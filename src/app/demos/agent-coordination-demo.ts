import {
  asyncScheduler, concatMap, defer, from, map, mergeMap, Observable, SchedulerLike, tap,
  timer, toArray
} from 'rxjs';

export type AgentStrategy = 'concatMap' | 'mergeMap';

interface Order {
  id: string;
  policyId: string;
  daysSinceDelivery: number;
}

interface Policy {
  id: string;
  clause: string;
  returnWindowDays: number;
}

interface RefundScenario {
  id: string;
  label: string;
  order: Order;
  knownPolicyId?: string;
  expected: { eligible: boolean; clause: string };
}

export interface AgentEvent {
  runId: string;
  atMs: number;
  step: 'Plan' | 'Order lookup' | 'Policy lookup' | 'Validate';
  status: 'ready' | 'waiting' | 'started' | 'completed';
  detail: string;
}

export interface AgentResult {
  eligible: boolean;
  clause: string;
  evidence: string;
  durationMs: number;
  toolCalls: number;
  checks: { recommendation: boolean; citation: boolean };
}

const POLICIES: Readonly<Partial<Record<string, Policy>>> = {
  standard: { id: 'standard', clause: 'R-14', returnWindowDays: 14 },
  clearance: { id: 'clearance', clause: 'R-07', returnWindowDays: 7 }
};

export const REFUND_SCENARIOS: readonly RefundScenario[] = [
  {
    id: 'independent',
    label: 'Independent lookups',
    order: { id: 'ORD-1042', policyId: 'standard', daysSinceDelivery: 10 },
    knownPolicyId: 'standard',
    expected: { eligible: true, clause: 'R-14' }
  },
  {
    id: 'dependent',
    label: 'Policy depends on the order',
    order: { id: 'ORD-2071', policyId: 'clearance', daysSinceDelivery: 10 },
    expected: { eligible: false, clause: 'R-07' }
  }
];

export function runRefundAgent(
  scenario: RefundScenario,
  strategy: AgentStrategy,
  runId: string,
  record: (event: AgentEvent) => void,
  scheduler: SchedulerLike = asyncScheduler
): Observable<AgentResult> {
  return defer(() => {
    const startedAt = scheduler.now();
    const elapsed = () => scheduler.now() - startedAt;
    let toolCalls = 0;

    const emit = (step: AgentEvent['step'], status: AgentEvent['status'], detail: string) =>
      record({ runId, atMs: elapsed(), step, status, detail });

    const runTool = <T>(
      step: 'Order lookup' | 'Policy lookup',
      input: string,
      delayMs: number,
      lookup: () => T,
      describe: (result: T) => string
    ) => defer(() => {
      toolCalls++;
      emit(step, 'started', input);
      return timer(delayMs, scheduler).pipe(
        map(lookup),
        tap((result) => emit(step, 'completed', describe(result)))
      );
    });

    const lookupOrder = () => runTool(
      'Order lookup', scenario.order.id, 600, () => scenario.order,
      (order) => `${order.daysSinceDelivery} days since delivery · policy ${order.policyId}`
    );

    const lookupPolicy = (policyId: string) => runTool(
      'Policy lookup', policyId, 400, () => {
        const policy = POLICIES[policyId];
        if (!policy) {
          throw new Error(`Policy ${policyId} was not found.`);
        }
        return policy;
      },
      (policy) => `${policy.clause} · ${policy.returnWindowDays}-day return window`
    );

    const knownPolicyId = scenario.knownPolicyId;
    emit('Plan', 'ready', knownPolicyId === undefined
      ? 'Find the policy ID in the order before looking up the policy.'
      : 'The order ID and policy ID are already available.');

    let lookups: Observable<(Order | Policy)[]>;
    if (knownPolicyId === undefined) {
      emit('Policy lookup', 'waiting', 'The policy ID must come from the order lookup.');
      lookups = lookupOrder().pipe(
        concatMap((order) => lookupPolicy(order.policyId).pipe(map((policy) => [order, policy])))
      );
    } else {
      const schedule = strategy === 'concatMap'
        ? concatMap((tool: Observable<Order | Policy>) => tool)
        : mergeMap((tool: Observable<Order | Policy>) => tool);
      lookups = from([lookupOrder(), lookupPolicy(knownPolicyId)]).pipe(schedule, toArray());
    }

    return lookups.pipe(map((results) => {
      const order = results.find((result): result is Order => 'policyId' in result);
      const policy = results.find((result): result is Policy => 'clause' in result);
      if (!order || !policy || order.policyId !== policy.id) {
        throw new Error('The policy could not be verified against the order.');
      }

      const eligible = order.daysSinceDelivery <= policy.returnWindowDays;
      const checks = {
        recommendation: eligible === scenario.expected.eligible,
        citation: policy.clause === scenario.expected.clause
      };
      emit('Validate', 'completed', 'Checked the recommendation and cited clause against the fixture.');
      return {
        eligible,
        clause: policy.clause,
        evidence: `Delivery was ${order.daysSinceDelivery} days ago. Clause ${policy.clause} allows returns within ${policy.returnWindowDays} days.`,
        durationMs: elapsed(),
        toolCalls,
        checks
      };
    }));
  });
}

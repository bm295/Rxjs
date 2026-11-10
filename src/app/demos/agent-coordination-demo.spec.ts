import { TestScheduler } from 'rxjs/testing';
import {
  AgentEvent, AgentResult, AgentStrategy, REFUND_SCENARIOS, runRefundAgent
} from './agent-coordination-demo';

describe('refund agent coordination', () => {
  function simulate(scenarioIndex: number, strategy: AgentStrategy) {
    const scheduler = new TestScheduler(() => undefined);
    const events: AgentEvent[] = [];
    const results: AgentResult[] = [];
    const runId = `test-${strategy}`;

    scheduler.run(() => {
      runRefundAgent(REFUND_SCENARIOS[scenarioIndex], strategy, runId, (event) => {
        events.push(event);
      }, scheduler).subscribe((result) => results.push(result));
    });

    expect(events.every((event) => event.runId === runId)).toBeTrue();
    expect(results.length).toBe(1);
    return { events, result: results[0] };
  }

  it('runs independent tools concurrently without changing the recommendation or citation', () => {
    const sequential = simulate(0, 'concatMap');
    const parallel = simulate(0, 'mergeMap');

    expect(sequential.result.durationMs).toBe(1000);
    expect(parallel.result.durationMs).toBe(600);
    expect(parallel.events.filter((event) => event.status === 'started').map((event) => event.atMs))
      .toEqual([0, 0]);

    for (const { result } of [sequential, parallel]) {
      expect(result.eligible).toBeTrue();
      expect(result.clause).toBe('R-14');
      expect(result.toolCalls).toBe(2);
      expect(result.checks).toEqual({ recommendation: true, citation: true });
    }
  });

  it('waits for the policy ID in both strategies and cites the policy from the order', () => {
    for (const strategy of ['concatMap', 'mergeMap'] as const) {
      const { events, result } = simulate(1, strategy);

      expect(events.filter((event) => event.step === 'Policy lookup').map((event) => [
        event.status, event.atMs
      ])).toEqual([['waiting', 0], ['started', 600], ['completed', 1000]]);
      expect(result.durationMs).toBe(1000);
      expect(result.eligible).toBeFalse();
      expect(result.clause).toBe('R-07');
      expect(result.toolCalls).toBe(2);
      expect(result.checks).toEqual({ recommendation: true, citation: true });
    }
  });

  it('stops pending lookups when the comparison is reset', () => {
    const scheduler = new TestScheduler(() => undefined);
    const events: AgentEvent[] = [];
    const next = jasmine.createSpy('result');

    scheduler.run(() => {
      const subscription = runRefundAgent(
        REFUND_SCENARIOS[1], 'mergeMap', 'canceled-run', (event) => events.push(event), scheduler
      ).subscribe(next);
      scheduler.schedule(() => subscription.unsubscribe(), 200);
    });

    expect(events.map((event) => event.status)).toEqual(['ready', 'waiting', 'started']);
    expect(next).not.toHaveBeenCalled();
  });
});

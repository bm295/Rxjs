import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AgentEvent, AgentResult, AgentStrategy, REFUND_SCENARIOS, runRefundAgent
} from '../../demos/agent-coordination-demo';

interface AgentRun {
  id: string;
  strategy: AgentStrategy;
  events: AgentEvent[];
  result?: AgentResult;
  error?: string;
}

@Component({
  selector: 'app-agent-coordination-demo-view',
  standalone: true,
  templateUrl: './agent-coordination-demo-view.component.html',
  styleUrl: './agent-coordination-demo-view.component.css'
})
export class AgentCoordinationDemoViewComponent implements OnDestroy {
  @Output() backToMenu = new EventEmitter<void>();

  protected readonly scenarios = REFUND_SCENARIOS;
  protected selectedScenario = this.scenarios[0];
  protected runs: AgentRun[] = [];
  protected get running(): boolean {
    return this.runs.some((run) => !run.result && !run.error);
  }

  private runNumber = 0;
  private subscriptions = new Subscription();

  protected selectScenario(scenario: (typeof REFUND_SCENARIOS)[number]): void {
    this.reset();
    this.selectedScenario = scenario;
  }

  protected compare(): void {
    this.reset();
    const runNumber = ++this.runNumber;
    const strategies: AgentStrategy[] = ['concatMap', 'mergeMap'];
    this.runs = strategies.map((strategy) => ({
      id: `${runNumber}-${strategy}`,
      strategy,
      events: []
    }));

    for (const run of this.runs) {
      this.subscriptions.add(runRefundAgent(
        this.selectedScenario,
        run.strategy,
        run.id,
        (event) => run.events.push(event)
      ).subscribe({
        next: (result) => run.result = result,
        error: (error: Error) => run.error = error.message
      }));
    }
  }

  protected reset(): void {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.runs = [];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  EXHAUST_MAP_CLICK_PLAN,
  createExhaustMapDemo
} from './demos/exhaust-map-demo';
import {
  AttemptStatus,
  DemoOperator,
  OutputEvent,
  REQUEST_PHASES,
  RequestRow,
  SubmitAttempt,
  TypingEvent
} from './demos/demo.models';
import {
  SWITCH_MAP_DEMO_LETTERS,
  SWITCH_MAP_DEMO_WORD,
  createSwitchMapDemo
} from './demos/switch-map-demo';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  protected selectedFunction: DemoOperator | null = null;
  protected running = false;
  protected typedTerm = '';
  protected typingEvents: TypingEvent[] = [];
  protected submitAttempts: SubmitAttempt[] = [];
  protected requestRows: RequestRow[] = [];
  protected outputEvents: OutputEvent[] = [];
  protected latestResponse = '';
  protected readonly demoWord = SWITCH_MAP_DEMO_WORD;
  protected readonly demoLetters = SWITCH_MAP_DEMO_LETTERS;
  protected readonly requestPhases = REQUEST_PHASES;
  protected readonly exhaustClickPlan = EXHAUST_MAP_CLICK_PLAN;

  private readonly typingDelayMs = 280;
  private readonly requestStepDelayMs = 260;
  private demoSub: Subscription | null = null;

  protected get ignoredAttemptSummary(): string {
    return this.submitAttempts
      .filter((attempt) => attempt.status === 'ignored')
      .map((attempt) => attempt.label)
      .join(', ');
  }

  protected openSwitchMapDemo(): void {
    this.openDemo('switchMap');
  }

  protected openExhaustMapDemo(): void {
    this.openDemo('exhaustMap');
  }

  protected backToMenu(): void {
    this.selectedFunction = null;
    this.resetDemo();
  }

  protected runSwitchMapDemo(): void {
    this.resetDemo();
    this.running = true;

    this.demoSub = createSwitchMapDemo({
      demoWord: this.demoWord,
      typingDelayMs: this.typingDelayMs,
      requestPhases: this.requestPhases,
      requestStepDelayMs: this.requestStepDelayMs,
      recordTypedTerm: (term, atMs) => this.recordTypedTerm(term, atMs),
      startRequest: (value, note) => this.startRequest(value, note),
      advanceRequest: (requestId, progressStep, note) =>
        this.advanceRequest(requestId, progressStep, note),
      completeRequest: (event, note) => this.recordOutput(event, note),
      cancelRequest: (requestId, note) => this.cancelRequest(requestId, note)
    }).subscribe({
      complete: () => {
        this.running = false;
      }
    });
  }

  protected runExhaustMapDemo(): void {
    this.resetDemo();
    this.running = true;

    this.demoSub = createExhaustMapDemo({
      clickPlan: this.exhaustClickPlan,
      requestPhases: this.requestPhases,
      requestStepDelayMs: this.requestStepDelayMs,
      recordSubmitAttempt: (label, atMs, status, note) =>
        this.recordSubmitAttempt(label, atMs, status, note),
      startRequest: (value, note) => this.startRequest(value, note),
      advanceRequest: (requestId, progressStep, note) =>
        this.advanceRequest(requestId, progressStep, note),
      completeRequest: (event, note) => this.recordOutput(event, note),
      cancelRequest: (requestId, note) => this.cancelRequest(requestId, note)
    }).subscribe({
      complete: () => {
        this.running = false;
      }
    });
  }

  protected resetDemo(): void {
    this.demoSub?.unsubscribe();
    this.demoSub = null;
    this.running = false;
    this.typedTerm = '';
    this.typingEvents = [];
    this.submitAttempts = [];
    this.requestRows = [];
    this.outputEvents = [];
    this.latestResponse = '';
  }

  ngOnDestroy(): void {
    this.demoSub?.unsubscribe();
  }

  private openDemo(operator: DemoOperator): void {
    this.selectedFunction = operator;
    this.resetDemo();
  }

  private recordTypedTerm(term: string, atMs: number): void {
    this.typedTerm = term;
    this.typingEvents.push({
      id: this.typingEvents.length + 1,
      term,
      atMs
    });
  }

  private recordSubmitAttempt(
    label: string,
    atMs: number,
    status: AttemptStatus,
    note: string
  ): void {
    this.submitAttempts.push({
      id: this.submitAttempts.length + 1,
      label,
      atMs,
      status,
      note
    });
  }

  private startRequest(value: string, note: string): number {
    const requestId = this.requestRows.length + 1;

    this.requestRows.push({
      id: requestId,
      value,
      progressStep: 0,
      progressPercent: 0,
      status: 'in-flight',
      note
    });

    return requestId;
  }

  private advanceRequest(
    requestId: number,
    progressStep: number,
    note: string
  ): void {
    const request = this.requestRows.find((item) => item.id === requestId);
    if (!request) {
      return;
    }

    request.progressStep = progressStep;
    request.progressPercent = (progressStep / this.requestPhases.length) * 100;
    request.note = note;
  }

  private recordOutput(event: OutputEvent, completionNote: string): void {
    this.outputEvents.push(event);
    this.latestResponse = event.message;

    const request = this.requestRows.find((item) => item.id === event.requestId);
    if (!request) {
      return;
    }

    request.status = 'completed';
    request.progressStep = this.requestPhases.length;
    request.progressPercent = 100;
    request.note = completionNote;
  }

  private cancelRequest(requestId: number, note: string): void {
    const request = this.requestRows.find((item) => item.id === requestId);
    if (!request) {
      return;
    }

    request.status = 'canceled';
    request.note = note;
  }
}

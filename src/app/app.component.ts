import { Component, OnDestroy } from '@angular/core';
import { Subscription, finalize, last, map, switchMap, take, tap, timer } from 'rxjs';

type RequestStatus = 'in-flight' | 'completed' | 'canceled';

interface TypingEvent {
  id: number;
  term: string;
  atMs: number;
}

interface RequestRow {
  id: number;
  term: string;
  progressStep: number;
  progressPercent: number;
  status: RequestStatus;
  note: string;
}

interface OutputEvent {
  requestId: number;
  term: string;
  message: string;
  atMs: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  protected selectedFunction: 'switchMap' | null = null;
  protected running = false;
  protected typedTerm = '';
  protected typingEvents: TypingEvent[] = [];
  protected requestRows: RequestRow[] = [];
  protected outputEvents: OutputEvent[] = [];
  protected latestResponse = '';
  protected readonly demoWord = 'COMPLETED';
  protected readonly demoLetters = this.demoWord.split('');
  protected readonly requestPhases = [
    'debounce before request',
    'request sent',
    'server processing',
    'response ready'
  ];

  private readonly typingDelayMs = 280;
  private readonly requestStepDelayMs = 260;
  private demoSub: Subscription | null = null;
  private startedAt = 0;

  protected openSwitchMapDemo(): void {
    this.selectedFunction = 'switchMap';
    this.resetDemo();
  }

  protected backToMenu(): void {
    this.selectedFunction = null;
    this.resetDemo();
  }

  protected runSwitchMapDemo(): void {
    this.resetDemo();
    this.running = true;
    this.startedAt = Date.now();

    const typing$ = timer(0, this.typingDelayMs).pipe(
      take(this.demoLetters.length),
      map((index) => this.demoWord.slice(0, index + 1)),
      tap((term) => this.recordTypedTerm(term)),
      switchMap((term) => this.createRequestStream(term))
    );

    this.demoSub = typing$.subscribe({
      next: (event) => this.recordOutput(event),
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
    this.requestRows = [];
    this.outputEvents = [];
    this.latestResponse = '';
    this.startedAt = 0;
  }

  ngOnDestroy(): void {
    this.demoSub?.unsubscribe();
  }

  private createRequestStream(term: string) {
    const requestId = this.startRequest(term);
    let completed = false;

    return timer(this.requestStepDelayMs, this.requestStepDelayMs).pipe(
      take(this.requestPhases.length),
      tap((step) => this.advanceRequest(requestId, step + 1)),
      last(),
      map(() => {
        completed = true;

        return {
          requestId,
          term,
          message: 'Response delivered for "' + term + '"',
          atMs: Date.now() - this.startedAt
        };
      }),
      finalize(() => this.finishRequest(requestId, completed))
    );
  }

  private recordTypedTerm(term: string): void {
    this.typedTerm = term;
    this.typingEvents.push({
      id: this.typingEvents.length + 1,
      term,
      atMs: Date.now() - this.startedAt
    });
  }

  private startRequest(term: string): number {
    const requestId = this.requestRows.length + 1;

    this.requestRows.push({
      id: requestId,
      term,
      progressStep: 0,
      progressPercent: 0,
      status: 'in-flight',
      note: 'waiting for debounce to finish'
    });

    return requestId;
  }

  private advanceRequest(requestId: number, progressStep: number): void {
    const request = this.requestRows.find((item) => item.id === requestId);
    if (!request) {
      return;
    }

    request.progressStep = progressStep;
    request.progressPercent = (progressStep / this.requestPhases.length) * 100;
    request.note = this.requestPhases[progressStep - 1] ?? request.note;
  }

  private recordOutput(event: OutputEvent): void {
    this.outputEvents.push(event);
    this.latestResponse = event.message;

    const request = this.requestRows.find((item) => item.id === event.requestId);
    if (!request) {
      return;
    }

    request.status = 'completed';
    request.progressStep = this.requestPhases.length;
    request.progressPercent = 100;
    request.note = 'response reached the subscriber';
  }

  private finishRequest(requestId: number, completed: boolean): void {
    if (completed) {
      return;
    }

    const request = this.requestRows.find((item) => item.id === requestId);
    if (!request) {
      return;
    }

    request.status = 'canceled';
    request.note = 'canceled when the next key arrived';
  }
}

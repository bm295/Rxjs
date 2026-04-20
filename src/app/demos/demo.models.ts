export type DemoOperator = 'switchMap' | 'exhaustMap';
export type RequestStatus = 'in-flight' | 'completed' | 'canceled';
export type AttemptStatus = 'accepted' | 'ignored';

export interface TypingEvent {
  id: number;
  term: string;
  atMs: number;
}

export interface SubmitAttempt {
  id: number;
  label: string;
  atMs: number;
  status: AttemptStatus;
  note: string;
}

export interface RequestRow {
  id: number;
  value: string;
  progressStep: number;
  progressPercent: number;
  status: RequestStatus;
  note: string;
}

export interface OutputEvent {
  requestId: number;
  value: string;
  message: string;
  atMs: number;
}

export interface ScheduledClick {
  label: string;
  waitMs: number;
}

export const REQUEST_PHASES = [
  'debounce before request',
  'request sent',
  'server processing',
  'response ready'
];

interface RequestTrackingHooks {
  startRequest(value: string, note: string): number;
  advanceRequest(requestId: number, progressStep: number, note: string): void;
  completeRequest(event: OutputEvent, note: string): void;
  cancelRequest(requestId: number, note: string): void;
}

export interface SwitchMapDemoOptions extends RequestTrackingHooks {
  demoWord: string;
  typingDelayMs: number;
  requestPhases: string[];
  requestStepDelayMs: number;
  recordTypedTerm(term: string, atMs: number): void;
}

export interface ExhaustMapDemoOptions extends RequestTrackingHooks {
  clickPlan: ScheduledClick[];
  requestPhases: string[];
  requestStepDelayMs: number;
  recordSubmitAttempt(
    label: string,
    atMs: number,
    status: AttemptStatus,
    note: string
  ): void;
}

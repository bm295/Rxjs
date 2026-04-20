import { Observable, from, timer } from 'rxjs';
import { concatMap, exhaustMap, finalize, last, map, take, tap } from 'rxjs';
import {
  AttemptStatus,
  ExhaustMapDemoOptions,
  OutputEvent,
  ScheduledClick
} from './demo.models';

export const EXHAUST_MAP_CLICK_PLAN: ScheduledClick[] = [
  { label: 'Click 1', waitMs: 0 },
  { label: 'Click 2', waitMs: 180 },
  { label: 'Click 3', waitMs: 180 },
  { label: 'Click 4', waitMs: 840 },
  { label: 'Click 5', waitMs: 180 },
  { label: 'Click 6', waitMs: 1070 }
];

export function createExhaustMapDemo(
  options: ExhaustMapDemoOptions
): Observable<void> {
  const startedAt = Date.now();
  const elapsedMs = () => Date.now() - startedAt;
  let requestBusy = false;

  return from(options.clickPlan).pipe(
    concatMap((click) => timer(click.waitMs).pipe(map(() => click))),
    tap((click) => {
      const status: AttemptStatus = requestBusy ? 'ignored' : 'accepted';
      const note =
        status === 'accepted'
          ? 'accepted and turned into a new inner request'
          : 'ignored because the previous save is still running';

      options.recordSubmitAttempt(click.label, elapsedMs(), status, note);

      if (status === 'accepted') {
        requestBusy = true;
      }
    }),
    exhaustMap((click) =>
      createExhaustMapRequestStream(click, options, elapsedMs).pipe(
        finalize(() => {
          requestBusy = false;
        })
      )
    )
  );
}

function createExhaustMapRequestStream(
  click: ScheduledClick,
  options: ExhaustMapDemoOptions,
  elapsedMs: () => number
): Observable<void> {
  const requestId = options.startRequest(
    click.label,
    'first click in the burst claimed the request slot'
  );

  return timer(options.requestStepDelayMs, options.requestStepDelayMs).pipe(
    take(options.requestPhases.length),
    tap((step) =>
      options.advanceRequest(
        requestId,
        step + 1,
        options.requestPhases[step] ?? 'processing request'
      )
    ),
    last(),
    map(() => {
      const event: OutputEvent = {
        requestId,
        value: click.label,
        message: 'Save completed from ' + click.label,
        atMs: elapsedMs()
      };

      options.completeRequest(
        event,
        'request finished, exhaustMap can accept the next click'
      );
    })
  );
}

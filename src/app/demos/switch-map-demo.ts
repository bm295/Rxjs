import { Observable, timer } from 'rxjs';
import { finalize, last, map, switchMap, take, tap } from 'rxjs';
import { OutputEvent, SwitchMapDemoOptions } from './demo.models';

export const SWITCH_MAP_DEMO_WORD = 'COMPLETED';
export const SWITCH_MAP_DEMO_LETTERS = SWITCH_MAP_DEMO_WORD.split('');

export function createSwitchMapDemo(
  options: SwitchMapDemoOptions
): Observable<void> {
  const startedAt = Date.now();
  const elapsedMs = () => Date.now() - startedAt;

  return timer(0, options.typingDelayMs).pipe(
    take(SWITCH_MAP_DEMO_LETTERS.length),
    map((index) => options.demoWord.slice(0, index + 1)),
    tap((term) => options.recordTypedTerm(term, elapsedMs())),
    switchMap((term) => createSwitchMapRequestStream(term, options, elapsedMs))
  );
}

function createSwitchMapRequestStream(
  term: string,
  options: SwitchMapDemoOptions,
  elapsedMs: () => number
): Observable<void> {
  const requestId = options.startRequest(term, 'waiting for debounce to finish');
  let completed = false;

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
      completed = true;

      const event: OutputEvent = {
        requestId,
        value: term,
        message: 'Response delivered for "' + term + '"',
        atMs: elapsedMs()
      };

      options.completeRequest(event, 'response reached the subscriber');
    }),
    finalize(() => {
      if (!completed) {
        options.cancelRequest(requestId, 'canceled when the next key arrived');
      }
    })
  );
}

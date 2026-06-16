import { Observable, timer } from 'rxjs';
import { last, map, mergeMap, take, tap } from 'rxjs';
import { OutputEvent, SwitchMapDemoOptions } from './demo.models';

export function createMergeMapDemo(
  options: SwitchMapDemoOptions
): Observable<void> {
  const startedAt = Date.now();
  const elapsedMs = () => Date.now() - startedAt;

  return timer(0, options.typingDelayMs).pipe(
    take(options.demoWord.length),
    map((index) => options.demoWord.slice(0, index + 1)),
    tap((term) => options.recordTypedTerm(term, elapsedMs())),
    mergeMap((term) => createMergeMapRequestStream(term, options, elapsedMs))
  );
}

function createMergeMapRequestStream(
  term: string,
  options: SwitchMapDemoOptions,
  elapsedMs: () => number
): Observable<void> {
  const requestId = options.startRequest(
    term,
    'started immediately and will keep running beside newer requests'
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
        value: term,
        message: 'Response delivered for "' + term + '"',
        atMs: elapsedMs()
      };

      options.completeRequest(
        event,
        'response reached the subscriber without canceling other requests'
      );
    })
  );
}

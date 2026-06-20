import { Observable, timer } from 'rxjs';
import { concatMap, last, map, take, tap } from 'rxjs';
import { OutputEvent, SwitchMapDemoOptions } from './demo.models';

export function createConcatMapDemo(
  options: SwitchMapDemoOptions
): Observable<void> {
  const startedAt = Date.now();
  const elapsedMs = () => Date.now() - startedAt;

  return timer(0, options.typingDelayMs).pipe(
    take(options.demoWord.length),
    map((index) => options.demoWord.slice(0, index + 1)),
    tap((term) => options.recordTypedTerm(term, elapsedMs())),
    concatMap((term, index) =>
      createConcatMapRequestStream(term, index, options, elapsedMs)
    )
  );
}

function createConcatMapRequestStream(
  term: string,
  index: number,
  options: SwitchMapDemoOptions,
  elapsedMs: () => number
): Observable<void> {
  const requestId = options.startRequest(
    term,
    index === 0
      ? 'started immediately as the first queued request'
      : 'queued behind earlier requests and will run in order'
  );

  return timer(options.requestStepDelayMs, options.requestStepDelayMs).pipe(
    take(options.requestPhases.length),
    tap((step) =>
      options.advanceRequest(
        requestId,
        step + 1,
        options.requestPhases[step] ?? 'processing queued request'
      )
    ),
    last(),
    map(() => {
      const event: OutputEvent = {
        requestId,
        value: term,
        message: 'Queued response delivered for "' + term + '"',
        atMs: elapsedMs()
      };

      options.completeRequest(
        event,
        'response reached the subscriber before the next queued request starts'
      );
    })
  );
}

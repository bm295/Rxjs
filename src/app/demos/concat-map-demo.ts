import { from, Observable, timer } from 'rxjs';
import { concatMap, last, map, take, tap } from 'rxjs';
import { ConcatMapDemoOptions, OutputEvent } from './demo.models';

export const CONCAT_MAP_FILES = ['report.pdf', 'photo.jpg', 'slides.pptx', 'data.csv'];
export const UPLOAD_PHASES = [
  'preparing file',
  'uploading file data',
  'server saving file',
  'upload confirmed'
];

export function createConcatMapDemo(
  options: ConcatMapDemoOptions
): Observable<void> {
  const startedAt = Date.now();
  const elapsedMs = () => Date.now() - startedAt;

  return from(options.files).pipe(
    tap((fileName) => options.recordQueuedFile(fileName, elapsedMs())),
    concatMap((fileName, index) =>
      createConcatMapRequestStream(fileName, index, options, elapsedMs)
    )
  );
}

function createConcatMapRequestStream(
  fileName: string,
  index: number,
  options: ConcatMapDemoOptions,
  elapsedMs: () => number
): Observable<void> {
  const requestId = options.startRequest(
    fileName,
    index === 0
      ? 'first file upload started immediately'
      : 'previous upload completed; starting the next queued file'
  );

  return timer(options.requestStepDelayMs, options.requestStepDelayMs).pipe(
    take(options.requestPhases.length),
    tap((step) =>
      options.advanceRequest(
        requestId,
        step + 1,
        options.requestPhases[step] ?? 'uploading file'
      )
    ),
    last(),
    map(() => {
      const event: OutputEvent = {
        requestId,
        value: fileName,
        message: 'Uploaded "' + fileName + '"',
        atMs: elapsedMs()
      };

      options.completeRequest(
        event,
        'upload completed before the next queued file starts'
      );
    })
  );
}

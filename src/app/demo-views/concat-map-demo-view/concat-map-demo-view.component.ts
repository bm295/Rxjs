import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CONCAT_MAP_FILES, UPLOAD_PHASES, createConcatMapDemo } from '../../demos/concat-map-demo';
import { FileQueueEvent, OutputEvent, RequestRow } from '../../demos/demo.models';

@Component({
  selector: 'app-concat-map-demo-view',
  standalone: true,
  templateUrl: './concat-map-demo-view.component.html'
})
export class ConcatMapDemoViewComponent implements OnDestroy {
  running = false;
  readonly uploadFiles = CONCAT_MAP_FILES;
  private readonly requestStepDelayMs = 260;
  private demoSub: Subscription | null = null;
  fileQueueEvents: FileQueueEvent[] = [];
  requestRows: RequestRow[] = [];
  outputEvents: OutputEvent[] = [];
  latestResponse = '';

  fileStatus(fileName: string): string {
    const request = this.requestRows.find((row) => row.value === fileName);
    if (request) {
      return request.status === 'completed' ? 'Uploaded' : 'Uploading';
    }
    return this.fileQueueEvents.some((event) => event.fileName === fileName)
      ? 'Queued'
      : 'Ready';
  }

  @Output() backToMenu = new EventEmitter<void>();

  runDemo(): void {
    this.resetDemo();
    this.running = true;
    this.demoSub = createConcatMapDemo({
      files: this.uploadFiles,
      requestPhases: UPLOAD_PHASES,
      requestStepDelayMs: this.requestStepDelayMs,
      recordQueuedFile: (fileName, atMs) => this.fileQueueEvents.push({
        id: this.fileQueueEvents.length + 1,
        fileName,
        atMs
      }),
      startRequest: (value, note) => this.startRequest(value, note),
      advanceRequest: (requestId, progressStep, note) => {
        const request = this.requestRows.find((row) => row.id === requestId);
        if (request) {
          request.progressStep = progressStep;
          request.progressPercent = (progressStep / UPLOAD_PHASES.length) * 100;
          request.note = note;
        }
      },
      completeRequest: (event, note) => {
        this.outputEvents.push(event);
        this.latestResponse = event.message;
        const request = this.requestRows.find((row) => row.id === event.requestId);
        if (request) {
          request.status = 'completed';
          request.progressStep = UPLOAD_PHASES.length;
          request.progressPercent = 100;
          request.note = note;
        }
      },
      cancelRequest: (requestId, note) => {
        const request = this.requestRows.find((row) => row.id === requestId);
        if (request) {
          request.status = 'canceled';
          request.note = note;
        }
      }
    }).subscribe({
      complete: () => {
        this.running = false;
      }
    });
  }

  resetDemo(): void {
    this.demoSub?.unsubscribe();
    this.demoSub = null;
    this.running = false;
    this.fileQueueEvents = [];
    this.requestRows = [];
    this.outputEvents = [];
    this.latestResponse = '';
  }

  ngOnDestroy(): void {
    this.demoSub?.unsubscribe();
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
}

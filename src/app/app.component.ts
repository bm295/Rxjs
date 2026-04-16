import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, interval, map, switchMap, take, tap } from 'rxjs';

type StreamStatus = 'active' | 'completed' | 'canceled';

interface StreamRow {
  id: number;
  emittedCount: number;
  status: StreamStatus;
}

interface OutputEvent {
  outerId: number;
  innerIndex: number;
  atMs: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  protected selectedFunction: 'switchMap' | null = null;
  protected running = false;
  protected streamRows: StreamRow[] = [];
  protected outputEvents: OutputEvent[] = [];
  protected readonly ballSlots = [1, 2, 3, 4, 5, 6];

  private demoSub: Subscription | null = null;
  private activeStreamId: number | null = null;
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

    const outerStream$ = interval(2200).pipe(
      take(4),
      map((value) => value + 1),
      tap((outerId) => this.activateStream(outerId)),
      switchMap((outerId) =>
        interval(450).pipe(
          take(6),
          map((innerIndex) => ({
            outerId,
            innerIndex: innerIndex + 1,
            atMs: Date.now() - this.startedAt
          }))
        )
      )
    );

    this.demoSub = outerStream$.subscribe({
      next: (event) => this.recordOutput(event),
      complete: () => {
        this.running = false;
        this.markLastActiveAsCompleted();
      }
    });
  }

  protected resetDemo(): void {
    this.demoSub?.unsubscribe();
    this.demoSub = null;
    this.running = false;
    this.streamRows = [];
    this.outputEvents = [];
    this.activeStreamId = null;
    this.startedAt = 0;
  }

  protected trackById(_: number, row: StreamRow): number {
    return row.id;
  }

  ngOnDestroy(): void {
    this.demoSub?.unsubscribe();
  }

  private activateStream(outerId: number): void {
    if (this.activeStreamId !== null) {
      const current = this.streamRows.find((row) => row.id === this.activeStreamId);
      if (current && current.emittedCount < this.ballSlots.length) {
        current.status = 'canceled';
      }
    }

    this.streamRows.push({
      id: outerId,
      emittedCount: 0,
      status: 'active'
    });

    this.activeStreamId = outerId;
  }

  private recordOutput(event: OutputEvent): void {
    this.outputEvents.push(event);

    const row = this.streamRows.find((item) => item.id === event.outerId);
    if (!row) {
      return;
    }

    row.emittedCount = event.innerIndex;
    if (event.innerIndex === this.ballSlots.length) {
      row.status = 'completed';
    }
  }

  private markLastActiveAsCompleted(): void {
    if (this.activeStreamId === null) {
      return;
    }

    const last = this.streamRows.find((row) => row.id === this.activeStreamId);
    if (!last) {
      return;
    }

    last.status = last.emittedCount === this.ballSlots.length ? 'completed' : 'canceled';
  }
}

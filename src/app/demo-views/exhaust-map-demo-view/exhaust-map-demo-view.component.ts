import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  OutputEvent,
  RequestRow,
  ScheduledClick,
  SubmitAttempt
} from '../../demos/demo.models';

@Component({
  selector: 'app-exhaust-map-demo-view',
  standalone: true,
  templateUrl: './exhaust-map-demo-view.component.html'
})
export class ExhaustMapDemoViewComponent {
  @Input() running = false;
  @Input() submitAttempts: SubmitAttempt[] = [];
  @Input() requestRows: RequestRow[] = [];
  @Input() outputEvents: OutputEvent[] = [];
  @Input() latestResponse = '';
  @Input() exhaustClickPlan: ScheduledClick[] = [];
  @Input() ignoredAttemptSummary = '';

  @Output() runDemo = new EventEmitter<void>();
  @Output() resetDemo = new EventEmitter<void>();
  @Output() backToMenu = new EventEmitter<void>();
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutputEvent, RequestRow, TypingEvent } from '../../demos/demo.models';

@Component({
  selector: 'app-switch-map-demo-view',
  standalone: true,
  templateUrl: './switch-map-demo-view.component.html'
})
export class SwitchMapDemoViewComponent {
  @Input() running = false;
  @Input() typedTerm = '';
  @Input() demoLetters: string[] = [];
  @Input() typingEvents: TypingEvent[] = [];
  @Input() requestRows: RequestRow[] = [];
  @Input() outputEvents: OutputEvent[] = [];
  @Input() latestResponse = '';

  @Output() runDemo = new EventEmitter<void>();
  @Output() resetDemo = new EventEmitter<void>();
  @Output() backToMenu = new EventEmitter<void>();
}

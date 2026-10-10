import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConcatMapDemoViewComponent } from './concat-map-demo-view.component';

describe('ConcatMapDemoViewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcatMapDemoViewComponent]
    }).compileComponents();
  });

  it('queues all files and uploads them sequentially, then resets the batch', fakeAsync(() => {
    const fixture = TestBed.createComponent(ConcatMapDemoViewComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const runButton = compiled.querySelector('.actions button') as HTMLButtonElement;
    runButton.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.column .event-list li').length).toBe(4);
    expect(compiled.querySelectorAll('.request-card').length).toBe(1);
    expect(compiled.querySelector('.click-strip')?.textContent).toContain('photo.jpg: Queued');

    tick(1040);
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.request-card.completed').length).toBe(1);
    expect(compiled.querySelectorAll('.request-card').length).toBe(2);
    expect(compiled.querySelector('.click-strip')?.textContent).toContain('photo.jpg: Uploading');

    tick(3120);
    fixture.detectChanges();
    const uploads = Array.from(compiled.querySelectorAll('.results .event-list li')).map(
      (item) => item.textContent
    );
    expect(uploads.length).toBe(4);
    ['report.pdf', 'photo.jpg', 'slides.pptx', 'data.csv'].forEach((fileName, index) => {
      expect(uploads[index]).toContain('Uploaded "' + fileName + '"');
    });
    expect(runButton.disabled).toBeFalse();

    runButton.click();
    tick(260);
    const resetButton = compiled.querySelectorAll('.actions button')[1] as HTMLButtonElement;
    resetButton.click();
    tick(4160);
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.request-card').length).toBe(0);
    expect(compiled.querySelectorAll('.results .event-list li').length).toBe(0);
    expect(compiled.querySelector('.click-strip')?.textContent).toContain('report.pdf: Ready');
  }));

  it('stops active and queued uploads when destroyed', fakeAsync(() => {
    const fixture = TestBed.createComponent(ConcatMapDemoViewComponent);
    const component = fixture.componentInstance;
    component.runDemo();
    tick(260);
    expect(component.requestRows[0].progressStep).toBe(1);

    fixture.destroy();
    tick(4160);
    expect(component.requestRows.length).toBe(1);
    expect(component.requestRows[0].progressStep).toBe(1);
    expect(component.outputEvents.length).toBe(0);
  }));
});

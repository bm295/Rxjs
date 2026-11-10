import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the landing screen', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const featureButtons = Array.from(compiled.querySelectorAll('.feature-btn')).map((button) =>
      button.textContent?.trim()
    );

    expect(compiled.querySelector('h1')?.textContent).toContain('RxJS Visual Lab');
    expect(featureButtons).toContain('switchMap');
    expect(featureButtons).toContain('mergeMap');
    expect(featureButtons).toContain('exhaustMap');
    expect(featureButtons).toContain('concatMap');
  });

  it('opens the mergeMap demo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const mergeButton = Array.from(compiled.querySelectorAll('.feature-btn')).find((button) =>
      button.textContent?.includes('mergeMap')
    ) as HTMLButtonElement | undefined;

    mergeButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.controls h2')?.textContent).toContain('Operator: mergeMap');
  });

  it('opens the exhaustMap demo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const exhaustButton = Array.from(compiled.querySelectorAll('.feature-btn')).find((button) =>
      button.textContent?.includes('exhaustMap')
    ) as HTMLButtonElement | undefined;

    exhaustButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.controls h2')?.textContent).toContain('Operator: exhaustMap');
  });

  it('opens the concatMap demo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const concatButton = Array.from(compiled.querySelectorAll('.feature-btn')).find((button) =>
      button.textContent?.includes('concatMap')
    ) as HTMLButtonElement | undefined;

    concatButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.controls h2')?.textContent).toContain('Operator: concatMap');
  });

  it('runs the agent comparison from the main menu and returns to it', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app: HTMLElement = fixture.nativeElement;
    const clickButton = (label: string) => {
      const button = Array.from(app.querySelectorAll('button')).find(
        (candidate) => candidate.textContent?.trim() === label
      );
      expect(button).toBeDefined();
      button?.click();
      fixture.detectChanges();
    };

    fixture.detectChanges();
    clickButton('AI Agent Coordination Lab');
    clickButton('Policy depends on the order');
    clickButton('Run comparison');
    expect(app.textContent).toContain('Policy lookup · waiting');
    tick(1000);
    fixture.detectChanges();

    const outcomes = Array.from(app.querySelectorAll('.outcome'));
    expect(outcomes.length).toBe(2);
    for (const outcome of outcomes) {
      expect(outcome.textContent).toContain('Ineligible for refund');
      expect(outcome.textContent).toContain('R-07');
    }

    clickButton('Back to menu');
    expect(app.textContent).toContain('Main menu');
  }));

});

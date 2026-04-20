import { TestBed } from '@angular/core/testing';
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
    expect(featureButtons).toContain('exhaustMap');
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
});

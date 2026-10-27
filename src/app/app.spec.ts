import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ToastService } from './services/toast.service';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let toast: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    toast = fixture.debugElement.injector.get(ToastService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('composes all page features', () => {
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('app-hero-section')).toBeTruthy();
    expect(root.querySelector('app-ecosystem-section')).toBeTruthy();
    expect(root.querySelector('app-portfolio-section')).toBeTruthy();
    expect(root.querySelector('app-hitmaker-section')).toBeTruthy();
    expect(root.querySelector('app-print-studio-section')).toBeTruthy();
    expect(root.querySelector('app-briefing-section')).toBeTruthy();
    expect(root.querySelector('app-site-footer')).toBeTruthy();
  });

  it('displays the toast notification banner when a toast message is active', () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.fixed.bottom-6.right-6')).toBeNull();

    toast.show('Item adicionado com sucesso');
    fixture.detectChanges();

    const toastBanner = root.querySelector('.fixed.bottom-6.right-6');
    expect(toastBanner).toBeTruthy();
    expect(toastBanner?.textContent).toContain('Item adicionado com sucesso');
  });
});

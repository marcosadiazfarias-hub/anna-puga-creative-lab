import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BriefingService } from '../../services/briefing.service';
import { QuoteCartService } from '../../services/quote-cart.service';
import { ToastService } from '../../services/toast.service';
import { BriefingSection } from './briefing-section';

describe('BriefingSection', () => {
  let fixture: ComponentFixture<BriefingSection>;
  let briefing: BriefingService;
  let quoteCart: QuoteCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BriefingSection],
      providers: [BriefingService, QuoteCartService, ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(BriefingSection);
    briefing = TestBed.inject(BriefingService);
    quoteCart = TestBed.inject(QuoteCartService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });

  it('toggles services from the briefing section', () => {
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('#contato')!;
    const service = 'Estampas Exclusivas (Private Label / Autoral)';
    const serviceButton = Array.from(section.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes(service),
    )!;

    serviceButton.click();
    fixture.detectChanges();
    expect(quoteCart.isSelected(service)).toBe(true);
  });

  it('submits the briefing form through the contact feature', () => {
    briefing.form.setValue({
      clientName: 'Joana',
      brandOrArtist: 'Estúdio Criativo',
      urgency: 'Planejamento de Lançamento',
      customNotes: '',
    });
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    fixture.detectChanges();

    const form = (fixture.nativeElement as HTMLElement).querySelector<HTMLFormElement>(
      '#contato form',
    )!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(openSpy).toHaveBeenCalledOnce();
  });
});


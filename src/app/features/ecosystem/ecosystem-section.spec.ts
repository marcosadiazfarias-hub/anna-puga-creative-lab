import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { QuoteActionsService } from '../../services/quote-actions.service';
import { QuoteCartService } from '../../services/quote-cart.service';
import { ToastService } from '../../services/toast.service';
import { EcosystemSection } from './ecosystem-section';

describe('EcosystemSection', () => {
  let fixture: ComponentFixture<EcosystemSection>;
  let quoteCart: QuoteCartService;
  let toast: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcosystemSection],
      providers: [
        PortfolioStateService,
        QuoteActionsService,
        QuoteCartService,
        ToastService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcosystemSection);
    quoteCart = TestBed.inject(QuoteCartService);
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });

  it('adds the selected business unit service to the quote cart', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const buttons = root.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click();
    fixture.detectChanges();

    expect(quoteCart.selectedServices()).toContain(
      'Key Visual & Artes para Eventos / Música Eletrônica',
    );
    expect(toast.message()).toContain('adicionado ao seu orçamento');
  });
});


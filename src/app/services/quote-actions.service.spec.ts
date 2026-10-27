import { TestBed } from '@angular/core/testing';
import { PortfolioStateService } from './portfolio-state.service';
import { QuoteActionsService } from './quote-actions.service';
import { QuoteCartService } from './quote-cart.service';
import { ToastService } from './toast.service';

describe('QuoteActionsService', () => {
  let service: QuoteActionsService;
  let portfolio: PortfolioStateService;
  let quoteCart: QuoteCartService;
  let toast: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PortfolioStateService,
        QuoteActionsService,
        QuoteCartService,
        ToastService,
      ],
    });
    service = TestBed.inject(QuoteActionsService);
    portfolio = TestBed.inject(PortfolioStateService);
    quoteCart = TestBed.inject(QuoteCartService);
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds a quote item, closes the modal, displays a toast, and scrolls to contact', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);
    portfolio.openCase(portfolio.items()[0]);

    service.addItem('Projeto especial');

    expect(quoteCart.selectedServices()).toContain('Projeto especial');
    expect(toast.message()).toContain('Projeto especial');
    expect(portfolio.selectedModal()).toBeNull();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(document.getElementById).toHaveBeenCalledWith('contato');
  });

  it('does not duplicate a quote item and handles a missing scroll target', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    const item = quoteCart.selectedServices()[0];
    const initialCount = quoteCart.selectedServices().length;

    service.addItem(item, 'missing-target');

    expect(quoteCart.selectedServices()).toHaveLength(initialCount);
    expect(toast.message()).toContain(item);
    expect(document.getElementById).toHaveBeenCalledWith('missing-target');
  });
});


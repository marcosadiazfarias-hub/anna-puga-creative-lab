import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { QuoteActionsService } from '../../services/quote-actions.service';
import { QuoteCartService } from '../../services/quote-cart.service';
import { ToastService } from '../../services/toast.service';
import { PortfolioSection } from './portfolio-section';

describe('PortfolioSection', () => {
  let fixture: ComponentFixture<PortfolioSection>;
  let portfolio: PortfolioStateService;
  let quoteCart: QuoteCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioSection],
      providers: [
        PortfolioStateService,
        QuoteActionsService,
        QuoteCartService,
        ToastService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioSection);
    portfolio = TestBed.inject(PortfolioStateService);
    quoteCart = TestBed.inject(QuoteCartService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });

  it('filters cards, opens and closes the case modal, and adds similar projects to the quote', () => {
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('#portfolio')!;
    const filterButton = Array.from(section.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Hamburgueria & Branding'),
    );

    filterButton?.click();
    fixture.detectChanges();
    expect(portfolio.activeFilter()).toBe('branding');
    expect(section.querySelectorAll('article')).toHaveLength(portfolio.filteredItems().length);

    const openButton = Array.from(section.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Ver Projeto & Mockups'),
    );
    openButton?.click();
    fixture.detectChanges();
    expect(root.querySelector('.fixed.inset-0')?.textContent).toContain(
      portfolio.selectedModal()?.title,
    );

    const closeButton = Array.from(
      root.querySelectorAll<HTMLButtonElement>('.fixed.inset-0 button'),
    ).find((button) => button.textContent?.includes('Fechar'));
    closeButton?.click();
    fixture.detectChanges();
    expect(portfolio.selectedModal()).toBeNull();

    const similarProjectButton = Array.from(
      section.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.includes('Quero Similar'))!;
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    similarProjectButton.click();
    expect(quoteCart.selectedServices()).toContain(portfolio.items()[0].priceReference);
  });
});


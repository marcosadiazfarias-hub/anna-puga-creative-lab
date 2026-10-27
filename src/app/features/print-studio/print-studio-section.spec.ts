import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { PrintStudioStateService } from '../../services/print-studio-state.service';
import { QuoteActionsService } from '../../services/quote-actions.service';
import { QuoteCartService } from '../../services/quote-cart.service';
import { ToastService } from '../../services/toast.service';
import { PrintStudioSection } from './print-studio-section';

describe('PrintStudioSection', () => {
  let fixture: ComponentFixture<PrintStudioSection>;
  let printStudio: PrintStudioStateService;
  let quoteCart: QuoteCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintStudioSection],
      providers: [
        PortfolioStateService,
        PrintStudioStateService,
        QuoteActionsService,
        QuoteCartService,
        ToastService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintStudioSection);
    printStudio = TestBed.inject(PrintStudioStateService);
    quoteCart = TestBed.inject(QuoteCartService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });

  it('updates the displayed design, garment, and fabric color from the controls', () => {
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('#estampas')!;
    const print = printStudio.catalog()[1];
    const printCard = Array.from(section.querySelectorAll<HTMLDivElement>('.neo-card')).find(
      (element) => element.textContent?.includes(print.name),
    )!;

    printCard.click();
    fixture.detectChanges();
    expect(printStudio.selectedPrintId()).toBe(print.id);

    const hoodieButton = Array.from(section.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Moletom',
    )!;
    hoodieButton.click();
    expect(printStudio.selectedGarment()).toBe('hoodie');

    section.querySelector<HTMLButtonElement>('button[title="Off-White"]')?.click();
    expect(printStudio.garmentBaseColor()).toBe('#F4F4F6');

    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    const reserveButton = Array.from(printCard.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Reservar'),
    )!;
    reserveButton.click();
    expect(quoteCart.selectedServices()).toContain(`Reserva de Estampa: ${print.name}`);

    const licenseButton = Array.from(section.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Licenciar Esta Estampa'),
    )!;
    licenseButton.click();
    expect(quoteCart.selectedServices()).toContain(
      `Licenciamento de Estampa: ${printStudio.activePrint().name}`,
    );
  });
});


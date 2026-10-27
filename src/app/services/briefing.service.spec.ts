import { TestBed } from '@angular/core/testing';
import { BriefingService } from './briefing.service';
import { QuoteCartService } from './quote-cart.service';
import { ToastService } from './toast.service';

describe('BriefingService', () => {
  let service: BriefingService;
  let quoteCart: QuoteCartService;
  let toast: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BriefingService, QuoteCartService, ToastService],
    });
    service = TestBed.inject(BriefingService);
    quoteCart = TestBed.inject(QuoteCartService);
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds a default message and updates it with form and cart values', () => {
    expect(service.previewText()).toBe(
      'Olá Anna!.\n\nTenho interesse em:\n• Identidade Visual & Cardápio (Gastronomia / Empresas)\nPrazo desejado: Normal (15 a 25 dias)',
    );

    service.form.setValue({
      clientName: 'Maria Silva',
      brandOrArtist: 'Banda Exemplo',
      urgency: 'Urgente',
      customNotes: 'Lançamento em novembro',
    });
    quoteCart.selectedServices.set(['Branding', 'Direção de arte']);

    expect(service.previewText()).toBe(
      'Olá Anna! Me chamo *Maria Silva* (Banda Exemplo).\n\nTenho interesse em:\n• Branding\n• Direção de arte\nPrazo desejado: Urgente\n\nDetalhes do projeto: Lançamento em novembro',
    );
  });

  it('uses the general project message when the quote cart is empty', () => {
    quoteCart.selectedServices.set([]);

    expect(service.previewText()).toBe(
      'Olá Anna!.\n\nGostaria de conversar sobre um projeto criativo.\nPrazo desejado: Normal (15 a 25 dias)',
    );
  });

  it('marks required fields and shows an error when the form is invalid', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    service.sendToWhatsApp();

    expect(service.form.controls.clientName.touched).toBe(true);
    expect(service.form.controls.brandOrArtist.touched).toBe(true);
    expect(toast.message()).toContain('Preencha seu nome');
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('opens WhatsApp with an encoded briefing in a protected new tab', () => {
    service.form.setValue({
      clientName: 'Ana',
      brandOrArtist: 'Marca & Cia',
      urgency: 'Normal',
      customNotes: 'Ideias para o verão',
    });
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    service.sendToWhatsApp();

    expect(openSpy).toHaveBeenCalledWith(
      `https://wa.me/5511999999999?text=${encodeURIComponent(service.previewText())}`,
      '_blank',
      'noopener,noreferrer',
    );
  });
});


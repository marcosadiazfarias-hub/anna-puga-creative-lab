import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('creates and renders the portfolio application', () => {
    fixture.detectChanges();

    expect(app).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h1')).toBeTruthy();
  });

  it('renders the contact signature with direct email and WhatsApp links', () => {
    fixture.detectChanges();
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer');

    expect(footer?.textContent).toContain('Marcos Farias');
    expect(footer?.querySelector('a[href="mailto:m.diazfarias@gmail.com"]')?.textContent).toContain(
      'm.diazfarias@gmail.com',
    );

    const whatsappLink = footer?.querySelector<HTMLAnchorElement>(
      'a[href="https://wa.me/5548988621897"]',
    );
    expect(whatsappLink?.getAttribute('aria-label')).toBe('Chamar Marcos Farias no WhatsApp');
    expect(whatsappLink?.textContent).toContain('(48) 98862-1897');
    expect(whatsappLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  describe('portfolio filters and case modal', () => {
    it('shows all portfolio items by default and filters every category', () => {
      expect(app.filteredPortfolio()).toHaveLength(app.portfolioItems().length);

      for (const category of ['eventos', 'branding', 'estampas', 'artistas'] as const) {
        app.setPortfolioFilter(category);
        expect(app.filteredPortfolio().length).toBeGreaterThan(0);
        expect(app.filteredPortfolio().every((item) => item.category === category)).toBe(true);
      }

      app.setPortfolioFilter('todos');
      expect(app.filteredPortfolio()).toEqual(app.portfolioItems());
    });

    it('returns an empty list when no portfolio item matches the selected category', () => {
      app.portfolioItems.set([]);
      app.setPortfolioFilter('eventos');

      expect(app.filteredPortfolio()).toEqual([]);
    });

    it('opens and closes the selected case modal', () => {
      const item = app.portfolioItems()[0];

      app.openCaseModal(item);
      expect(app.selectedPortfolioModal()).toBe(item);

      app.closeCaseModal();
      expect(app.selectedPortfolioModal()).toBeNull();
    });
  });

  describe('music catalog and lyrics', () => {
    it('shows every track by default and filters Pagode and Sertanejo', () => {
      expect(app.filteredHits()).toEqual(app.hitTracks());

      app.activeHitGenreFilter.set('Pagode');
      expect(app.filteredHits().length).toBeGreaterThan(0);
      expect(app.filteredHits().every((track) => track.genre === 'Pagode')).toBe(true);

      app.activeHitGenreFilter.set('Sertanejo');
      expect(app.filteredHits().length).toBeGreaterThan(0);
      expect(app.filteredHits().every((track) => track.genre === 'Sertanejo')).toBe(true);
    });

    it('returns no tracks when the selected genre has no matches', () => {
      app.hitTracks.set([]);
      app.activeHitGenreFilter.set('Pagode');

      expect(app.filteredHits()).toEqual([]);
    });

    it('expands and collapses lyrics for a track', () => {
      app.toggleLyrics('hit-01');
      expect(app.expandedLyricsId()).toBe('hit-01');

      app.toggleLyrics('hit-02');
      expect(app.expandedLyricsId()).toBe('hit-02');

      app.toggleLyrics('hit-02');
      expect(app.expandedLyricsId()).toBeNull();
    });
  });

  describe('print catalog', () => {
    it('selects a print by id and falls back to the first catalog item for an unknown id', () => {
      app.selectedPrintId.set('print-03');
      expect(app.activePrint().id).toBe('print-03');

      app.selectedPrintId.set('missing-print');
      expect(app.activePrint()).toBe(app.printCatalog()[0]);
    });

    it('updates the rendered print and garment mockup through its controls', () => {
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const printSection = root.querySelector('#estampas');

      expect(printSection).toBeTruthy();
      for (const print of app.printCatalog()) {
        const card = Array.from(
          printSection!.querySelectorAll<HTMLDivElement>('.neo-card'),
        ).find((element) => element.textContent?.includes(print.name));

        expect(card).toBeTruthy();
        card?.click();
        fixture.detectChanges();
        expect(app.selectedPrintId()).toBe(print.id);
      }

      const garments = [
        { label: 'T-Shirt', value: 'tshirt' },
        { label: 'Moletom', value: 'hoodie' },
        { label: 'Ecobag', value: 'totebag' },
        { label: 'Camisa/Moda', value: 'dress' },
      ] as const;
      for (const garment of garments) {
        const button = Array.from(printSection!.querySelectorAll('button')).find((element) =>
          element.textContent?.trim().includes(garment.label),
        );

        expect(button).toBeTruthy();
        button?.click();
        fixture.detectChanges();
        expect(app.selectedGarment()).toBe(garment.value);
      }

      const offWhiteSwatch = printSection!.querySelector<HTMLButtonElement>(
        'button[title="Off-White"]',
      );
      offWhiteSwatch?.click();
      fixture.detectChanges();
      expect(app.garmentBaseColor()).toBe('#F4F4F6');
    });
  });

  describe('rendered interactions', () => {
    it('filters portfolio cards and opens, keeps, and closes the case modal', () => {
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const portfolio = root.querySelector('#portfolio')!;
      const filterButton = Array.from(portfolio.querySelectorAll('button')).find((button) =>
        button.textContent?.includes('Branding'),
      );

      filterButton?.click();
      fixture.detectChanges();
      expect(app.activePortfolioFilter()).toBe('branding');
      expect(Array.from(portfolio.querySelectorAll('article'))).toHaveLength(
        app.filteredPortfolio().length,
      );

      const openButton = Array.from(portfolio.querySelectorAll('button')).find((button) =>
        button.textContent?.includes('Ver Projeto & Mockups'),
      );
      openButton?.click();
      fixture.detectChanges();

      const modal = root.querySelector<HTMLElement>('.fixed.inset-0');
      expect(modal?.textContent).toContain(app.selectedPortfolioModal()?.title);

      modal?.children[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();
      expect(app.selectedPortfolioModal()).not.toBeNull();

      const closeButton = Array.from(modal?.querySelectorAll('button') ?? []).find((button) =>
        button.textContent?.includes('Fechar'),
      );
      closeButton?.click();
      fixture.detectChanges();
      expect(app.selectedPortfolioModal()).toBeNull();

      app.openCaseModal(app.portfolioItems()[0]);
      fixture.detectChanges();
      const dismissButton = Array.from(
        root.querySelectorAll<HTMLButtonElement>('.fixed.inset-0 button'),
      ).find((button) => button.textContent?.includes('✕'));
      dismissButton?.click();
      fixture.detectChanges();
      expect(app.selectedPortfolioModal()).toBeNull();

      app.openCaseModal(app.portfolioItems()[0]);
      fixture.detectChanges();
      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      const similarProjectButton = Array.from(
        root.querySelectorAll<HTMLButtonElement>('.fixed.inset-0 button'),
      ).find((button) => button.textContent?.includes('Orçar Projeto Similar'));
      similarProjectButton?.click();
      fixture.detectChanges();
      expect(app.selectedServicesCart()).toContain(app.portfolioItems()[0].priceReference);

      app.openCaseModal(app.portfolioItems()[0]);
      fixture.detectChanges();
      root.querySelector<HTMLElement>('.fixed.inset-0')?.click();
      fixture.detectChanges();
      expect(app.selectedPortfolioModal()).toBeNull();
    });

    it('filters tracks, toggles lyrics and playback, and requests a track quote', () => {
      vi.useFakeTimers();
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const hitmaker = root.querySelector('#hitmaker')!;
      const track = app.hitTracks()[0];
      const trackCard = Array.from(hitmaker.querySelectorAll<HTMLDivElement>('.neo-card-pink')).find(
        (card) => card.textContent?.includes(track.title),
      )!;
      const playButton = trackCard.querySelector<HTMLButtonElement>('button')!;

      playButton.click();
      fixture.detectChanges();
      expect(app.playingTrackId()).toBe(track.id);

      playButton.click();
      fixture.detectChanges();
      expect(app.playingTrackId()).toBeNull();

      const lyricsButton = Array.from(
        trackCard.querySelectorAll<HTMLButtonElement>('button'),
      ).find((button) => button.textContent?.includes('Ver Letra do Refrão'))!;
      lyricsButton.click();
      fixture.detectChanges();
      expect(trackCard.textContent).toContain(track.chorusLyrics);

      const hideLyricsButton = Array.from(
        trackCard.querySelectorAll<HTMLButtonElement>('button'),
      ).find((button) => button.textContent?.includes('Ocultar Letra do Refrão'));
      hideLyricsButton?.click();
      fixture.detectChanges();
      expect(app.expandedLyricsId()).toBeNull();

      const sertanejoFilter = Array.from(
        hitmaker.querySelectorAll<HTMLButtonElement>('button'),
      ).find((button) => button.textContent?.trim() === 'Sertanejo');
      sertanejoFilter?.click();
      fixture.detectChanges();
      expect(app.filteredHits().every((item) => item.genre === 'Sertanejo')).toBe(true);

      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      const quoteButton = Array.from(
        hitmaker.querySelectorAll<HTMLButtonElement>('button'),
      ).find((button) => button.textContent?.includes('Solicitar Guia Completa'));
      quoteButton?.click();
      fixture.detectChanges();
      expect(app.selectedServicesCart()).toContain(
        `Liberação / Guia Musical: ${app.hitTracks()[1].title} (${app.hitTracks()[1].genre})`,
      );
    });

    it('toggles service selection and displays the quote toast from the template', () => {
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const contact = root.querySelector('#contato')!;
      const service = app.availableServices[1];
      const serviceButton = Array.from(contact.querySelectorAll('button')).find((button) =>
        button.textContent?.includes(service),
      );

      serviceButton?.click();
      fixture.detectChanges();
      expect(app.isServiceSelected(service)).toBe(true);

      serviceButton?.click();
      fixture.detectChanges();
      expect(app.isServiceSelected(service)).toBe(false);

      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      const quoteButton = Array.from(
        root.querySelectorAll<HTMLButtonElement>('#portfolio button'),
      ).find((button) => button.textContent?.includes('Quero Similar'));
      quoteButton?.click();
      fixture.detectChanges();

      expect(root.textContent).toContain('adicionado ao seu orçamento');
      expect(root.querySelector('.fixed.bottom-6.right-6')).toBeTruthy();
    });
  });

  describe('service quote cart', () => {
    it('adds and removes a service without creating duplicate entries', () => {
      const service = app.availableServices[1];

      expect(app.isServiceSelected(service)).toBe(false);
      app.toggleServiceInCart(service);

      expect(app.selectedServicesCart().filter((item) => item === service)).toHaveLength(1);
      expect(app.isServiceSelected(service)).toBe(true);

      app.toggleServiceInCart(service);
      expect(app.isServiceSelected(service)).toBe(false);
    });

    it('adds an item to the quote, closes the modal, and scrolls to the contact section', () => {
      const scrollIntoView = vi.fn();
      vi.spyOn(document, 'getElementById').mockReturnValue({
        scrollIntoView,
      } as unknown as HTMLElement);
      app.openCaseModal(app.portfolioItems()[0]);

      app.addItemToQuote('Projeto especial');

      expect(app.selectedServicesCart()).toContain('Projeto especial');
      expect(app.toastMessage()).toContain('Projeto especial');
      expect(app.selectedPortfolioModal()).toBeNull();
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      expect(document.getElementById).toHaveBeenCalledWith('contato');
    });

    it('does not duplicate an existing quote item and accepts a custom scroll target', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      const initialCount = app.selectedServicesCart().length;
      const existingService = app.selectedServicesCart()[0];

      app.addItemToQuote(existingService, 'custom-target');

      expect(app.selectedServicesCart()).toHaveLength(initialCount);
      expect(app.toastMessage()).toContain(existingService);
      expect(document.getElementById).toHaveBeenCalledWith('custom-target');
    });
  });

  describe('WhatsApp briefing', () => {
    it('builds a preview with the default service and without optional notes', () => {
      expect(app.whatsappPreviewText()).toBe(
        'Olá Anna!.\n\nTenho interesse em:\n• Identidade Visual & Cardápio (Gastronomia / Empresas)\nPrazo desejado: Normal (15 a 25 dias)',
      );
    });

    it('builds a preview with client details, multiple services, urgency, and notes', () => {
      app.briefingForm.setValue({
        clientName: 'Maria Silva',
        brandOrArtist: 'Banda Exemplo',
        urgency: 'Urgente',
        customNotes: 'Lançamento em novembro',
      });
      app.selectedServicesCart.set(['Branding', 'Direção de arte']);

      expect(app.whatsappPreviewText()).toBe(
        'Olá Anna! Me chamo *Maria Silva* (Banda Exemplo).\n\nTenho interesse em:\n• Branding\n• Direção de arte\nPrazo desejado: Urgente\n\nDetalhes do projeto: Lançamento em novembro',
      );
    });

    it('uses the generic project message when the cart is empty', () => {
      app.selectedServicesCart.set([]);

      expect(app.whatsappPreviewText()).toBe(
        'Olá Anna!.\n\nGostaria de conversar sobre um projeto criativo.\nPrazo desejado: Normal (15 a 25 dias)',
      );
    });

    it('marks invalid fields and shows an error toast instead of opening WhatsApp', () => {
      const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

      app.sendBriefingToWhatsApp();

      expect(app.briefingForm.controls.clientName.touched).toBe(true);
      expect(app.briefingForm.controls.brandOrArtist.touched).toBe(true);
      expect(app.toastMessage()).toContain('Preencha seu nome');
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('encodes the briefing and opens WhatsApp in a protected new tab for valid fields', () => {
      app.briefingForm.setValue({
        clientName: 'Ana',
        brandOrArtist: 'Marca & Cia',
        urgency: 'Normal',
        customNotes: 'Ideias para o verão',
      });
      const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

      app.sendBriefingToWhatsApp();

      expect(openSpy).toHaveBeenCalledWith(
        `https://wa.me/5511999999999?text=${encodeURIComponent(app.whatsappPreviewText())}`,
        '_blank',
        'noopener,noreferrer',
      );
    });
  });

  describe('notifications', () => {
    it('clears a toast after its timeout', () => {
      vi.useFakeTimers();

      app.showToast('Briefing enviado');
      expect(app.toastMessage()).toBe('Briefing enviado');

      vi.advanceTimersByTime(3800);
      expect(app.toastMessage()).toBeNull();
    });

    it('does not let an earlier timeout clear a newer toast', () => {
      vi.useFakeTimers();

      app.showToast('Primeira mensagem');
      vi.advanceTimersByTime(2000);
      app.showToast('Mensagem atualizada');

      vi.advanceTimersByTime(1800);
      expect(app.toastMessage()).toBe('Mensagem atualizada');

      vi.advanceTimersByTime(2000);
      expect(app.toastMessage()).toBeNull();
    });
  });

  describe('audio playback', () => {
    it('starts playback, updates progress, previews chords, and stops at completion', async () => {
      vi.useFakeTimers();
      const oscillator = {
        type: 'sine' as OscillatorType,
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      const gain = {
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      const context = {
        state: 'running',
        currentTime: 0,
        destination: {},
        createOscillator: vi.fn(() => oscillator),
        createGain: vi.fn(() => gain),
        resume: vi.fn(),
        close: vi.fn(),
      };
      class MockAudioContext {
        state = context.state as AudioContextState;
        currentTime = context.currentTime;
        destination = context.destination;
        createOscillator = context.createOscillator;
        createGain = context.createGain;
        resume = context.resume;
        close = context.close;
      }
      vi.stubGlobal('AudioContext', MockAudioContext);

      const track = app.hitTracks()[0];
      app.togglePlayTrack(track);

      expect(app.playingTrackId()).toBe(track.id);
      expect(app.trackProgress()).toBe(8);
      expect(oscillator.start).toHaveBeenCalledTimes(track.chordProgression.length);

      await vi.advanceTimersByTimeAsync(3000);
      expect(app.trackProgress()).toBe(25);
      expect(oscillator.start).toHaveBeenCalledTimes(track.chordProgression.length * 2);

      await vi.advanceTimersByTimeAsync(9000);
      expect(app.playingTrackId()).toBeNull();
      expect(app.trackProgress()).toBe(0);
    });

    it('resumes a suspended audio context and can stop playback manually', () => {
      vi.useFakeTimers();
      const context = {
        state: 'suspended',
        currentTime: 0,
        destination: {},
        createOscillator: vi.fn(() => ({
          type: 'sine' as OscillatorType,
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        })),
        createGain: vi.fn(() => ({
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        })),
        resume: vi.fn(),
        close: vi.fn(),
      };
      class MockAudioContext {
        state = context.state as AudioContextState;
        currentTime = context.currentTime;
        destination = context.destination;
        createOscillator = context.createOscillator;
        createGain = context.createGain;
        resume = context.resume;
        close = context.close;
      }
      vi.stubGlobal('AudioContext', MockAudioContext);

      app.togglePlayTrack(app.hitTracks()[0]);
      expect(context.resume).toHaveBeenCalledOnce();

      app.stopAudioPlayback();
      expect(app.playingTrackId()).toBeNull();
      expect(app.trackProgress()).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    });

    it('stops the current track when its play control is toggled again', () => {
      vi.useFakeTimers();

      const track = app.hitTracks()[0];
      app.togglePlayTrack(track);
      app.togglePlayTrack(track);

      expect(app.playingTrackId()).toBeNull();
      expect(app.trackProgress()).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    });

    it('replaces an active track when another track is started', () => {
      vi.useFakeTimers();

      app.togglePlayTrack(app.hitTracks()[0]);
      app.togglePlayTrack(app.hitTracks()[1]);

      expect(app.playingTrackId()).toBe(app.hitTracks()[1].id);
      expect(app.trackProgress()).toBe(8);
      expect(vi.getTimerCount()).toBe(1);
    });

    it('continues playback when Web Audio is unavailable', () => {
      vi.useFakeTimers();
      vi.stubGlobal(
        'AudioContext',
        class {
          constructor() {
            throw new Error('Audio is unavailable');
          }
        },
      );

      app.togglePlayTrack(app.hitTracks()[0]);

      expect(app.playingTrackId()).toBe(app.hitTracks()[0].id);
      expect(app.trackProgress()).toBe(8);
    });

    it('closes the audio context when the component is destroyed', () => {
      vi.useFakeTimers();
      const close = vi.fn();
      class MockAudioContext {
        state = 'running' as AudioContextState;
        currentTime = 0;
        destination = {};
        createOscillator = vi.fn(() => ({
          type: 'sine' as OscillatorType,
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        }));
        createGain = vi.fn(() => ({
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        }));
        resume = vi.fn();
        close = close;
      }
      vi.stubGlobal('AudioContext', MockAudioContext);

      app.togglePlayTrack(app.hitTracks()[0]);
      fixture.destroy();

      expect(close).toHaveBeenCalledOnce();
      expect(app.playingTrackId()).toBeNull();
    });
  });
});

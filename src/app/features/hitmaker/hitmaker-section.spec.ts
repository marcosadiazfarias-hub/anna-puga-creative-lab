import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPreviewService } from '../../services/audio-preview.service';
import { HitmakerStateService } from '../../services/hitmaker-state.service';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { QuoteActionsService } from '../../services/quote-actions.service';
import { QuoteCartService } from '../../services/quote-cart.service';
import { ToastService } from '../../services/toast.service';
import { HitmakerSection } from './hitmaker-section';

describe('HitmakerSection', () => {
  let fixture: ComponentFixture<HitmakerSection>;
  let hitmaker: HitmakerStateService;
  let audio: AudioPreviewService;
  let quoteCart: QuoteCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HitmakerSection],
      providers: [
        AudioPreviewService,
        HitmakerStateService,
        PortfolioStateService,
        QuoteActionsService,
        QuoteCartService,
        ToastService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HitmakerSection);
    hitmaker = TestBed.inject(HitmakerStateService);
    audio = TestBed.inject(AudioPreviewService);
    quoteCart = TestBed.inject(QuoteCartService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the filtered tracks, lyrics, and quote action', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('#hitmaker')!;
    const track = hitmaker.tracks()[0];
    const card = Array.from(section.querySelectorAll<HTMLDivElement>('.neo-card-pink')).find(
      (element) => element.textContent?.includes(track.title),
    )!;

    vi.useFakeTimers();
    const playButton = card.querySelector<HTMLButtonElement>('button')!;
    playButton.click();
    fixture.detectChanges();
    expect(audio.playingTrackId()).toBe(track.id);
    playButton.click();
    fixture.detectChanges();
    expect(audio.playingTrackId()).toBeNull();

    const lyricsButton = Array.from(card.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Ver Letra do Refrão'),
    )!;
    lyricsButton.click();
    fixture.detectChanges();
    expect(card.textContent).toContain(track.chorusLyrics);

    const quoteButton = Array.from(card.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Solicitar Guia Completa'),
    )!;
    quoteButton.click();
    fixture.detectChanges();
    expect(quoteCart.selectedServices()).toContain(
      `Liberação / Guia Musical: ${track.title} (${track.genre})`,
    );

    const sertanejoFilter = Array.from(
      section.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.trim() === 'Sertanejo')!;
    sertanejoFilter.click();
    fixture.detectChanges();
    expect(hitmaker.filteredTracks().every((item) => item.genre === 'Sertanejo')).toBe(true);
  });
});


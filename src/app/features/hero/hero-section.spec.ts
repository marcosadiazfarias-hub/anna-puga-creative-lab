import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPreviewService } from '../../services/audio-preview.service';
import { HitmakerStateService } from '../../services/hitmaker-state.service';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { QuoteCartService } from '../../services/quote-cart.service';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  let fixture: ComponentFixture<HeroSection>;
  let portfolio: PortfolioStateService;
  let audio: AudioPreviewService;
  let hitmaker: HitmakerStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSection],
      providers: [
        AudioPreviewService,
        HitmakerStateService,
        PortfolioStateService,
        QuoteCartService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    portfolio = TestBed.inject(PortfolioStateService);
    audio = TestBed.inject(AudioPreviewService);
    hitmaker = TestBed.inject(HitmakerStateService);
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the main heading, filters portfolio pillars, and toggles featured audio playback', () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')).toBeTruthy();

    const eventPillar = Array.from(root.querySelectorAll<HTMLAnchorElement>('a')).find((link) =>
      link.textContent?.includes('Grandes Eventos & Cena Eletrônica'),
    )!;
    eventPillar.click();
    expect(portfolio.activeFilter()).toBe('eventos');

    const brandingPillar = Array.from(root.querySelectorAll<HTMLAnchorElement>('a')).find((link) =>
      link.textContent?.includes('Branding & Gastronomia'),
    )!;
    brandingPillar.click();
    expect(portfolio.activeFilter()).toBe('branding');

    const playButton = root.querySelector<HTMLButtonElement>('button')!;
    playButton.click();
    fixture.detectChanges();
    expect(audio.playingTrackId()).toBe(hitmaker.tracks()[0].id);

    playButton.click();
    fixture.detectChanges();
    expect(audio.playingTrackId()).toBeNull();
  });
});


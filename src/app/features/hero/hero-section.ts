import { Component, inject } from '@angular/core';
import { HitTrack } from '../../models/site-catalog';
import { AudioPreviewService } from '../../services/audio-preview.service';
import { HitmakerStateService } from '../../services/hitmaker-state.service';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { QuoteCartService } from '../../services/quote-cart.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
})
export class HeroSection {
  private readonly portfolio = inject(PortfolioStateService);
  private readonly audio = inject(AudioPreviewService);
  private readonly hitmaker = inject(HitmakerStateService);
  private readonly quoteCart = inject(QuoteCartService);

  readonly selectedServicesCart = this.quoteCart.selectedServices;
  readonly hitTracks = this.hitmaker.tracks;
  readonly playingTrackId = this.audio.playingTrackId;

  setPortfolioFilter(filter: 'eventos' | 'branding'): void {
    this.portfolio.setFilter(filter);
  }

  togglePlayTrack(track: HitTrack): void {
    this.audio.toggleTrack(track);
  }
}

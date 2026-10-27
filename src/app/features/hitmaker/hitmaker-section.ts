import { Component, inject } from '@angular/core';
import { HitTrack } from '../../models/site-catalog';
import { AudioPreviewService } from '../../services/audio-preview.service';
import { HitmakerStateService } from '../../services/hitmaker-state.service';
import { QuoteActionsService } from '../../services/quote-actions.service';

@Component({
  selector: 'app-hitmaker-section',
  templateUrl: './hitmaker-section.html',
})
export class HitmakerSection {
  private readonly audio = inject(AudioPreviewService);
  private readonly hitmaker = inject(HitmakerStateService);
  private readonly quoteActions = inject(QuoteActionsService);

  readonly activeHitGenreFilter = this.hitmaker.activeGenre;
  readonly expandedLyricsId = this.hitmaker.expandedLyricsId;
  readonly filteredHits = this.hitmaker.filteredTracks;
  readonly hitGenres = ['Todos', 'Pagode', 'Sertanejo'] as const;
  readonly hitTracks = this.hitmaker.tracks;
  readonly playingTrackId = this.audio.playingTrackId;

  setHitGenre(genre: 'Todos' | 'Pagode' | 'Sertanejo'): void {
    this.hitmaker.setGenre(genre);
  }

  togglePlayTrack(track: HitTrack): void {
    this.audio.toggleTrack(track);
  }

  toggleLyrics(trackId: string): void {
    this.hitmaker.toggleLyrics(trackId);
  }

  addItemToQuote(itemLabel: string): void {
    this.quoteActions.addItem(itemLabel);
  }
}

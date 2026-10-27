import { computed, Injectable, signal } from '@angular/core';
import { HIT_TRACKS } from '../data/site-catalog';
import { HitTrack } from '../models/site-catalog';

@Injectable()
export class HitmakerStateService {
  readonly tracks = signal<HitTrack[]>(HIT_TRACKS);
  readonly activeGenre = signal<'Todos' | 'Pagode' | 'Sertanejo'>('Todos');
  readonly expandedLyricsId = signal<string | null>(null);

  readonly filteredTracks = computed(() => {
    const genre = this.activeGenre();
    const tracks = this.tracks();
    return genre === 'Todos' ? tracks : tracks.filter((track) => track.genre === genre);
  });

  setGenre(genre: 'Todos' | 'Pagode' | 'Sertanejo'): void {
    this.activeGenre.set(genre);
  }

  toggleLyrics(trackId: string): void {
    this.expandedLyricsId.update((currentId) => (currentId === trackId ? null : trackId));
  }
}

import { TestBed } from '@angular/core/testing';
import { HitmakerStateService } from './hitmaker-state.service';

describe('HitmakerStateService', () => {
  let service: HitmakerStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HitmakerStateService],
    });
    service = TestBed.inject(HitmakerStateService);
  });

  it('filters tracks by genre and returns all tracks for Todos', () => {
    expect(service.filteredTracks()).toEqual(service.tracks());

    for (const genre of ['Pagode', 'Sertanejo'] as const) {
      service.setGenre(genre);
      expect(service.filteredTracks().length).toBeGreaterThan(0);
      expect(service.filteredTracks().every((track) => track.genre === genre)).toBe(true);
    }

    service.setGenre('Todos');
    expect(service.filteredTracks()).toEqual(service.tracks());
  });

  it('returns no tracks when the selected genre has no matches', () => {
    service.tracks.set([]);
    service.setGenre('Pagode');

    expect(service.filteredTracks()).toEqual([]);
  });

  it('expands, changes, and collapses track lyrics', () => {
    service.toggleLyrics('hit-01');
    expect(service.expandedLyricsId()).toBe('hit-01');

    service.toggleLyrics('hit-02');
    expect(service.expandedLyricsId()).toBe('hit-02');

    service.toggleLyrics('hit-02');
    expect(service.expandedLyricsId()).toBeNull();
  });
});


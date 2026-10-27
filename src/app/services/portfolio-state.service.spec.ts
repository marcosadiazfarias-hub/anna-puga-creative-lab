import { TestBed } from '@angular/core/testing';
import { PortfolioStateService } from './portfolio-state.service';

describe('PortfolioStateService', () => {
  let service: PortfolioStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioStateService],
    });
    service = TestBed.inject(PortfolioStateService);
  });

  it('filters every portfolio category and restores the complete catalog', () => {
    expect(service.filteredItems()).toHaveLength(service.items().length);

    for (const category of ['eventos', 'branding', 'estampas', 'artistas'] as const) {
      service.setFilter(category);
      expect(service.filteredItems().length).toBeGreaterThan(0);
      expect(service.filteredItems().every((item) => item.category === category)).toBe(true);
    }

    service.setFilter('todos');
    expect(service.filteredItems()).toEqual(service.items());
  });

  it('returns no items when the selected category has no matches', () => {
    service.items.set([]);
    service.setFilter('eventos');

    expect(service.filteredItems()).toEqual([]);
  });

  it('opens and closes the selected case modal', () => {
    const item = service.items()[0];

    service.openCase(item);
    expect(service.selectedModal()).toBe(item);

    service.closeCase();
    expect(service.selectedModal()).toBeNull();
  });
});


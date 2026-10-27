import { computed, Injectable, signal } from '@angular/core';
import { PORTFOLIO_ITEMS } from '../data/site-catalog';
import { PortfolioItem } from '../models/site-catalog';

@Injectable()
export class PortfolioStateService {
  readonly items = signal<PortfolioItem[]>(PORTFOLIO_ITEMS);
  readonly activeFilter = signal<'todos' | 'eventos' | 'branding' | 'estampas' | 'artistas'>(
    'todos',
  );
  readonly selectedModal = signal<PortfolioItem | null>(null);

  readonly filteredItems = computed(() => {
    const filter = this.activeFilter();
    const items = this.items();
    return filter === 'todos' ? items : items.filter((item) => item.category === filter);
  });

  setFilter(filter: 'todos' | 'eventos' | 'branding' | 'estampas' | 'artistas'): void {
    this.activeFilter.set(filter);
  }

  openCase(item: PortfolioItem): void {
    this.selectedModal.set(item);
  }

  closeCase(): void {
    this.selectedModal.set(null);
  }
}

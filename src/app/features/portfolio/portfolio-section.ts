import { Component, inject } from '@angular/core';
import { PortfolioItem } from '../../models/site-catalog';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { QuoteActionsService } from '../../services/quote-actions.service';

@Component({
  selector: 'app-portfolio-section',
  templateUrl: './portfolio-section.html',
})
export class PortfolioSection {
  private readonly portfolio = inject(PortfolioStateService);
  private readonly quoteActions = inject(QuoteActionsService);

  readonly portfolioItems = this.portfolio.items;
  readonly activePortfolioFilter = this.portfolio.activeFilter;
  readonly selectedPortfolioModal = this.portfolio.selectedModal;
  readonly filteredPortfolio = this.portfolio.filteredItems;

  setPortfolioFilter(filter: 'todos' | 'eventos' | 'branding' | 'estampas' | 'artistas'): void {
    this.portfolio.setFilter(filter);
  }

  openCaseModal(item: PortfolioItem): void {
    this.portfolio.openCase(item);
  }

  closeCaseModal(): void {
    this.portfolio.closeCase();
  }

  addItemToQuote(itemLabel: string): void {
    this.quoteActions.addItem(itemLabel);
  }
}

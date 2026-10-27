import { Component, inject } from '@angular/core';
import { QuoteActionsService } from '../../services/quote-actions.service';

@Component({
  selector: 'app-ecosystem-section',
  templateUrl: './ecosystem-section.html',
})
export class EcosystemSection {
  private readonly quoteActions = inject(QuoteActionsService);

  addItemToQuote(itemLabel: string): void {
    this.quoteActions.addItem(itemLabel);
  }
}

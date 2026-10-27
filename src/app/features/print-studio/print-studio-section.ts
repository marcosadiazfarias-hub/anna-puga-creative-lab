import { Component, inject } from '@angular/core';
import { QuoteActionsService } from '../../services/quote-actions.service';
import { PrintStudioStateService } from '../../services/print-studio-state.service';

@Component({
  selector: 'app-print-studio-section',
  templateUrl: './print-studio-section.html',
})
export class PrintStudioSection {
  private readonly printStudio = inject(PrintStudioStateService);
  private readonly quoteActions = inject(QuoteActionsService);

  readonly activePrint = this.printStudio.activePrint;
  readonly garmentBaseColor = this.printStudio.garmentBaseColor;
  readonly printCatalog = this.printStudio.catalog;
  readonly selectedGarment = this.printStudio.selectedGarment;
  readonly selectedPrintId = this.printStudio.selectedPrintId;

  addItemToQuote(itemLabel: string): void {
    this.quoteActions.addItem(itemLabel);
  }
}

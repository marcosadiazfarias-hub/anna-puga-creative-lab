import { inject, Injectable } from '@angular/core';
import { PortfolioStateService } from './portfolio-state.service';
import { QuoteCartService } from './quote-cart.service';
import { ToastService } from './toast.service';

@Injectable()
export class QuoteActionsService {
  private readonly portfolio = inject(PortfolioStateService);
  private readonly quoteCart = inject(QuoteCartService);
  private readonly toast = inject(ToastService);

  addItem(itemLabel: string, scrollId = 'contato'): void {
    this.quoteCart.addService(itemLabel);
    this.toast.show(`"${itemLabel}" adicionado ao seu orçamento!`);
    this.portfolio.closeCase();

    document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' });
  }
}

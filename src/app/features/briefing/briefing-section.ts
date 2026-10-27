import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AVAILABLE_SERVICES } from '../../data/site-catalog';
import { BriefingService } from '../../services/briefing.service';
import { QuoteCartService } from '../../services/quote-cart.service';

@Component({
  selector: 'app-briefing-section',
  imports: [ReactiveFormsModule],
  templateUrl: './briefing-section.html',
})
export class BriefingSection {
  private readonly briefing = inject(BriefingService);
  private readonly quoteCart = inject(QuoteCartService);

  readonly availableServices = AVAILABLE_SERVICES;
  readonly briefingForm = this.briefing.form;
  readonly selectedServicesCart = this.quoteCart.selectedServices;
  readonly whatsappPreviewText = this.briefing.previewText;

  toggleServiceInCart(serviceName: string): void {
    this.quoteCart.toggleService(serviceName);
  }

  isServiceSelected(serviceName: string): boolean {
    return this.quoteCart.isSelected(serviceName);
  }

  sendBriefingToWhatsApp(): void {
    this.briefing.sendToWhatsApp();
  }
}

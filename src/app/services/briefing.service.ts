import { computed, inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { QuoteCartService } from './quote-cart.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class BriefingService {
  private readonly formBuilder = inject(FormBuilder);
  private readonly quoteCart = inject(QuoteCartService);
  private readonly toast = inject(ToastService);

  readonly form = this.formBuilder.nonNullable.group({
    clientName: ['', [Validators.required, Validators.minLength(2)]],
    brandOrArtist: ['', [Validators.required]],
    urgency: ['Normal (15 a 25 dias)'],
    customNotes: [''],
  });

  private readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  readonly previewText = computed(() => {
    const formValue = this.formValue();
    const services = this.quoteCart.selectedServices();
    const namePart = formValue.clientName
      ? `Olá Anna! Me chamo *${formValue.clientName}*`
      : 'Olá Anna!';
    const brandPart = formValue.brandOrArtist ? ` (${formValue.brandOrArtist})` : '';
    const servicesPart =
      services.length > 0
        ? `\n\nTenho interesse em:\n${services.map((service) => `• ${service}`).join('\n')}`
        : '\n\nGostaria de conversar sobre um projeto criativo.';
    const notesPart = formValue.customNotes
      ? `\n\nDetalhes do projeto: ${formValue.customNotes}`
      : '';

    return `${namePart}${brandPart}.${servicesPart}\nPrazo desejado: ${formValue.urgency}${notesPart}`;
  });

  sendToWhatsApp(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Preencha seu nome e marca/projeto para enviar no WhatsApp.');
      return;
    }

    const text = encodeURIComponent(this.previewText());
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank', 'noopener,noreferrer');
  }
}

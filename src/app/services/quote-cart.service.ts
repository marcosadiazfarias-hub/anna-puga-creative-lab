import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuoteCartService {
  readonly selectedServices = signal<string[]>([
    'Identidade Visual & Cardápio (Gastronomia / Empresas)',
  ]);

  toggleService(serviceName: string): void {
    this.selectedServices.update((services) =>
      services.includes(serviceName)
        ? services.filter((service) => service !== serviceName)
        : [...services, serviceName],
    );
  }

  addService(serviceName: string): void {
    this.selectedServices.update((services) =>
      services.includes(serviceName) ? services : [...services, serviceName],
    );
  }

  isSelected(serviceName: string): boolean {
    return this.selectedServices().includes(serviceName);
  }
}

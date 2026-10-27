import { computed, Injectable, signal } from '@angular/core';
import { PRINT_CATALOG } from '../data/site-catalog';

@Injectable()
export class PrintStudioStateService {
  readonly catalog = signal(PRINT_CATALOG);
  readonly selectedPrintId = signal('print-01');
  readonly selectedGarment = signal<'tshirt' | 'hoodie' | 'totebag' | 'dress'>('tshirt');
  readonly garmentBaseColor = signal<'#121216' | '#F4F4F6' | '#CCFF00' | '#581C87'>('#121216');

  readonly activePrint = computed(
    () => this.catalog().find((print) => print.id === this.selectedPrintId()) ?? this.catalog()[0],
  );
}

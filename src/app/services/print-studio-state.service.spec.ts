import { TestBed } from '@angular/core/testing';
import { PrintStudioStateService } from './print-studio-state.service';

describe('PrintStudioStateService', () => {
  let service: PrintStudioStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintStudioStateService],
    });
    service = TestBed.inject(PrintStudioStateService);
  });

  it('selects a print by id and falls back to the first design for an unknown id', () => {
    service.selectedPrintId.set('print-03');
    expect(service.activePrint().id).toBe('print-03');

    service.selectedPrintId.set('missing-print');
    expect(service.activePrint()).toBe(service.catalog()[0]);
  });
});


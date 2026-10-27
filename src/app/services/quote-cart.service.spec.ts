import { TestBed } from '@angular/core/testing';
import { QuoteCartService } from './quote-cart.service';

describe('QuoteCartService', () => {
  let service: QuoteCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuoteCartService],
    });
    service = TestBed.inject(QuoteCartService);
  });

  it('adds and removes cart entries without duplicates', () => {
    const item = 'Nova identidade visual';

    expect(service.isSelected(item)).toBe(false);
    service.addService(item);
    service.addService(item);
    expect(service.selectedServices().filter((entry) => entry === item)).toHaveLength(1);
    expect(service.isSelected(item)).toBe(true);

    service.toggleService(item);
    expect(service.isSelected(item)).toBe(false);

    service.toggleService(item);
    expect(service.isSelected(item)).toBe(true);
  });
});


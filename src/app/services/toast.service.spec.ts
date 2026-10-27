import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('replaces an older toast timeout when showing a newer message', () => {
    vi.useFakeTimers();

    service.show('Primeira mensagem');
    vi.advanceTimersByTime(2000);
    service.show('Mensagem atualizada');

    vi.advanceTimersByTime(1800);
    expect(service.message()).toBe('Mensagem atualizada');
    vi.advanceTimersByTime(2000);
    expect(service.message()).toBeNull();
  });

  it('clears the active timeout on destroy', () => {
    vi.useFakeTimers();

    service.show('Mensagem temporária');
    service.ngOnDestroy();

    expect(vi.getTimerCount()).toBe(0);
  });
});


import { Injectable, OnDestroy, signal } from '@angular/core';

@Injectable()
export class ToastService implements OnDestroy {
  readonly message = signal<string | null>(null);

  private timeout: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.message.set(message);
    this.timeout = setTimeout(() => {
      if (this.message() === message) {
        this.message.set(null);
      }
      this.timeout = null;
    }, 3800);
  }

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

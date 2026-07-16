import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  readonly isLoading = signal<boolean>(false);
  readonly loadingMessage = signal<string>('Accediendo al Sistema...');

  show(message: string = 'Accediendo al Sistema...'): void {
    this.loadingMessage.set(message);
    this.isLoading.set(true);
  }

  hide(): void {
    this.isLoading.set(false);
  }

  showTemporarily(durationMs: number = 1500, message: string = 'Accediendo al Sistema...'): Promise<void> {
    this.show(message);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.hide();
        resolve();
      }, durationMs);
    });
  }
}

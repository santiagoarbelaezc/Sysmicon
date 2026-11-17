import { createSignal, useSignal } from '../core/signal';

class LoadingService {
  readonly isLoading = createSignal<boolean>(false);
  readonly loadingMessage = createSignal<string>('Accediendo al Sistema...');

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

export const loadingService = new LoadingService();

export function useLoadingService() {
  const isLoading = useSignal(loadingService.isLoading);
  const loadingMessage = useSignal(loadingService.loadingMessage);
  return {
    isLoading,
    loadingMessage,
    show: (msg?: string) => loadingService.show(msg),
    hide: () => loadingService.hide(),
    showTemporarily: (ms?: number, msg?: string) => loadingService.showTemporarily(ms, msg),
  };
}

import { useSyncExternalStore } from 'react';

export interface Signal<T> {
  (): T;
  get(): T;
  set(value: T): void;
  update(updater: (prev: T) => T): void;
  subscribe(listener: () => void): () => void;
}

export function createSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((l) => l());
  };

  const sig = (() => value) as Signal<T>;

  sig.get = () => value;

  sig.set = (newValue: T) => {
    if (!Object.is(value, newValue)) {
      value = newValue;
      notify();
    }
  };

  sig.update = (updater: (prev: T) => T) => {
    sig.set(updater(value));
  };

  sig.subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return sig;
}

export function useSignal<T>(sig: Signal<T>): T {
  return useSyncExternalStore(sig.subscribe, sig.get, sig.get);
}

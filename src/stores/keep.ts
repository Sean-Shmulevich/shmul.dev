import { writable } from 'svelte/store';

function storeIframe() {
  const { subscribe, set, update } = writable<number>(0);
  return {
    subscribe,
    reset: () => {
      set(0);
      return true;
    },
    set: (n: number) => set(n),
  };
}

export const glowWindow = storeIframe();

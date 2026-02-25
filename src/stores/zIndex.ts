import { writable } from 'svelte/store';

function createCount() {
  const { subscribe, set, update } = writable<{ zIdx: number; name: string }>({
    zIdx: 1,
    name: 'Overview',
  });

  return {
    subscribe,
    increment: () => update((n) => ({ zIdx: n.zIdx + 1, name: n.name })),
    decrement: () => update((n) => ({ zIdx: n.zIdx - 1, name: n.name })),
    reset: () => set({ zIdx: 0, name: '' }),
    set: (n: { zIdx: number; name: string }) => set(n),
  };
}

export const count = createCount();

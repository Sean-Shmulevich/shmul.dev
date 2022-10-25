import { writable } from 'svelte/store';

function createCount() {
	const { subscribe, set, update } = writable({zIdx: 1, name: "Overview"});

	return {
		subscribe,
		increment: () => update(n => n + 1),
		decrement: () => update(n => n - 1),
		reset: () => set({zIdx: 0, name: ""}),
        set: (n) => set(n)
	};
}

export const count = createCount();
import { RangeSetBuilder } from '@codemirror/state';
import { writable } from 'svelte/store';

function storeIframe() {
    const { subscribe, set, update } = writable(0);
    return {
        subscribe,
        reset: () => {
            set(0);
            return true;
        },
        set: (n) => set(n)
    };
}

export const glowWindow = storeIframe();
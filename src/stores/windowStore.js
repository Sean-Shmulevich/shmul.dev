import { writable } from 'svelte/store';

function createWindowsStore() {
  const { subscribe, set, update } = writable({});

  let fileSysWindowsInternal = {}; // Internal state for sub-file windows
  let numFileWinInternal = 1;     // Internal counter for sub-file windows

  return {
    subscribe,
    openWindow: (name, initialPosition) => update(windows => {
      if (!windows[name]) {
        windows[name] = {
          zIndex: 0,
          minimized: false,
          position: initialPosition || { x: 180, y: 100 } // Default position if not provided
        };
      }
      return windows;
    }),
    closeWindow: (name) => update(windows => {
      delete windows[name];
      // Also remove from internal fileSysWindows if it was a sub-file window
      if (fileSysWindowsInternal[name]) {
        delete fileSysWindowsInternal[name];
      }
      return windows;
    }),
    minimizeWindow: (name, minimized) => update(windows => {
      if (windows[name]) {
        windows[name].minimized = minimized;
      }
      return windows;
    }),
    setZIndex: (name, zIndex) => update(windows => {
      if (windows[name]) {
        windows[name].zIndex = zIndex;
      }
      return windows;
    }),
    openSubFileWindow: (name, currentMaxZIndex) => update(windows => {
      const maxWindows = 3; // Max amount of extra windows allowed

      if (Object.keys(fileSysWindowsInternal).length < maxWindows) {
        // Assume position is handled by openWindow or passed
        if (!windows[name]) { // Only open if not already in store
            windows[name] = {
                zIndex: currentMaxZIndex + 1, // Set z-index to highest + 1
                minimized: false,
                position: { x: 180 + (numFileWinInternal * 30), y: 100 + (numFileWinInternal * 30) } // Example: sequential positioning
            }
        } else { // If already exists, just bring to front
            windows[name].zIndex = currentMaxZIndex + 1;
            windows[name].minimized = false; // Ensure it's not minimized
        }

        fileSysWindowsInternal[name] = numFileWinInternal;
        numFileWinInternal += 1;
      }
      return windows;
    }),
    reset: () => {
      fileSysWindowsInternal = {};
      numFileWinInternal = 1;
      set({});
    }
  };
}

export const windows = createWindowsStore();
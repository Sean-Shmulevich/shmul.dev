import { writable, get } from 'svelte/store';

// Central store for all OS windows.
export interface WindowContext {
  id: string; // Unique identifier (e.g. 'Js Paint', 'VS Code', 'File System 1')
  title: string; // Display title
  component: string; // The app type or component name
  x: number; // X position
  y: number; // Y position
  width: number; // Width
  height: number; // Height
  zIndex: number; // Current stack order
  isMinimized: boolean; // Is it hidden in the taskbar?
  isMaximized: boolean; // Is it taking up the full screen?
  isActive: boolean; // Is it the currently focused window?
  [key: string]: any; // Allow overrides
}

export interface OsState {
  windows: Record<string, WindowContext>;
  activeWindowId: string | null;
  maxZIndex: number;
}

function createOsStore() {
  const { subscribe, set, update } = writable<OsState>({
    windows: {},
    activeWindowId: null,
    maxZIndex: 1,
  });

  return {
    subscribe,

    // Open a completely new window or bring an existing one to the front
    openWindow: (id: string, options: Partial<WindowContext> = {}) => {
      update((state) => {
        const newZ = state.maxZIndex + 1;

        // If it already exists, just focus it and un-minimize it
        if (state.windows[id]) {
          state.windows[id].zIndex = newZ;
          state.windows[id].isMinimized = false;
          state.windows[id].isActive = true;
        } else {
          // Create it fresh
          state.windows[id] = {
            id,
            title: options.title || id,
            component: options.component || id,
            x: options.x || Math.max(20, window.innerWidth / 4),
            y: options.y || 100,
            width: options.width || 400,
            height: options.height || 300,
            zIndex: newZ,
            isMinimized: false,
            isMaximized: false,
            isActive: true,
            ...options, // Allow overrides
          };
        }

        // Deactivate all others
        Object.values(state.windows).forEach((win) => {
          if (win.id !== id) win.isActive = false;
        });

        return {
          ...state,
          activeWindowId: id,
          maxZIndex: newZ,
        };
      });
    },

    // Close a window and permanently remove it from the OS
    closeWindow: (id: string) => {
      update((state) => {
        const newWindows = { ...state.windows };
        delete newWindows[id];

        let newActive = state.activeWindowId;
        if (newActive === id) {
          newActive = null; // We closed the focused window
        }

        return {
          ...state,
          windows: newWindows,
          activeWindowId: newActive,
        };
      });
    },

    // Toggle Minimize
    toggleMinimize: (id: string) => {
      update((state) => {
        if (!state.windows[id]) return state;

        const win = state.windows[id];
        win.isMinimized = !win.isMinimized;

        if (win.isMinimized) {
          win.isActive = false;
          if (state.activeWindowId === id) {
            state.activeWindowId = null;
          }
        } else {
          // Un-minimizing should focus it
          const newZ = state.maxZIndex + 1;
          win.zIndex = newZ;
          win.isActive = true;
          state.maxZIndex = newZ;
          state.activeWindowId = id;

          // Deactivate others
          Object.values(state.windows).forEach((w) => {
            if (w.id !== id) w.isActive = false;
          });
        }

        return state;
      });
    },

    // Bring a window to the front and make it active
    focusWindow: (id: string) => {
      update((state) => {
        if (!state.windows[id] || state.activeWindowId === id) return state;

        const newZ = state.maxZIndex + 1;

        Object.values(state.windows).forEach((win: WindowContext) => {
          win.isActive = win.id === id;
        });

        state.windows[id].zIndex = newZ;
        state.windows[id].isMinimized = false; // ensure it's visible

        return {
          ...state,
          activeWindowId: id,
          maxZIndex: newZ,
        };
      });
    },

    // Update exact window coordinates (used for dragging)
    updatePosition: (id: string, x: number, y: number) => {
      update((state) => {
        if (state.windows[id]) {
          state.windows[id].x = x;
          state.windows[id].y = y;
        }
        return state;
      });
    },

    // Update exact window dimensions (used for resizing)
    updateDimensions: (id: string, width: number, height: number) => {
      update((state) => {
        if (state.windows[id]) {
          state.windows[id].width = width;
          state.windows[id].height = height;
        }
        return state;
      });
    },
  };
}

export const osStore = createOsStore();

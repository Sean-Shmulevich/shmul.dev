import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/personalWebsiteSvelte",
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
      onwarn(warning, defaultHandler) {
        // Suppress warnings for legacy packages without svelte exports conditions
        if (warning.code === 'missing-exports-condition') {
          const allowedPackages = [
            '@portabletext/svelte',
            'svelte-drag-drop-touch',
            'svelte-markdown',
            'javascript-interface-library',
            'svelte-coordinate-conversion',
            'dragdroptouch-bug-fixed',
          ];
          if (allowedPackages.some((pkg) => warning.message.includes(pkg))) {
            return;
          }
        }
        // Handle all other warnings normally
        defaultHandler(warning);
      },
    }),
  ],
});

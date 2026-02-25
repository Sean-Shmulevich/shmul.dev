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

        // Suppress self-closing tag warnings from third-party compiled Svelte components like svelte-loading-spinners
        if (warning.code === 'element_invalid_self_closing_tag' && warning.filename && warning.filename.includes('node_modules')) {
          return;
        }
        // Handle all other warnings normally
        defaultHandler(warning);
      },
    }),
  ],
});

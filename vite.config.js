import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoPreprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/personalWebsiteSvelte/",
  plugins: [svelte({
      preprocess: autoPreprocess()
    })]
})

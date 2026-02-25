<script>
  import { osStore } from '../../stores/osStore.ts';
  import WindowFrame from './WindowFrame.svelte';

  // We will dynamically import components to keep bundle size small,
  // similar to how App.svelte currently works
  const componentMap = {
    AboutMe: () => import('../../lib/AboutMe.svelte').then((m) => m.default),
    SysWindow: () =>
      import('../../lib/SysWindow.svelte').then((m) => m.default),
    JsPaint: () => import('../../lib/JsPaint.svelte').then((m) => m.default),
    Photos: () => import('../../lib/Photos.svelte').then((m) => m.default),
    VsCode: () => import('../../lib/VsCode.svelte').then((m) => m.default),
    SnakeGame: () =>
      import('../../lib/SnakeGame.svelte').then((m) => m.default),
  };

  $: windows = Object.values($osStore.windows);
</script>

<!-- Iterate through all open windows in the OS -->
{#each windows as win (win.id)}
  <WindowFrame id={win.id} title={win.title}>
    {#await componentMap[win.component]() then Component}
      {#if Component}
        <!-- 
                   We pass the internal component any ID or state it might need, 
                   but mostly it will just rely on its own internal logic or the osStore bounds
                -->
        <svelte:component this={Component} windowId={win.id} />
      {/if}
    {/await}
  </WindowFrame>
{/each}

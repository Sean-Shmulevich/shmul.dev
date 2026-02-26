<script>
  import { createEventDispatcher } from 'svelte';
  import { draggable } from '../../lib/windowUtils.ts';
  import { osStore } from '../../stores/osStore.ts';

  export let id; // The unique id of the window assigned by osStore
  export let title; // The title string
  export let icon = ''; // Optional title bar icon

  const dispatch = createEventDispatcher();

  // Subscribe to our specific window state
  $: windowState = $osStore.windows[id];

  // Reactive styles
  $: isMinimized = windowState?.isMinimized || false;
  $: isActive = windowState?.isActive || false;
  $: zIndex = windowState?.zIndex || 1;
  $: BoxX = windowState?.x || 100;
  $: BoxY = windowState?.y || 100;
  $: width = windowState?.width || 400;
  $: height = windowState?.height || 300;

  // Window control functions
  function handleFocus() {
    if (!isActive) osStore.focusWindow(id);
  }

  function handleClose() {
    osStore.closeWindow(id);
    dispatch('close', id);
  }

  function handleMinimize() {
    osStore.toggleMinimize(id);
  }

  // Drag Logic
  function onDragStart() {
    handleFocus();
    return { x: BoxX, y: BoxY };
  }

  function onDragMove(x, y) {
    osStore.updatePosition(id, x, y);
  }

  function onDragEnd(x, y) {
    osStore.updatePosition(id, x, y);
  }
</script>

<!-- Add a CSS wrapper that conditionally hides via transform scale (Window 98 style) or display:none based on state -->
{#if windowState && !isMinimized}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="window-frame {isActive ? 'active' : 'inactive'}"
    on:mousedown={handleFocus}
    style="
            position: fixed;
            left: {BoxX}px;
            top: {BoxY}px;
            z-index: {zIndex};
            width: {width}px;
            height: {height}px;
        "
  >
    <!-- Title Bar -->
    <div
      class="title-bar {isActive ? '' : 'inactive'}"
      use:draggable={{
        onDragStart,
        onDragMove,
        onDragEnd,
      }}
    >
      <div class="title-bar-text">
        {#if icon}
          <img
            src={icon}
            alt="icon"
            style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;"
          />
        {/if}
        {title}
      </div>

      <div class="title-bar-controls">
        <button
          aria-label="Minimize"
          on:mousedown|stopPropagation={handleMinimize}
          class="minimize-btn"
        ></button>
        <button aria-label="Maximize" disabled></button>
        <button aria-label="Close" on:mousedown|stopPropagation={handleClose}
        ></button>
      </div>
    </div>

    <!-- Inner Content Window (Windows 98 Styling) -->
    <div class="window window-content-wrapper">
      <div class="window-body">
        <!-- SLOT is where the child app gets rendered -->
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  /* 
       We use the basic 98.css classes for the title bar inside, but the outer frame 
       manages positioning and sizing.
    */
  .window-frame {
    display: flex;
    flex-direction: column;
    border: 2px solid #dfdfdf;
    border-right-color: #0a0a0a;
    border-bottom-color: #0a0a0a;
    background: #c0c0c0;
    box-shadow:
      1px 1px 0 #000 inset,
      -1px -1px 0 #fff inset,
      2px 2px 0 #0a0a0a,
      -2px -2px 0 #dfdfdf;
    padding: 2px;
  }

  .title-bar {
    cursor: move;
    flex-shrink: 0;
    touch-action: none; /* Prevent scroll on touch so pointer drag works */
  }

  .window-content-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin: 0;
    box-shadow: none; /* Inherit frame shadow */
    border: none;
    overflow: hidden;
  }

  .window-body {
    flex-grow: 1;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  /* Keep inactive titlebars styled correctly */
  .title-bar.inactive {
    background: #808080;
    color: #c0c0c0;
  }

  /* Button overrides for precise 98.css compatibility */
  .title-bar-controls button {
    min-width: 16px;
    min-height: 14px;
    padding: 0;
  }
</style>

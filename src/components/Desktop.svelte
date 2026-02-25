<script>
  import { createEventDispatcher } from 'svelte';
  export let icons;
  export let current;

  const dispatch = createEventDispatcher();
</script>

{#each icons as { left, src, text }, i}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="homeIcon"
    style="top:{i * 105 + 65}px; left:{left}px;image-rendering: pixelated"
    class:blue={current === text}
    on:click={() => dispatch('select', text)}
    on:dblclick={() => dispatch('open', text)}
  >
    <img {src} alt="window 98 home screen {text} button" style="width:55px" />
    <p class="homeIconText">{text}</p>
  </div>
{/each}

<style>
  .homeIconText {
    margin-top: -11px;
    margin-bottom: -3px;
    font-family: Apple Garamond;
    font-size: 1.15rem;
  }

  .blue {
    background-color: blue;
    color: white;
  }

  .homeIcon {
    position: fixed;
    text-align: center;
    width: fit-content;
    top: 45px;
    left: 32px;
  }
</style>

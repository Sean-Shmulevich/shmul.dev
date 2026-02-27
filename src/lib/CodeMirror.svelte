<script>
  import { onMount, onDestroy } from "svelte";

  let loading = true;
  let observer;

  onMount(() => {
    import("./pyscript.js");

    // The import resolves when the module is parsed, but the py-repl
    // custom element initializes asynchronously after that.
    // Watch for the CodeMirror editor to actually appear inside py-repl.
    const repl = document.getElementById("my-repl");
    if (repl) {
      observer = new MutationObserver(() => {
        if (repl.querySelector(".cm-editor")) {
          loading = false;
          observer.disconnect();
        }
      });
      observer.observe(repl, { childList: true, subtree: true });
    }
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
  });
</script>

<link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />

<section class="pyscript" style="color:white;caret-color:yellow !important">
  <br />
  <div style="margin-inline: 15px; position: relative;">
    <p
      style="font-family:Apple Garamond;font-size:1rem;color:white;text-align:center;margin-top:-15px"
    >
      Try coding python!
    </p>
    {#if loading}
      <div class="py-loading">
        <div class="py-spinner"></div>
        <p class="py-loading-text">Loading Python runtime...</p>
      </div>
    {/if}
    <py-repl id="my-repl" auto-generate="true"></py-repl>
  </div>
</section>

<style>
  .py-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
  }

  .py-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(160, 151, 229, 0.3);
    border-top-color: rgb(160, 151, 229);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .py-loading-text {
    font-family: "Apple Garamond";
    font-size: 0.9rem;
    color: rgb(160, 151, 229);
    margin-top: 12px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  :global(.Codemirror) {
    display: contents;
    color: white;
    height: auto !important;
    background-color: rgb(43, 43, 74);
    border: 5px solid white !important;
    caret-color: white !important;
  }
  :global(.cm-gutters) {
    background-color: rgb(43, 43, 74) !important;
    border-right: 1px solid rgb(46, 45, 80) !important;
  }
  :global(.cm-lineNumbers) {
    background-color: rgb(43, 43, 74) !important;
  }
  :global(.output) {
    font-family: Apple Garamond;
    font-size: 1rem;
    margin-left: 6%;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  :global(.cm-scroller) {
    background-color: rgb(43, 43, 74) !important;
    overflow: auto !important;
  }
  :global(.cm-activeLineGutter) {
    background-color: rgb(43, 43, 74) !important;
  }
  :global(.cm-gutterElement) {
    color: rgb(160, 151, 229) !important;
  }

  :global(.cm-editor) {
    margin-top: -2px !important;
    height: 100% !important;
  }

  :global(#code-editor) {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
  }

  :global(#code-editor > .cm-editor) {
    flex-grow: 1 !important;
    min-width: 0 !important;
  }

  /* Fix Play Button Alignment */
  :global(.py-repl-run-button),
  :global(#code-editor > button) {
    position: static !important;
    margin-left: -2px !important;
    margin-top: -3px !important;
    flex-shrink: 0 !important;
    align-self: flex-start !important;
  }

  /* Fix Cursor Color */
  :global(.cm-cursor) {
    border-left-color: white !important;
  }

  :global(.cm-editor) {
    margin-top: -2px !important;
    height: 100% !important;
  }
  :global(.ͼd) {
    color: #84ff84;
  }
  :global(.ͼa) {
    color: #f5aeff;
  }
  :global(.ͼc) {
    color: #ffd300;
  }
  :global(.ͼl) {
    color: #9776ff;
  }
  :global(.cm-line) {
    caret-color: yellow !important;
    background-color: rgb(43, 43, 74) !important;
  }
</style>

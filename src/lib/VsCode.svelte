<script>
  //css
  import "../css/work.css";
  import "../css/myStyle.css";
  import "../css/codicon.css";
  import "../css/terminal.css";

  import { asDraggable } from "svelte-drag-and-drop-actions";
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  
  //stores
  import { count } from "../stores/zIndex.js";
  import { glowWindow } from "../stores/keep.js";
  import { writableArray } from "../stores/minimized.js";

  import {incrementCount, tapHandler, touchDevice, swipeStart, swipeEnd, handleMinimize } from "./SysWindow.svelte";
  
  export let zIdx = 0;
  let minWidth = 502;

  //double tap function to relese on destroy.
  let mobileDblTap;
  let mobileSwipe;
  let minFunc;
  export let BoxX = 200,BoxY = 200; //starting coords
  export let hide = false;
  let vsPos;
  let menuX, menuY;
  let currWidth = 600;
  let currHeight = 400;
  export let windowName = "VS Code";
  let maxX = 0,maxY = 0;

  //dispatch the close event to the app.svelte.
  const dispatch = createEventDispatcher();

  function forward(event) {
    // glowWindow.reset();
    dispatch("close", event.detail);
  }

  
  onMount(() => {
    //basically a media query
    minFunc = () => {[hide, menuX, menuY] = handleMinimize($writableArray, glowWindow, hide, windowName, `#minButt${windowName.replace(/\s+/g, "")}`, `.vscode.${windowName.replace(/\s+/g, "-")}`);}
    if (window.innerWidth < 700) {
      BoxX = 0;
      // @ts-ignore
    }
    if (window.innerWidth <= 600) {
      minWidth = window.innerWidth - 80;
      currWidth = window.innerWidth;
    }
    //only create if the device has a touchscreen.
    if(touchDevice){
        document.querySelector(`.vscode.${windowName.replace(/\s+/g, '-')} * .vsAppCol`).addEventListener("touchstart", swipeStart);
        document.querySelector(`.vscode.${windowName.replace(/\s+/g, '-')} * .vsAppCol`).addEventListener("touchend", mobileSwipe = (e) => {swipeEnd(e, minFunc)});
        document.querySelector(`.vscode.${windowName.replace(/\s+/g, '-')} > .vsAppBar`).addEventListener("touchstart", mobileDblTap = (e) => {tapHandler(e,minFunc)});
      }
  });
  //remove tap listeners.
  onDestroy(() => {
    if(touchDevice){
      document.querySelector(`.vscode.${windowName.replace(/\s+/g, '-')} * .vsAppCol`).removeEventListener("touchstart", swipeStart);
      document.querySelector(`.vscode.${windowName.replace(/\s+/g, '-')} * .vsAppCol`).removeEventListener("touchend", mobileSwipe);
      document.querySelector(`.vscode.${windowName.replace(/\s+/g, '-')} > .vsAppBar`).removeEventListener("touchstart", mobileDblTap);
    }
  });


  function onDragStart() {
    return { x: BoxX, y: BoxY };
  }

  function onDragMove(x, y, dx, dy) {
    BoxX = x;
    BoxY = y;
  }

  function onDragEnd(x, y, dx, dy) {
    BoxX = x;
    BoxY = y;
  
  }

  function maybeDontIncrement() {
    if (!hide) {
      zIdx = incrementCount(zIdx, $count, count, "VS Code");
    } else {
      zIdx = zIdx;
    }
  }

  //Window funtion mousemove & mouseup
  function initResize(e) {
    // if(currWidth >= 833){
    //     currWidth = 833;
    // }
    // else if(currWidth <= 502){
    //     currWidth = 502;
    // }
    window.addEventListener("mousemove", Resize, false);
    window.addEventListener("mouseup", stopResize, false);
    if(touchDevice){
      
      window.addEventListener("touchstart", Resize, false);
      window.addEventListener("touchend", stopResize, false);
    }
  }
  //resize the element
  function Resize(e) {
    // console.log(currWidth);
    //the resize bar is 6 px
    //(e.clientX - BoxX) <= 833 && (e.clientX - BoxX) >= 502
    if (true) {
      currWidth = e.clientX - BoxX;
      currHeight = e.clientY - BoxY;
    }
  }
  //on mouseup remove windows functions mousemove & mouseup
  function stopResize(e) {
    window.removeEventListener("mousemove", Resize, false);
    window.removeEventListener("mouseup", stopResize, false);
    if(touchDevice){
      window.removeEventListener("touchstart", Resize, false);
      window.removeEventListener("touchend", stopResize, false);
    }
  }
</script>

<svelte:window bind:innerWidth={maxX} bind:innerHeight={maxY} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="container vscode {windowName.replace(/\s+/g, '-')}"
  style="
    position: fixed;
    left:{BoxX}px; top:{BoxY}px;
    width:{currWidth}px;
    height:{currHeight}px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    max-height: 625px;
    max-width: 833px;
    min-width: {minWidth}px;
    min-height: 305px;
    
    --menuX: {menuX}px;
    --menuY: {menuY}px;
    z-index: {zIdx};
"
  on:mousedown={maybeDontIncrement}
  class:classname={hide}
  bind:this={vsPos}
>
  <div
    style="   
position: absolute; 
height:20px;
width: 20px;
border-radius: 50%;
cursor: se-resize;
z-index:50;
right: 0;
bottom: 0;
"
    on:mousedown={initResize}
    on:touchstart|preventDefault|capture={initResize}
  />

  <div
    class="vsAppBar"
    style="position: relative;"
    use:asDraggable={{
      relativeTo: document.body,
      onDragStart,
      onDragMove,
      onDragEnd,
      minX: 0,
      minY: 26,
      maxX: window.innerWidth,
      maxY: window.innerHeight - 70,
    }}
  >
    <div
      style="margin-top: 1px;width: 60px;display: flex;justify-content: space-evenly;"
    >
      <div
        class="fakeButtons fakeClose vsControlButtons"
        on:mousedown={forward}
      />
      <div
        class="fakeButtons fakeMinimize vsControlButtons"
        on:click|capture|preventDefault={() => minFunc()}
      />
      <div class="fakeButtons fakeZoom vsControlButtons" />
    </div>
    <div class="barSearch" style="width:70%">
      <div style="display:flex;width: inherit;">
        <div id="searchLeft" class="codicon codicon-arrow-left" />
        <div id="searchRight" class="codicon codicon-arrow-right" />
        <!-- <div id="searchInBox" class="codicon codicon-search" /> -->
        <input
          class="barSearchInput"
          id="text17"
          type="text"
          style="box-shadow: unset;border-radius: 5px;background-color: rgb(36,36,64);border: 1px solid rgb(180 153 72);"
        />
      </div>
    </div>
    <div class="layoutBox">
      <div
        class="codicon codicon-layout vsSnapIcon"
        style="margin-left: 7px;"
      />
      <hr style="border-color: #898988;" />
      <div class="codicon codicon-layout-sidebar-right-off vsSnapIcon" />
      <div class="codicon codicon-layout-panel-off vsSnapIcon" />
      <div class="codicon codicon-layout-sidebar-left-off vsSnapIcon" />
    </div>
  </div>
  <div class="vsWindowContent" style="display:flex;">
    <div class="vsAppCol">
      <div class="codicon codicon-files vsIcon" />
      <div class="codicon codicon-search vsIcon" />
      <div class="codicon codicon-debug-alt-small vsIcon" />
      <div class="codicon codicon-extensions vsIcon" />
      <div class="codicon codicon-symbol-namespace vsIcon" />
      <div class="codicon codicon-folder-opened vsIcon" />
      <div class="codicon codicon-account vsIconBottom" style="bottom: 34px;" />
      <div
        class="codicon codicon-settings-gear vsIconBottom"
        style="bottom: 5px;"
      />
    </div>

    <div class="codeAndNumbers">
      <div class="vsLineNumbers" style="display:none" />
      <div class="vsCodeWindow" style="overflow-y:scroll;overflow: overlay;">
        <div class="vsText">
          <slot />
        </div>
      </div>
    </div>
  </div>
  <div class="vsBottomBar">
    <div id="yellowCorner">
      <div class="codicon codicon-remote" id="teeneyRemote" />
    </div>
    <div class="codicon codicon-close-all" id="teenyClose" />
    <div class="codicon codicon-warning" id="teenyClose" />
    <div style="display:flex;margin-left: auto;flex-direction: row-reverse;">
      <div
        class="codicon codicon-bell"
        style="color: rgb(160,151,229);margin-left: auto;margin-right: 8px;transform: scale(0.9);margin-top:1px"
      />
      <div
        class="codicon codicon-squirrel"
        style="color: rgb(160,151,229);margin-left: auto;margin-right: 4px;transform: scale(0.9);margin-top:1px"
      />
      <div
        class="codicon codicon-terminal-powershell"
        style="color: rgb(160,151,229);margin-left: auto;margin-right: 6px;transform: scale(0.9);margin-top:1px"
      />
      <span class="vsBarText">HTML</span>
      <span class="vsBarText">LF</span>
      <span class="vsBarText">UTF-8</span>
      <span class="vsBarText">Spaces: 4</span>
      <span class="vsBarText">Ln 140, Col 55</span>
    </div>
  </div>
</div>

<style>
    @media (max-width: 460px) {
      .vsBarText:nth-of-type(5){display: none !important}
  }
  @keyframes move {
    50%,
    100% {
      transform: translate(var(--menuX), 0) translate(0, var(--menuY))
        scale(0.1);
    }
    0% {
      transform: translate(0, 0) translate(0, 0) scale(1);
    }
    10% {
      transform: translate(calc(var(--menuX) / 1.1), 0)
        translate(calc(var(--menuY) / 10), 0) scale(0.25);
    }
  }
  .classname {
    -webkit-animation-name: move;
    -webkit-animation-duration: 850ms;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-timing-function: linear;
    -webkit-animation-fill-mode: forwards;
  }
  ::-webkit-scrollbar-thumb {
    display: block !important;
    background: transparent;
  }
  ::-webkit-scrollbar-track {
    background: rgb(160 151 229/ 50%);
  }

  :global(.Codemirror) {
    display: contents;
    color: white;
    height: auto !important;
    background-color: rgb(43, 43, 74);
    border: 5px solid white !important;
  }
  :global(.cm-gutters) {
    background-color: rgb(43, 43, 74) !important;
    border-right: 1px solid rgb(46, 45, 80) !important;
  }
  :global(.cm-gutter) {
    background-color: rgb(43, 43, 74) !important;
  }
  :global(.cm-content) {
    caret-color: yellow !important;
  }
  :global(.ͼ4, .cm-line) {
    caret-color: yellow !important;
  }
  :global(.cm-lineNumbers) {
    background-color: rgb(43, 43, 74) !important;
  }
  :global(.cm-activeLine) {
    background-color: rgb(31 32 63) !important;
  }
  :global(.cm-scroller) {
    background-color: rgb(43, 43, 74) !important;
  }
  :global(.cm-activeLineGutter) {
    background-color: rgb(43, 43, 74) !important;
  }
  :global(.cm-gutterElement) {
    color: rgb(160, 151, 229) !important;
  }
  :global(.cm-line) {
  }
  :global(.cm-editor) {
    margin-top: -2px !important;
    height: 100% !important;
  }
  :global(.cm-focused) {
    outline: unset !important;
  }
  :global(.ͼb) {
    color: rgb(242, 160, 57);
  }
  :global(.ͼa) {
    color: rgb(250, 176, 234);
  }
  :global(.ͼg) {
    color: rgb(273, 154, 247);
  }
  :global(.ͼc) {
    color: rgb(185, 251, 154);
  }
  :global(.ͼl) {
    color: rgb(178 251 251);
  }
  :global(.cm-line) {
    color: rgb(244 208 70);
  }
  :global(.ͼd) {
    color: rgb(244 109 141);
  }
  :global(.ͼm) {
    color: yellow;
  }
</style>

<script>
  //css
  import "../css/work.css";
  import "../css/myStyle.css";
  import "../css/codicon.css";
  import "../css/terminal.css";

  import { draggable } from "./windowUtils";
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  import { count } from "../stores/zIndex.ts";
  import { glowWindow } from "../stores/keep.ts";
  import { writableArray } from "../stores/minimized.ts";
  import { osStore } from "../stores/osStore.ts";

  import {
    incrementCount,
    tapHandler,
    touchDevice,
    swipeStart,
    swipeEnd,
    handleMinimize,
  } from "./windowUtils";

  export let zIdx = 0;
  export let shellConfig = null;

  const DEFAULT_MAX_WIDTH = 833;
  const DEFAULT_MAX_HEIGHT = 625;
  const DEFAULT_MIN_HEIGHT = 305;
  const DEFAULT_DESKTOP_MIN_WIDTH = 502;
  const DEFAULT_MOBILE_SIDE_PADDING = 80;

  //double tap function to relese on destroy.
  let mobileDblTap;
  let mobileSwipe;
  let minFunc;
  export let BoxX = window.innerWidth < 700 ? 0 : 200,
    BoxY = 200; //starting coords
  export let hide = false;
  let menuX, menuY;
  let currWidth = window.innerWidth <= 600 ? window.innerWidth : 600;
  let currHeight = 400;
  export let windowName = "VS Code";
  let maxX = 0,
    maxY = 0;
  let minWidth =
    window.innerWidth <= 600
      ? window.innerWidth - DEFAULT_MOBILE_SIDE_PADDING
      : DEFAULT_DESKTOP_MIN_WIDTH;
  let maxWidth = DEFAULT_MAX_WIDTH;
  let maxHeight = DEFAULT_MAX_HEIGHT;
  let minHeight = DEFAULT_MIN_HEIGHT;
  let lastViewportWidth = 0;
  let lastViewportHeight = 0;

  //dispatch the close event to the app.svelte.
  const dispatch = createEventDispatcher();

  function getViewportWidth() {
    return maxX || window.innerWidth;
  }

  function getViewportHeight() {
    return maxY || window.innerHeight;
  }

  function getViewportMargin(viewportWidth) {
    if (!shellConfig) {
      return viewportWidth <= 600 ? 10 : 0;
    }

    return viewportWidth <= 700
      ? (shellConfig.mobileViewportMargin ?? 16)
      : (shellConfig.desktopViewportMargin ?? 48);
  }

  function resolveShellBounds(
    viewportWidth = window.innerWidth,
    viewportHeight = window.innerHeight,
  ) {
    if (!shellConfig) {
      return {
        minWidth:
          viewportWidth <= 600
            ? viewportWidth - DEFAULT_MOBILE_SIDE_PADDING
            : DEFAULT_DESKTOP_MIN_WIDTH,
        minHeight: DEFAULT_MIN_HEIGHT,
        maxWidth: DEFAULT_MAX_WIDTH,
        maxHeight: DEFAULT_MAX_HEIGHT,
      };
    }

    const margin = getViewportMargin(viewportWidth);
    const availableWidth = Math.max(280, viewportWidth - margin * 2);
    const availableHeight = Math.max(280, viewportHeight - margin * 2);
    const configuredMinWidth = shellConfig.minWidth ?? 360;
    const configuredMinHeight = shellConfig.minHeight ?? DEFAULT_MIN_HEIGHT;

    return {
      minWidth: Math.min(configuredMinWidth, availableWidth),
      minHeight: Math.min(configuredMinHeight, availableHeight),
      maxWidth: availableWidth,
      maxHeight: availableHeight,
    };
  }

  function getInitialShellSize(
    viewportWidth = window.innerWidth,
    viewportHeight = window.innerHeight,
  ) {
    const bounds = resolveShellBounds(viewportWidth, viewportHeight);

    if (
      !shellConfig ||
      shellConfig.fitMode !== "contain" ||
      !shellConfig.contentAspectRatio
    ) {
      return {
        width: Math.min(
          viewportWidth <= 600 ? viewportWidth : 600,
          bounds.maxWidth,
        ),
        height: Math.min(400, bounds.maxHeight),
        ...bounds,
      };
    }

    const chromeWidth = shellConfig.chromeWidth ?? 31;
    const chromeHeight = shellConfig.chromeHeight ?? 48;
    const maxContentWidth = Math.max(0, bounds.maxWidth - chromeWidth);
    const maxContentHeight = Math.max(0, bounds.maxHeight - chromeHeight);
    const aspectRatio = shellConfig.contentAspectRatio;

    let contentWidth = maxContentWidth;
    let contentHeight = contentWidth / aspectRatio;

    if (contentHeight > maxContentHeight) {
      contentHeight = maxContentHeight;
      contentWidth = contentHeight * aspectRatio;
    }

    const initialScale = shellConfig.initialScale ?? 1;
    const scaledWidth = Math.round((contentWidth + chromeWidth) * initialScale);
    const scaledHeight = Math.round(
      (contentHeight + chromeHeight) * initialScale,
    );

    return {
      width: Math.min(bounds.maxWidth, Math.max(bounds.minWidth, scaledWidth)),
      height: Math.min(
        bounds.maxHeight,
        Math.max(bounds.minHeight, scaledHeight),
      ),
      ...bounds,
    };
  }

  function clampWindowPosition(width = currWidth, height = currHeight) {
    const viewportWidth = getViewportWidth();
    const viewportHeight = getViewportHeight();
    const margin = getViewportMargin(viewportWidth);
    const maxLeft = Math.max(margin, viewportWidth - width - margin);
    const maxTop = Math.max(margin, viewportHeight - height - margin);

    BoxX = Math.min(Math.max(BoxX, margin), maxLeft);
    BoxY = Math.min(Math.max(BoxY, margin), maxTop);
    osStore.updatePosition(windowName, BoxX, BoxY);
  }

  function clampDimension(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getResizeMaxWidth() {
    if (!shellConfig) {
      return maxWidth;
    }

    const viewportWidth = getViewportWidth();
    const margin = getViewportMargin(viewportWidth);
    return Math.max(minWidth, viewportWidth - BoxX - margin);
  }

  function getResizeMaxHeight() {
    if (!shellConfig) {
      return maxHeight;
    }

    const viewportHeight = getViewportHeight();
    const margin = getViewportMargin(getViewportWidth());
    return Math.max(minHeight, viewportHeight - BoxY - margin);
  }

  function forward(event) {
    // glowWindow.reset();
    dispatch("close", event.detail);
  }

  onMount(() => {
    //basically a media query
    minFunc = () => {
      [hide, menuX, menuY] = handleMinimize(
        $writableArray,
        glowWindow,
        windowName,
        `#minButt${windowName.replace(/\s+/g, "")}`,
        `.vscode.${windowName.replace(/\s+/g, "-")}`,
      );
    };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const initialSize = getInitialShellSize(viewportWidth, viewportHeight);

    minWidth = initialSize.minWidth;
    minHeight = initialSize.minHeight;
    maxWidth = initialSize.maxWidth;
    maxHeight = initialSize.maxHeight;

    if (shellConfig) {
      currWidth = initialSize.width;
      currHeight = initialSize.height;
      clampWindowPosition(currWidth, currHeight);
    } else {
      if (viewportWidth < 700) {
        BoxX = 0;
        // @ts-expect-error Type mismatch constraint on VS Code window width.
      }
      if (viewportWidth <= 600) {
        currWidth = viewportWidth;
      }
    }
    //only create if the device has a touchscreen.
    if (touchDevice) {
      document
        .querySelector(`.vscode.${windowName.replace(/\s+/g, "-")} * .vsAppCol`)
        .addEventListener("touchstart", swipeStart);
      document
        .querySelector(`.vscode.${windowName.replace(/\s+/g, "-")} * .vsAppCol`)
        .addEventListener(
          "touchend",
          (mobileSwipe = (e) => {
            swipeEnd(e, minFunc);
          }),
        );
      document
        .querySelector(`.vscode.${windowName.replace(/\s+/g, "-")} > .vsAppBar`)
        .addEventListener(
          "touchstart",
          (mobileDblTap = (e) => {
            tapHandler(e, minFunc);
          }),
        );
    }
  });
  //remove tap listeners.
  onDestroy(() => {
    if (touchDevice) {
      const col = document.querySelector(
        `.vscode.${windowName.replace(/\s+/g, "-")} * .vsAppCol`,
      );
      const bar = document.querySelector(
        `.vscode.${windowName.replace(/\s+/g, "-")} > .vsAppBar`,
      );
      col?.removeEventListener("touchstart", swipeStart);
      col?.removeEventListener("touchend", mobileSwipe);
      bar?.removeEventListener("touchstart", mobileDblTap);
    }
  });

  function onDragStart() {
    maybeDontIncrement();
    return { x: BoxX, y: BoxY };
  }

  function onDragMove(x, y) {
    BoxX = x;
    BoxY = y;
    osStore.updatePosition(windowName, x, y);
  }

  function onDragEnd(x, y) {
    BoxX = x;
    BoxY = y;
    osStore.updatePosition(windowName, x, y);
  }

  function maybeDontIncrement() {
    if (!hide) {
      zIdx = incrementCount(zIdx, $count, count, "VS Code");
      osStore.focusWindow(windowName);
    } else {
      zIdx = zIdx;
    }
  }

  //Window funtion mousemove & mouseup
  function initResize() {
    window.addEventListener("mousemove", Resize, false);
    window.addEventListener("mouseup", stopResize, false);
    window.addEventListener("touchmove", Resize, { passive: false });
    window.addEventListener("touchend", stopResize, false);
  }
  //resize the element
  function Resize(e) {
    if (e.cancelable) e.preventDefault();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    currWidth = clampDimension(clientX - BoxX, minWidth, getResizeMaxWidth());
    currHeight = clampDimension(
      clientY - BoxY,
      minHeight,
      getResizeMaxHeight(),
    );
  }
  //on mouseup remove windows functions mousemove & mouseup
  function stopResize() {
    window.removeEventListener("mousemove", Resize, false);
    window.removeEventListener("mouseup", stopResize, false);
    window.removeEventListener("touchmove", Resize);
    window.removeEventListener("touchend", stopResize, false);
  }

  $: {
    const bounds = resolveShellBounds(getViewportWidth(), getViewportHeight());
    minWidth = bounds.minWidth;
    minHeight = bounds.minHeight;
    maxWidth = bounds.maxWidth;
    maxHeight = bounds.maxHeight;
  }

  $: {
    currWidth = clampDimension(currWidth, minWidth, getResizeMaxWidth());
    currHeight = clampDimension(currHeight, minHeight, getResizeMaxHeight());
  }

  $: if (shellConfig) {
    const viewportWidth = getViewportWidth();
    const viewportHeight = getViewportHeight();

    if (
      lastViewportWidth !== viewportWidth ||
      lastViewportHeight !== viewportHeight
    ) {
      lastViewportWidth = viewportWidth;
      lastViewportHeight = viewportHeight;
      clampWindowPosition(currWidth, currHeight);
    }
  }
</script>

<svelte:window bind:innerWidth={maxX} bind:innerHeight={maxY} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container vscode {windowName.replace(/\s+/g, '-')}"
  style="
    position: fixed;
    left:{BoxX}px; top:{BoxY}px;
    width:{currWidth}px;
    height:{currHeight}px;
    display: flex;
    flex-direction: column;
    max-height: {maxHeight}px;
    max-width: {maxWidth}px;
    min-width: {minWidth}px;
    min-height: {minHeight}px;
    
    --menuX: {menuX}px;
    --menuY: {menuY}px;
    z-index: {zIdx};
"
  on:mousedown={maybeDontIncrement}
  class:classname={hide}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
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
    on:pointerdown|stopPropagation
  ></div>

  <div
    class="vsAppBar"
    style="position: relative;"
    use:draggable={{
      onDragStart,
      onDragMove,
      onDragEnd,
    }}
  >
    <div
      style="margin-top: 1px;width: 60px;display: flex;justify-content: space-evenly;"
    >
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="fakeButtons fakeClose vsControlButtons"
        on:mousedown={forward}
        on:pointerdown|stopPropagation
        on:touchstart|stopPropagation
      ></div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="fakeButtons fakeMinimize vsControlButtons"
        on:click|capture|preventDefault={() => minFunc()}
        on:pointerdown|stopPropagation
        on:touchstart|stopPropagation
      ></div>
      <div class="fakeButtons fakeZoom vsControlButtons"></div>
    </div>
    <div class="barSearch" style="width:70%">
      <div style="display:flex;width: inherit;">
        <div id="searchLeft" class="codicon codicon-arrow-left"></div>
        <div id="searchRight" class="codicon codicon-arrow-right"></div>
        <!-- <div id="searchInBox" class="codicon codicon-search"></div> -->
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
      ></div>
      <hr style="border-color: #898988;" />
      <div class="codicon codicon-layout-sidebar-right-off vsSnapIcon"></div>
      <div class="codicon codicon-layout-panel-off vsSnapIcon"></div>
      <div class="codicon codicon-layout-sidebar-left-off vsSnapIcon"></div>
    </div>
  </div>
  <div class="vsWindowContent" style="display:flex;">
    <div class="vsAppCol">
      <div class="codicon codicon-files vsIcon"></div>
      <div class="codicon codicon-search vsIcon"></div>
      <div class="codicon codicon-debug-alt-small vsIcon"></div>
      <div class="codicon codicon-extensions vsIcon"></div>
      <div class="codicon codicon-symbol-namespace vsIcon"></div>
      <div class="codicon codicon-folder-opened vsIcon"></div>
      <div
        class="codicon codicon-account vsIconBottom"
        style="bottom: 34px;"
      ></div>
      <div
        class="codicon codicon-settings-gear vsIconBottom"
        style="bottom: 5px;"
      ></div>
    </div>

    <div class="codeAndNumbers">
      <div class="vsLineNumbers" style="display:none"></div>
      <div class="vsCodeWindow" style="overflow-y:auto;overflow-x:hidden;">
        <div class="vsText">
          <slot />
        </div>
      </div>
    </div>
  </div>
  <div class="vsBottomBar">
    <div id="yellowCorner">
      <div class="codicon codicon-remote" id="teeneyRemote"></div>
    </div>
    <div class="codicon codicon-close-all" id="teenyClose"></div>
    <div class="codicon codicon-warning" id="teenyClose"></div>
    <div style="display:flex;margin-left: auto;flex-direction: row-reverse;">
      <div
        class="codicon codicon-bell"
        style="color: rgb(160,151,229);margin-left: auto;margin-right: 8px;transform: scale(0.9);margin-top:1px"
      ></div>
      <div
        class="codicon codicon-squirrel"
        style="color: rgb(160,151,229);margin-left: auto;margin-right: 4px;transform: scale(0.9);margin-top:1px"
      ></div>
      <div
        class="codicon codicon-terminal-powershell"
        style="color: rgb(160,151,229);margin-left: auto;margin-right: 6px;transform: scale(0.9);margin-top:1px"
      ></div>
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
    .vsBarText:nth-of-type(5) {
      display: none !important;
    }
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
    animation-name: move;
    animation-duration: 850ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    -webkit-animation-name: move;
    -webkit-animation-duration: 850ms;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-timing-function: linear;
    -webkit-animation-fill-mode: forwards;
  }
  .vsAppBar {
    touch-action: none;
    user-select: none;
  }
  ::-webkit-scrollbar-thumb {
    display: block !important;
    background: transparent;
  }
  ::-webkit-scrollbar-track {
    background: rgb(160 151 229/ 50%);
  }
</style>

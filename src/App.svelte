<script>
  import swissMountains from './assets/swissMountains.webp';
  import resumeImg from './assets/SeanResume.webp';

  import BottomBar from './lib/BottomBar.svelte';
  // import JsPaint from "./lib/JsPaint.svelte"
  // import SysWindow from "./lib/SysWindow.svelte";
  // import {touchDevice} from './lib/SysWindow.svelte';
  import TopBar from './lib/TopBar.svelte';
  import ContentWindow from './lib/ContentWindow.svelte';
  // import VsCode from './lib/V/var/folders/_t/7nklclld0qzcsm5gd1svn4x00000gn/T/iTerm2.rzFrH8.scheduleSpring.png sCode.svelte'
  let VSCODE = null;
  let FILESYS = null;
  let JSPAINT = null;
  let CODEMIRROR = null;
  let PORTABLETEXT = null;
  let SNAKEGAME = null;

  let snakeGameActive = false;

  import { count } from './stores/zIndex.ts';
  import { writableArray } from './stores/minimized.ts';
  import { appLaunch } from './stores/appLaunch.ts';
  import { osStore } from './stores/osStore.ts';

  import { onMount } from 'svelte';

  let current = '';
  let doubleClick = '';

  import {
    windowRegistry,
    icons,
    isContentWindow,
    needsVsCode,
  } from './config/registry.ts';
  import Desktop from './components/Desktop.svelte';

  let positions = {};
  let nextPosition = { x: 180, y: 100 };

  // Per-window state maps for z-index and minimize state.
  let zMap = {};
  let isMinimized = {};
  let fileSysWindows = {};

  function windowUsesPosition(name) {
    return name.startsWith('File System') === false;
  }

  function allocatePosition(name) {
    const small = window.innerWidth < 700;
    if (name === 'Overview') {
      nextPosition = { x: nextPosition.x, y: nextPosition.y + 30 };
      return { x: 200, y: nextPosition.y };
    }
    nextPosition = { x: nextPosition.x + 30, y: nextPosition.y + 30 };
    if (small) {
      return { x: 10, y: Math.max(nextPosition.y - 30, 30) };
    }
    return { ...nextPosition };
  }

  function ensureWindowState(name) {
    if (zMap[name] === undefined) zMap[name] = 0;
    if (isMinimized[name] === undefined) isMinimized[name] = false;
  }

  function ensurePosition(name) {
    if (!windowUsesPosition(name)) return;
    if (!positions[name]) {
      const pos = allocatePosition(name);
      positions = { ...positions, [name]: pos };
    }
  }

  function openWindow(name) {
    ensureWindowState(name);
    ensurePosition(name);
    if ($writableArray.indexOf(name) === -1) {
      $writableArray = [...$writableArray, name];
    }
    // Track in new OS Store securely
    osStore.openWindow(name, {
      title: name,
      x: positions[name]?.x || 200,
      y: positions[name]?.y || 100,
      component: name.split(' ')[0],
    });
  }

  onMount(() => {
    nextPosition = { x: window.innerWidth / 4, y: nextPosition.y };
    let catchTouchErr = () => {
      window.onerror = function () {
        return true;
      };
    };
    window.addEventListener('touchmove', catchTouchErr);
  });

  function unsetBlue() {
    if (current !== '') {
      current = '';
    }
  }

  //define starting windows on the screen names defined by "icons"
  function startWindows(winList) {
    winList.forEach((ele) => {
      openWindow(ele);
    });
  }
  startWindows(['Overview']);

  //keep track of the number of file item menus and How many there are.
  let numFileWin = 1;
  function makeSubFileWin(name) {
    //check if it not already in the writable array
    //4 max windows total right now
    let maxWindows = 3; //maximum amount of extra windows allowed that are not the root menu.

    if (Object.keys(fileSysWindows).length < maxWindows) {
      //set z index to the highest current z index.
      zMap[name] = $count['zIdx'] + 1; //set z index to highest when the desktop icon is pressed
      let newCount = zMap[name]; //var to set new count
      count.set({ zIdx: newCount, name: name }); //set count in the store to the highest
      openWindow(name);
      fileSysWindows[name] = numFileWin;
      //the order of the statemnets here is weird but it works well.
      numFileWin = numFileWin + 1;
    }
  }

  async function ensureComponents(name) {
    if (needsVsCode(name) && VSCODE === null) {
      VSCODE = (await import('./lib/VsCode.svelte')).default;
    }
    if (name === 'VS Code' && CODEMIRROR === null) {
      CODEMIRROR = (await import('./lib/CodeMirror.svelte')).default;
    }
    if (isContentWindow(name) && PORTABLETEXT === null) {
      PORTABLETEXT = (await import('@portabletext/svelte')).PortableText;
    }
    if (name.startsWith('File System') && FILESYS === null) {
      FILESYS = (await import('./lib/SysWindow.svelte')).default;
    }
    if (name === 'Js Paint' && JSPAINT === null) {
      JSPAINT = (await import('./lib/JsPaint.svelte')).default;
    }
    if (name === 'snake' && SNAKEGAME === null) {
      SNAKEGAME = (await import('./lib/SnakeGame.svelte')).default;
    }
  }

  //this is run when opening a window from the 'desktop'
  async function updateWindows() {
    //kind of convoluted logic for setting blue styles after one click
    //this should have been be done with css
    if (current === '') return;
    await ensureComponents(current);
    doubleClick = current;
    current = ''; //unbluing

    openWindow(doubleClick);

    //MAIN FILE WINDOW IS OPENED
    // if(doubleClick === "File System" && numFileWin === 0){
    //     fileSysWindows["File System"] = 0;
    //     numFileWin = 1;
    // }
    //this line lets you open minimized items with file doubleclicks
    isMinimized[doubleClick] = false; //unset double click when the desktop icon is pressed
    zMap[doubleClick] = $count['zIdx'] + 1; //set z index to highest when the desktop icon is pressed
    let newCount = zMap[doubleClick]; //var to set new count
    count.set({ zIdx: newCount, name: doubleClick }); //set count in the store to the highest

    // Track focus
    osStore.focusWindow(doubleClick);

    doubleClick = ''; //blue class stuff i think
  }

  function removeWindow(window) {
    //remove from bottom bar as well.
    //style the focused window differently.

    //if the window being removed is in a subFilemenu item.
    if (Object.keys(fileSysWindows).indexOf(window) !== -1) {
      delete fileSysWindows[window];
    }
    //remove from writable array.
    $writableArray.splice($writableArray.indexOf(window), 1); //get rid of it in the min bar if it's there.
    $writableArray = $writableArray;

    if (positions[window]) {
      delete positions[window];
      positions = { ...positions };
    }
    // Track teardown in OS Store
    osStore.closeWindow(window);
  }

  //it's pretty cool that capture works and that's one of the first things I tried but like why
  //capture makes it go from outer-innerMost as opposed to innerMost-toOutside.
  function handleMessage(event) {
    ensureWindowState(event.detail.text);
    ensurePosition(event.detail.text);
    isMinimized[event.detail.text] = false;

    //this code allows you to click on the item in the menubar and show it to the screen and set the current z index to the highest.
    zMap[event.detail.text] = $count['zIdx'] + 1;
    let newCount = zMap[event.detail.text];
    let currName = event.detail.text;
    count.set({ zIdx: newCount, name: currName });
    // Track focus in OS Store
    osStore.focusWindow(currName);
    //take the one that you recieve and set it
  }

  // var alowed = window.screen.orientation.lock("portrait");
  $: {
    //after all of the windows are hidden reset the z-index so it doesn't get unresonably large but also would it ever do this.
    if ($writableArray.length === 0) {
      $count = { zIdx: 0, name: '' };
      //reset the starting positions for the windows as well.
      positions = {};
      nextPosition = { x: window.innerWidth / 4, y: 180 };
    }

    //locic for launching apps from filesystem.
    if ($appLaunch.length === 1) {
      let currApp = $appLaunch[0];
      if (currApp === 'snake') {
        (async () => {
          await ensureComponents(currApp);
          snakeGameActive = true;
          $appLaunch.splice(0, 1);
        })();
      } else {
        (async () => {
          await ensureComponents(currApp);
          openWindow(currApp);
          //if its already in the menu bar just increment the z index;
          isMinimized[currApp] = false; //unset double click when the desktop icon is pressed
          zMap[currApp] = $count['zIdx'] + 1; //set z index to highest when the desktop icon is pressed
          let newCount = zMap[currApp]; //var to set new count
          count.set({ zIdx: newCount, name: currApp });
          $appLaunch.splice(0, 1); //remove the only element in the array.
        })();
      }
    }
  }
</script>

<svelte:window on:click|capture={unsetBlue} />

<main>
  <TopBar />
  <div
    style="background: url('{swissMountains}') 0 50% repeat-x"
    class="mountainDiv"
  ></div>
  <Desktop
    {icons}
    {current}
    on:select={(e) => (current = e.detail)}
    on:open={(e) => {
      current = e.detail;
      updateWindows();
    }}
  />
  {#each windowRegistry as win (win.id)}
    {#if $writableArray.indexOf(win.id) !== -1}
      {#if win.kind === 'fileSystem'}
        {#if FILESYS}
          <svelte:component
            this={FILESYS}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:newWin={() =>
              makeSubFileWin('File System' + numFileWin, numFileWin)}
            on:close={() => removeWindow(win.id)}
          />
        {/if}
      {:else if win.kind === 'jsPaint'}
        {#if positions[win.id] && JSPAINT}
          <svelte:component
            this={JSPAINT}
            BoxX={positions[win.id].x}
            BoxY={positions[win.id].y}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:close={() => removeWindow(win.id)}
          />
        {/if}
      {:else if win.kind === 'component'}
        {#if positions[win.id]}
          <svelte:component
            this={win.component}
            BoxX={positions[win.id].x}
            BoxY={positions[win.id].y}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:close={() => removeWindow(win.id)}
          />
        {/if}
      {:else if win.kind === 'vsCode'}
        {#if positions[win.id] && VSCODE && (win.content !== 'codemirror' || CODEMIRROR)}
          <svelte:component
            this={VSCODE}
            BoxX={positions[win.id].x}
            BoxY={positions[win.id].y}
            windowName={win.id}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:close={() => removeWindow(win.id)}
          >
            {#if win.content === 'codemirror'}
              <svelte:component
                this={CODEMIRROR}
                doc={'//using codeMirror for syntax highlighting\n//CSS vsCode window styles from scratch\nlet a = 15;\n"let a = 15;"'}
              />
            {:else if win.content === 'resume'}
              <div class="article">
                <img
                  src={resumeImg}
                  style="width:125%"
                  alt="Sean Shmulevich's Resume"
                />
              </div>
            {/if}
          </svelte:component>
        {/if}
      {:else if win.kind === 'content'}
        {#if positions[win.id] && VSCODE && PORTABLETEXT}
          <ContentWindow
            {VSCODE}
            PortableText={PORTABLETEXT}
            windowName={win.id}
            docName={win.docName}
            BoxX={positions[win.id].x}
            BoxY={positions[win.id].y}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:close={() => removeWindow(win.id)}
          />
        {/if}
      {/if}
    {/if}
  {/each}
  <!-- display one subfile menu for each time the new window button was pressed the key is very important here-->
  {#each Object.keys(fileSysWindows) as fileWin (fileSysWindows[fileWin])}
    {#if $writableArray.indexOf(fileWin) !== -1 && FILESYS}
      <svelte:component
        this={FILESYS}
        windowIndex={//this line of code is matching the int in a string.
        //coding with regex is cool.
        parseInt(fileWin.match(/(?<num>[0-9].*$)/).groups.num)}
        bind:hide={isMinimized[fileWin]}
        bind:zIdx={zMap[fileWin]}
        on:newWin={() =>
          makeSubFileWin(
            'File System' + (numFileWin + 1),
            fileSysWindows[fileWin]
          )}
        on:close={() => removeWindow(fileWin)}
      />
    {/if}
  {/each}
  {#if snakeGameActive && SNAKEGAME}
    <svelte:component
      this={SNAKEGAME}
      active={snakeGameActive}
      on:close={() => {
        snakeGameActive = false;
      }}
    />
  {/if}
  <BottomBar on:min={handleMessage} />
  <div class="scan-lines"></div>
</main>

<style>
  /* markdown styles */
  .article {
    color: white;
    font-family: Apple Garamond bold;
    padding: 0px 15px 10px 15px;
    margin-top: -10px;
  }
  .scan-lines {
    z-index: 99999;
    opacity: 0.7;
    filter: alpha(70);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    background-image:
      radial-gradient(
        ellipse at center,
        transparent 0,
        transparent 60%,
        rgba(0, 0, 0, 0.25) 100%
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1px,
        rgba(0, 0, 0, 0.35) 3px
      );
    background-size:
      100% 100%,
      100% 6px;
    -webkit-animation: flicker 0.3s linear infinite;
    animation: flicker 0.3s linear infinite;
  }
  :global(pre) {
    background: unset;
  }
  .mountainDiv {
    position: fixed;
    bottom: 20px;
    left: 0px;
    height: 40%;
    width: 100%;
    background-size: contain;
    background-repeat: repeat-x;
    background-size: 350px 300px;
  }
  /* .swissMountains {
    width: 100%;
    max-height: 700px;
    max-width: 1000px;
    background-repeat: repeat-x;
  } */
  /* .swissMountainsRepeat {
    width: 100%;
    position: fixed;
    bottom: -80px;
    left: 0px;
    max-height: 700px;
    max-width: 1000px;
  } */
  /*<AboutMe zIdx={-1}/>*/
</style>

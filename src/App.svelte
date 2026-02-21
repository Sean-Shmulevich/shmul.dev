<script>
  import svelteLogo from "./assets/windowicons/aim_fldr.ico";
  import vsLogo from "./assets/windowicons/vb-bas.ico";
  import shmulSys from "./assets/myIcon_1.png";
  import swissMountains from './assets/swissMountains.webp';

  import AboutMe from "./lib/AboutMe.svelte";
  import BottomBar from "./lib/BottomBar.svelte";
  // import JsPaint from "./lib/JsPaint.svelte"
  // import SysWindow from "./lib/SysWindow.svelte";
  // import {touchDevice} from './lib/SysWindow.svelte';
  import TopBar from "./lib/TopBar.svelte";
  import ContentWindow from "./lib/ContentWindow.svelte";
  // import VsCode from './lib/V/var/folders/_t/7nklclld0qzcsm5gd1svn4x00000gn/T/iTerm2.rzFrH8.scheduleSpring.png sCode.svelte'
  let VSCODE = null;
  let FILESYS = null;
  let JSPAINT = null;
  let CODEMIRROR = null;
  let PORTABLETEXT = null;

  import { count } from "./stores/zIndex.js";
  import { writableArray } from "./stores/minimized.js";
  import { appLaunch } from "./stores/appLaunch.js";

  import { onMount } from "svelte";

  let current = "";
  let doubleClick = "";

  const paintIcon =
    "https://win98icons.alexmeub.com/icons/png/paint_old-0.png";

  const windowRegistry = [
    {
      id: "File System",
      kind: "fileSystem",
      desktop: { order: 1, left: 25, src: svelteLogo },
    },
    {
      id: "Js Paint",
      kind: "jsPaint",
      desktop: { order: 3, left: 25, src: paintIcon },
    },
    {
      id: "Overview",
      kind: "component",
      component: AboutMe,
      desktop: { order: 0, left: 30, src: shmulSys },
    },
    {
      id: "VS Code",
      kind: "vsCode",
      content: "codemirror",
      desktop: { order: 2, left: 25, src: vsLogo },
    },
    { id: "resume", kind: "vsCode", content: "resume" },
    { id: "snake", kind: "vsCode", content: "snake" },
    { id: "My_Philosophy", kind: "content", docName: "My_Philosophy" },
    { id: "hobbies", kind: "content", docName: "Hobbies" },
    { id: "goals", kind: "content", docName: "Goals" },
    { id: "ideas", kind: "content", docName: "Ideas" },
    { id: "About_Website", kind: "content", docName: "About_Website" },
  ];

  const icons = windowRegistry
    .filter((w) => w.desktop)
    .sort((a, b) => a.desktop.order - b.desktop.order)
    .map((w) => ({ left: w.desktop.left, src: w.desktop.src, text: w.id }));

  const contentWindowSet = new Set(
    windowRegistry.filter((w) => w.kind === "content").map((w) => w.id)
  );
  const vsCodeShellWindowSet = new Set(
    windowRegistry
      .filter((w) => w.kind === "vsCode" || w.kind === "content")
      .map((w) => w.id)
  );

  function isContentWindow(name) {
    return contentWindowSet.has(name);
  }

  function needsVsCode(name) {
    return vsCodeShellWindowSet.has(name);
  }

  let store;
  let positions = {};
  let nextPosition = { x: 180, y: 100 };
  let contentList;

  // Per-window state maps for z-index and minimize state.
  let zMap = {};
  let isMinimized = {};
  let fileSysWindows = {};

  function windowUsesPosition(name) {
    return name.startsWith("File System") === false;
  }

  function allocatePosition(name) {
    if (name === "Overview") {
      nextPosition = { x: nextPosition.x, y: nextPosition.y + 30 };
      return { x: 200, y: nextPosition.y };
    }
    nextPosition = { x: nextPosition.x + 30, y: nextPosition.y + 30 };
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
  }

  onMount(() => {
    nextPosition = { x: window.innerWidth / 4, y: nextPosition.y };
    let catchTouchErr = () => {
      window.onerror = function (msg, url, line, col, error) {
        return true;
      };
    };
    window.addEventListener("touchmove", catchTouchErr);
  });

  function unsetBlue() {
    if (current !== "") {
      current = "";
    }
  }

  //define starting windows on the screen names defined by "icons"
  function startWindows(winList) {
    winList.forEach((ele) => {
      openWindow(ele);
    });
  }
  startWindows(["Overview"]);

  //keep track of the number of file item menus and How many there are.
  let numFileWin = 1;
  function makeSubFileWin(name, i) {
    //check if it not already in the writable array
    //4 max windows total right now
    let maxWindows = 3; //maximum amount of extra windows allowed that are not the root menu.

    if (Object.keys(fileSysWindows).length < maxWindows) {
      //set z index to the highest current z index.
      zMap[name] = $count["zIdx"] + 1; //set z index to highest when the desktop icon is pressed
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
      VSCODE = (await import("./lib/VsCode.svelte")).default;
    }
    if (name === "VS Code" && CODEMIRROR === null) {
      CODEMIRROR = (await import("./lib/CodeMirror.svelte")).default;
    }
    if (isContentWindow(name) && PORTABLETEXT === null) {
      PORTABLETEXT = (await import("@portabletext/svelte")).PortableText;
    }
    if (name.startsWith("File System") && FILESYS === null) {
      FILESYS = (await import("./lib/SysWindow.svelte")).default;
    }
    if (name === "Js Paint" && JSPAINT === null) {
      JSPAINT = (await import("./lib/JsPaint.svelte")).default;
    }
  }

  //this is run when opening a window from the 'desktop'
  async function updateWindows() {
    //kind of convoluted logic for setting blue styles after one click
    //this should have been be done with css
    if (current === "") return;
    await ensureComponents(current);
    doubleClick = current;
    current = ""; //unbluing

    openWindow(doubleClick);

    //MAIN FILE WINDOW IS OPENED
    // if(doubleClick === "File System" && numFileWin === 0){
    //     fileSysWindows["File System"] = 0;
    //     numFileWin = 1;
    // }
    //this line lets you open minimized items with file doubleclicks
    isMinimized[doubleClick] = false; //unset double click when the desktop icon is pressed
    zMap[doubleClick] = $count["zIdx"] + 1; //set z index to highest when the desktop icon is pressed
    let newCount = zMap[doubleClick]; //var to set new count
    count.set({ zIdx: newCount, name: doubleClick }); //set count in the store to the highest
    doubleClick = ""; //blue class stuff i think
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
  }

  //it's pretty cool that capture works and that's one of the first things I tried but like why
  //capture makes it go from outer-innerMost as opposed to innerMost-toOutside.
  function handleMessage(event) {
    ensureWindowState(event.detail.text);
    ensurePosition(event.detail.text);
    isMinimized[event.detail.text] = false;

    //this code allows you to click on the item in the menubar and show it to the screen and set the current z index to the highest.
    zMap[event.detail.text] = $count["zIdx"] + 1;
    let newCount = zMap[event.detail.text];
    let currName = event.detail.text;
    count.set({ zIdx: newCount, name: currName });
    //take the one that you recieve and set it
  }

  // var alowed = window.screen.orientation.lock("portrait");
  $: {
    //after all of the windows are hidden reset the z-index so it doesn't get unresonably large but also would it ever do this.
    if ($writableArray.length === 0) {
      $count = { zIdx: 0, name: "" };
      //reset the starting positions for the windows as well.
      positions = {};
      nextPosition = { x: window.innerWidth / 4, y: 180 };
    }

    //locic for launching apps from filesystem.
    if ($appLaunch.length === 1) {
      let currApp = $appLaunch[0];
      (async () => {
        await ensureComponents(currApp);
        openWindow(currApp);
        //if its already in the menu bar just increment the z index;
        isMinimized[currApp] = false; //unset double click when the desktop icon is pressed
        zMap[currApp] = $count["zIdx"] + 1; //set z index to highest when the desktop icon is pressed
        let newCount = zMap[currApp]; //var to set new count
        count.set({ zIdx: newCount, name: currApp });
        $appLaunch.splice(0, 1); //remove the only element in the array.
      })();
    }
  }
</script>

<svelte:window on:click|capture={unsetBlue} />

<main>
  <TopBar />
  <div
    style="background: url('{swissMountains}') 0 50% repeat-x"
    class="mountainDiv"
  />
  {#each icons as { left, src, text }, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="homeIcon"
      style="top:{i * 105 + 65}px; left:{left}px;image-rendering: pixelated"
      class:blue={current === text}
      on:click={() => (current = text)}
      on:dblclick={updateWindows}
    >
      <img {src} alt="window 98 home screen {text} button" style="width:55px" />
      <p class="homeIconText">{text}</p>
    </div>
  {/each}
  {#each windowRegistry as win (win.id)}
    {#if $writableArray.indexOf(win.id) !== -1}
      {#if win.kind === "fileSystem"}
        {#if FILESYS}
          <svelte:component
            this={FILESYS}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:newWin={() => makeSubFileWin("File System" + numFileWin, numFileWin)}
            on:close={() => removeWindow(win.id)}
          />
        {/if}
      {:else if win.kind === "jsPaint"}
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
      {:else if win.kind === "component"}
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
      {:else if win.kind === "vsCode"}
        {#if positions[win.id] &&
        VSCODE &&
        (win.content !== "codemirror" || CODEMIRROR)}
          <svelte:component
            this={VSCODE}
            BoxX={positions[win.id].x}
            BoxY={positions[win.id].y}
            windowName={win.id}
            bind:hide={isMinimized[win.id]}
            bind:zIdx={zMap[win.id]}
            on:close={() => removeWindow(win.id)}
          >
            {#if win.content === "codemirror"}
              <svelte:component
                this={CODEMIRROR}
                doc={'//using codeMirror for syntax highlighting\n//CSS vsCode window styles from scratch\nlet a = 15;\n"let a = 15;"'}
              />
            {:else if win.content === "resume"}
              <div class="article">
                <img
                  src="assets/SeanResume.webp"
                  style="width:125%"
                  alt="Sean Shmulevich's Resume"
                />
              </div>
            {:else if win.content === "snake"}
              <div class="article">
                <h2 style="line-height:2rem">
                  No snake game yet but the idea is to make a snake game where the
                  windows on this page are obstacles for the snake.
                </h2>
              </div>
            {/if}
          </svelte:component>
        {/if}
      {:else if win.kind === "content"}
        {#if positions[win.id] && VSCODE && PORTABLETEXT}
          <ContentWindow
            VSCODE={VSCODE}
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
            "File System" + (numFileWin + 1),
            fileSysWindows[fileWin]
          )}
        on:close={() => removeWindow(fileWin)}
      />
    {/if}
  {/each}
  <BottomBar on:min={handleMessage} />
  <div class="scan-lines" />
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
    background-image: radial-gradient(
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
    background-size: 100% 100%, 100% 6px;
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

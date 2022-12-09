<script>
  import svelteLogo from "./assets/windowicons/aim_fldr.ico";
  import vsLogo from "./assets/windowicons/vb-bas.ico";
  import shmulSys from "./assets/myIcon_1.png";
  // import swissMountains from './assets/swissMountains.png';

  import AboutMe from "./lib/AboutMe.svelte";
  import BottomBar from "./lib/BottomBar.svelte";
  // import JsPaint from "./lib/JsPaint.svelte"
  // import SysWindow from "./lib/SysWindow.svelte";
  // import {touchDevice} from './lib/SysWindow.svelte';
  import TopBar from "./lib/TopBar.svelte";
  import Image from './lib/Image.svelte'
  import { BarLoader } from 'svelte-loading-spinners';
  // import VsCode from './lib/VsCode.svelte'
  let VSCODE = null;
  let FILESYS = null;
  let JSPAINT = null;
  let CODEMIRROR = null;
  let PORTABLETEXT = null;


  import { count } from "./stores/zIndex.js";
  import { writableArray } from "./stores/minimized.js";
  import { appLaunch } from "./stores/appLaunch.js";

//   import SvelteMarkdown from "svelte-markdown";
//   import source from "./assets/markdown/test.md?raw";
  // import CodeMirror from './lib/CodeMirror.svelte'
    import { get } from "./stores/sanity.js";

  let getData = async (fileName) => {
    let data = await (await get(fileName)).body["textArr"][0].FileContent;
    // console.log(data);
    return data;
  };

  import { onMount } from "svelte";

  let current = "";
  let doubleClick = "";
  const icons = [
    {
      left: 30,
      pos: 55,
      src: shmulSys,
      text: "Overview",
    },
    {
      left: 25,
      src: svelteLogo,
      text: "File System",
    },
    {
      left: 25,
      src: vsLogo,
      text: "VS Code",
    },
    {
      left: 25,
      src: "https://win98icons.alexmeub.com/icons/png/paint_old-0.png",
      text: "Js Paint",
    },
  ];
  let store;
  let startPositionX = 180,
    startPositionY = 100;
  let contentList;

  onMount(() => {
    startPositionX = window.innerWidth / 4;
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
      //this if statement is mostly for development becaause
      //vite will double add this to the menubar unless you force there to be only one.
      if ($writableArray.indexOf(ele) === -1) {
        $writableArray.push(ele);
      }
    });
    $writableArray = $writableArray;
  }
  startWindows(["Overview"]);
  //bind to child z-index values in order to set to the highest on file icon press.
  //alternatively set the highest by default in the element to start and it will be the first one when you init it.
  let zMap = { "File System": 0, Overview: 0, "VS Code": 0 };
  let isMinimized = { "File System": false, Overview: false, "VS Code": false };
  let fileSysWindows = {};

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

      if ($writableArray.indexOf(doubleClick) === -1) {
        $writableArray = [...$writableArray, name]; //add to writable array
        fileSysWindows[name] = numFileWin;
      }
      //the order of the statemnets here is weird but it works well.
      numFileWin = numFileWin + 1;
    }
  }

  //this is run when opening a window from the 'desktop'
  async function updateWindows() {
    //kind of convoluted logic for setting blue styles after one click
    //this should have been be done with css
    //dynamic import.
    if (VSCODE === null && current === "VS Code") {
      VSCODE = (await import("./lib/VsCode.svelte")).default;
      CODEMIRROR = (await import("./lib/CodeMirror.svelte")).default;
    } else if (FILESYS === null && current === "File System") {
      FILESYS = (await import("./lib/SysWindow.svelte")).default;
    } else if (JSPAINT === null && current === "Js Paint") {
      JSPAINT = (await import("./lib/JsPaint.svelte")).default;
    }
    if (current === "") return;
    doubleClick = current;
    current = ""; //unbluing

    //global stores to what is currently on the screen and also in the menubar
    //if the item doesnt exist yet in the menubar then add it
    //what if the item is not on the screen but should still be in the menubar
    //its still under the screen with my implementation.
    //what are the edge cases here?
    if ($writableArray.indexOf(doubleClick) === -1) {
      $writableArray = [...$writableArray, doubleClick]; //add to writable array
    }

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
  }

  //it's pretty cool that capture works and that's one of the first things I tried but like why
  //capture makes it go from outer-innerMost as opposed to innerMost-toOutside.
  function handleMessage(event) {
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
      startPositionX = window.innerWidth / 4;
      startPositionY = 180;
    }

    //locic for launching apps from filesystem.
    if ($appLaunch.length === 1) {
      // console.log(contentList);
      let a = async () => {
        //dynamically load the js for these components.
        if (VSCODE === null) {
          VSCODE = (await import("./lib/VsCode.svelte")).default;
          CODEMIRROR = (await import("./lib/CodeMirror.svelte")).default;
        }
        if(PORTABLETEXT === null) {
            PORTABLETEXT =  (await import("@portabletext/svelte")).PortableText;
        }
      };
      a();
      let currApp = $appLaunch[0];
      //only launch if its not already in the menu bar
      if ($writableArray.indexOf(currApp) === -1) {
        $writableArray = [...$writableArray, currApp]; //add to writable array
      }
      //if its already in the menu bar just increment the z index;
      isMinimized[currApp] = false; //unset double click when the desktop icon is pressed
      zMap[currApp] = $count["zIdx"] + 1; //set z index to highest when the desktop icon is pressed
      let newCount = zMap[currApp]; //var to set new count
      count.set({ zIdx: newCount, name: currApp });
      $appLaunch.splice(0, 1); //remove the only element in the array.
    }
  }
</script>

<svelte:window on:click|capture={unsetBlue} />

<main>


  <TopBar />
  <div
    style="background: url('https://crustmag.slimecars.com/images/swissMountains.png') 0 50% repeat-x"
    class="mountainDiv"
  />
  {#each icons as { left, src, text }, i}
    <div
      class="homeIcon"
      style="top:{i * 105 + 65}px; left:{left}px"
      class:blue={current === text}
      on:click={() => (current = text)}
      on:dblclick={updateWindows}
    >
      <img {src} alt="folder icon Windows 95" style="width:55px" />
      <p class="homeIconText">{text}</p>
    </div>
  {/each}
  {#if $writableArray.indexOf("File System") !== -1}
    <svelte:component
      this={FILESYS}
      bind:hide={isMinimized["File System"]}
      bind:zIdx={zMap["File System"]}
      on:newWin={() => makeSubFileWin("File System" + numFileWin, numFileWin)}
      on:close={() => removeWindow("File System")}
    />
  {/if}
  <!-- display one subfile menu for each time the new window button was pressed the key is very important here-->
  {#each Object.keys(fileSysWindows) as fileWin (fileSysWindows[fileWin])}
    {#if $writableArray.indexOf(fileWin) !== -1}
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
  {#if $writableArray.indexOf("Js Paint") !== -1}
    <svelte:component
      this={JSPAINT}
      BoxX={(startPositionX += 30)}
      BoxY={(startPositionY += 30)}
      bind:hide={isMinimized["Js Paint"]}
      bind:zIdx={zMap["Js Paint"]}
      on:close={() => removeWindow("Js Paint")}
    />
  {/if}
  {#if $writableArray.indexOf("Overview") !== -1}
    <AboutMe
      BoxY={(startPositionY += 30)}
      bind:hide={isMinimized["Overview"]}
      bind:zIdx={zMap["Overview"]}
      on:close={() => removeWindow("Overview")}
    />
  {/if}
  {#if $writableArray.indexOf("VS Code") !== -1}
    <svelte:component
      this={VSCODE}
      BoxX={(startPositionX += 30)}
      BoxY={(startPositionY += 30)}
      bind:hide={isMinimized["VS Code"]}
      bind:zIdx={zMap["VS Code"]}
      on:close={() => removeWindow("VS Code")}
    >
      <svelte:component
        this={CODEMIRROR}
        doc={'//using codeMirror for syntax highlighting\n//CSS vsCode window styles from scratch\nlet a = 15;\n"let a = 15;"'}
      >
        bind:docStore={store}>
      </svelte:component>
    </svelte:component>
  {/if}
  <!-- i could also show all the md files but hide them by default -->
  {#if $writableArray.indexOf("resume") !== -1}
    <svelte:component
      this={VSCODE}
      BoxX={(startPositionX += 30)}
      BoxY={(startPositionY += 30)}
      windowName="resume"
      bind:hide={isMinimized["resume"]}
      bind:zIdx={zMap["resume"]}
      on:close={() => removeWindow("resume")}
    >
      <div
        style="color:white;font-family:Apple Garamond bold;padding:10px;margin-top:0px"
      >
        <img src="https://crustmag.slimecars.com/images/SeanResume.png" style="width:125%" alt="">
      </div>
    </svelte:component>
  {/if}
  {#if $writableArray.indexOf("snake") !== -1}
  <svelte:component
    this={VSCODE}
    BoxX={(startPositionX += 30)}
    BoxY={(startPositionY += 30)}
    windowName="snake"
    bind:hide={isMinimized["snake"]}
    bind:zIdx={zMap["snake"]}
    on:close={() => removeWindow("snake")}
  >
    <div
      style="color:white;font-family:Apple Garamond bold;padding:10px;margin-top:0px;padding-top:0px"
    >
      <h2 style="line-height:2rem">No snake game yet but the idea is to make a snake game where the windows on this page are obstacles for the snake.</h2>
    </div>
  </svelte:component>
{/if}
  {#if $writableArray.indexOf("passions") !== -1}
  <svelte:component
    this={VSCODE}
    BoxX={(startPositionX += 30)}
    BoxY={(startPositionY += 30)}
    windowName="passions"
    bind:hide={isMinimized["passions"]}
    bind:zIdx={zMap["passions"]}
    on:close={() => removeWindow("passions")}
  >
    <div
      style="color:white;font-family:Apple Garamond bold;padding:10px;margin-top:0px"
    >
        <!-- svelte-ignore empty-block -->
      {#await getData("Passions")}
      <div style="margin: 25% auto auto 40%">
          <BarLoader size="60" color="rgb(150 150 255)" unit="px" />
      </div>
      {:then backendContent}
      <svelte:component
      this={PORTABLETEXT}
      value={backendContent}
      components={{
      types: {
          // block-level components
          image: Image,
          // inline-level components
      }
      }}
      >
      </svelte:component>
      {/await}
    </div>
  </svelte:component>
  {/if}
  {#if $writableArray.indexOf("hobbies") !== -1}
  <svelte:component
    this={VSCODE}
    BoxX={(startPositionX += 30)}
    BoxY={(startPositionY += 30)}
    windowName="hobbies"
    bind:hide={isMinimized["hobbies"]}
    bind:zIdx={zMap["hobbies"]}
    on:close={() => removeWindow("hobbies")}
  >
    <div
      style="color:white;font-family:Apple Garamond bold;padding:10px;margin-top:0px"
    >
        <!-- svelte-ignore empty-block -->
      {#await getData("Hobbies")}
      <div style="margin: 25% auto auto 40%">
          <BarLoader size="60" color="rgb(150 150 255)" unit="px" />
      </div>
      {:then backendContent}
      <svelte:component
      this={PORTABLETEXT}
      value={backendContent}
      components={{
      types: {
          // block-level components
          image: Image,
          // inline-level components
      }
      }}
      >
      </svelte:component>
      {/await}
    </div>
  </svelte:component>
  {/if}
  {#if $writableArray.indexOf("goals") !== -1}
  <svelte:component
    this={VSCODE}
    BoxX={(startPositionX += 30)}
    BoxY={(startPositionY += 30)}
    windowName="goals"
    bind:hide={isMinimized["goals"]}
    bind:zIdx={zMap["goals"]}
    on:close={() => removeWindow("goals")}
  >
    <div
      style="color:white;font-family:Apple Garamond bold;padding:10px;margin-top:0px"
    >
        <!-- svelte-ignore empty-block -->
      {#await getData("Goals")}
      <div style="margin: 25% auto auto 40%">
          <BarLoader size="60" color="rgb(150 150 255)" unit="px" />
      </div>
      {:then backendContent}
      <svelte:component
      this={PORTABLETEXT}
      value={backendContent}
      components={{
      types: {
          // block-level components
          image: Image,
          // inline-level components
      }
      }}
      >
      </svelte:component>
      {/await}
    </div>
  </svelte:component>
  {/if}
  {#if $writableArray.indexOf("ideas") !== -1}
  <svelte:component
    this={VSCODE}
    BoxX={(startPositionX += 30)}
    BoxY={(startPositionY += 30)}
    windowName="ideas"
    bind:hide={isMinimized["ideas"]}
    bind:zIdx={zMap["ideas"]}
    on:close={() => removeWindow("ideas")}
  >
    <div
      style="color:white;font-family:Apple Garamond bold;padding:10px;margin-top:0px"
    >
        <!-- svelte-ignore empty-block -->
      {#await getData("Ideas")}
      <div style="margin: 25% auto auto 40%">
          <BarLoader size="60" color="rgb(150 150 255)" unit="px" />
      </div>
      {:then backendContent}
      <svelte:component
      this={PORTABLETEXT}
      value={backendContent}
      components={{
      types: {
          // block-level components
          image: Image,
          // inline-level components
      }
      }}
      >
      </svelte:component>
      {/await}
    </div>
  </svelte:component>
  {/if}
  <BottomBar on:min={handleMessage} />
  <div class="scan-lines" />
</main>

<style>
  /* markdown styles */
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
  .swissMountains {
    width: 100%;
    max-height: 700px;
    max-width: 1000px;
    background-repeat: repeat-x;
  }
  .swissMountainsRepeat {
    width: 100%;
    position: fixed;
    bottom: -80px;
    left: 0px;
    max-height: 700px;
    max-width: 1000px;
  }
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

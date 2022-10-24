<script>
    import svelteLogo from './assets/windowicons/aim_fldr.ico';
    import vsLogo from './assets/windowicons/vb-bas.ico';
    import shmulSys from './assets/windowicons/doc_panda1.ico';

    import AboutMe from './lib/AboutMe.svelte'
    import TopBar from './lib/TopBar.svelte'
    import BottomBar from './lib/BottomBar.svelte'
    import FilePage from './lib/FilePage.svelte'
    import VsCode from './lib/VsCode.svelte'
    import FileList from './lib/FileList.svelte'
    import SysWindow from "./lib/SysWindow.svelte";
    import JsPaint from "./lib/JsPaint.svelte"

    import {count} from './stores/zIndex.js';
    import {writableArray} from './stores/minimized.js';



    let current = '';
    let doubleClick = '';
    const icons = [
        {
            pos: 45,
            src: svelteLogo,
            text: "File System"
        },
        {
            pos: 143,
            src: shmulSys,
            text: "Shmul Sys"
        },
        {
            pos: 232,
            src: vsLogo,
            text: "VS Code"
        },
        {
            pos: 315,
            src: "https://win98icons.alexmeub.com/icons/png/paint_old-0.png",
            text: "Js Paint"
        },
    ];

    function unsetBlue() {
        if (current !== '') {
            current = ''
        }
    }

    let windows = [];//represents 1x of each of the current windows open.
    function startWindows(winList) {
        winList.forEach((ele) => {
            windows.push(ele);
            $writableArray.push(ele);
        });
        $writableArray = $writableArray;
    }
    startWindows(["Shmul Sys"]);
    //bind to child z-index values in order to set to the highest on file icon press.
    //alternatively set the highest by default in the element to start and it will be the first one when you init it.
    let zMap = {'File System': 0, 'Shmul Sys': 0, 'VS Code': 0};
    let isMinimized = {'File System': false, 'Shmul Sys': false, 'VS Code': false};

    //this is run when opening a window
    function updateWindows() {
        doubleClick = current;
        current = '';//unbluing
        if (windows.indexOf(doubleClick) === -1) {//setting this to true just makes more closes necessary.
            windows.push(doubleClick);
            windows = windows;

            if($writableArray.indexOf(doubleClick) === -1){
                $writableArray = [...$writableArray, doubleClick];//add to writable array
            }
        }
        //this line lets you open minimized items with file doubleclicks
        isMinimized[doubleClick] = false;
        zMap[doubleClick] = $count["zIdx"] + 1;
        let newCount = zMap[doubleClick];
        count.set({zIdx: newCount, name: doubleClick});
        doubleClick = '';
    }

    function removeWindow(window) {
        windows.splice(windows.indexOf(window), 1);
        windows = windows;

        //remove from bottom bar as well.
        //style the focused window differently.
        $writableArray.splice($writableArray.indexOf(window), 1);//get rid of it in the min bar if it's there.
        $writableArray = $writableArray;
    }

    //it's pretty cool that capture works and that's one of the first things I tried but like why
    //capture makes it go from outer-innerMost as opposed to innerMost-toOutside.
    function handleMessage(event) {
        isMinimized[event.detail.text] = false;
        zMap[event.detail.text] = $count['zIdx'] + 1;
        let newCount = zMap[event.detail.text];
        let currName = event.detail.text;
        count.set({zIdx: newCount, name: currName});
        //take the one that you recieve and set it
    }

    $: {
        if(windows.length === 0){
            $count = {zIdx: 0, name: ""};
        }
    }
</script>

<svelte:window on:click|capture={unsetBlue}/>

<main>

    <TopBar/>
    {#each icons as {pos, src, text}}
        <div class="homeIcon" style="top:{pos}px; left:32px" class:blue={current === text}
             on:click="{() => current = text}" on:dblclick="{updateWindows}">
            <img
                    {src}
                    alt="folder icon Windows 95"
                    style="width:50px">
            <p class="homeIconText">{text}</p>
        </div>
    {/each}
    {#if windows.indexOf('File System') !== -1}
        <SysWindow bind:hide="{isMinimized['File System']}"  bind:zIdx="{zMap['File System']}" on:close={() => removeWindow('File System')}/>
    {/if}
    {#if windows.indexOf('Js Paint') !== -1}
        <JsPaint bind:hide="{isMinimized['Js Paint']}" bind:zIdx="{zMap['Js Paint']}" on:close={() => removeWindow('Js Paint')}/>
    {/if}
    {#if windows.indexOf('Shmul Sys') !== -1}
        <AboutMe bind:hide="{isMinimized['Shmul Sys']}" bind:zIdx="{zMap['Shmul Sys']}" on:close={() => removeWindow('Shmul Sys')}/>
    {/if}
    {#if windows.indexOf('VS Code') !== -1}
        <VsCode bind:hide="{isMinimized['VS Code']}" bind:zIdx="{zMap['VS Code']}" on:close={() => removeWindow('VS Code')}/>
    {/if}
    <BottomBar on:min={handleMessage}/>
</main>


<style>
    /*<AboutMe zIdx={-1}/>*/
    .homeIconText {
        margin-top: -11px;
        margin-bottom: -3px;
        font-family: Apple Garamond;
        font-size: 1rem;
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
    :global(.jspaint){
        background: rgb(174, 168, 217) !important;
    }
</style>

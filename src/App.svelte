<script>
    import svelteLogo from './assets/windowicons/aim_fldr.ico';
    import vsLogo from './assets/windowicons/vb-bas.ico';
    import listLogo from './assets/windowicons/doc_panda1.ico';

    import AboutMe from './lib/AboutMe.svelte'
    import TopBar from './lib/TopBar.svelte'
    import BottomBar from './lib/BottomBar.svelte'
    import FilePage from './lib/FilePage.svelte'
    import VsCode from './lib/VsCode.svelte'
    import FileList from './lib/FileList.svelte'
    import SysWindow from "./lib/SysWindow.svelte";

    import {count} from './stores/zIndex.js';
    import {writableArray} from './stores/minimized.js';


    let current = '';
    let doubleClick = '';
    const icons = [
        {
            pos: 45,
            src: svelteLogo,
            text: "Files Grid"
        },
        {
            pos: 148,
            src: listLogo,
            text: "Files List"
        },
        {
            pos: 242,
            src: vsLogo,
            text: "VS Code"
        },
    ];

    function unsetBlue() {
        if (current !== '') {
            current = ''
        }
    }

    let windows = [];//represents 1x of each of the current windows open.
    //bind to child z-index values in order to set to the highest on file icon press.
    //alternatively set the highest by default in the element to start and it will be the first one when you init it.
    let zMap = {'Files Grid': 0, 'Files List': 0, 'VS Code': 0};
    let isMinimized = {'Files Grid': false, 'Files List': false, 'VS Code': false};

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
        zMap[doubleClick] = $count + 1;
        count.increment();
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
        zMap[event.detail.text] = $count + 1;
        count.increment();
        //take the one that you recieve and set it
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
    {#if windows.indexOf('Files Grid') !== -1}
        <SysWindow bind:hide="{isMinimized['Files Grid']}"  bind:zIdx="{zMap['Files Grid']}" on:close={() => removeWindow('Files Grid')}/>
    {/if}
    {#if windows.indexOf('Files List') !== -1}
        <FileList bind:hide="{isMinimized['Files List']}" bind:zIdx="{zMap['Files List']}" on:close={() => removeWindow('Files List')}/>
    {/if}
    {#if windows.indexOf('VS Code') !== -1}
        <VsCode bind:hide="{isMinimized['VS Code']}" bind:zIdx="{zMap['VS Code']}" on:close={() => removeWindow('VS Code')}/>
    {/if}
    <AboutMe zIdx={-1}/>
    <BottomBar on:min={handleMessage}/>
</main>


<style>
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
</style>

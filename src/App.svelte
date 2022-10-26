<script>
    import svelteLogo from './assets/windowicons/aim_fldr.ico';
    import vsLogo from './assets/windowicons/vb-bas.ico';
    import shmulSys from './assets/myIcon_1.png';

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
            left: 30,
            pos: 55,
            src: shmulSys,
            text: "Overview"
        },
        {
            left: 25,
            src: svelteLogo,
            text: "File System"
        },
        {
            left: 25,
            src: vsLogo,
            text: "VS Code"
        },
        {
            left: 25,
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
    startWindows(["Overview"]);
    //bind to child z-index values in order to set to the highest on file icon press.
    //alternatively set the highest by default in the element to start and it will be the first one when you init it.
    let zMap = {'File System': 0, 'Overview': 0, 'VS Code': 0};
    let isMinimized = {'File System': false, 'Overview': false, 'VS Code': false};

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
    <div class="mountainDiv">
    </div>
    
    {#each (icons) as {left, src, text}, i}
        <div class="homeIcon" style="top:{(i*105)+65}px; left:{left}px" class:blue={current === text}
             on:click="{() => current = text}" on:dblclick="{updateWindows}">
            <img
                    {src}
                    alt="folder icon Windows 95"
                    style="width:55px">
            <p class="homeIconText">{text}</p>
        </div>
    {/each}
    {#if windows.indexOf('File System') !== -1}
        <SysWindow bind:hide="{isMinimized['File System']}"  bind:zIdx="{zMap['File System']}" on:close={() => removeWindow('File System')} />
    {/if}
    {#if windows.indexOf('Js Paint') !== -1}
        <JsPaint bind:hide="{isMinimized['Js Paint']}" bind:zIdx="{zMap['Js Paint']}" on:close={() => removeWindow('Js Paint')}/>
    {/if}
    {#if windows.indexOf('Overview') !== -1}
        <AboutMe bind:hide="{isMinimized['Overview']}" bind:zIdx="{zMap['Overview']}" on:close={() => removeWindow('Overview')} />
    {/if}
    {#if windows.indexOf('VS Code') !== -1}
        <VsCode bind:hide="{isMinimized['VS Code']}" bind:zIdx="{zMap['VS Code']}" on:close={() => removeWindow('VS Code')}/>
    {/if}
    <BottomBar on:min={handleMessage}/>
</main>


<style>
    .mountainDiv{
        position: fixed;
        bottom:20px;
        left: 0px;
        height:40%;width:100%;
        background-size:contain;
        background-repeat: repeat-x;
        background-size: 350px 300px;
        background: url(https://png2.cleanpng.com/sh/c6501a073cc680aae025f1619f056cf8/L0KzQYm3UcI5N5lsiZH0aYP2gLBuTfp2dphritNALYPmeLrzlPhwep8ygdD9ZYLvcbzsjr10aZ1Beud7Zz33f8b5igN1NZJ5ReVCaYT9dcPzgf5lNZt6htlvcnH4Pb3ojvR0a5J1fZ95bHHxPYboVvQ3amo1TNQ9YnGzPom4Vsg1QGQ8Sac6N0G1QIW3UMMxQGUziNDw/kisspng-jungfrau-schilthorn-interlaken-salzburg-tourist-at-switzerland-jungfrau-landscape-plan-5a6d6b904b4ba0.8168483715171204003084.png) 55% 39% repeat-x, url(https://png2.cleanpng.com/sh/c6501a073cc680aae025f1619f056cf8/L0KzQYm3UcI5N5lsiZH0aYP2gLBuTfp2dphritNALYPmeLrzlPhwep8ygdD9ZYLvcbzsjr10aZ1Beud7Zz33f8b5igN1NZJ5ReVCaYT9dcPzgf5lNZt6htlvcnH4Pb3ojvR0a5J1fZ95bHHxPYboVvQ3amo1TNQ9YnGzPom4Vsg1QGQ8Sac6N0G1QIW3UMMxQGUziNDw/kisspng-jungfrau-schilthorn-interlaken-salzburg-tourist-at-switzerland-jungfrau-landscape-plan-5a6d6b904b4ba0.8168483715171204003084.png) 55% 39% repeat-x;
    }
    .swissMountains{
        width: 100%;
        max-height: 700px;
        max-width: 1000px;
        background-repeat: repeat-x;
    }
    .swissMountainsRepeat{
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
    :global(.jspaint){
        background: rgb(174, 168, 217) !important;
    }
</style>

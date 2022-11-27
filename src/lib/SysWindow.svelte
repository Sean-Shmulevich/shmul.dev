<script context="module">

    export function incrementCount(zIdx, currMaxZ, currStore, name) {
        if (zIdx > currMaxZ["zIdx"]) {
        } else if (zIdx == currMaxZ["zIdx"]) {
            //make it higher then anything
            zIdx += 2;
        } else {
            zIdx = currMaxZ["zIdx"] + 1;
        }
        currStore.set({zIdx, name});
        return zIdx;
    };

    export let fileWinOffset = 0;

    var tapedTwice = false;
    export function tapHandler(event, handleMinimize)  {
        if(!tapedTwice) {
            tapedTwice = true;
            setTimeout( function() { tapedTwice = false; }, 300 );
            return false;
        }
        event.preventDefault();
        //action on double tap goes below
        handleMinimize();
    }
    function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        // @ts-ignore
        (navigator.msMaxTouchPoints > 0));
    }
    //true if the device has a touch screen.
    export let touchDevice = isTouchDevice();
    let touchstartX = 0;
    let touchendX = 200;
    export function swipeStart(e){
        touchstartX = e.changedTouches[0].screenY;
    }
    export function swipeEnd(e, handleMinimize){
        touchendX = e.changedTouches[0].screenY;
        if(Math.abs(touchstartX - touchendX) > 100){
            if (touchendX > touchstartX) handleMinimize();
        }
    }
</script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import SysWindowContent from './SysWindowContent.svelte'
    import {createEventDispatcher} from 'svelte';
    import {asDraggable} from 'svelte-drag-and-drop-actions'
    // import  DragDropTouch  from 'svelte-drag-drop-touch'
    import { onMount, onDestroy } from 'svelte';

    import {count} from '../stores/zIndex.js';
    import {glowWindow} from "../stores/keep.js";
    import {writableArray} from "../stores/minimized.js";

    export let zIdx = 0;
    export let BoxX = 120, BoxY = 120;//starting coords

    //fileWinOffset is a static variable that keeps track of how many window have been created it then calculates an offset based off this
    let width = 414;
    export let hide = false;

    let currentPath;//currentPath
    let thisWindow;//theCurrent window

    let menuX, menuY;
    let remPos;
    export let windowIndex = 0;
    
    //double tap function to relese on destroy.
    let mobileDblTap;
    let mobileSwipe;
    let maxX = 0;
    let maxY = 0;
    let w, h;

    onMount(() => {
		fileWinOffset+=25;
        BoxX = window.innerWidth/4;
        //basically a media query
        
        if(window.innerWidth < 660){
            BoxX = 50;
        }
        if(window.innerWidth < 465){
            BoxX = -23;
        }
        //if the width of the screen is bigger then the width of the filesystem window then set the width of the window to twenty less then the max screen size
        if(window.innerWidth <= 414){
            width = window.innerWidth - 20;
        }
        BoxX+= fileWinOffset;
        BoxY += fileWinOffset;
        
        if(touchDevice){
            document.querySelector(`.remBoxMobile.File-System${windowIndex} * div.window`).addEventListener("touchstart", swipeStart);
            document.querySelector(`.remBoxMobile.File-System${windowIndex} * div.window`).addEventListener("touchend", mobileSwipe = (e) => {swipeEnd(e, handleMinimize)});
            document.querySelector(`.remBoxMobile.File-System${windowIndex} > .fileGridBar`).addEventListener("touchstart", mobileDblTap = (e) => {tapHandler(e, handleMinimize)});
        }
	});
    //dont let the offset get insane keep it proportional to the current number of windows.
    //!bug if you remove one in a stack (not the top one) the newest one will be on top of one that is on top of the stack directly overrlapping it.
    onDestroy(() => {
		fileWinOffset -= 25;
        if(touchDevice){
            document.querySelector(`.remBoxMobile.File-System${windowIndex} * div.window`).removeEventListener("touchstart", swipeStart);
            document.querySelector(`.remBoxMobile.File-System${windowIndex} * div.window`).removeEventListener("touchend", mobileSwipe);
            document.querySelector(`.remBoxMobile.File-System${windowIndex} > .fileGridBar`).removeEventListener("touchstart", mobileDblTap);
        }
	});

    //wait for the window to load and then add an event listener
    // window.addEventListener("load", () =>{
    //     document.querySelector(".s--qfxjjQmf6o1").addEventListener("touchstart", swipeStart);
    //     document.querySelector(".s--qfxjjQmf6o1").addEventListener("touchend", swipeEnd);
    // });

    const dispatch = createEventDispatcher();

    function forward(event) {
        glowWindow.reset();
        dispatch('close', event.detail);
    }
    function newWindow(event) {
        dispatch('newWin', event.detail);
    }

    //handle drag
    function onDragStart () { return { x:BoxX,y:BoxY} }
    function onDragMove (x,y, dx,dy) { BoxX = x; BoxY = y }
    function onDragEnd  (x,y, dx,dy) { BoxX = x; BoxY = y }

    function handleMinimize(){
        //current default window is File System
        let currWindow = "File System";

        //if the winddow is a subWindow then append the number to the end of the string
        if(windowIndex !== 0){
            currWindow = currWindow+(windowIndex);
        }
        // console.log(windowIndex);

        let currMenuPos = $writableArray.indexOf(currWindow);
        if(currMenuPos === -1) {return}
        //store the current window in glow window until the menubar animation ends
        glowWindow.set(currWindow);
        $glowWindow = $glowWindow;
        hide=true;
        //if the current window is not visible then return and dont animate

        //current menubar item position information
        let domButtonPos = (document.querySelectorAll(".appMinimized")[currMenuPos]).getBoundingClientRect();

        //uh why tho
        const element = document.createElement("div");
        document.body.appendChild(element);

        //calculate 1/3rd into the button
        //the location that the window will go into
        let buttonMidPt = domButtonPos.left + (domButtonPos.width/3);
        let styles = getComputedStyle(remPos);
        let left = parseInt(styles.left);
        let bottom = parseInt(styles.bottom);
        let height = parseInt(styles.height);
        let width = parseInt(styles.width);
        //offset the amount it needs to move from where it is right now
        //these variables will be put into css variables
        menuX = (buttonMidPt - (left + width/2))-15;
        menuY = bottom + height;

        //select rembox and wait for the current animation to end..
        let pickWindow = currMenuPos;
        // if(windowIndex === -1){pickWindow = 0}
        let elem = document.querySelector(`.remBoxMobile.File-System${windowIndex}`);
        // console.log(elem);
        
        //animation is over stop glow window
        elem.addEventListener("animationend", function() {
            let currWindow = "File System";
            //if the winddow is a subWindow then append the number to the end of the string
            // if(windowIndex !== -1){
            //     currWindow = currWindow+(windowIndex);
            // }
            let currMenuPos = $writableArray.indexOf(currWindow);
            let domButtonPos = document.querySelectorAll(".appMinimized")[currMenuPos];
        
            glowWindow.reset();
            $glowWindow = $glowWindow;}, false);

    }


</script>
<svelte:window bind:innerWidth={maxX} bind:innerHeight={maxY} />
    <div class="remBoxMobile File-System{windowIndex}" style="
        position:fixed;
        left:{BoxX}px; top:{BoxY}px;
        z-index: {zIdx};
        --menuX: {menuX}px;
        --menuY: {menuY}px;
        width: {width}px;
        cursor: unset !important;
    " on:mousedown={() => {
        if(!hide){
             zIdx = incrementCount(zIdx, $count, count, "File System");
        }
        else{
            zIdx = zIdx;
        }
    }} class:classname={hide} bind:this={remPos}>
        <div class="title-bar fileGridBar windowBar " style="width: calc(100% - 2px);" bind:clientWidth={w} bind:clientHeight={h}
             use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:26, maxX:window.innerWidth-20, maxY: window.innerHeight-70}}>
            <div class="title-bar-text"
                 style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: 4px;">
                <span class="filesBarText">File Explorer</span>
            </div>
            <div class="title-bar-controls" style="position: relative;float: right;margin-right: 5px;padding-top: 5px;">
                <button class="minimize" style="min-width: 15px;" aria-label="Minimize"
                        on:mousedown|capture|preventDefault={() => handleMinimize()} on:touchstart|capture|preventDefault={() => handleMinimize()}></button>
                <button class="full" style="min-width: 15px;margin-left: 2px;"
                        aria-label="Maximize"></button>
                <button class="close" style="min-width: 15px;" aria-label="Close"
                        on:mousedown|capture|preventDefault={forward} on:touchstart|capture|preventDefault={forward}></button>
            </div>
        </div>

        <div style="border: 1px solid #000000;display: inline-block;width: inherit;margin-top: -6px">

            <fieldset class="fileMenuTop" style="margin-bottom: 0px;display: flex;align-items: center">
                <button class="backButton" style="margin-left:1px;width:fit-content" on:click={thisWindow.goUp}>
                    <img src="https://win98icons.alexmeub.com/icons/png/unplug_storage-0.png" class="pathIcon"
                         style="width:20px;height:20px;margin-bottom:6px;margin-left:-2px"/>
                    <span class="moveText" style="margin-right: 0px">Back</span>
                </button>


                <button class="backButton" style="margin-right: 0px;width:fit-content" on:click={thisWindow.goUp}>
                    <img src="https://win98icons.alexmeub.com/icons/png/tree-0.png" class="pathIcon"
                         style="width:20px;height:20px;margin-bottom:6px;margin-left:0px"/>
                    <span class="moveText" style="margin-right: 6px">Other</span>
                </button>

                <button class="backButton" style=";margin-right: 0px;width:fit-content" on:click={thisWindow.goHome}>
                    <img src="https://win98icons.alexmeub.com/icons/png/address_book_home.png" class="pathIcon"
                         style="width:20px;height:20px;margin-bottom:6px;margin-left:0px"/>
                    <span class="moveText" style="margin-right: 6px">Home</span>
                </button>
                <button class="backButton" style="margin-right: 0px;width:fit-content;flex: 0 0 auto;" on:click|preventDefault|capture={newWindow}>
                    <img src="https://win98icons.alexmeub.com/icons/png/web_file_set-0.png" class="pathIcon"
                         style="width:20px;max-height:20px;min-height:20px;margin-bottom:6px;margin-left:-2px;margin-right:-4px"/>
                    <span class="moveText" style="margin-right: 6px">New Window</span>
                </button>
                <button class="backButton" style="margin-right:1px;min-width: 60px">
                    <img src="https://win98icons.alexmeub.com/icons/png/file_lines-1.png" alt="small file icon"
                         class="pathIcon" style="width:20px;height:20px;margin-bottom:6px;margin-left:-6px"/>
                    <span class="moveText">List view</span>
                </button>
            </fieldset>


            <div class="window myWindow"
                 style="width: calc(100% - 14px);background: white;margin-left: 0px;border: 4px solid #c0c0c0!important;box-shadow: inset -1px -1px #000000, inset 1px 1px #0a0a0a, inset -2px -2px #808080, inset 2px 2px #dfdfdf;">


                <div class="window-body">

                    <SysWindowContent bind:this={thisWindow} bind:path={currentPath}/>

                </div>


                <fieldset class="fileMenuBottom" style="transform: translateY(-2px);">
                    <div class="status-bar">
                        <span class="status-bar-field"><span style="position:absolute;transform: translateY(-5px);">
                            <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-2.png"
                                 alt="small file icon" class="pathIcon"/>
                            {currentPath}
                        </span></span>
                    </div>
                </fieldset>
            </div>

        </div><!--window ends -->

    </div>
<style>
    div{
        -webkit-touch-callout:none;
        -ms-touch-action:none; touch-action:none;
    }
    @keyframes move {
        50%, 100% {
            transform: translate(var(--menuX), 0) translate(0, var(--menuY)) scale(.1) ;
        }
        0% {
            transform: translate(0, 0) translate(0, 0) scale(1);
        }
        10% {
            transform: translate(calc(var(--menuX) / 1.1), 0) translate(calc(var(--menuY) / 10), 0) scale(.25);
        }
    }
    @keyframes animatedgradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .classes{
        -webkit-animation-name: glow, animatedgradient;
        z-index: -1;
        background-size: 300% 300%;
        -webkit-animation-duration: 180ms;
        -webkit-animation-iteration-count: 2;
        -webkit-animation-timing-function: linear;
        -webkit-animation-direction: alternate;
        -webkit-animation-delay: 35ms;
    }
    @keyframes glow {
        from {
            box-shadow: 10px 10px 0px rgb(26 26 101);
        }
        to {
            box-shadow: 0px -10px 35px rgb(26 26 101);
        }
    }
    .classname {
        -webkit-animation-name: move;
        -webkit-animation-duration: 840ms;
        -webkit-animation-iteration-count: 1;
        -webkit-animation-timing-function: linear;
        -webkit-animation-fill-mode: forwards;
    }

    .moveText {
        display: inline-block;
        transform: translate(2px, -7px);
    }

    .backButton {
        flex: 1;
        position: relative;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
        color: black;
        padding-left: 4px;
        margin-bottom: -1px;
        margin-top: 3px;
        align-items: center;
        background: #c0c0c0;
        min-width: 60px;
    }

    .myFileButton {
        background-position: 1px 1px;
        background-image: url(https://98.js.org/images/browse-ui-icons.png);
        /* margin: 0; */
        padding: 2px 3px;
        /* padding-left: 10px; */
        width: 16px;
        margin-right: 0px;
        height: 21px;
        top: 2px;
        margin-top: -2px;
        margin-bottom: -4px;
    }

    .pathIcon {
        position: relative;
        transform: translateY(4px);
        margin-right: -2px;
    }

    .filesBarText {
        display: inline-block;
        transform: translateY(-5.0px);
        font-size: 10px;
    }
</style>
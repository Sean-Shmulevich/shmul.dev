<script context="module">
    import {quartOut} from "svelte/easing";

    export function fade(node, {
        delay = 80,
        duration = 1000,
        easing = quartOut,
    }) {
        const w = getComputedStyle(node).width;
        const h = getComputedStyle(node).height;

        //check the store to find what order the array is in to find the exact position to go into.
        //the data may only be available in app. make a store that gets sent then wiped with this data.

        const aboutTheLengthToTheBottom = parseInt(getComputedStyle(node).bottom) + parseInt(h);
        const aboutTheLengthToTheLeft = parseInt(getComputedStyle(node).left) + parseInt(w)/2;
        const xTranslate = (u) => u*aboutTheLengthToTheLeft;
        const yTranslate = (u) => {
            return u * aboutTheLengthToTheBottom;
        };
        return {
            delay,
            duration,
            easing,
            //scale y down faster then your are scaling x this will allow you to squash the object
            //or use rotateX .2 also to squash the y values.rotateX(.2turn)
            //skew(${u*80}deg)
            css: (t,u) => `transform: translate(${xTranslate(-u)}px, ${yTranslate(u)}px) scale(${t},${t})`
        };
    }

    export function incrementCount(zIdx, currMaxZ, currStore, name) {
        if (zIdx > currMaxZ["zIdx"]) {
        } else if (zIdx == currMaxZ["zIdx"]) {
            zIdx += 2;
        } else {
            zIdx = currMaxZ["zIdx"] + 1;
        }
        currStore.set({zIdx, name});
        return zIdx;
    };
</script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import SysWindowContent from './SysWindowContent.svelte'
    import {createEventDispatcher} from 'svelte';
    import {asDraggable} from 'svelte-drag-and-drop-actions'

    import {count} from '../stores/zIndex.js';
    import {glowWindow} from "../stores/keep.js";
    import {writableArray} from "../stores/minimized.js";

    export let zIdx = 0;
    let BoxX = 200, BoxY = 200;//starting coords

    function onDragStart () { return { x:BoxX,y:BoxY} }
    function onDragMove (x,y, dx,dy) { BoxX = x; BoxY = y }
    function onDragEnd  (x,y, dx,dy) { BoxX = x; BoxY = y }

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
    }
    function newWindow(event) {
        dispatch('newWin', event.detail);
    }


    export let hide = false;

    let currentPath;//currentPath
    let thisWindow;//theCurrent window

    //not a pure function.
    let animation = {fn: fade};
    function maybe(node, options) {
        if (hide) {
            return options.fn(node, options);
        }
    }

    let menuX, menuY;
    let remPos;

    function handleMinimize(){
        glowWindow.set("File System");
        hide=true;
        let currMenuPos = $writableArray.indexOf("File System");
        if(currMenuPos === -1) return
        let domButtonPos = (document.querySelectorAll(".appMinimized")[currMenuPos]).getBoundingClientRect();

        const element = document.createElement("div");
        document.body.appendChild(element);


        let buttonMidPt = domButtonPos.left + (domButtonPos.width/3);
        let styles = getComputedStyle(remPos);
        let left = parseInt(styles.left);
        let bottom = parseInt(styles.bottom);
        let height = parseInt(styles.height);
        let width = parseInt(styles.width);
        menuX = (buttonMidPt - (left + width/2))-15;
        menuY = bottom + height;

        let elem = document.querySelector(".remBoxMobile");
        elem.addEventListener("animationend", function() {glowWindow.reset()}, false);

    }
    let maxX = 0;
    let maxY = 0;

    let w;
    let h;
</script>
<svelte:window bind:innerWidth={maxX} bind:innerHeight={maxY} />
    <div class="remBoxMobile" style="
        position:fixed;
        left:{BoxX}px; top:{BoxY}px;
        z-index: {zIdx};
        --menuX: {menuX}px;
        --menuY: {menuY}px;
        cursor: unset !important;
    " on:mousedown={() => {
        if(!hide){
             zIdx = incrementCount(zIdx, $count, count, "File System");
        }
        else{
            zIdx = zIdx;
        }
    }} class:classname={hide} bind:this={remPos}>
        <div class="title-bar fileGridBar windowBar " bind:clientWidth={w} bind:clientHeight={h}
             use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:26, maxX:maxX-415, maxY: maxY-410}}>
            <div class="title-bar-text"
                 style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: 4px;">
                <span class="filesBarText">File Explorer</span>
            </div>
            <div class="title-bar-controls" style="position: relative;float: right;margin-right: 5px;padding-top: 5px;">
                <button class="minimize" style="min-width: 15px;" aria-label="Minimize"
                        on:mousedown|capture={() => handleMinimize()} on:touchstart={() => handleMinimize()}></button>
                <button class="full" style="min-width: 15px;margin-left: 2px;"
                        aria-label="Maximize"></button>
                <button class="close" style="min-width: 15px;" aria-label="Close"
                        on:mousedown={forward} on:touchstart={forward}></button>
            </div>
        </div>

        <div style="border: 1px solid #000000;display: inline-block;width: 414px;margin-top: -6px">

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
                <button class="backButton" style="margin-right:1px;">
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
        position: relative;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
        color: black;
        padding-left: 4px;
        margin-bottom: -1px;
        margin-top: 3px;
        align-items: center;
        background: #c0c0c0;
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
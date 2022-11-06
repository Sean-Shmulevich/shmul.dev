<script>
    import {createEventDispatcher} from 'svelte';
    import {asDraggable} from 'svelte-drag-and-drop-actions'

    import {count} from '../stores/zIndex.js';
    import {glowWindow} from '../stores/keep.js';
    import {fade, incrementCount} from "./SysWindow.svelte"
    import {onMount} from 'svelte';
    import {writableArray} from "../stores/minimized.js";


    export let zIdx = 0;
    let BoxX = 200, BoxY = 200;//starting coords

    function onDragStart() {
        return {x: BoxX, y: BoxY}
    }

    function onDragMove(x, y, dx, dy) {
        BoxX = x;
        BoxY = y
    }

    function onDragEnd(x, y, dx, dy) {
        BoxX = x;
        BoxY = y
    }

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
    }


    export let hide = false;

    let remBox;
    //not a pure function.
    let animation = {fn: fade};

    function maybe(node, options) {
        if (hide) {
            return options.fn(node, options);
        }
    }

    let menuX, menuY;

    function handleMinimize(){
        let currMenuPos = $writableArray.indexOf("Js Paint");
        if(currMenuPos === -1) return
        glowWindow.set("Js Paint");
        $glowWindow = $glowWindow;
        hide=true;
        let domButtonPos = (document.querySelectorAll(".appMinimized")[currMenuPos]).getBoundingClientRect();


        let buttonMidPt = domButtonPos.left + (domButtonPos.width/3);
        let styles = getComputedStyle(remBox);
        let left = parseInt(styles.left);
        let bottom = parseInt(styles.bottom);
        let height = parseInt(styles.height);
        let width = parseInt(styles.width);
        menuX = (buttonMidPt - (left + width/2))-20;
        menuY = bottom + height;

        let elem = document.querySelector(".remBoxMobile");
        elem.addEventListener("animationend", function() {glowWindow.reset();$glowWindow = $glowWindow;}, false);
    }

    function maybeDontIncrement(){
        if(!hide){
            zIdx = incrementCount(zIdx, $count, count, "Js Paint");
        }
        else{
            zIdx = zIdx;
        }
    }

</script>
    <div class="remBoxMobile" style="
        position:fixed;
        left:{BoxX}px; top:{BoxY}px;
        --currX: {BoxX}px;
        --currY: {BoxY}px;
        --menuX: {menuX}px;
        --menuY: {menuY}px;
        z-index: {zIdx};
        resize: both;
        overflow: hidden;
        height: 500px;
        width: 350px;
        max-height: 625px;
        max-width: 833px;
        min-width: 200px;
        min-height: 250px;
    " on:mousedown={maybeDontIncrement} class:classname={hide} bind:this={remBox}>
        <div class="title-bar fileGridBar windowBar " style="width:unset"
             use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:0}}>
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

        <div style="border: 1px solid #000000;display: inline-block;width: 100%;margin-top: -6px; height: inherit;max-height: 625px;">


            <div class="window myWindow"
                 style="max-height: 625px;height: inherit;width: calc(100% - 14px);background: white;margin-left: 0px;border: 4px solid #c0c0c0!important;box-shadow: inset -1px -1px #000000, inset 1px 1px #0a0a0a, inset -2px -2px #808080, inset 2px 2px #dfdfdf;">


                <div class="window-body" style="height: calc(100% - 35px);margin:0px">

                    <iframe class:mouseOn={zIdx === $count['zIdx']} src="https://jspaint.app" style="width: 100%;height: 100%;pointer-events: none;"></iframe>;
                    https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css

                </div>
            </div>

        </div><!--window ends -->

    </div>
<style>

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
        -webkit-animation-duration: 850ms;
        -webkit-animation-iteration-count: 1;
        -webkit-animation-timing-function: linear;
        -webkit-animation-fill-mode: forwards;
    }


    /*.hideToMenuBar {*/
    /*    -webkit-animation-name: backOutDown;*/
    /*    animation-name: backOutDown;*/
    /*}*/
    .mouseOn {
        pointer-events: all !important;
    }

    :global(.jspaint) {
        background: rgb(174, 168, 217) !important;
    }
</style>
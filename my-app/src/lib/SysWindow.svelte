<script context="module">
    import DragDropTouch from 'svelte-drag-drop-touch'
    import {asDraggable} from 'svelte-drag-and-drop-actions'
</script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import SysWindowContent from './SysWindowContent.svelte'
    import {createEventDispatcher} from 'svelte';

    import {count} from '../stores/zIndex.js';
    import {writableArray} from '../stores/minimized.js';
    import {fly} from "svelte/transition";
    import {quintOut} from "svelte/easing";

    export let zIdx = 0;

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
    }

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

    export const incrementCount = () => {
        if (zIdx > $count) {
            count.set(zIdx);
            console.log($count);
        } else if (zIdx == $count) {
            zIdx += 2;
            count.set(zIdx);
        } else {
            zIdx = $count + 1;
            count.set(zIdx);
        }
        return zIdx;
    };
    export let hide = false;

    //function wrapper so cool and solid im glad I found this
    function maybe(node, options) {
        if (hide) {
            return options.fn(node, options);
            //how do I use minimized.js in order to show conditionally set hide back.
            //i need the knowledge of if it is currently on the screen or not.
            //but if i just check that its in the store then i can just flip hide?
        }
    }

    let currentPath;

    let animation = {fn: fly, delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut};
</script>
{#if !hide}
    <div class="remBoxMobile" style="
        position:fixed;
        left:{BoxX}px; top:{BoxY}px;
        z-index: {zIdx};
    " on:mousedown={incrementCount} out:maybe={animation}>
        <div class="title-bar fileGridBar windowBar " style="cursor:move"
             use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:0}}>
            <div class="title-bar-text"
                 style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: 4px;">
                <span class="filesBarText">File Explorer</span>
            </div>
            <div class="title-bar-controls" style="position: relative;float: right;margin-right: 5px;padding-top: 5px;">
                <button class="minimize" style="min-width: 15px;" aria-label="Minimize"
                        on:click={() => hide=true}></button>
                <button class="full" style="min-width: 15px;margin-left: 2px;"
                        aria-label="Maximize"></button>
                <button class="close" style="min-width: 15px;" aria-label="Close"
                        on:mousedown={forward}></button>
            </div>
        </div>

        <div style="border: 1px solid #000000;display: inline-block;width: 414px;margin-top: -6px">

            <fieldset class="fileMenuTop" style="margin-bottom: 0px;display: flex;align-items: center">
                <button class="backButton" style="margin-left:1px;width:fit-content">
                    <img src="https://win98icons.alexmeub.com/icons/png/unplug_storage-0.png" class="pathIcon"
                         style="width:20px;height:20px;margin-bottom:6px;margin-left:-2px"/>
                    <span class="moveText" style="margin-right: 0px">Back</span>
                </button>


                <button class="backButton" style="margin-right: 0px;width:fit-content">
                    <img src="https://win98icons.alexmeub.com/icons/png/tree-0.png" class="pathIcon"
                         style="width:20px;height:20px;margin-bottom:6px;margin-left:0px"/>
                    <span class="moveText" style="margin-right: 6px">Other</span>
                </button>


                <button class="backButton" style=";margin-right: 0px;width:fit-content">
                    <img src="https://win98icons.alexmeub.com/icons/png/address_book_home.png" class="pathIcon"
                         style="width:20px;height:20px;margin-bottom:6px;margin-left:0px"/>
                    <span class="moveText" style="margin-right: 6px">Home</span>
                </button>
                <button class="backButton" style="margin-right: 0px;width:fit-content;flex: 0 0 auto;">
                    <img src="https://win98icons.alexmeub.com/icons/png/web_file_set-0.png" class="pathIcon"
                         style="width:20px;max-height:20px;min-height:20px;margin-bottom:6px;margin-left:-2px"/>
                    <span class="moveText" style="margin-right: 6px">New Window</span>
                </button>
                <button class="backButton" style="margin-right:2px;">
                    <img src="https://win98icons.alexmeub.com/icons/png/file_lines-1.png" alt="small file icon"
                         class="pathIcon" style="width:20px;height:20px;margin-bottom:6px;margin-left:-6px"/>
                    <span class="moveText">List view</span>
                </button>
            </fieldset>


            <div class="window myWindow"
                 style="background: white;width: 400px;margin-left: 0px;border: 4px solid #c0c0c0!important;box-shadow: inset -1px -1px #000000, inset 1px 1px #0a0a0a, inset -2px -2px #808080, inset 2px 2px #dfdfdf;">


                <div class="window-body">

                    <SysWindowContent bind:path={currentPath}/>

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
{/if}
<style>
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
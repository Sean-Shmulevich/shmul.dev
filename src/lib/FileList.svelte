<script context="module">
    import DragDropTouch from 'svelte-drag-drop-touch'
    import {asDraggable} from 'svelte-drag-and-drop-actions'
</script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import {createEventDispatcher} from 'svelte';

    import {count} from '../stores/zIndex.js';
    import {writableArray} from "../stores/minimized.js";
    import {fly} from "svelte/transition";
    import {quintOut} from "svelte/easing";

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
    }

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


    function incrementCount() {
        if (zIdx > $count) {
            count.set(zIdx);
        } else if (zIdx == $count) {
            zIdx += 2;
            count.set(zIdx);
        } else {
            zIdx = $count + 1;
            count.set(zIdx);
        }
    }
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
    let animation = {fn: fly, delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut};

</script>
{#if !hide}
<div class="linksBox" id="windowOutter" style="
         position:fixed;
         left:{BoxX}px;
         top:{BoxY}px;
         cursor:move;
         z-index: {zIdx};" on:mousedown={incrementCount} out:maybe={animation}>


    <div class="title-bar linksBar windowBar"
         use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd,  minX:0,minY:0}}>
        <div class="title-bar-text"
             style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: 4px;">A Window With A
            Status Bar
        </div>
        <div class="title-bar-controls" style="float: right;margin-right: 5px;padding-top: 5px;">
            <button class="minimize" style="min-width: 15px;background-color: #ff2121;" aria-label="Minimize" on:click={() => hide=true}></button>
            <button class="full" style="min-width: 15px;margin-left: 2px;background-color: #ffcf21;"
                    aria-label="Maximize"></button>
            <button class="close" on:mousedown={forward}
                    style="min-width: 15px;background-color: #21ff3f;" aria-label="Close"></button>
        </div>
    </div>

    <div style="border: 1px solid #000000;display: inline-block;width: inherit;">

        <fieldset class="fileMenuTop" style="margin-bottom: 0px;">
            <div class="status-bar">
                <p class="status-bar-field">Press F1 for help</p>
                <p class="status-bar-field">Slide 1</p>
                <p class="status-bar-field">CPU Usage: 14%</p>
            </div>
        </fieldset>


        <div class="window myWindow linksWindow">


            <hr>
            <div class="window-body">

                <div class="fileMenuItem">
                    <img id="fileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>

                    <p style="margin-left: 26px;">github</p>
                    <p style="margin: auto;">3Kb</p>
                    <p style="margin-left: 26px;">public</p>

                </div>
                <hr>

                <div class="fileMenuItem">
                    <img id="fileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>

                    <p style="margin-left: 26px;">LinkedIn</p>
                    <p style="margin: auto;">3Kb</p>
                    <p style="margin-left: 26px;">public</p>

                </div>

                <hr>


                <div class="fileMenuItem">
                    <img id="fileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>

                    <p style="margin-left: 26px;">Contact Info</p>
                    <p style="margin: auto;">3Kb</p>
                    <p style="margin-left: 26px;">public</p>

                </div>


            </div><!--window ends-->

            <fieldset class="fileMenuBottom" style="margin-top: -2px;">
                <div class="status-bar">
                    <p class="status-bar-field">Press F1 for help</p>
                    <p class="status-bar-field">Slide 1</p>
                    <p class="status-bar-field">CPU Usage: 14%</p>
                </div>
            </fieldset>
        </div>

    </div>

</div>
{/if}
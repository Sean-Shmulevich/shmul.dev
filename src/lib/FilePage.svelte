<script context="module">
    import  DragDropTouch  from 'svelte-drag-drop-touch'
    import { asDraggable } from 'svelte-drag-and-drop-actions'
</script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import {createEventDispatcher} from 'svelte';

    import { count } from '../stores/zIndex.js';
    import { writableArray } from '../stores/minimized.js';
    import {fly} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    export let zIdx = 0;

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
    }

    let BoxX = 200, BoxY = 200;//starting coords
    function onDragStart () { return { x:BoxX,y:BoxY} }
    function onDragMove (x,y, dx,dy) { BoxX = x; BoxY = y }
    function onDragEnd  (x,y, dx,dy) { BoxX = x; BoxY = y }

    export const incrementCount = () => {
        if(zIdx > $count){
            count.set(zIdx);
        }
        else if(zIdx == $count){
            zIdx += 2;
            count.set(zIdx);
        }
        else {
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
    let animation = {fn: fly, delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut};
</script>
{#if !hide}
<div class="remBoxMobile" style="
        position:fixed;
        left:{BoxX}px; top:{BoxY}px;
        z-index: {zIdx};
    " on:mousedown={incrementCount} out:maybe={animation}>
    <div class="title-bar fileGridBar windowBar" style="cursor:move" use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:0}}>
      <div class="title-bar-text" style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: 4px;">A Window With A Status Bar</div>
      <div class="title-bar-controls" style="position: relative;float: right;margin-right: 5px;padding-top: 5px;">
        <button class="minimize" style="min-width: 15px;background-color: #ff2121;" aria-label="Minimize" on:click={() => hide=true}></button>
        <button class="full" style="min-width: 15px;margin-left: 2px;background-color: #ffcf21;" aria-label="Maximize"></button>
        <button class="close" style="min-width: 15px;background-color: #21ff3f;" aria-label="Close" on:mousedown={forward}></button>
      </div>
    </div>
  
    <div style="border: 1px solid #000000;display: inline-block;width: 414px;margin-top: -6px">
  
      <fieldset class="fileMenuTop" style="margin-bottom: 0px;">
        <div class="status-bar">
          <p class="status-bar-field">Press F1 for help</p>
          <p class="status-bar-field">Slide 1</p>
          <p class="status-bar-field">CPU Usage: 14%</p>
        </div>
        </fieldset>
      
        
          <div class="window myWindow" style="background: white;width: 400px;margin-left: 0px;border: 4px solid #c0c0c0!important;box-shadow: inset -1px -1px #000000, inset 1px 1px #0a0a0a, inset -2px -2px #808080, inset 2px 2px #dfdfdf;">
            
            
  
            <div class="window-body" >
  
                <div class="menuItem">
                      <div class="exploreIcon">
                        <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
                        <p id="filetext">hello</p>
                      </div>
                      
                      <div class="exploreIcon">
                        <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
                        <p id="filetext">hello</p>
                      </div>
                      <div class="exploreIcon">
                        <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
                        <p id="filetext">hello</p>
                      </div>
                      <div class="exploreIcon">
                        <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
                        <p id="filetext">hello</p>
                      </div>
                </div>
  
  
        <div class="menuItem">
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
          
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
        </div>
  
  
        <div class="menuItem">
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
          
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
          <div class="exploreIcon">
            <img id="menuFileIcon" src="https://cdn-icons-png.flaticon.com/512/124/124837.png"/>
            <p id="filetext">hello</p>
          </div>
  
        </div>
  
        
  
  
  
            </div><!--window ends -->
  
            <fieldset class="fileMenuBottom" style="transform: translateY(-2px)">
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
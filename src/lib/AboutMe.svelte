<script context="module">
    import  DragDropTouch  from 'svelte-drag-drop-touch'
    import { asDraggable } from 'svelte-drag-and-drop-actions'
  </script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';

    import { count } from '../stores/zIndex.js';
    import {createEventDispatcher} from "svelte";
    import {fly} from "svelte/transition";
    import {quartOut, quintOut} from "svelte/easing";

    export let zIdx;
    let BoxX = 200, BoxY = 200;//starting coords
    function onDragStart ()          { return { x:BoxX,y:BoxY} }
    function onDragMove (x,y, dx,dy) { BoxX = x; BoxY = y }
    function onDragEnd  (x,y, dx,dy) { BoxX = x; BoxY = y }

    function incrementCount() {
        if(zIdx > $count){
            count.set(zIdx);
            console.log($count);
        }
        else if(zIdx == $count){
            zIdx += 2;
            count.set(zIdx);
        }
        else {
            zIdx = $count + 1;
            count.set(zIdx);
        }
	}
    let value = "Hello";

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
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

    function fade(node, {
        delay = 80,
        duration = 1000,
        easing = quartOut,
    }) {
        const o = +getComputedStyle(node).opacity;
        const w = getComputedStyle(node).width;
        const h = getComputedStyle(node).height;
        console.log(getComputedStyle(node).top);
        console.log(getComputedStyle(node).left);

        //check the store to find what order the array is in to find the exact position to go into.
        //the data may only be available in app. make a store that gets sent then wiped with this data.

        const aboutTheLengthToTheBottom = parseInt(getComputedStyle(node).bottom) + parseInt(h);
        const aboutTheLengthToTheLeft = parseInt(getComputedStyle(node).left) + parseInt(w)/2;
        const xTranslate = (u) => u*aboutTheLengthToTheLeft;
        const yTranslate = (u) => {
            return u * aboutTheLengthToTheBottom;
        };
        console.log(`transform: translate(${xTranslate}, ${yTranslate})`);
        return {
            delay,
            duration,
            easing,
            //scale y down faster then your are scaling x this will allow you to squash the object
            //or use rotateX .2 also to squash the y values.rotateX(.2turn)
            //skew(${u*80}deg)
            css: (t,u) => `transform: translate(${xTranslate(-u)}px, ${yTranslate(u)}px) scale(${t/1.4},${t/1.4})`
        };
    }

    let animation = {fn: fade};
</script>

{#if !hide}
<!-- svelte-ignore missing-declaration -->
<div class="SystemMenuWrapper" style="
        background-color:lightgrey;
        position:fixed;
        outline:1px solid black;
        padding: 5px; 
        display:block;
        left:{BoxX}px; top:{BoxY}px; width:375px; height:430px;
        cursor:move;
        z-index: {zIdx};
        " on:mousedown={incrementCount} out:maybe={animation}>
    <div use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:0}} class="title-bar fileGridBar windowBar" style="width:auto" >
        <div class="title-bar-text" style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: -1px;">Overview</div>
        <div class="title-bar-controls" style="position: relative;float: right;margin-right: 5px;padding-top: 5px;">
            <button class="minimize" style="min-width: 15px;" aria-label="Minimize" on:click={() => hide=true} on:touchstart={() => hide=true}></button>
            <button class="full" style="min-width: 15px;margin-left: 2px;" aria-label="Maximize"></button>
            <button class="close" style="min-width: 15px;" aria-label="Close" on:mousedown={forward} on:touchstart={forward}></button>
        </div>
    </div>
  
  
    <div style="padding: 10px 10px 30px;height: 366px;">
  
        <div class="SubMenu">
            <div class="SubMenuTabs" style="height: 21px;z-index: 1;user-select: none;display: flex">
                    <label class="SubMenuTab radioTab" style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Hello"}>
                        <span class="menuText">Hello</span>
                    </label>
                    <label class="SubMenuTab radioTab" style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Skills"}>
                        <span class="menuText">Skills</span>
                    </label>
                    <label class="SubMenuTab radioTab" style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Social"}>
                        <span class="menuText">Social</span>
                    </label>
                    <label class="SubMenuTab radioTab" style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Credits"}>
                        <span class="menuText">Credits</span>
                    </label>
                    <label class="SubMenuTab radioTab" style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Statue"}>
                        <span class="menuText">Statue</span>
                    </label>
            </div>
    
            <div class="SubMenuBody" style="border-width: 1px;border-style: solid;border-color: white black black white;z-index: 0;padding: 20px;height: 295px">
                <div style="display: flex;flex-direction: row;">
                    <div style="width: 100%;padding: 20px;line-height: 1.5;">
                        <h2>Tech I've Built With</h2>
                        <div style="font-family: 'Apple Garamond bold'">
                            {value} Javascript, Typescript, ReactJS, Browser Extensions, Python (pandas, flask, django, selnium, scrapy), Java, ReactJS, C, Rust, SCSS, HTML5, Bash, Git, ZSH.
                        </div>
                    </div>
                </div>
            </div>
        </div>
  
        <button class="CloseButton submit">Cancel</button>
        <button class="CloseButton submit">OK</button>
    </div>
  
  
  </div>
<style>
    .radioTab {
        cursor: pointer;
        display: inline-block;
        font-size: 0.85rem;
        padding: 3px 12px 0px;
        margin-right: 3px;
        background: lightGrey;
        border-top: 1px solid white;
        border-right: 1px solid black;
        border-bottom: none;
        height: 18px;
        border-left: 1px solid white;
        transform:translateY(-1px);
        border-radius: 2px 2px 0px 0px;
    }
    :global([draggable]) {
        -webkit-touch-callout:none;
        -ms-touch-action:none; touch-action:none;
        -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
    }
    .menuText{
        font-family: 'Apple Garamond bold';
        font-size: 0.88rem;
        display: block;
        margin-top: -29px;
        margin-left:2px;
        margin-right:2px;
        cursor: pointer;
    }
    h2{
        font-family: 'Apple Garamond bold';
    }
    .SubMenuTab{
        font-family: 'Apple Garamond bold';
    }
    .submit {
        color:black;
        font-family: "Apple Garamond bold italic";
        font-size: 1rem;
        cursor: pointer;
        width: 75px;
        height: 23px;
        float: right;
        border-width: 1px;
        border-style: solid;
        border-color: white black black white;
        margin-top: 5px;
        background: none;
    }
</style>
{/if}
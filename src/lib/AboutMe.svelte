<script>
    import '../css/98.css';
    import '../css/myStyle.css';

    import {count} from '../stores/zIndex.js';
    import {createEventDispatcher} from "svelte";
    import {asDraggable} from 'svelte-drag-and-drop-actions'
    import  DragDropTouch  from 'svelte-drag-drop-touch'
    import {onMount, onDestroy} from 'svelte';

    //getThe zIndex and animations functions used for all windows.
    import {incrementCount, swipeStart, swipeEnd, tapHandler, touchDevice, handleMinimize} from "./SysWindow.svelte"
    import {glowWindow} from "../stores/keep.js";
    import {writableArray} from "../stores/minimized.js";

    export let zIdx;
    let mobileDblTap;
    let mobileSwipe;
    export let hide = false;
    let minFunc;
    // let animation = {fn: fade};

    let menuX, menuY;
    let aboutBox;
    export let BoxX = 200, BoxY = 120;//starting coords
    let value = "Hello";
    let maxX = 0, maxY = 0;
    let width = 375;//+13
    let height = 430;//+50

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('close', event.detail);
    }

    onMount(() => {
        minFunc = () => {[hide, menuX, menuY] = handleMinimize($writableArray, glowWindow, hide, "Overview", "#minButtOverview", "#OverviewWindow")};
        //basically a media query
        if(window.innerWidth < 460){
            BoxY = 50;
            width = 300;
            //generate 100 away from the right side of the screen this turns out to be right after the menu screen icons
            BoxX = 102;
            height = 420;
        }
        else{
            width = 375;
            height = 430;
            //wait for the window to load and then add an event listener
        }
        if(touchDevice){
            document.querySelector(".SubMenu").addEventListener("touchstart", swipeStart);
            document.querySelector(".SubMenu").addEventListener("touchend", mobileSwipe = (e) => swipeEnd(e, minFunc));
            document.getElementById("aboutBar").addEventListener("touchstart", mobileDblTap = (e) => tapHandler(e,minFunc, forward));
        }
	});

    onDestroy(() => {
        //remove the touch listeners
        if(touchDevice){
            document.querySelector(".SubMenu").removeEventListener("touchstart", swipeStart);
            document.querySelector(".SubMenu").removeEventListener("touchend", mobileSwipe);
            //double tap on bar.
            document.getElementById("aboutBar").removeEventListener("touchstart", mobileDblTap);
        }
    });
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

    function maybeDontIncrement(){
        if(!hide){
            zIdx = incrementCount(zIdx, $count, count, "Overview");
        }
        else{
            zIdx = zIdx;
        }
    }
</script>
<svelte:window bind:innerWidth={maxX} bind:innerHeight={maxY} />
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div id="OverviewWindow" class="SystemMenuWrapper" style="
        background-color:lightgrey;
        position:fixed;
        outline:1px solid black;
        padding: 5px; 
        display:block;
        left:{BoxX}px;
        top:{BoxY}px;
        width:{width}px;
        height:{height}px;
        z-index: {zIdx};
        --menuX: {menuX}px;
        --menuY: {menuY}px;

        " tabindex="0" on:mousedown={maybeDontIncrement} class:classname={hide} bind:this={aboutBox}>
        <div id="aboutBar" use:asDraggable={{ onlyFrom: '.title-bar', relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:29, maxX:window.innerWidth, maxY: window.innerHeight-70}}
             class="title-bar fileGridBar windowBar" style="width:auto">
            <div class="title-bar-text"
                 style="text-align:right;float:left;font-size: 10px;margin-left: 10px;margin-top: -1px;">Overview
            </div>
            <div class="title-bar-controls" style="position: relative;float: right;margin-right: 5px;padding-top: 5px;">
                <button class="minimize" style="min-width: 15px;" aria-label="Minimize" on:mousedown|capture={minFunc}
                        on:touchstart={minFunc}></button>
                <button class="full" style="min-width: 15px;margin-left: 2px;" aria-label="Maximize"></button>
                <button class="close" style="min-width: 15px;" aria-label="Close" on:mousedown={forward}
                        on:touchstart={forward}></button>
            </div>
        </div>


        <div style="padding: 10px 10px 30px;height: 366px;">

            <div class="SubMenu">
                <div class="SubMenuTabs" style="height: 21px;z-index: 1;user-select: none;display: flex">
                    <label class="SubMenuTab radioTab" class:selectedTab={value === "Hello"} style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Hello"}>
                        <span class="menuText">Hello</span>
                    </label>
                    <label class="SubMenuTab radioTab" style="display: unset" class:selectedTab={value === "Skills"} >
                        <input type=radio bind:group={value}  name="scoops" value={"Skills"}>
                        <span class="menuText">Skills</span>
                    </label>
                    <label class="SubMenuTab radioTab" class:selectedTab={value === "Social"} style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Social"}>
                        <span class="menuText">Social</span>
                    </label>
                    <label class="SubMenuTab radioTab" class:selectedTab={value === "Credits"} style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Credits"}>
                        <span class="menuText">Credits</span>
                    </label>
                    <label class="SubMenuTab radioTab" class:selectedTab={value === "Statue"} style="display: unset">
                        <input type=radio bind:group={value} name="scoops" value={"Statue"}>
                        <span class="menuText">Statue</span>
                    </label>
                </div>

                <div class="SubMenuBody"
                     style="border-width: 1px;border-style: solid;border-color: white black black white;z-index: 0;padding: 20px;height: 295px">
                    <div style="display: flex;flex-direction: row;">
                        <div style="width: 100%;padding: 20px;line-height: 1.5;">
                            {#if value == "Hello"}
                            <h2>Tech I've Built With</h2>
                            <div style="font-family: 'Apple Garamond bold';font-size:0.9rem">
                                    python (django, selnium, scrapy, pandas, Flask), Java, Typescript, Javascript (Node.js, React, Svelte), C, Rust, SCSS, Tailwind Css, Bash, Git, ZSH, regular expressions.
                                </div>
                            {:else if value === "Skills"}
                                <h2>{value} </h2>
                                django, selnium, scrapy), Java, ReactJS, C, Rust, SCSS, HTML5, Bash, Git, ZSH.
                                <div style="font-family: 'Apple Garamond bold'">
                                    {value} Javascript, Typescript, ReactJS, Browser Extensions, Python (pandas, flask,
                                </div>
                            {:else if value === "Social"}
                                <h2>{value} </h2>
                                django, selnium, scrapy), Java, ReactJS, C, Rust, SCSS, HTML5, Bash, Git, ZSH.
                                <div style="font-family: 'Apple Garamond bold'">
                                    {value} Javascript, Typescript, ReactJS, Browser Extensions, Python (pandas, flask,
                                </div>
                            {:else if value === "Credits"}
                                <h2>{value} </h2>
                                django, selnium, scrapy), Java, ReactJS, C, Rust, SCSS, HTML5, Bash, Git, ZSH.
                                <div style="font-family: 'Apple Garamond bold'">
                                    {value} Javascript, Typescript, ReactJS, Browser Extensions, Python (pandas, flask,
                                </div>
                            {:else if value === "Statue"}
                                <h2>{value} </h2>
                                django, selnium, scrapy), Java, ReactJS, C, Rust, SCSS, HTML5, Bash, Git, ZSH.
                                <div style="font-family: 'Apple Garamond bold'">
                                    {value} Javascript, Typescript, ReactJS, Browser Extensions, Python (pandas, flask,
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <button class="CloseButton submit">Cancel</button>
            <button class="CloseButton submit">OK</button>
        </div>


    </div>
    <style>
        @media (max-width: 460px) {
            .SubMenuTabs{transform: scale(.86) translateX(-22px);}
            .SubMenuBody{height: 255px !important;}
            .SystemMenuWrapper{height: 383px !important;width:300px !important}
            .SubMenuBody > div > div > h2{margin-top: -16px;}
        }
        @media (min-width: 460px) {
            .SystemMenuWrapper{width:375px !important}
        }
        .selectedTab{
            height: 19px !important;
        }

        @keyframes move {
            50%, 100% {
                transform: translate(var(--menuX), 0) translate(0, var(--menuY)) scale(.1);
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
            transform: translateY(-1px);
            border-radius: 2px 2px 0px 0px;
        }

        :global([draggable]) {
            -webkit-touch-callout: none;
            -ms-touch-action: none;
            touch-action: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .menuText {
            font-family: 'Apple Garamond bold';
            font-size: 0.88rem;
            display: block;
            margin-top: -29px;
            margin-left: 2px;
            margin-right: 2px;
            cursor: pointer;
        }

        h2 {
            font-family: 'Apple Garamond bold';
        }

        .SubMenuTab {
            font-family: 'Apple Garamond bold';
        }

        .submit {
            color: black;
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
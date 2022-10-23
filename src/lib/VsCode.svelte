<script>
    import '../css/work.css';
    import '../css/myStyle.css';
    import '../css/codicon.css';
    import '../css/terminal.css';
    import {asDraggable} from 'svelte-drag-and-drop-actions'
    import { oneDark } from '@codemirror/theme-one-dark';

    import {fade, incrementCount} from "./SysWindow.svelte"
    import CodeMirror from './CodeMirror.svelte'
    let store;
    function changeHandler({ detail: {tr} }) {
        console.log('change', tr.changes.toJSON())
    }

    import {count} from '../stores/zIndex.js';
    import {glowWindow} from '../stores/keep.js';
    import {writableArray} from "../stores/minimized.js";
    export let zIdx = 0;

    import {createEventDispatcher, afterUpdate} from 'svelte';

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
    let animation = {fn: fade};
    let vsPos;
    let menuX, menuY;

    //requires a lot of information multiples stores and a call to the dom.
    function handleMinimize(){
        glowWindow.set("VS Code");
        hide=true;
        let currMenuPos = $writableArray.indexOf("VS Code");
        if(currMenuPos === -1) return
        let domButtonPos = (document.querySelectorAll(".appMinimized")[currMenuPos]).getBoundingClientRect();

        const element = document.createElement("div");
        document.body.appendChild(element);



        console.log(domButtonPos.left, domButtonPos.width);
        let buttonMidPt = domButtonPos.left + (domButtonPos.width/2);
        let styles = getComputedStyle(vsPos);
        let left = parseInt(styles.left);
        let bottom = parseInt(styles.bottom);
        let height = parseInt(styles.height);
        let width = parseInt(styles.width);
        menuX = (buttonMidPt - (left + width/2))-15;
        menuY = bottom + height;

        let elem = document.querySelector(".vscode");
        elem.addEventListener("animationend", function() {glowWindow.reset()}, false);

    }

</script>

<div class="vscode" style="
        position: fixed;
        left:{BoxX}px; top:{BoxY}px;
        --currX: {BoxX}px;
        --currY: {BoxY}px;
        --menuX: {menuX}px;
        --menuY: {menuY}px;
        z-index: {zIdx};
        max-height: 625px;
        max-width: 833px;
        min-width: 200px;
        min-height: 250px;
" on:mousedown={() => zIdx = incrementCount(zIdx, $count, count)} class:classname={hide}  bind:this={vsPos}>
    <div class="vsAppBar"

         use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:0}}>
        <div style="margin-left: 6px;">
            <div class="fakeButtons fakeClose vsControlButtons" on:mousedown={forward}></div>
            <div class="fakeButtons fakeMinimize vsControlButtons" on:click={() => handleMinimize()}></div>
            <div class="fakeButtons fakeZoom vsControlButtons"></div>
        </div>
        <div class="barSearch">

            <div style="display:flex;width: inherit;">
                <div id="searchLeft" class='codicon codicon-arrow-left'></div>
                <div id="searchRight" class='codicon codicon-arrow-right'></div>
                <div id="searchInBox" class='codicon codicon-search'></div>
                <input class="barSearchInput" id="text17" type="text"
                       style="box-shadow: unset;border-radius: 5px;background-color: rgb(36,36,64);border: 1px solid rgb(180 153 72);"/>
            </div>
        </div>
        <div class="layoutBox">
            <div class='codicon codicon-layout vsSnapIcon' style="margin-left: 7px;"></div>
            <hr style="border-color: #898988;"/>
            <div class='codicon codicon-layout-sidebar-right-off vsSnapIcon'></div>
            <div class='codicon codicon-layout-panel-off vsSnapIcon'></div>
            <div class='codicon codicon-layout-sidebar-left-off vsSnapIcon'></div>
        </div>
    </div>
    <div class="vsWindowContent" style="display:flex;">
        <div class="vsAppCol">
            <div class='codicon codicon-files vsIcon'></div>
            <div class='codicon codicon-search vsIcon'></div>
            <div class='codicon codicon-debug-alt-small vsIcon'></div>
            <div class='codicon codicon-extensions vsIcon'></div>
            <div class='codicon codicon-symbol-namespace vsIcon'></div>
            <div class='codicon codicon-folder-opened vsIcon'></div>
            <div class='codicon codicon-account vsIconBottom' style="bottom: 34px;"></div>
            <div class='codicon codicon-settings-gear vsIconBottom' style="bottom: 5px;"></div>


        </div>



        <div class="codeAndNumbers">
            <div class="vsLineNumbers" style="display:none">

            </div>
            <div class="vsCodeWindow">
                <div class="vsText">
                    <div>
                        <CodeMirror doc={'let a = 15;\n"let a = 15;"'}
                                    bind:docStore={store}
                                    on:change={changeHandler}></CodeMirror>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="vsBottomBar">
        <div id="yellowCorner">
            <div class='codicon codicon-remote' id="teeneyRemote"></div>
        </div>
        <div class='codicon codicon-close-all' id="teenyClose"></div>
        <div class='codicon codicon-warning' id="teenyClose"></div>
        <div style="display:flex;margin-left: auto;flex-direction: row-reverse;">
            <div class='codicon codicon-bell'
                 style="color: rgb(160,151,229);margin-left: auto;margin-right: 8px;transform: scale(0.9);margin-top:1px"></div>
            <div class='codicon codicon-squirrel'
                 style="color: rgb(160,151,229);margin-left: auto;margin-right: 4px;transform: scale(0.9);margin-top:1px"></div>
            <div class='codicon codicon-terminal-powershell'
                 style="color: rgb(160,151,229);margin-left: auto;margin-right: 6px;transform: scale(0.9);margin-top:1px"></div>
            <span class=vsBarText>HTML</span>
            <span class=vsBarText>LF</span>
            <span class=vsBarText>UTF-8</span>
            <span class=vsBarText>Spaces: 4</span>
            <span class=vsBarText>Ln 140, Col 55</span>
        </div>
    </div>
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

    :global(.Codemirror) {
        display: contents;
        color: white;
        height: auto !important;
        background-color: rgb(43,43,74);
        border: 5px solid white !important;
    }
    :global(.cm-gutters){
        background-color: rgb(43,43,74) !important;
        border-right: 1px solid rgb(46,45,80) !important;
    }
    :global(.cm-gutter){
        background-color: rgb(43,43,74) !important;
    }
    :global(.cm-lineNumbers){
        background-color: rgb(43,43,74) !important;
    }
    :global(.cm-scroller){
        background-color: rgb(43,43,74) !important;
    }
    :global(.cm-activeLineGutter){
        background-color: rgb(43,43,74) !important;
    }
    :global(.cm-gutterElement){
        color: rgb(160,151,229) !important;
    }
    :global(.cm-editor){
        margin-top: -2px !important;
        max-height: 524px !important;
        height: 524px !important;
    }
     :global(.cm-focused){
         outline:unset !important;
     }






</style>
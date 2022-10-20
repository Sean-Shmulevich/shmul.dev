<script>
    import '../css/work.css';
    import '../css/myStyle.css';
    import '../css/codicon.css';
    import '../css/terminal.css';
    import {asDraggable} from 'svelte-drag-and-drop-actions'
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    import {count} from '../stores/zIndex.js';
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

    function incrementCount() {
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

{#if hide}
{:else}
<div class="vscode" style="
    position:fixed;
    left:{BoxX}px; top:{BoxY}px;
    z-index: {zIdx};
" on:mousedown={incrementCount} out:maybe={animation}>
    <div class="vsAppBar" style="cursor:move"
         use:asDraggable={{relativeTo:document.body, onDragStart, onDragMove, onDragEnd, minX:0,minY:0}}>
        <div style="margin-left: 6px;">
            <div class="fakeButtons fakeClose vsControlButtons" on:mousedown={forward}></div>
            <div class="fakeButtons fakeMinimize vsControlButtons" on:click={() => hide=true}></div>
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
                    <textarea class="scrollabletextbox" id="myTextArea" name="note">Hello World</textarea>
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
{/if}
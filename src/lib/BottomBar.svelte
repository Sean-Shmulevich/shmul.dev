<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import {writableArray} from '../stores/minimized.js';
    import {glowWindow} from '../stores/keep.js';

    import vsLogo from '../assets/windowicons/vb-bas.ico';
    import fileLogo from '../assets/windowicons/aim_fldr.ico';
    import shmulSys from '../assets/windowicons/doc_panda1.ico';

    let iconMap = {'File System': fileLogo,'Shmul Sys': shmulSys, 'VS Code': vsLogo, "Js Paint": "https://win98icons.alexmeub.com/icons/png/paint_old-0.png"};

    import {createEventDispatcher} from "svelte";

    let currentWindows;
    $: currentWindows = $writableArray;
    const dispatch = createEventDispatcher();

    let text;
    export let currWin;
    function forward(event, text) {
        dispatch('min', {text: text});
    }



</script>
<div class="notAButton notMyButtonStyles" style="width: calc(100% + 3px);margin-right:-1px;position: fixed">
    <button class="menuBarStart" style="color:black;font-size:15px;margin-top: 4.5px;margin-left: -7px;margin-top: 5px;max-height: 29px">
        <img src="https://win98icons.alexmeub.com/icons/png/windows_update_large-2.png" alt="hello alt"
             style="width:28px;vertical-align: middle;margin-right:-2px;">
        <span style="font-family: 'Apple Garamond Bold';font-size: 1.4rem;display: inline-block;transform: translate(4px,2px);">Start</span>
    </button>
    {#if currentWindows.length > 0}
        <div class="vl"></div>
    {/if}

    <div class="minimizedItems">
        {#each currentWindows as window}
                <button on:click|capture={(event) => forward(event,window)} class:classes={window === $glowWindow} class="appMinimized">
                    <img src="{iconMap[window]}" alt="hello alt"
                         style="width:25px;vertical-align: middle;margin-right: 6px;">
                    <span style="font-size:1rem;">{window}</span>
                </button>
        {/each}
    </div>

    <!-- update the clock i did it in a script tag but innerHTML is bad so lets try smth else okay nice we did-->
    <script type="text/javascript" charset="utf-8">
        setInterval(() => {
            a = new Date();
            minutes = a.getMinutes();
            hours = a.getHours();
            if (minutes < 10) {
                minutes = "0" + a.getMinutes();
            }
            if (hours < 10) {
                hours = "0" + a.getHours();
            }
            time = hours + ':' + minutes + " PM";
            timeText = document.createTextNode(time);
            document.getElementById('time').innerText = '';
            document.getElementById('time').appendChild(timeText);
        }, 1000);
    </script>


    <div class="vl" style="height:28px;margin-top: 5px;margin-right: 2px"></div>
    <div class="timeBox" style="margin-right: -6px">
        <img src="https://win98icons.alexmeub.com/icons/png/gears_tweakui_a-1.png" alt="hello alt" class="gears">
        <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays_green-0.png" alt="hello alt"
             style="width:22px;margin-right:2px;margin-bottom: -5px">


        <b id="time" class="timeText" style="margin-top:3px"> PM</b>
    </div>

</div>
<style>
    .classes{
        -webkit-animation-name: glow;
        -webkit-animation-duration: 180ms;
        -webkit-animation-iteration-count: 2;
        -webkit-animation-timing-function: linear;
        -webkit-animation-direction: alternate;
        -webkit-animation-delay: 35ms;
    }
    @keyframes glow {
        from {
            box-shadow: -5px 10px 0px rgb(26 26 101);
        }
        to {
            box-shadow: 0px -10px 20px rgb(26 26 101);
        }
    }

    button {
        background: rgb(174, 168, 217);

    }
    .gears{
        width: 24px;
        margin-right: 2px;
        margin-left: 8px;
        margin-bottom: -7px;
    }

    .timeText {
        font-size: 1.25rem;
        margin-right: 6px;
        font-family: AppleSystemUIFont;
        display: inline-block;
    }

    .vl {
        /*remove it when theres no apps anymore*/
        border-right: 1px solid rgb(255 255 255);
        border-left: 1px solid rgb(49 49 84);
        margin-left: 6px;
        margin-top: 8px;
        height: 24px;
    }

    .appMinimized:focus {
        outline: 2px solid #000000;
        outline-offset: -2px;
        background: rgb(208 202 249);
    }

    .appMinimized:not(:disabled):active {
        box-shadow: unset;
    }

    .appMinimized {
        font-family: 'Apple Garamond Bold';
        margin-top: 5px;
        color: black;
        width: fit-content;
        margin-left: 7px;
        /* box-shadow: unset; */
        padding: 7px 0px 7px 7px;
        max-height: 29px;
        padding-right: 5px;
        /* border-left: 2px solid black; */
        /* border-right: 2px solid black; */
        align-items: center;
        justify-content: space-around;
        display: inline-flex;
    }

    .minimizedItems {
        margin-left: 0px;
        margin-right: auto;
        display: flex;
    }
</style>
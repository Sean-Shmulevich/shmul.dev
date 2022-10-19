<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import {writableArray} from '../stores/minimized.js';

    import vsLogo from '../assets/windowicons/vb-bas.ico';
    import fileLogo from '../assets/windowicons/aim_fldr.ico';
    import fileListLogo from '../assets/windowicons/doc_panda1.ico';

    let iconMap = {'Files Grid': fileLogo, 'Files List': fileListLogo, 'VS Code': vsLogo};

    import {createEventDispatcher} from "svelte";

    let currentWindows;
    $: currentWindows = $writableArray;
    const dispatch = createEventDispatcher();

    function forward(event, text) {
        dispatch('min', {text: text});
    }
</script>
<div class="notAButton notMyButtonStyles">
    <button class="menuBarStart" style="color:black;font-size:15px;margin-top: 4.5px;margin-left: -7px;">
        <img src="https://win98icons.alexmeub.com/icons/png/windows_update_large-2.png" alt="hello alt"
             style="width:28px;vertical-align: middle;margin-right:-2px;">
        <span style="font-family: 'Apple Garamond Bold';font-size: 1.4rem;display: inline-block;transform: translate(4px,2px);">Start</span>
    </button>
    {#if currentWindows.length > 0}
        <div class="vl"></div>
    {/if}
    <div class="minimizedItems">

        {#each currentWindows as window}
            <button on:click={(event) => forward(event,window) } class="appMinimized">
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
            time = hours + ':' + minutes+" PM";
            timeText = document.createTextNode(time);
            document.getElementById('time').innerText = '';
            document.getElementById('time').appendChild(timeText);
        }, 1000);
    </script>
    <button disabled="true" class="timeBox">
        <img src="https://win98icons.alexmeub.com/icons/png/users-0.png" alt="hello alt"
             style="width:20px;margin-right:6px;margin-bottom: -3px;margin-left:3px">
        <img src="https://win98icons.alexmeub.com/icons/png/gears_tweakui_a-1.png" alt="hello alt"
             style="width:24px;margin-right:2px;margin-bottom: -5px;">
        <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays_green-0.png" alt="hello alt"
             style="width:22px;margin-right:2px;margin-bottom: -3px">


        <b id="time" class="timeText"> PM</b></button>
</div>
<style>
    button {
        background: rgb(174, 168, 217);

    }
    .timeText {
        font-size:1.25rem;
        margin-right: 3px;
        font-family: AppleSystemUIFont;
        display: inline-block;
    }
    .vl{
        /*remove it when theres no apps anymore*/
        border-left: 2px double rgb(49 49 84);
        margin-left: 6px;
        margin-top: 8px;
        height: 24px;
        background-color: rgb(49 49 84);
        outline: 1px solid rgb(49 49 84);
    }
    .appMinimized:focus {
        outline: 2px solid #000000;
        outline-offset: -2px;
        background: rgb(154 143 233);
    }

    .appMinimized:not(:disabled):active {
        box-shadow: unset;
    }

    .appMinimized {
        font-family: 'Apple Garamond Bold';
        margin-top: 4.5px;
        color: black;
        width: fit-content;
        margin-left: 7px;
        /* box-shadow: unset; */
        padding: 7px 0px 7px 7px;
        max-height: 30px;
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
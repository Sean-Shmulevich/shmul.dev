<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import {writableArray} from '../stores/minimized.js';
    import {glowWindow} from '../stores/keep.js';

    import vsLogo from '../assets/windowicons/vb-bas.ico';
    import fileLogo from '../assets/windowicons/aim_fldr.ico';
    import Overview from '../assets/myIcon_1.png';
    import defaultLogo from '../assets/windowicons/aim_fldr.ico';

    let iconMap = {'File System': fileLogo,'Overview': Overview, 'VS Code': vsLogo, "Js Paint": "https://win98icons.alexmeub.com/icons/png/paint_old-0.png", "Default": "https://win98icons.alexmeub.com/icons/png/notepad_file-2.png"};

    import {createEventDispatcher} from "svelte";

    let currentWindows;
    $: currentWindows = $writableArray;
    const dispatch = createEventDispatcher();

    let text;
    let activeWindow = "";
    function forward(event, text) {
        activeWindow = text;

        //why is this called min when button is pressed the item will show unless it already exists in that case it will be set to the highest zIndex
        dispatch('min', {text: text});
    }
    function findIcon(map, window){
        let win = window;
        //test regex pattern 
        //File System(int)
        if(/File System\d+$/.test(window)){
            let a = window.match(/(?<num>[0-9].*$)/).groups.num.length
            win = win.slice(0, -a);//cut the number off of the name;
        }
        else if(!map[win]){
            return map['Default'];
        }
        return map[win];
    }

</script>
<div class="notAButton notMyButtonStyles" style="width: calc(100% + 3px);margin-right:-1px;position: fixed">
    <button class="menuBarStart" style="color:black;font-size:15px;margin-top: 4.5px;margin-left: -7px;margin-top: 5px;max-height: 29px;border: 1px solid black;min-width: 20px;">
        <img src="https://win98icons.alexmeub.com/icons/png/windows_update_large-2.png" alt="hello alt"
             style="width:27px;vertical-align: middle;margin-right:-2px;">
        <span class="startWords">Start</span>
    </button>
    {#if currentWindows.length > 0}
        <div class="vl"></div>
    {/if}

    <div class="minimizedItems">
        {#each currentWindows as window}
                <button on:click|capture|preventDefault={(event) => forward(event,window)} class:classes={window === $glowWindow}  class="appMinimized">
                    <img src="{findIcon(iconMap, window)}" alt="hello alt"
                    style="padding-top:0px;width:22px;vertical-align: middle;margin-right: 0px;padding-left:10px;padding-right:4px;transform: skew(20deg);">
                    <span class="minItemText">{window}</span>
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
            time = hours + ':' + minutes;
            timeText = document.createTextNode(time);
            document.getElementById('time').innerText = '';
            document.getElementById('time').appendChild(timeText);
        }, 1000);
    </script>


    <div class="vl" style="height:28px;margin-top: 5px;margin-right: 2px;"></div>
    <div class="timeBox" style="margin-right: -6px;white-space: nowrap;display: flex;background: linear-gradient( 90deg, rgb(26 26 101), rgb(154 143 233) );">
        <!--<img src="https://win98icons.alexmeub.com/icons/png/gears_tweakui_a-1.png" alt="hello alt" class="gears">-->
        <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays_green-0.png" alt="hello alt"
            style="width:20px;margin-right:10px;margin-top: 2px;margin-left:-2px;padding-left:10px">


        <b id="time" class="timeText" style="margin-bottom:10px;display:block;margin-top:4px;color:white;font-family: 'Apple Garamond Bold'"></b>
    </div>

</div>
<style>
    .minItemText {
        font-size:1rem;padding-right:12px;transform: skew(20deg);white-space: nowrap;
    }
    .startWords{
        font-family: 'Apple Garamond Bold';
        font-size: 1.4rem;
        display: inline-block;
        transform: translate(4px,2px);
    }

    button {
        background: #aea8d8;
    }
    button:focus{
        outline: unset;
    }
    .gears{
        width: 24px;
        margin-right: 2px;
        margin-left: 8px;
        margin-bottom: -7px;
    }

    .timeText {
        font-size: 1.25rem;
        margin-right: 2px;
        font-family: AppleSystemUIFont;
        display: inline-block;
        white-space: nowrap;
        padding-right: 10px;
    }

    .vl {
        /*remove it when theres no apps anymore*/
        border-right: 1px solid rgb(255 255 255);
        border-left: 1px solid rgb(49 49 84);
        margin-left: 6px;
        margin-top: 8px;
        height: 24px;
    }
    @keyframes animatedgradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .classes{
        -webkit-animation-name: glow, animatedgradient;
        z-index: -1;
        background-size: 300% 300%;
        -webkit-animation-duration: 180ms;
        -webkit-animation-iteration-count: 2;
        -webkit-animation-timing-function: linear;
        -webkit-animation-direction: alternate;
        -webkit-animation-delay: 35ms;
    }
    @keyframes glow {
        from {
            box-shadow: 10px 10px 0px rgb(26 26 101);
        }
        to {
            box-shadow: 0px -10px 35px rgb(26 26 101);
        }
    }
    @keyframes rotate {
        from {
            transform: rotateZ(0deg);
        }
        to {
            transform: rotateZ(360deg);
        }
    }

    .appMinimized:hover::after {
        content: '';
        position: absolute;
        border-radius: 7px 7px 7px 7px;
        top: calc(-1 * var(--borderWidth) + 2px);
        left: calc(-1 * var(--borderWidth) + 3px);
        height: calc(82% + var(--borderWidth) * 2);
        width: calc(96% + var(--borderWidth) * 2);
        background: linear-gradient(60deg, #abffe5, #ffae9e, #ff7aa0, rgba(179, 143, 236, 0.87));
        z-index: -1;
        background-size: 300% 300%;
        animation: animatedgradient 2s ease alternate infinite;
    }


    .appMinimized {
        --borderWidth: 1px;
        font-family: 'Apple Garamond Bold';
        margin-top: 5px;
        color: black;
        width: 100%;
        overflow: hidden;

        margin-left: 7px;
        /* box-shadow: unset; */
        padding: 7px 0px 7px 7px;
        max-height: 29px;
        margin-top: 5px;
        min-width: 20px;
        padding-right: 5px;
        /* border-left: 2px solid black; */
        /* border-right: 2px solid black; */
        align-items: center;
        justify-content: space-around;
        display: inline-flex;
        position: relative;
        /*transform: skew(-40deg);*/
        z-index: 5;
        border-radius: 5px 9px 5px 9px;
        border: 2px solid black;

        /* background: linear-gradient(90deg, rgb(26, 26, 101), rgb(154, 143, 233)); */

        /* background: rgba(179, 143, 236, 0.87); */
        /* background: linear-gradient(60deg, #abffe5, #6e99dc, #ff9eba, rgba(179, 143, 236, 0.87)); */
    }

    .minimizedItems {
        position: relative;
        overflow: hidden;
        margin-left: 0px;
        padding-right: 2px;
        border-radius: 5px 9px 5px 9px;
        transform: skew(-20deg);
        margin-right: auto;
        display: flex;
    }
</style>
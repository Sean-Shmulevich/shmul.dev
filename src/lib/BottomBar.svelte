<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import {writableArray} from '../stores/minimized.js';
    import {glowWindow} from '../stores/keep.js';
    import {appLaunch} from '../stores/appLaunch.js';

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
        // console.log(text);
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
    let showMenu = false;
    const toggleMenu = () => {
        showMenu = true;
    }
    const toggleMenuOff = () => {
        showMenu = false;
    }
    // function removeText(){
    //     if($writableArray.length > 5){
    //         let client = document.querySelector(".minItemText").getBoundingClientRect();
    //         if (client.width < 90){
    //             document.querySelectorAll(".minItemText").forEach((ele, i) => {
    //               ele.style.display = "none";
    //               // ele.querySelector("* img");
    //               (document.querySelectorAll(".minimizedItems * img")[i]).style.marginLeft = "-10px";
    //             });
    //             return true;
    //         }
    //         return false;
    //     }
    //     return false;
    // }
    function sendThing(e){
        showMenu = false;
        // console.log(e.target.lastChild);
        let map = {
            "AboutMySite": "About_Website", 
            "MyHobbies": "hobbies",
            "Resume": "resume", 
            "MyIdeas": "ideas",
            "AboutMe": "goals"

        }
        console.log(e.target.nodeName);
        let clickedEle = e.target;
        if (e.target.nodeName === "IMG"){
            const clickedNodeIndex = [].indexOf.call(clickedEle.parentNode.children, clickedEle);
            // get the parent of the clicked node if its an image and get the index of the image and translate that to the index of the p tag next to that image.
            clickedEle = clickedEle.parentNode.parentNode.children[clickedNodeIndex +2];
            console.log(clickedEle);

        }
        let clickedName = (clickedEle.lastChild.textContent).replace(/\s/g, '');
        // console.log(map[clickedName], clickedName)
        $appLaunch.push(map[clickedName]);
        $appLaunch = $appLaunch;
    }

</script>

{#if showMenu}
<!-- on:mouseleave={showMenu = false} -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="startMenu" on:click={(e) => sendThing(e)} on:touchstart={(e) => sendThing(e)} on:mouseleave={toggleMenuOff} style="">
    <div style="height:100%; width:20px;position:absolute;left:3px;bottom:-1px;background: linear-gradient( 90deg, rgb(154 143 233), rgb(26 26 101) );">
        <div style="
        color:white;
        position:absolute;
        bottom: 32px;
        left: -27px;
        font-size:.9rem;
        transform: rotate(-90deg);">
            <span style="font-weight:bold">Shmul</span>.dev
        </div>
    </div>
    <div style="height:100%; width:20px;position:absolute;left:34px;bottom:-3px;background: transparent;">
        <img src="{iconMap['Default']}" width="20px" height="20px" class="startMenuIcon" alt="{window} start menu icon"/>
        <img src="{iconMap['Default']}" width="20px" height="20px" class="startMenuIcon" alt="{window} start menu icon"/>
        <img src="{iconMap['Default']}" width="20px" height="20px" class="startMenuIcon" alt="{window} start menu icon"/>
        <img src="{iconMap['Default']}" width="20px" height="20px" class="startMenuIcon" alt="{window} start menu icon"/>
        <img src="{iconMap['Default']}" width="20px" height="20px" class="startMenuIcon" alt="{window} start menu icon"/>
    </div>
    <p style="margin-left:40px">
        About My Site
    </p>
    <p>
        My Hobbies
    </p>
    <p>
        Resume
    </p>
    <p>
        My Ideas
    </p>
    <p>
        About Me
    </p>
    <!-- <p>
        <img src="{vsLogo}" width="20px" height="20px" class="startMenuIcon" alt="{window} bottom bar icon"/>
        Menu item 6
    </p>
    <p>
        <img src="{vsLogo}" width="20px" height="20px" class="startMenuIcon" alt="{window} bottom bar icon"/>
        Menu item 7
    </p> -->
</div>
{/if}

<div class="notAButton notMyButtonStyles" style="width: calc(100% + 3px);margin-right:-1px;position: fixed">
    <button class="menuBarStart" on:touchstart={toggleMenu} on:mouseenter={toggleMenu} style="color:black;font-size:15px;margin-top: 4.5px;margin-left: -7px;margin-top: 5px;max-height: 29px;border: 1px solid black;min-width: 20px;">
        <img src="https://win98icons.alexmeub.com/icons/png/windows_update_large-2.png" alt="windows 98 style start icon"
             style="width:27px;vertical-align: middle;margin-right:-2px;image-rendering:pixelated">
        <span class="startWords">Start</span>
    </button>
    {#if currentWindows.length > 0}
        <div class="vl"></div>
    {/if}

    <div class="minimizedItems">
        {#each currentWindows as window}
                <button id={"minButt"+window.replace(/\s/g, '')} on:click|capture|preventDefault={(event) => forward(event,window)} class:classes={window === $glowWindow}  class="appMinimized">
                    <img src="{findIcon(iconMap, window)}" alt="{window} bottom bar icon"
                    style="padding-top:0px;width:22px;vertical-align: middle;margin-right: 0px;padding-left:10px;padding-right:4px;transform: skew(20deg);image-rendering:pixelated">
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
        <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays_green-0.png" alt="windows 98 sound icon"
            style="width:27px;height:27px;margin-top: 2px;margin-left:-2px;padding-left:10px;image-rendering:pixelated">

        <b id="time" class="timeText" style="margin-bottom:10px;display:block;margin-top:4px;color:white;font-family: 'Apple Garamond Bold'"></b>
    </div>

</div>
<style>
    /* make start button with svelte if you hover on it it will reveal a menu above it if you click on it it wont go away until you click somewhere else
     */
     .startMenuIcon{
        margin-left:-6px;margin-right:6px;transform:translateY(5px);
     }
     .startMenu{
        z-index: 1000;
        background-color:#eae3fa;position:absolute;width: 150px;bottom: 35px;text-align: center;box-shadow: inset -1px -1px #0a0a0a,
inset 1px 1px #ffffff, inset -2px -2px #808080,
inset 2px 2px #dfdfdf;
     }
     .startMenu > p:hover{
        background-color: rebeccapurple;
        color:white;
     }
     .startMenu > p{
        font-size:1rem;
        margin-left:25px;
        margin-right:4px;
        margin-top:5px;
        margin-bottom:5px;
        font-family: Apple Garamond italic;
     }
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
    /* .gears{
        width: 24px;
        margin-right: 2px;
        margin-left: 8px;
        margin-bottom: -7px;
    } */
    .none{display: none;}
    .shift{margin-right:-20px;}
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
        background: rgb(197 197 255 / 72%);
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
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    import { writableArray } from '../stores/minimized.js';
    import {createEventDispatcher} from "svelte";
    let currentWindows;
    $: currentWindows = $writableArray;
    const dispatch = createEventDispatcher();

    function forward(event,text) {
        dispatch('min', {text: text});
    }
</script>
<div class="notAButton notMyButtonStyles" >
    <button class = "menuBarStart" style="color:black">This is MS paint </button>
    <div class = "minimizedItems">
        {#each  currentWindows as window}
                <button on:click={(event) => forward(event,window) } class = "appMinimized">{window}</button>


        {/each}
    </div>

    <!-- update the clock i did it in a script tag but innerHTML is bad so lets try smth else okay nice we did-->
    <script type="text/javascript" charset="utf-8">
      setInterval(() => {
        a = new Date();
        minutes = a.getMinutes();
        hours = a.getHours();
        if(minutes < 10)
        {
          minutes = "0"+a.getMinutes();
        }
        if (hours < 10) {
          hours = "0"+a.getHours();
        }
        time = hours + ':' + minutes;
        timeText = document.createTextNode(time);
        document.getElementById('time').innerText = '';
        document.getElementById('time').appendChild(timeText);
      }, 15000);
    </script>
    <button disabled="true" class="timeBox"><b id="time"></b></button>
  </div>
<style>
    .appMinimized{
        margin-top: 7px;
        color: black;
        width: 90%;
        margin-left: 6px;
    }
    .minimizedItems {
        margin-left: 15px;
        margin-right: auto;
        display: flex;
    }
</style>
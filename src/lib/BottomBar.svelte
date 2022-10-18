<script>
    import '../css/98.css';
    import '../css/myStyle.css';
</script>
<div class="notAButton notMyButtonStyles">
    <button class = "menuBarStart">This is MS paint </button>  
  
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
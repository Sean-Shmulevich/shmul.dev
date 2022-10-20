<script>
    import '../css/98.css';
    import '../css/myStyle.css';

    import vsLogo from '../assets/windowicons/vb-bas.ico';
    import fileLogo from '../assets/windowicons/aim_fldr.ico';
</script>
<div class="notAButton notMyToolBar topBar">
    <img src="./favicon.svg" class="leftIcon" alt="hello alt">
    <h1 class="street">Sean Shmulevich</h1>
    <div class="rightBox">
        <img src="https://win98icons.alexmeub.com/icons/png/magnifying_glass-0.png" alt="hello alt" class="rightmost" style="margin-right: 4mm;">
        <span class="dateText">Tue Oct 18</span>
        <img src="https://win98icons.alexmeub.com/icons/png/entire_network_globe-5.png" alt="hello alt" class="rightmost" style="margin-left:-3px">
        <img src="https://win98icons.alexmeub.com/icons/png/clean_drive-1.png" alt="hello alt" class="rightmost">
        <img src="https://win98icons.alexmeub.com/icons/png/help_book_big-0.png" alt="hello alt" class="rightmost">
    </div>
</div>
<style>
    .leftIcon {
        width: 54px;
        max-height: 45px;
        margin-top: -1px;
        vertical-align: middle;
        margin-left: -21px;
        margin-right: -10px;
    }
  .street {
        position: relative;
        font-family: 'Apple Garamond bold', sans-serif;
        font-size: 25px;
        font-style: italic;
        -webkit-text-stroke: 0.1px #ed2121;
        color: #000;
        text-shadow: 3.5px 2px rgb(154 143 233);;
        margin: 0;
        margin-right: auto;
        margin-left: 10px;
      }
    .dateText{
        color: black;
        font-family: 'Apple Garamond bold';
        font-size: 1.5rem;
        margin-right: 20px;
        margin-left: -3px;
    }
    .rightBox{
        display: inline-flex;
        flex-direction: row-reverse;
    }
    .topBar {
        align-items: center;
        height: 30px;
    }
    .rightmost {
        /*transform: scaleX(-1);*/
        width:22px;
        max-height: 23px;
        vertical-align: middle;
        margin-left:auto;
        margin-right: 20px;
        margin-top: 2px;
    }
</style>
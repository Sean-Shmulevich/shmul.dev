<script>
    import '../css/98.css';
    import '../css/myStyle.css';

    import linkedIn from '../assets/linkedin_pixel_logo_icon_181925.png';
    import instaLogo from '../assets/instagram_pixel_logo_icon_181922.png';
</script>
<div class="notAButton notMyToolBar topBar">
    <div class="notAButton" style="max-height:25px;display: flex; margin-top: 0px;transform: skew(-20deg);border-radius: 5px 9px 5px 9px;border: 2px solid black;background-color: rgb(160,151,229)">
        <h1 class="street">Sean Shmulevich</h1>
        <!--<img src="./favicon.svg" class="leftIcon" alt="hello alt">-->
    </div>
    <div class="rightBox">
        <img src="https://win98icons.alexmeub.com/icons/png/magnifying_glass-0.png" alt="hello alt" class="rightmost" style="margin-right: 4mm;">
        <span class="dateText">Tue Oct 18</span>
        <img src="https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/d7e4e1e509c728d.png" alt="hello alt" class="rightmost" style="margin-left:-3px">
        <img src="{linkedIn}" alt="hello alt" class="rightmost">
        <img src={instaLogo} alt="hello alt" class="rightmost">
    </div>
</div>
<style>
    .leftIcon {
        width: 54px;
        max-height: 45px;
        margin-top: -10px;
        vertical-align: middle;
    }
  .street {
        transform: skew(20deg);
        position: relative;
        font-family: 'Apple Garamond bold', sans-serif;
        font-size: 22px;
        font-style: italic;
        -webkit-text-stroke: 0.1px #ed2121;
        color: #000;
        text-shadow: 3.5px 2px rgb(160,151,229);
        margin: 0;
        margin-right: auto;
        margin-top: -2px;
        margin-left: 0px;
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
        position: fixed;
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
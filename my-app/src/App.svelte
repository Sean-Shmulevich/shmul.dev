<script>
    import svelteLogo from './assets/svelte.svg'
    import Counter from './lib/Counter.svelte'
    import AboutMe from './lib/AboutMe.svelte'
    import TopBar from './lib/TopBar.svelte'
    import BottomBar from './lib/BottomBar.svelte'
    import FilePage from './lib/FilePage.svelte'
    import VsCode from './lib/VsCode.svelte'
    import FileList from './lib/FileList.svelte'
    import {count} from './stores/zIndex.js';


    let current = '';
    let doubleClick = '';
    let biggestZ = 0;//78 is the height of an icon.
    const icons = [
        {
            pos: 45,
            src: "data:image/png;base64,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",
            text: "Files Grid"
        },
        {
            pos: 148,
            src: "data:image/png;base64,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",
            text: "Files List"
        },
        {
            pos: 248,
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFkAAABOCAMAAAB8Bkq+AAAChVBMVEUAAAAAAAAAAAAAAACHh4eCgoKAgICAgICBgYGEhISDg4MPDw+SkpKAgIACAgKAgICoqKWhoaGxsbGQkJCQkJCGhoYODgOQkJAAAACAgICVlZWDg4OAgICFhYWAgIDb29tkZAy8vLy2traAgIAAAACIiIiPj4+CgoKAgIAAAACJiYkHBwAAAAAAAABWVgCEhISAgIAAAAB4eHhAQEB2dlkeHgAAAAAvLyNBQUHg4GDf32D5+Rf19SHKyp/r6zzU1ITS0ort7TbHx6jDw7T8/AzPz5Dw8DDOzpbx8SqAgIDGxqnY2HgAAADAwMDn50gQEACAgABgYAD4+Pifn59wcAAgIADw8PD9/f3g4ODDw8P//wCHh4ePj4///+GHhwGEhAr8/Pr///GQkC6fnwL4+PX//+PS0sb5+VH5+fLV1b3b26vn54f09GP8/Ej+/ubAwL7AwJPGxq6RkSrp6RWenga/vwO8vJ7Gxn7U1FTt7Tni4iqTkySYmBicnAzs7ArHx6q/v6n+/ob//z/8/Bv///Pj49TPz8/Ly638/IuhoVrw8Dzx8RX+/vb8/Oz7++zq6urh4drn58jGxrjDw574+JjS0pbLy4fh4Wna2lqjo1Snp0jp6S34+Ca4uBj19Qy8vAyGhga4uKjk5FTw8ADx8dW5ubm8vLT//4CgoGDq6kH//w+EhAz4+ADIyMXBwbq1tbXw8LDv77DMzJybm5mWlpSLi4ve3mawsDCvrzD19SMLCwvj48v//6d8fHyEhGf19VEbGwjU1NT5+b3Hx7exsbG1tZ7w8JDAwJDw8HCXl2dgYGCcnFT//0ucnEhDQ0Ofnzz4+DH//y2fnyCIiBiAgBCBgQNUVADLwwGHAAAAOXRSTlMA8B+ADj/g8H8fOg4DwTse/vL+8ubi4srCtJ9wYEsY/Pzw4NLSx4+MeHBXURwH+PDh4eDgz8+fVz+Ent+AAAAEIElEQVRYw+2X91PTYBzG0xrUtraCe++9tybpTLCUEUedCEXZomhZonWhuAfWvbegoiIq4MC99x5/j998CdrzGi6Uxh+4Ptz1PnfPm4e83/R5LyV8REqpDdE0kT1a+1d3TROT23Zt5V/9tU2JbUO21XZO9K8OwzS9Ah8IGTZkUD/ev/p2a92DDHwUQ8a07+30L29Eq65tA8yFUQxqX3XftTzNuTjdtceZttyVvljAEqezxFUanjBQG9hAyB5dO/frfT+7ODsrY0nmsqUZWdnFmUu2ImYsXfY4p13EQP3gXoEkt26VyDtdxQvsLDeViaQ51r6AmcoDUhxHRQK2S4jWaxqfq+3ZLSJ827MHj+3TLNZYs42yWqbZzbFTAWmrlbYBvq5O7DxMq2nkQLT6jn29pdu/frGwFofRHGWijQ4LG2VmACmjkTIBlm8oC+/YvzvZqDsme3as4dNcGzfdg/3fYzwsd5sBZD2RiMxtDpF/UTN6sIaUI51OJ2wuLKx7h2reW/pqZ/kt/la553wuF+sBzD1vR/TEcoh8ZXX7bj3D5GiKwaCD5JYtO7Qrc1dUPC8qus5fLyrKdbs5Ad25bB1ybkTeXVYZ0VKOxo3v1MUAydHRiWXx8uQOr0mQoehPtWOH63SQXPV0vkxtjedlqPJdrWpSixaQPMs7T6YWOeXI+7A2TqVSCclz5yW70rHS/tuNKHh7AAUP0eVzRYnPFWneh0+mx8XFYfLmBx8yodJS7UYUPETwEMFDBA8RPMSsird9fj0Rk5MvXWGw0lLtBhQ8WkDwEGEZIi4DBA+RvXj56uw59cnbTzqgatg6qCGiAxtJm6CRiNjIf8qJiMsAwUOMOnBs4Z/kRfsOWWhb3UkBRwciHB2AlA1OEUQ8Rf45UBBxGSB4iOYTp5L+JM+bH89S4m5gp5TkphsaE3iIzLUVSQres/JzTt64yUjFmGyRNlOM1cggGq0cIB0TQzOIgkcJCB4iI16BywDBQzRt2PE3efeNIzRFUTSFn3WIf8D4QYseouQyEY/ePft3znv3m2jxf8L90JK31tBmwEM0nl6RpFyyctNQ7gmG2t182q3Yyb/54E4zblp8r5PcdENjAg/Rcvi4z3djy7Yo3LT4Xie56YbGBB6iY9eZ/9Lum0d82imiRIkp6WUiHr0Tavd/ardy3zrFmhJqd6jdku1WLlm5aSj1BEPtbkbtDr3XhX61Nat2K/QEq7aUvtmVv6owZ/WF1TmFK/PXI+avPIdYuGo9ouAhgocIHiJ4iOAh5rx8X5/86OPnb6kFa1Py1qWuy0tZU5CKWLCmDlPWiggeIniIqRJX5KV8/1mf/GNGsIXJev2EPjODrVETu3QhNJrJnaYHW52Gq9UEQRgGqIKtAQZCkHpoi2BrqBqTR45QB1sjRhLEb2Quvc6fLYO3AAAAAElFTkSuQmCC",
            text: "VS Code"
        },
    ];

    function unsetBlue() {
        if (current !== '') {
            current = ''
        }
    }

    let windows = [];//represents 1x of each of the current windows open.
    //bind to child z-index values in order to set to the highest on file icon press.
    //alternatively set the highest by default in the element to start and it will be the first one when you init it.
    let zMap = {'Files Grid': 0, 'Files List': 0, 'VS Code': 0};


    function updateWindows() {
        doubleClick = current;
        current = '';//unbluing
        if (windows.indexOf(doubleClick) === -1) {//element does not yet exist
            windows.push(doubleClick);
            windows = windows;
        }
        zMap[doubleClick] = $count + 1;
        count.increment();
        doubleClick = '';
    }

    function removeWindow(window) {
        windows.splice(windows.indexOf(window), 1);
        windows = windows;
    }

    //it's pretty cool that capture works and that's one of the first things I tried but like why
    //capture makes it go from outer-innerMost as opposed to innerMost-toOutside.
</script>

<svelte:window on:click|capture={unsetBlue}/>

<main>

    <TopBar/>
    {#each icons as {pos, src, text}}
        <div class="homeIcon" style="top:{pos}px; left:32px" class:blue={current === text}
             on:click="{() => current = text}" on:dblclick="{updateWindows}">
            <img
                    {src}
                    alt="folder icon Windows 95">
            <p class="homeIconText">{text}</p>
        </div>
    {/each}
    {#if windows.indexOf('Files Grid') !== -1}
        <FilePage bind:zIdx="{zMap['Files Grid']}" on:close={() => removeWindow('Files Grid')}/>
    {/if}
    {#if windows.indexOf('Files List') !== -1}
        <FileList bind:zIdx="{zMap['Files List']}" on:close={() => removeWindow('Files List')}/>
    {/if}
    {#if windows.indexOf('VS Code') !== -1}
        <VsCode bind:zIdx="{zMap['VS Code']}" on:close={() => removeWindow('VS Code')}/>
    {/if}
    <AboutMe zIdx={-1}/>
    <BottomBar/>
</main>


<style>
    .homeIconText {
        margin-top: -11px;
        margin-bottom: -3px;
    }

    .blue {
        background-color: blue;
        color: white;
    }

    .homeIcon {
        position: fixed;
        text-align: center;
        top: 45px;
        left: 32px;
    }
</style>

<script>
  import Image from "./Image.svelte";
  import { BarLoader } from "svelte-loading-spinners";
  import { get } from "../stores/sanity.js";

  export let VSCODE;
  export let PortableText;
  export let windowName;
  export let docName;
  export let zIdx = 0;
  export let hide = false;
  export let BoxX = 200;
  export let BoxY = 120;

  let getData = async (fileName) => {
    let data = await (await get(fileName)).body["textArr"][0].FileContent;
    return data;
  };
</script>

<svelte:component
  this={VSCODE}
  {BoxX}
  {BoxY}
  {windowName}
  bind:hide
  bind:zIdx
  on:close
>
  <div class="article">
    <!-- svelte-ignore empty-block -->
    {#await getData(docName)}
      <div style="margin: 25% auto auto 40%">
        <BarLoader size="60" color="rgb(150 150 255)" unit="px" />
      </div>
    {:then backendContent}
      <svelte:component
        this={PortableText}
        value={backendContent}
        components={{
          types: {
            image: Image,
          },
        }}
      />
    {/await}
  </div>
</svelte:component>

<style>
  .article {
    color: white;
    font-family: Apple Garamond bold;
    padding: 0px 15px 10px 15px;
    margin-top: -10px;
  }
</style>

<script lang="ts">
  import { urlFor } from "../stores/sanity";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let portableText: any;
</script>

<figure>
  {#if portableText.value.asset?._ref}
    <img
      width="200"
      alt="sean shmulevich blog"
      src={urlFor(portableText.value.asset._ref).width(200).url()}
    />
    <figcaption>{portableText.value.asset._ref}</figcaption>
  {/if}
</figure>

<style>
  figure {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  img {
    margin-inline: auto;
  }
  figcaption {
    text-align: center;
  }
</style>

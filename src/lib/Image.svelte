<script lang="ts">
    import type {CustomBlockComponentProps} from '@portabletext/svelte'
    import {urlFor} from "../stores/sanity.js"

    interface asset {
        _ref: string
        _type: string
    }

    export let portableText: CustomBlockComponentProps<{_key?: string, asset?: asset}>
</script>

<figure>
    <img width="200" alt="sean shmulevich blog" src={urlFor(portableText.value.asset._ref).width(200).url()} />
    <figcaption>{portableText.value.asset._ref}</figcaption>
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
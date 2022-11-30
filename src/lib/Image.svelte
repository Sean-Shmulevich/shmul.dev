<script lang="ts">
    import type {CustomBlockComponentProps} from '@portabletext/svelte'

    interface asset {
        _ref: string
        _type: string
    }

    export let portableText: CustomBlockComponentProps<{_key?: string, asset?: asset}>
</script>

<figure>
    <img src={"https://picsum.photos/200"} />
    <span>{portableText.value.asset._ref}</span>
    <!-- <figcaption>{value.caption}</figcaption> -->
</figure>
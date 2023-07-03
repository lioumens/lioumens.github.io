<script setup lang="ts">
import katex from "katex"

export interface Props {
    src: string
    inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    inline: true
})
</script>

<template>
    <span v-if="props.inline" class="math math-inline" v-html="katex.renderToString(props.src, {displayMode: !props.inline})"></span>
    <div v-else class="math math-display" v-html="katex.renderToString(props.src, {displayMode: !props.inline})"></div>
</template>
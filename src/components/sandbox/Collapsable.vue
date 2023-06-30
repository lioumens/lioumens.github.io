<script setup lang="ts">
import {ref} from "vue"
const collapsed = ref(true)
const toggle = () => collapsed.value = !collapsed.value
</script>

<template>
    <div @click="toggle" class="m-collapsable">
    <details  class="m-collapsable-details" open>
    <summary class="m-collapsable-summary">
        This will be a prop eventually.
    </summary>
    <div v-if="!collapsed" class="m-collapsable-content">
        I can see details here right?
    </div>
    </details>
    </div>
</template>

<style lang="scss" scoped>
.m-collapsable {
    height: fit-content;
    padding: 1rem 2rem;
    margin: 2rem 4rem;
    background: var(--nord0);
    border-radius: 10px;
    cursor: pointer;
}
.m-collapsable-details {
    pointer-events: none;
}
.m-collapsable-summary {
    list-style: none;
}
</style>
<script setup lang="ts">
import type {InputHTMLAttributes} from "vue"

interface SliderProps {
    min: number
    max: number
    initial?: number
    step: number
    ticks?: boolean
    inputAttributes?: InputHTMLAttributes
}

const props = withDefaults(defineProps<SliderProps>(), {
    step: 1,
    ticks: false,
})


</script>

<template>
    <div class="m-slider">
        <input type="range" :min="props.min" :max="props.max" :value="props.initial" class="m-slider--input" v-bind=""/>
        <div class="m-slider--track"></div>
        <div class="m-slider--thumb"></div>
    </div>
</template>

<style scoped lang="scss">

.m-slider--track {
    width: 100%;
    height: 10px;
    border-radius: 5px;

}
</style>
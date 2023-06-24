<script setup lang="ts">

// should be draggable on initialization, but emit the x,y position (svg coord is fine). Translation can be done on parent with the axes.

// props can modify the behavior of the circle
// circle needs to know the boundary svg
import {useDrag} from "./drag.js"
import {ref, computed, watch} from "vue"

// const props = defineProps(["SVGBox"])

const props = defineProps<{
    radius: number,
    restrictDragAxis: "x" | "y" | "none",
    initialX: number,
    initialY: number
}>()

const emit = defineEmits<{
    xEvent: [value: number]
    yEvent: [value: number]
}>()


const el = ref()

const {x, y, isDragging} = useDrag(el, props.radius, props.restrictDragAxis, props.initialX, props.initialY)

const pauseAnimOnDrag = computed(() => {
    return { animationPlayState: isDragging.value ? "paused" : "running" }
})

const xPos = computed(() => {
    emit("xEvent", x.value)
    return x.value
})

const yPos = computed(() => {
    emit("yEvent", y.value)
    return y.value
})
</script>

<template>
    <circle class="pulsepoint"
            :cx="x"
            :cy="y"
            :r="`${props.radius * 1.5}`"
            fill="var(--nord11)"
            stroke="var(--nord11)"
            opacity=".2"
            :style="pauseAnimOnDrag" />
    <circle class="datapoint" ref="el" :cx="xPos" :cy="yPos" :r="props.radius" :style="pauseAnimOnDrag" fill="var(--nord11)" />
</template>

<style scoped lang="scss">
@keyframes pulse {
	0% {
        transform: scale(1);
		box-shadow: 0 0 0 0 rgba(36, 201, 49, 0.7);
        animation-timing-function: ease-out;
	}

	80% {
        transform: scale(1.2);
		box-shadow: 0 0 5px 30px rgba(123, 36, 36, .3);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
	}

	100% {
        transform: scale(1);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        animation-timing-function: ease-in;
	}
}

@keyframes radar {
    0% {
        transform: scale(0);
        opacity: .3;
        fill: var(--nord11);
        stroke-width: 2;
        animation-timing-function: ease-out;
    }
    30% {
        transform: scale(1.2);
        opacity: .15;
        fill: var(--nord11);
        stroke-width: 4;
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
    }
    100% {
        transform: scale(1.3);
        opacity: .1;
        fill: none;
        stroke-width: 0;
        animation-timing-function: ease-in;
    }
}
.datapoint {
    transform-origin: center;
    transform-box: fill-box;
    animation: pulse 2s infinite;
    cursor: grab;
}

.pulsepoint {
    transform-origin: center;
    transform-box: fill-box;
    animation: radar 2s infinite;
}

@keyframes blink {
    0%, 30% {opacity : 1}
    50% {opacity : .7}
    70% {opacity : 1}
}

@media (prefers-reduced-motion: reduce) {
    .datapoint {
        animation: blink 2s infinite;
    }
    .pulsepoint {
        display: none;
    }
}
</style>

<script setup lang="ts">
import {ref} from "vue"
import {gsap} from "gsap"
const svgBox = ref(null)

const xPos = [50, 70, 100, 410, 470, 500]
const yPos = [170, 170, 170, 50, 50, 50]
const range = ref(110)

const tl = gsap.timeline()
tl.to(range, {duration: 2, value: 400, ease: "power1.inOut", repeat: -1, yoyo: true})
// tl.to(range, {keyframes: [
//     {duration: 2, value: 110, delay:1, ease: "power1.inOut"},
//     {duration: 2, value: 300, delay:1, ease: "power1.inOut"},
//     {duration: 2, value: 400, delay:1, ease: "power1.inOut"}
// ], repeat: -1, yoyo: true})
</script>

<template>
    <svg viewBox="0 0 600 200" ref="svgBox" preserveAspectRatio="xMidYMid meet" @click="tl.paused(!tl.paused())">
        <defs>
            <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                fill="#9f9f9f" 
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line x1="30" y1="170" x2="570" y2="170" 
        stroke="#9f9f9f" stroke-width="2" marker-end="url(#arrow)"></line>
        <line x1="30" y1="170" x2="30" y2="30" stroke="#9f9f9f" stroke-width="2"
        marker-end="url(#arrow)"></line>
        <line x1="22" x2="30" y1="50" y2="50" stroke="#9f9f9f" stroke-width="1"></line>
        <text x="10" y="170" fill="#9f9f9f" dominant-baseline="middle">0</text>
        <text x="10" y="50" fill="#9f9f9f" dominant-baseline="middle">1</text>
        <line x1="22" x2="30" y1="170" y2="170" stroke="#9f9f9f" stroke-width="1"></line>

        <text x="45" y="30" style="font-family:monospace;" fill="#9f9f9f">p(x)</text>
        <text x="565" y="155" style="font-family:monospace;" fill="#9f9f9f">x</text>

        <circle v-for="(x, i) in xPos" :cx="x" :cy="yPos[i]" r="7" fill="var(--nord11)"></circle>

        <line x1="30" y1="170" :x2="range" y2="170" stroke="var(--nord11)" stroke-width="2" />
        <line :x1="range" y1="50" x2="570" y2="50" stroke="var(--nord11)" stroke-width="2" />
        <line :x1="range" y1="50" :x2="range" y2="170" stroke="var(--nord11)" stroke-width="2" />

        <!-- <circle cx="50" cy="170" r="7" fill="var(--nord11)"></circle> -->
    </svg>
</template>
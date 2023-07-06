<script setup lang="ts">
import {ref, onMounted} from "vue"
import "mathbox/mathbox.css"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Mathbox from "mathbox"
// import * as MathBox from "mathbox"
// import * as MathBox from "mathbox/build/bundle/mathbox"

import {useScriptTag} from "@vueuse/core"

// const element = document.querySelector("#my-thing")

// if (typeof window !== "undefined") {
//   console.log((await import("gsap/MotionPathPlugin")))
//   MotionPathPlugin = (await import("gsap/MotionPathPlugin")).MotionPathPlugin
//   // const {MotionPathPlugin} = await import("gsap/MotionPathPlugin")
// //   // import {MotionPathPlugin} from "gsap/MotionPathPlugin"
//   // gsap.registerPlugin(MotionPathPlugin)
// }
// let MathBox;
// if (typeof window !== undefined) {
//     MathBox = await import("mathbox")
// }
// const MathBox = (await import("mathbox"))


// onMounted(() => {
//     const options = {
//     element: mything.value,
//     controls: {
//         klass: THREE.OrbitControls
//     },
//     };
//     const root = MathBox.mathBox(options);
//     const view = root
//     .cartesian({
//         range: [
//         [-2, 2],
//         [-1, 1],
//         [-1, 1],
//         ],
//         scale: [2, 1, 1],
//     })
//     .axis({
//         axis: 1,
//     })
//     .axis({
//         axis: 2,
//     });
// })

const mything = ref(null)
// useScriptTag("https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.min.js")
// useScriptTag("https://cdn.jsdelivr.net/npm/three@0.137.0/examples/js/controls/OrbitControls.js")


// useScriptTag("https://cdn.jsdelivr.net/npm/mathbox@latest/build/bundle/mathbox.js", () => {
    // const options = {
    // element: mything.value,
    // controls: {
    //     klass: THREE.OrbitControls
    // },
    // };
    // const root = MathBox.mathBox(options);
    // const view = root
    // .cartesian({
    //     range: [
    //     [-2, 2],
    //     [-1, 1],
    //     [-1, 1],
    //     ],
    //     scale: [2, 1, 1],
    // })
    // .axis({
    //     axis: 1,
    // })
    // .axis({
    //     axis: 2,
    // });

// })
    


</script>

<template>
    <div id="my-thing" ref="mything"></div>
</template>
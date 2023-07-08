<script setup lang="ts">
import {ref, onMounted, onUnmounted, watchEffect, watch} from "vue"
import "mathbox/mathbox.css"

import * as THREE from "three"
import { scaleLinear } from "d3-scale"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// import Mathbox from "mathbox"
// import * as MathBox from "mathbox"
// import * as MathBox from "mathbox/build/bundle/mathbox"
// 
// import {useScriptTag} from "@vueuse/core"
import Katex from "../blog-5/Katex.vue"
import katex from "katex"
import useDragNumber from "../../composables/blog-6/dragNumber.js"

// const element = document.querySelector("#my-thing")

// useScriptTag("https://cdn.jsdelivr.net/npm/mathbox@latest/build/bundle/mathbox.js")

// if (typeof window !== "undefined") {
//   console.log((await import("gsap/MotionPathPlugin")))
//   MotionPathPlugin = (await import("gsap/MotionPathPlugin")).MotionPathPlugin
//   // const {MotionPathPlugin} = await import("gsap/MotionPathPlugin")
// //   // import {MotionPathPlugin} from "gsap/MotionPathPlugin"
//   // gsap.registerPlugin(MotionPathPlugin)
// }


let a = ref(1)
// let b = ref(2)
let sig1 = ref(1)
let sig2 = ref(1)
let rho = ref(0)
let mu1 = useDragNumber(".mu1", -2, 2, 0.1, 0)
let mu2 = useDragNumber(".mu2", -2, 2, 0.1, 0)

let ela = ref(null)

// run on client only 
let MathBox;
if (typeof window !== undefined) {
    MathBox = await import("mathbox")
}

//
// async function loadMathBox() {
//     const MathBox = await import("mathbox")
//     return(MathBox)
// }

const mything = ref(null)
let mu1El, mu2El;
onMounted(() => {
    const el = document.getElementById("my-thing")
    mu1El = document.querySelector(".mu1>.mord")
    mu2El = document.querySelector(".mu2>.mord")

    MathBox.DOM.Types.latex = MathBox.DOM.createClass({
        render: function (el) {
          this.props.innerHTML = katex.renderToString(this.children, {strict:false});
          return el("span", this.props);
        },
      });
    // resolve as a promise, and have code 
    const options = {
        element: mything.value, // i don't know why
        plugins: ['core', 'controls', 'cursor'],
        controls: {
            klass: OrbitControls
        },
    };
    const root = MathBox.mathBox(options);
    const three = root.three
// change background color
    three.renderer.setClearColor(new THREE.Color(0x3b4252), 1.0);
    const view = root
    .cartesian({
        range: [
        [-3, 3],
        [0, .5],
        [-3, 3],
        ],
        scale: [1, 1, 1],
    })
    .axis({
        axis: 1,
        width: 3,
    })
    .axis({
        axis: 2,
        width: 3,
    })
    .axis({
        axis: 3,
        width: 3,
    })

    // .grid({
    //     width: 2,  
    //     divideX: 20,
    //     divideY: 10,
    // });
    root.select('axis').set('color', '#eceff4');



    var camera = root.camera({
    proxy: true,
    position: [2, 2, 2],
    });

    root.set('focus', 3)

    // let data = view.interval({
    //     expr: function(emit, x, i, t) {
    //     emit(x, Math.sin(x + t) * Math.exp(-x * x));
    //     },
    //     width: 64,
    //     channels: 2
    // })
    let data = view.area({
        expr: function(emit, x, y, i, j, t) {
            // emit(x, a.value * x * x - b.value * y * y, y);
            const z = ((x - mu1.value)**2) / sig1.value**2  + 
                      ((y-mu2.value)**2) / sig2.value**2 - 
                      2 * rho.value * (x - mu1.value) * (y - mu2.value) / sig1.value/ sig2.value
            emit(x,y,
                 1 / (2 * Math.PI * sig1.value * sig2.value * Math.sqrt(1 - rho.value * rho.value)) * 
                 Math.exp(-z / (2* (1 -rho.value**2))));
        },
        width: 60,
        channels: 3,
        height: 60,
        rangeX: [-3, 3],
        rangeY: [-3, 3]
    }).swizzle({
        order: "xzy"
    })
    let surface = view.surface({
        shaded: true,
        // lineX: true,
        // lineY: true,
        fill: true,
        color: '#bf616a',
        width: 2,
        zBias: 1,
    })

    // let curve = view.line({
    //     width: 10,
    //     color: '#3090FF'
    // })
    // let points = view.point({
    //     size: 6,
    //     color: '#3090FF',
    //     zIndex: 1,
    // })

    // labelling the axes
    let scale = view.scale({
        divide: 5,
        origin: [0, 0, 0], // goes through the origin, makes sense
        axis: 1,
        nice: true,
    })
    let ticks = view.ticks({
        width: 5,
        size: 15,
        color: "black"
    })

    let format = view.format({
        digits: 2,
        weight: "bold",
    })
    let labels = view.label({
        color: "red",
        zIndex: 1,
    })

    let scale2 = view.scale({
        divide: 5,
        origin: [0, 0, 0], // goes through the origin, makes sense
        axis: 3,
        nice: true,
    }).label({
        color: "red",
        zIndex: 1,
    })

    view.array({
        data: [
            [0, 0, 0],
        ],
        channels: 3, 
        live: false,
    })
    // .text({
    //     data:["origin"]
    // })
    // .label({
    //     color: "red",
    //     zIndex: 1,
    //     outline: 0
    // })
    .html({
        width: 8,
        height: 3,
        depth: 2,
        expr: function(emit, el, i, j, k, l, time) {
            // emit latex
            emit(
                el("latex", null, " \\pi x^2" + " + " + "y^2" + " = " + "1")
            )
        }
    })
    .dom({
        snap: false,
        offset: [0, 0, 0],
        depth: 0.5, // makes it look smaller
        size: 24, // font-size
        zoom: 1,
        outline: 0 // natural outline to latex
    })


    // let play = root.play({
    //     target: "cartesian",
    //     pace: 5,
    //     to: 2,
    //     loop:true,
    //     script: [
    //         {props: {range: [[-2, 2], [-1, 1]]}},
    //         {props: {range: [[-4,4], [-2, 2]]}},
    //         {props: {range: [[-2, 2], [-1, 1]]}}
    //     ]
    // })
// losing pointer capture is more reliable than mouseup for somereason 
// ela.value.addEventListener("lostpointercapture", () => {
//     aDragging.value = false;
//     console.log("lost pointer capture")
// });

// })
// onUnmounted(() => {
//     ela.value.removeEventListener("lostpointercapture")
// })
})

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


// current value
let b = useDragNumber("#bLatex", 0, 10, .5)
let z = useDragNumber("#zLatex", 0, 10, .3)
let aDragging = ref(false)
let aX = ref(0)
let aY = ref(0)
let currentX = 0

const aMin = 0;
const aMax = 10;

watch(() => mu1.value, (newMu1) => {
    if (mu1El) {
        mu1El.innerText = mu1.value.toFixed(1)
    }
})
watch(() => mu2.value, (newMu2) => {
    if (mu2El) {
        mu2El.innerText = mu2.value.toFixed(1)
    }
})

</script>

<template>
    <Katex src="\begin{aligned}
    &f(x, y;\mu_x, \mu_y, \sigma_x, \sigma_y, \rho) = \frac{1}{2\pi\sigma_x\sigma_y\sqrt{1 - \rho^2}} \;\times\\
    &\qquad\exp{\left(-\frac{1}{2(1-\rho^2)}\left[\left(\frac{x-\mu_x}{\sigma_x^2}\right)^2 + \left(\frac{y - \mu_y}{\sigma_y}\right)^2 - \left(\frac{2\rho(x - \mu_x)(y-\mu_y)}{\sigma_x\sigma_y}\right)\right]\right)}\end{aligned}" :inline="false" />
    <div id="my-thing" ref="mything" style="height:500px;width:500px"></div>
    <input type="range" v-model.number="mu1" min="-2" max="2" step="0.1">
    <input type="range" v-model.number="mu2" min="-2" max="2" step="0.1">
    <input type="range" v-model="rho" min="-1" max="1" step="0.1">
    <input type="range" v-model="sig1" min="0.1" max="5" step="0.1">
    <input type="range" v-model="sig2" min="0.1" max="5" step="0.1">
    <div
      class="mean-control"
      v-html="katex.renderToString(`\\mathbb{E}
      \\begin{bmatrix}X\\\\Y\\end{bmatrix} = \\begin{bmatrix}\\mu_x \\\\ \\mu_y\\end{bmatrix} = \\begin{bmatrix} \\htmlClass{mu1}{0.00} \\\\ \\htmlClass{mu2}{0.00} \\end{bmatrix}`, {displayMode:true, trust:true, strict:false})"> </div>

    <span
    ref="ela"
    class="ela"
    @pointerdown.left="startDrag"
    @pointermove="doDrag"
    @pointercancel="stopDrag"
    @touchstart.prevent=""
    @dragstart.prevent=""
    @lostpointercapture="stopDrag"
    >{{ a.toFixed(2) }}</span>
    <br/>

    <span>{{ z }}</span>
    <span class="elb">{{ b }}</span>

</template>

<style lang="scss" scoped>
.ela {
    cursor: ew-resize;
    user-select: none;
}
</style>
<script setup lang="ts">
import {ref, onMounted, onUnmounted, watchEffect, watch} from "vue"
import "mathbox/mathbox.css"

import * as THREE from "three"
import { scaleLinear } from "d3-scale"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Vector3 } from "three/src/math/Vector3.js";
// import Mathbox from "mathbox"
// import * as MathBox from "mathbox"
// import * as MathBox from "mathbox/build/bundle/mathbox"
// 
// import {useScriptTag} from "@vueuse/core"
import Katex from "../blog-5/Katex.vue"
import katex from "katex"
import useDragNumber from "../../composables/blog-6/dragNumber.js"
import useLinkHover from "../../composables/blog-6/linkHover.ts"
import Slider from "../blog-6/Slider.vue"
import {VSlider} from "vuetify/components/VSlider"
import "vuetify/components/VGrid/"
import "vuetify/components/VApp/"
import "vuetify/components/VInput/"
import "vuetify/components/VLabel/"
import "vuetify/directives"

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
const {num:sig1, isDragging:sig1Active} = useDragNumber(".sig1", 0.1, 2, 0.01, 1)
const {num:sig2, isDragging:sig2Active} = useDragNumber(".sig2", 0.1, 2, 0.01, 1)
const {num:rho, isDragging:rhoActive} = useDragNumber(".rho", -.9, .9, 0.01, 0)
const {num:mu1, isDragging:mu1Active} = useDragNumber(".mu1", -2, 2, 0.1, 0)
const {num:mu2, isDragging:mu2Active} = useDragNumber(".mu2", -2, 2, 0.1, 0)

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


const mathboxContainer = ref(null)
let mu1El, mu2El, sig1El, sig2El, rhos;
onMounted(() => {
    // can select element to spawn into
    // const el = document.getElementById("my-thing")

    mu1El = document.querySelector(".mu1-number>.mord") // get inner element with number
    mu2El = document.querySelector(".mu2-number>.mord")
    sig1El = document.querySelector(".sig1-number>.mord")
    sig2El = document.querySelector(".sig2-number>.mord") 
    rhos = document.querySelectorAll(".rho-number>.mord")

    // allow latex render on graph
    MathBox.DOM.Types.latex = MathBox.DOM.createClass({
        render: function (el) {
          this.props.innerHTML = katex.renderToString(this.children, {strict:false});
          return el("span", this.props);
        },
      });

    const options = {
        element: mathboxContainer.value, // spawn into viewport
        plugins: ['core', 'controls', 'cursor'],
        controls: {
            klass: OrbitControls
        },
        camera: {
            up: new Vector3(0, 0, 1),
        },
    };

    const root = MathBox.mathBox(options);
    const three = root.three
    // change background color
    three.controls.maxDistance = 5
    three.controls.minDistance = 1
    three.renderer.setClearColor(new THREE.Color(0x3b4252), 1.0);

    // const sliceXZ = root
    //   .cartesian({
    //     range: [
    //       [-3, 3],
    //       [-3, 3],
    //       [-0, .4],
    //     ],
    //     rotation: [0, 0, 0],
    //     position: [0, 0, 0],
    //     scale: [1, 1, .5],
    //   })
    //   .grid({
    //     axes: [1, 3],
    //     divideX: 10,
    //     divideY: 10,
    //     width: 1,
    //     opacity: .2,
    //     color: "#2e3440",
    //   })
    //   .visible(true)
    // const sliceYZ = root
    //   .cartesian({
    //     range: [
    //       [-3, 3],
    //       [-3, 3],
    //       [-0, .4],
    //     ],
    //     rotation: [0, 0, 0],
    //     position: [0, 0, 0],
    //     scale: [1, 1, .5],
    //   })
    //   .grid({
    //     axes: [2, 3],
    //     divideX: 10,
    //     divideY: 10,
    //     width: 1,
    //     opacity: .2,
    //     color: "#2e3440",
    //   })
    //   .visible(false)



    const view = root
    .cartesian({
        range: [
        [-3, 3],
        [-3, 3],
        [0, .4],
        ],
        scale: [1, 1, .5],
        position: [0,0 , 0] // shift the origin
    })
    .axis({
        axis: 1,
        width: 2,
    })
    .axis({
        axis: 2,
        width: 2,
    })
    .axis({
        axis: 3,
        width: 2,
    })

    // .grid({
    //     width: 2,  
    //     divideX: 20,
    //     divideY: 10,
    // });
    root.select('axis').set('color', '#b0b0b0');



    var camera = root.camera({
        proxy: true,
        position: [2, .4, 1],
        rotation: [Math.PI, 0, 0],
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
                 1 / (2 * Math.PI * sig1.value * sig2.value * Math.sqrt(1 - rho.value**2)) * 
                 Math.exp(-z / (2* (1 -rho.value**2))));
        },
        width: 100,
        channels: 3,
        height: 100,
        rangeX: [-3, 3],
        rangeY: [-3, 3]
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

    // let vertGrid = view.grid({
    //     axes: [1, 2],
    //     divideX: 10,
    //     divideY: 10,
    //     width: 1,
    //     opacity: .2,
    //     color: "#2e3440",
    //     zBias: 1,
    // }).transform({
    //     position: [0, 0, 2],
    //     rotation: [Math.PI / 2, 0, 0]
    // })

    // let contours = view
    // .resample({
    //     height: 10,
    // })
    // .line({
    //     width: 2,
    //     color: '#2e3440',
    //     zIndex: 1,
    //     opacity: .2
    // })

    // let curve = view.line({
    //     width: 10,
    //     color: '#3090FF'
    // })
    // let points = view.point({
    //     size: 6,
    //     color: '#3090FF',
    //     zIndex: 1,
    // })

    // set the format for the axes ticks

    // labelling the axes
    let scale = view.scale({
        divide: 5,
        origin: [0, 0, 0], // goes through the origin, makes sense
        axis: 1,
        nice: true,
    }).ticks({
        width: 1,
        size: 5,
        color: "#b0b0b0"
    }).format({
        // format must come before the label
        digits: 2,
        weight: "normal",
    }) .label({
        color: "#b0b0b0",
        zIndex: 1,
        outline: 0
    })

    let scale2 = view.scale({
        divide: 5,
        origin: [0, 0, 0], // goes through the origin, makes sense
        axis: 2,
        nice: true,
    }).ticks({
        width: 1,
        size: 5,
        color: "#b0b0b0"
    }).format({
        digits: 2,
        weight: "normal",
    }).label({
        color: "#b0b0b0",
        zIndex: 1,
        outline: 0
    })

    // use array data to set axes text
    view.array({
        data: [
            [3, 0, 0],
            [0, 3, 0],
            [0, 0, .4],
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
            // emit latex in order of the data
            emit(
                el("latex", null, "\\color{#b0b0b0}x")
            )
            emit(
                el("latex", null, "\\color{#b0b0b0}y")
            )
            emit(
                el("latex", null, "\\color{#b0b0b0}\\text{density}")
            )
            // emit(
            //     el("span", {innerHTML: "density"})
            // )
        },
    })
    .dom({
        snap: false,
        offset: [0, 30, 0], // seems like in pixels? not sure units
        depth: 0.5, // makes it look smaller
        size: 24, // font-size
        zoom: 1,
        outline: 0, // natural outline to latex
        // attributes: {"style": {"color:": "#b0b0b0"}}
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
// let b = useDragNumber("#bLatex", 0, 10, .5)
// let z = useDragNumber("#zLatex", 0, 10, .3)
let aDragging = ref(false)
let aX = ref(0)
let aY = ref(0)
let currentX = 0

const aMin = 0;
const aMax = 10;

watch(mu1, (newMu1) => {
    if (mu1El) {
        mu1El.innerText = newMu1.toFixed(1)
    }
})
watch(mu2, (newMu2) => {
    if (mu2El) {
        mu2El.innerText = newMu2.toFixed(1)
    }
})
watch(sig1, (newSig1) => {
    if (sig1El) {
        sig1El.innerText = (newSig1**2).toFixed(2)
        rhos.forEach(rhoEl => {
            rhoEl.innerText = (rho.value * newSig1 * sig2.value).toFixed(2)
        })
    }
})
watch(sig2, (newSig2) => {
    if (sig2El) {
        sig2El.innerText = (newSig2**2).toFixed(2)
        rhos.forEach(rhoEl => {
            rhoEl.innerText = (rho.value * sig1.value * newSig2).toFixed(2)
        })
    }
})
watch(rho, (newRho) => {
    if (rhos.length === 0) {
        return
    }
    rhos.forEach(rhoEl => {
        rhoEl.innerText = (newRho * sig1.value * sig2.value).toFixed(2)
    });
})
useLinkHover(".mu1, .bivariate-density--slider__mu1", mu1Active)
useLinkHover(".mu2, .bivariate-density--slider__mu2", mu2Active)
useLinkHover(".sig1, .bivariate-density--slider__sig1", sig1Active)
useLinkHover(".sig2, .bivariate-density--slider__sig2", sig2Active)
useLinkHover(".rho, .bivariate-density--slider__rho", rhoActive)

</script>

<template>
    <Katex src="
    {\small
    \begin{aligned}
        &f(x, y;\htmlClass{mu1}{\mu_x}, \htmlClass{mu2}{\mu_y}, \htmlClass{sig1}{\sigma_x},\htmlClass{sig2}{\sigma_y}, \htmlClass{rho}{\rho}) =
    \frac{1}{2\pi\htmlClass{sig1}{\sigma_x}\htmlClass{sig2}{\sigma_y}\sqrt{1 - \htmlClass{rho}{\rho}^2}} \;\times\\
    &\quad\exp{\left(-\frac{1}{2(1-\htmlClass{rho}{\rho}^2)}\left[\left(\frac{x-\htmlClass{mu1}{\mu_x}}{\htmlClass{sig1}{\sigma_x}}\right)^2 +
    \left(\frac{y - \htmlClass{mu2}{\mu_y}}{\htmlClass{sig2}{\sigma_y}}\right)^2 -
    \left(\frac{2\htmlClass{rho}{\rho}(x - \htmlClass{mu1}{\mu_x})(y-\htmlClass{mu2}{\mu_y})}{\htmlClass{sig1}{\sigma_x}\htmlClass{sig2}{\sigma_y}}\right)\right]\right)}
    \end{aligned}
    }" :inline="false" />

    <div class="bivariate-applet">
        <div id="mathboxContainer" ref="mathboxContainer" style="min-height:350px;width:100%;margin:0 auto;"></div>
        <div class="bivariate-slider-group">
            <v-app class="vuetify-app">
                <v-row class="justify-space-around slider-row mt-1">
                <VSlider v-model="mu1" min="-2" max="2" step="0.1" class="mt-0 bivariate-density--slider__mu1" color="var(--nord12)" density="compact">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <VSlider v-model="mu2" min="-2" max="2" step="0.1" class="mt-0 bivariate-density--slider__mu2" color="var(--nord11)" density="compact">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <VSlider v-model="sig1" min="0.2" max="2" step="0.01" class="mt-0 bivariate-density--slider__sig1" color="var(--nord8)">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <VSlider v-model="sig2" min="0.2" max="2" step="0.01" class="mt-0 bivariate-density--slider__sig2" color="var(--nord10)">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <VSlider v-model="rho" min="-.9" max=".9" step="0.01" class="mt-0 bivariate-density--slider__rho" color="var(--nord13)" density="compact">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                </v-row>
                <v-row class="justify-space-around label-row mt-n3 flex-fill">
                        <v-label class="vuetify-slider-label mu1">
                            <span v-html="katex.renderToString('\\mu_x')"></span>&nbsp;=&nbsp;{{ (mu1 >= 0 ? " " : "") + mu1.toFixed(1) }}
                        </v-label>
                        <v-label class="vuetify-slider-label mu2">
                            <span v-html="katex.renderToString('\\mu_y')"></span>&nbsp;=&nbsp;{{ (mu2 >= 0 ? " " : "") + mu2.toFixed(1) }}
                        </v-label>
                        <v-label class="vuetify-slider-label sig1">
                            <span v-html="katex.renderToString('\\sigma_x')"></span>&nbsp;=&nbsp;{{ sig1.toFixed(2) }}
                        </v-label>
                        <v-label class="vuetify-slider-label sig2">
                            <span v-html="katex.renderToString('\\sigma_y')"></span>&nbsp;=&nbsp;{{ sig2.toFixed(2) }}
                        </v-label>
                        <v-label class="vuetify-slider-label rho">
                            <span v-html="katex.renderToString('\\rho')"></span>&nbsp;=&nbsp;{{ (rho >= 0 ? " " : "") + rho.toFixed(1) }}
                        </v-label>
                </v-row>
            </v-app>
        </div>
    </div>

    <div
      class="mean-control"
      v-html="katex.renderToString(`\\begin{align*}\\mathbb{E}
      \\begin{bmatrix}
        X\\\\
        Y
      \\end{bmatrix} &= 
      \\begin{bmatrix}
        \\htmlClass{mu1}{\\mu_x} \\\\
        \\htmlClass{mu2}{\\mu_y}
      \\end{bmatrix} = 
      \\begin{bmatrix} 
         \\htmlClass{mu1 mu1-number}{0.0} \\\\ 
         \\htmlClass{mu2 mu2-number}{0.0} 
      \\end{bmatrix} \\\\\\\\
      \\text{Var}
      \\begin{bmatrix}
        X\\\\
        Y
      \\end{bmatrix} &=
      \\begin{bmatrix}
        \\htmlClass{sig1}{\\sigma_x^2} & \\htmlClass{rho}{\\rho}\\htmlClass{sig1}{\\sigma_x}\\htmlClass{sig2}{\\sigma_y} \\\\
        \\htmlClass{rho}{\\rho}\\htmlClass{sig1}{\\sigma_x}\\htmlClass{sig2}{\\sigma_y} & \\htmlClass{sig2}{\\sigma_y^2}
      \\end{bmatrix} \\\\[1em]
      &=
      \\begin{bmatrix}
        \\htmlClass{sig1 sig1-number}{1.00} & \\htmlClass{rho rho-number}{0} \\\\
        \\htmlClass{rho rho-number}{0.0} & \\htmlClass{sig2 sig2-number}{1.00}
      \\end{bmatrix}
      \\end{align*}`, {displayMode:true, trust:true, strict:false})"></div>

</template>

<style lang="scss" scoped>
.ela {
    cursor: ew-resize;
    user-select: none;
}
:deep(.mu1) {
    &:hover, &:focus, &:active, &.active{
        // box-shadow: 0px 0px 10px 5px var(--nord12);
        text-shadow: var(--nord12) 0px 0px 10px;
        color: var(--nord12);
    }

}
:deep(.mu2) {
    &.active{
        text-shadow: var(--nord11) 0px 0px 10px;
        color: var(--nord11);
    }
}
:deep(.sig1) {
    &.active {
        text-shadow: var(--nord8) 0px 0px 10px;
        color: var(--nord8);
    }
}
:deep(.sig2){
    &.active {
        text-shadow: var(--nord10) 0px 0px 10px;
        color: var(--nord10);
    }
}
:deep(.rho) {
    &.active {
        color: var(--nord13);
        text-shadow: var(--nord13) 0px 0px 10px;
    }
}

.bivariate-applet {
    display: grid;
    grid-template-columns: 1fr; 
    grid-template-areas: "sliders"
                         "labels"
                         "mathbox"
                         "properties";
    grid-template-rows: 15px 15px 1fr;
}

.slider-row{
    grid-area: sliders;
    width: 100%;
}
.label-row {
    grid-area: labels;
    width: 100%;
}
.mean-control {
    grid-area: properties;
    user-select: none;
}
// .bivariate-slider-group {
//     grid-area: "sliders"
// }

#mathboxContainer {
    grid-area: mathbox;
}

.vuetify-app :deep(.v-application__wrap) {
    min-height: 0;
}
.vuetify-slider-label {
    // I'm being lazy and adjusting size based on screen instead of reorganizing flex
    font-size: min(calc(.7rem + 1vw), 1.1rem);
    font-family: monospace;
    opacity: .8;
}

@media screen and (max-width:450px) {
    .vuetify-slider-label {
        font-size: .7rem;
    }
}

</style>
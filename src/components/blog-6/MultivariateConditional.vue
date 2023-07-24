<script setup lang="ts">
import { onMounted, ref, watch, computed} from "vue"
import * as THREE from "three"
import { Vector3 } from "three/src/math/Vector3.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import katex from "katex"
import Katex from "../blog-5/Katex.vue"
import {VSlider} from "vuetify/components/VSlider"

import useDragNumber from "../../composables/blog-6/dragNumber.js"
import useLinkHover from "../../composables/blog-6/linkHover.ts"

let MathBox;
if (typeof window !== undefined) {
    MathBox = await import("mathbox")
}

const mvnConditionalBox = ref(null)

// const mu1 = ref(0)
// const mu2 = ref(0)
// const sigma1 = ref(1)
// const sigma2 = ref(1)
// const rho = ref(0)
// const y = ref(0)

const {num:mu1, isDragging:mu1CondActive} = useDragNumber(".mu1-conditional", -2, 2, 0.1, 0)
const {num:mu2, isDragging:mu2CondActive} = useDragNumber(".mu2-conditional", -2, 2, 0.1, 0)
const {num:y, isDragging:yCondActive} = useDragNumber(".y-conditional", -3, 3, 0.1, 0)
const {num:sigma1, isDragging:sigma1CondActive} = useDragNumber(".sigma1-conditional", .2, 2, 0.01, 1)
const {num:sigma2, isDragging:sigma2CondActive} = useDragNumber(".sigma2-conditional", .2, 2, 0.01, 1)
const {num:rho, isDragging:rhoCondActive} = useDragNumber(".rho-conditional", -.9, .9, 0.01, 0)

useLinkHover(".mu1-conditional", mu1CondActive)
useLinkHover(".mu2-conditional", mu2CondActive)
useLinkHover(".y-conditional", yCondActive)
useLinkHover(".sigma1-conditional", sigma1CondActive)
useLinkHover(".sigma2-conditional", sigma2CondActive)
useLinkHover(".rho-conditional", rhoCondActive)


let root;
// watch([mu1, mu2, sigma1, sigma2, rho], ()=> {
//     const cond_sd = Math.sqrt((1  - rho.value**2) * sigma1.value**2)
//     const cond_mean = mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value)
    
//     // console.log("cond_sd: ", cond_sd, "cond_mean: ", cond_mean)
// })

watch(y, () => {
    root?.select("#slice").set({position: [0, y.value / 3, 0]})
})

const cond_mean = computed(() => {
    return(mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value))
})

const cond_factor = computed(() => {
    return(1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2))
})

let condMeanEl, condVarEl, condFactorEl;
watch([y, mu1, mu2, rho, sigma1, sigma2], () => {
    if (condMeanEl) {
        condMeanEl.innerText =  cond_mean.value.toFixed(1)
    }
    if (condVarEl) {
        condVarEl.innerText = (sigma1.value**2 * (1 - rho.value**2)).toFixed(1)
    }
    if (condFactorEl) {
        condFactorEl.innerText = cond_factor.value.toFixed(3)
    }
})


onMounted(() => {
    condMeanEl = document.querySelector(".conditional-mean>.mord")
    condVarEl = document.querySelector(".conditional-var>.mord")
    condFactorEl = document.querySelector(".conditional-factor>.mord")
    
    // Mathbox code    
    MathBox.DOM.Types.latex = MathBox.DOM.createClass({
        render: function (el) {
          this.props.innerHTML = katex.renderToString(this.children, {strict:false});
          return el("span", this.props);
        },
      });

    const options = {
        element: mvnConditionalBox.value, // spawn into viewport
        plugins: ['core', 'controls', 'cursor'],
        controls: {
            klass: OrbitControls
        },
        camera: {
            up: new Vector3(0, 0, 1),
        },
    };

    root = MathBox.mathBox(options);
    const three = root.three
    // change background color
    three.controls.maxDistance = 5
    three.controls.minDistance = 1
    three.renderer.setClearColor(new THREE.Color(0x3b4252), 1.0);

    const view = root
    .cartesian({
        range: [
        [-3, 3],
        [-3, 3],
        [0, .4],
        ],
        scale: [1, 1, .5],
        position: [0, 0, 0] // shift the origin
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

    let scale = view.scale({
        divide: 5,
        origin: [0, 0, 0],
        axis: 1,
        nice: true,
    }).ticks({
        width: 1,
        size: 5,
        color: "#b0b0b0"
    }).format({
        digits: 2,
        weight: "normal",
    }) .label({
        color: "#b0b0b0",
        zIndex: 1,
        outline: 0,
        size: 12
    })
    .scale({
        divide: 5,
        origin: [0, 0, 0],
        axis: 2,
        nice: true,
    })
    .ticks({
        width: 1,
        size: 5,
        color: "#b0b0b0"
    })
    .format({
        // format must come before the label
        digits: 2,
        weight: "normal",
    })
    .label({
        color: "#b0b0b0",
        zIndex: 1,
        outline: 0,
        size: 12,
    })
    .array({
        id: "axis-labels",
        data: [[3, 0, 0], [0, 3, 0]],
        channels: 3,
        live: false
    })
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
            // emit(
            //     el("span", {innerHTML: "density"})
            // )
        },
    })
    .dom({
        snap: false,
        offset: [0, 30, 0], // seems like in pixels? not sure units
        depth: 0.8, // makes it look smaller
        size: 24, // font-size
        zoom: 1,
        outline: 0, // natural outline to latex
        // attributes: {"style": {"color:": "#b0b0b0"}}
    })


    let data = view.area({
        expr: function(emit, x, y, i, j, t) {
            // emit(x, a.value * x * x - b.value * y * y, y);
            const z = ((x - mu1.value)**2) / sigma1.value**2  + 
                      ((y-mu2.value)**2) / sigma2.value**2 - 
                      2 * rho.value * (x - mu1.value) * (y - mu2.value) / sigma1.value/ sigma2.value
            emit(x,y,
                 1 / (2 * Math.PI * sigma1.value * sigma2.value * Math.sqrt(1 - rho.value**2)) * 
                 Math.exp(-z / (2* (1 -rho.value**2))));
        },
        width: 100,
        channels: 3,
        height: 100,
        rangeX: [-3, 3],
        rangeY: [-3, 3]
    }).surface({
        shaded: true,
        // lineX: true,
        // lineY: true,
        opacity: .8,
        fill: true,
        color: '#bf616a',
        width: 2,
        zBias: 1,
    })

    const sliceView = root
      .cartesian({
        range: [
          [-3, 3],
          [-3, 3],
          [-0, .4],
        ],
        rotation: [0, 0, 0],
        position: [0, 0, 0],
        scale: [1, 1, .5],
        id: "slice"
      })
      .grid({
        axes: [1, 3],
        divideX: 10,
        divideY: 10,
        width: 1,
        opacity: .2,
        color: "#2e3440",
        // color: "#c0c0c0",
      })
      .interval({
        expr: function (emit, x, i, t) {
        //   emit(x, x**2);
        // 
        // mean is \mu_1 + \rho \sigma_1 / sigma_2 * (x2 - mu2)
        // var is (1 - \rho^2) * \sigma_1^2
          const cond_sd = Math.sqrt((1  - rho.value**2) * sigma1.value**2)
          const cond_mean = mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value)
          const norm_factor = 1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2)
          emit(x, 0, 1/(Math.sqrt(2*Math.PI) * cond_sd) * Math.exp(-1 * (x - cond_mean)**2 / 2 / cond_sd**2) * norm_factor)
        },
        width: 60,
        channels: 3,
        items: 1,
        range: [-3, 3]
      })
      .line({
        width: 2,
        color: "#bf616a",
        zIndex: 1,
      })
      .interval({
        expr: function (emit, x, i, t) {
        //   emit(x, x**2);
        // 
        // mean is \mu_1 + \rho \sigma_1 / sigma_2 * (x2 - mu2)
        // var is (1 - \rho^2) * \sigma_1^2
          const cond_sd = Math.sqrt((1  - rho.value**2) * sigma1.value**2)
          const cond_mean = mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value)
          const norm_factor = 1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2)
          emit(x, 0, 1/(Math.sqrt(2*Math.PI) * cond_sd) * Math.exp(-1 * (x - cond_mean)**2 / 2 / cond_sd**2))
        },
        width: 60,
        channels: 3,
        items: 1,
        range: [-3, 3]
    })
    .line({
    width: 2,
    color: "#2e3440",
    zIndex: 1,
    })
    .array({
        id: "slice-labels",
        data: [[-2.9, y.value, .4], [2.4, y.value, .4]],
        channels: 3,
        live: true
    })
    .html({
        width: 8,
        height: 3,
        depth: 2,
        expr: function(emit, el, i, j, k, l, time) {
            // emit latex in order of the data
            emit(
                el("latex", null, `\\color{#a3be8c}y=${y.value.toFixed(1)}`)
            )
            // emit(
            //     el("latex", null, "\\color{#a3be8c}\\frac{1}{f_Y(y)}= " + cond_factor.value.toFixed(3))
            // )
            emit(
                el("latex", null, "\\frac{\\color{#bf616a}\\blacksquare}{\\color{#000000} \\blacksquare}= " + cond_factor.value.toFixed(3))
            )
            // emit(
            //     el("span", {innerHTML: "density"})
            // )
        },
    })
    .dom({
        snap: false,
        offset: [0, 30, 0], // seems like in pixels? not sure units
        depth: 0.8, // makes it look smaller
        size: 24, // font-size
        zoom: 1,
        outline: 0, // natural outline to latex
        // attributes: {"style": {"color:": "#b0b0b0"}}
    })

    // const play = root.play({
    //     target: "cartesian",
    //     pace: 5,
    //     to: 2,
    //     loop: true,
    //     script:[
    //     {props: {scale: [1, 1, .5]}},
    //     {props: {scale: [0, 1, .5]}},
    //     {props: {scale: [1, 1, .5]}},
    //     ]
    // })
    
    
    
    var camera = root.camera({
        proxy: true,
        position: [2, .4, 1],
        rotation: [Math.PI, 0, 0],
    });
    
    // select all axes
    root.select('axis').set('color', '#b0b0b0');
    root.set('focus', 3)
})
</script>

<template>
    <div class="bivariate-conditional-applet">
        <div id="mvn-conditional-box" class="mvn-conditional-box" ref="mvnConditionalBox" style="min-height:350px;width:100%;margin:0 auto;"></div>

        <div class="conditional-slider-group">
            <v-app class="vuetify-app">
                <v-row no-gutters class="justify-space-around slider-row mx-0">
                <v-col class="d-flex flex-column">
                    <VSlider v-model="y" min="-3" max="3" step="0.1" class="mt-0" color="var(--nord14)" density="compact">
                        <!-- <template v-slot:append> -->
                        <!-- </template> -->
                    </VSlider>
                    <v-label class="vuetify-slider-label y-conditional justify-center ylabel">
                        <span v-html="katex.renderToString('y')"></span>&nbsp;=&nbsp;{{ y.toFixed(2) }}
                    </v-label>
                </v-col>
                <v-col class="d-flex flex-column">
                <VSlider v-model="mu1" min="-2" max="2" step="0.1" class="mt-0" color="var(--nord12)" density="compact">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <v-label class="vuetify-slider-label mu1-conditional justify-center">
                    <span v-html="katex.renderToString('\\mu_x')"></span>&nbsp;=&nbsp;{{ (mu1 >= 0 ? " " : "") + mu1.toFixed(1) }}
                </v-label>
                </v-col>

                <v-col class="d-flex flex-column">
                <VSlider v-model="mu2" min="-2" max="2" step="0.1" class="mt-0" color="var(--nord11)" density="compact">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <v-label class="vuetify-slider-label mu2-conditional justify-center">
                    <span v-html="katex.renderToString('\\mu_y')"></span>&nbsp;=&nbsp;{{ (mu2 >= 0 ? " " : "") + mu2.toFixed(1) }}
                </v-label>
                </v-col>

                <v-col class="d-flex flex-column">
                <VSlider v-model="sigma1" min="0.2" max="2" step="0.01" class="mt-0" color="var(--nord8)">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                <v-label class="vuetify-slider-label sigma1-conditional justify-center">
                    <span v-html="katex.renderToString('\\sigma_x')"></span>&nbsp;=&nbsp;{{ sigma1.toFixed(2) }}
                </v-label>
                </v-col>

                <v-col class="d-flex flex-column">
                <VSlider v-model="sigma2" min="0.2" max="2" step="0.01" class="mt-0" color="var(--nord10)">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                        <v-label class="vuetify-slider-label justify-center sigma2-conditional">
                            <span v-html="katex.renderToString('\\sigma_y')"></span>&nbsp;=&nbsp;{{ sigma2.toFixed(2) }}
                        </v-label>
                </v-col>
                <v-col class="d-flex flex-column px-0 mx-0">
                <VSlider v-model="rho" min="-.9" max=".9" step="0.01" class="" color="var(--nord13)" density="compact">
                    <!-- <template v-slot:append> -->
                    <!-- </template> -->
                </VSlider>
                        <v-label class="vuetify-slider-label justify-center rho-conditional">
                            <span v-html="katex.renderToString('\\rho')"></span>&nbsp;=&nbsp;{{ (rho >= 0 ? " " : "") + rho.toFixed(1) }}
                        </v-label>
                </v-col>
                </v-row>
            </v-app>
        </div>
<div class="bivariate-conditional-eqns">

        <Katex src="
        \begin{aligned}
        E[X | Y = \htmlClass{y-conditional}{y}] &= \htmlClass{mu1-conditional}{\mu_x} + \htmlClass{rho-conditional}{\rho} \frac{\htmlClass{sigma1-conditional}{\sigma_x}}{\htmlClass{sigma2-conditional}{\sigma_y}}(\htmlClass{y-conditional}{y} - \htmlClass{mu2-conditional}{\mu_y})\\
        &=\htmlClass{conditional-mean}{0.0} \\[1em]
        Var[X | Y = \htmlClass{y-conditional}{y}] &= \htmlClass{sigma1-conditional}{\sigma^2_x}(1 - \htmlClass{rho-conditional}{\rho}^2) \\[.5em]
        &= \htmlClass{conditional-var}{1.0} \\[1em]
        \frac{\color{#bf616a} \blacksquare}{\color{#000000} \blacksquare}
        &= \frac{1}{f_{\tiny Y}(\htmlClass{y-conditional}{y})} \\[1em]
        &= \htmlClass{conditional-factor}{0.399}
        \end{aligned}"
        :inline="false"></Katex>
</div>
</div>
        <!-- <label for="mu1">mu1</label>
        <input
            id="mu1"
            type="range"
            min="-3"
            max="3"
            step="0.1"
            v-model.number="mu1">
        <label for="mu2">mu2</label>
        <input
            id="mu2"
            type="range"
            min="-3"
            max="3"
            step="0.1"
            v-model.number="mu2">
        <label for="sigma1">sigma1</label>
        <input
            id="sigma1"
            type="range"
            min=".2"
            max="3"
            step="0.1"
            v-model.number="sigma1">
        <label for="sigma2">sigma2</label>
        <input
            id="sigma2"
            type="range"
            min=".2"
            max="3"
            step="0.1"
            v-model.number="sigma2">
        <label for="rho">rho</label>
        <input
            id="rho"
            type="range"
            min="-.8"
            max=".8"
            step="0.05"
            v-model.number="rho">
        <label for="y">y</label>
        <input
            id="y"
            type="range"
            min="-2"
            max="2"
            step="0.1"
            v-model.number="y">
            <ul>
                <li>mu1: {{ mu1 }}</li>
                <li>mu2: {{ mu2 }}</li>
                <li>sigma1: {{ sigma1 }}</li>
                <li>sigma2: {{ sigma2 }}</li>
                <li>rho: {{ rho }}</li>
            </ul> -->
</template>

<style lang="scss" scoped>
.slider-row{
    grid-area: sliders;
    width: 100%;
}
.label-row {
    grid-area: labels;
    width: 100%;
}
.vuetify-app :deep(.v-application__wrap) {
    min-height: 0;
}
.vuetify-app :deep(.v-input--horizontal) {
    grid-template-rows: auto 0;
}

.mvn-conditional-box {
    grid-area: mathbox;
}
.conditional-slider-group {
    grid-area: sliders
}
.vuetify-slider-label {
    // I'm being lazy and adjusting size based on screen instead of reorganizing flex
    font-size: min(calc(.7rem + 1vw), 1.1rem);
    // font-family: monospace;
    opacity: .8;
}
.bivariate-conditional-eqns {
    grid-area: eqns;
    user-select: none;
    -webkit-user-select: none;
}

.bivariate-conditional-applet {
    display: grid;
    grid-template-areas: "sliders" "mathbox" "eqns";
    grid-template-rows: 40px 1fr .5fr;
}

:deep(.mu1-conditional) {
    &:hover, &:focus, &:active, &.active{
        // box-shadow: 0px 0px 10px 5px var(--nord12);
        text-shadow: var(--nord12) 0px 0px 10px;
        color: var(--nord12);
    }

}
:deep(.mu2-conditional) {
    &.active{
        text-shadow: var(--nord11) 0px 0px 10px;
        color: var(--nord11);
    }
}
:deep(.y-conditional) {
    &.active {
        text-shadow: var(--nord14) 0px 0px 10px;
        color: var(--nord14);
    }
}
:deep(.sigma1-conditional) {
    &.active {
        text-shadow: var(--nord8) 0px 0px 10px;
        color: var(--nord8);
    }
}
:deep(.sigma2-conditional){
    &.active {
        text-shadow: var(--nord10) 0px 0px 10px;
        color: var(--nord10);
    }
}
:deep(.rho-conditional) {
    &.active {
        color: var(--nord13);
        text-shadow: var(--nord13) 0px 0px 10px;
    }
}
</style>
<script setup lang="ts">
import { onMounted, ref, watch, computed} from "vue"
import * as THREE from "three"
import { Vector3 } from "three/src/math/Vector3.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import katex from "katex"
import Katex from "../blog-5/Katex.vue"
import {VSlider} from "vuetify/components/VSlider"
import {VBtn} from "vuetify/components/VBtn"

import useDragNumber from "../../composables/blog-6/dragNumber.js"
import useLinkHover from "../../composables/blog-6/linkHover.ts"

let MathBox;
if (typeof window !== undefined) {
    MathBox = await import("mathbox")
}

let root;
const mvnMarginalBox = ref(null)

// const mu1 = ref(0)
// const mu2 = ref(0)
// const sigma1 = ref(1)
// const sigma2 = ref(1)
// const rho = ref(0)
const y = ref(0)
const eps = ref(1)
const isPlaying = ref(true)
const isIntegrating = ref(true)

const togglePlay = () => {
    root.select('play').set('speed', isPlaying.value ? 0 : 1)
    isPlaying.value = !isPlaying.value
}
const toggleIntegration = () => {
    if (isIntegrating.value) {
        root.select("#surfacePlay").set({"from": 1, "loop": false})
    } else {
        root.select("#surfacePlay").set({"from": 0, "loop": true})
    }
    // root.select("#surfacePlay").set({"from": 1, "loop": false}) 
    isIntegrating.value = !isIntegrating.value
}

const {num:mu1, isDragging:mu1MargActive} = useDragNumber(".mu1-marginal", -2, 2, 0.1, 0)
const {num:mu2, isDragging:mu2MargActive} = useDragNumber(".mu2-marginal", -2, 2, 0.1, 0)
const {num:sigma1, isDragging:sigma1MargActive} = useDragNumber(".sigma1-marginal", .2, 2, 0.01, 1)
const {num:sigma2, isDragging:sigma2MargActive} = useDragNumber(".sigma2-marginal", .2, 2, 0.01, 1)
const {num:rho, isDragging:rhoMargActive} = useDragNumber(".rho-marginal", -.9, .9, 0.01, 0)

useLinkHover(".mu1-marginal", mu1MargActive)
useLinkHover(".mu2-marginal", mu2MargActive)
useLinkHover(".sigma1-marginal", sigma1MargActive)
useLinkHover(".sigma2-marginal", sigma2MargActive)
useLinkHover(".rho-marginal", rhoMargActive)


// watch([mu1, mu2, sigma1, sigma2, rho], ()=> {
    //     const cond_sd = Math.sqrt((1  - rho.value**2) * sigma1.value**2)
    //     const cond_mean = mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value)
    
    //     // console.log("cond_sd: ", cond_sd, "cond_mean: ", cond_mean)
    // })
    
    // watch(y, () => {
        //     root?.select("#slice").set({position: [0, y.value / 3, 0]})
        // })
        
        const marg_factor = computed(() => {
            const cond_sd = Math.sqrt((1  - rho.value**2) * sigma2.value**2)
            return(1/(Math.sqrt(2 * Math.PI) * cond_sd))
        })
        
        let margMeanEl, margVarEl, margFactorEl;
        watch([mu1, sigma1, sigma2, rho], (newMu1, newSigma1) => {
            if (margMeanEl) {
                margMeanEl.innerText =  mu1.value.toFixed(1)
            }
            if (margVarEl) {
                margVarEl.innerText = sigma1.value.toFixed(2)
            }
            if (margFactorEl) {
                margFactorEl.innerText = marg_factor.value.toFixed(2)
            }
        })
        
        
        onMounted(() => {
            margMeanEl = document.querySelector(".marginal-mean>.mord")
            margVarEl = document.querySelector(".marginal-var>.mord")
            margFactorEl = document.querySelector(".marginal-factor>.mord")
            
            // Mathbox code    
            MathBox.DOM.Types.latex = MathBox.DOM.createClass({
                render: function (el) {
                    this.props.innerHTML = katex.renderToString(this.children, {strict:false});
                    return el("span", this.props);
                },
            });
            
            const options = {
                element: mvnMarginalBox.value, // spawn into viewport
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
            // .transform({
                //     matrix: [
                //         1, 0, 0, 0,
                //         0, .1, 0, 0,
                //         0, 0, 1, 0,
                //         0, 0, 0, 1,
                //     ],
                // })
                
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
                        2 * rho.value * (x - mu1.value) * (y - eps.value * mu2.value) / sigma1.value/ sigma2.value
                        const cond_sd = Math.sqrt((1  - rho.value**2) * sigma2.value**2)
                        const cond_mean = mu2.value + rho.value * sigma2.value / sigma1.value * (x-mu1.value)
                        //   const norm_factor = 1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2)
                        //   emit(x, 0, )
                        const cond_dens = 1/(Math.sqrt(2*Math.PI) * cond_sd) * Math.exp(-1 * (y- cond_mean)**2 / 2 / cond_sd**2)
                        const cond_factor = 1/(Math.sqrt(2 * Math.PI) * cond_sd)
                        const joint_dens =1 / (2 * Math.PI * sigma1.value * sigma2.value * Math.sqrt(1 - rho.value**2)) * 
                        Math.exp(-z / (2* (1 -rho.value**2))) 
                        emit(x,y,joint_dens);
                    },
                    width: 100,
                    channels: 3,
                    height: 100,
                    rangeX: [-3, 3],
                    rangeY: [-3, 3],
                    id: "marginalsurface"
                })
                .surface({
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
                        //   const cond_sd = Math.sqrt((1  - rho.value**2) * sigma1.value**2)
                        //   const cond_mean = mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value)
                        //   const norm_factor = 1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2)
                        
                        const marg_mean = mu1.value
                        const marg_sd = sigma1.value
                        emit(x, 0, 1/(Math.sqrt(2*Math.PI) * marg_sd) * Math.exp(-1 * (x- marg_mean)**2 / 2 / marg_sd**2))
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
                .interval({
                    expr: function (emit, x, i, t) {
                        const marg_mean = mu1.value
                        const marg_sd = sigma1.value
                        emit(x, 0, 1/(Math.sqrt(2*Math.PI) * marg_sd) * Math.exp(-1 * (x- marg_mean)**2 / 2 / marg_sd**2) * marg_factor.value)
                    },
                    //     //   emit(x, x**2);
                    //     // 
                    //     // mean is \mu_1 + \rho \sigma_1 / sigma_2 * (x2 - mu2)
                    //     // var is (1 - \rho^2) * \sigma_1^2
                    //       const cond_sd = Math.sqrt((1  - rho.value**2) * sigma1.value**2)
                    //       const cond_mean = mu1.value + rho.value * sigma1.value / sigma2.value * (y.value - mu2.value)
                    //       const norm_factor = 1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2)
                    //       emit(x, 0, 1/(Math.sqrt(2*Math.PI) * cond_sd) * Math.exp(-1 * (x - cond_mean)**2 / 2 / cond_sd**2))
                    // },
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
                .array({
                    id: "slice-labels",
                    data: [[-2.6, 0, .4]],
                    channels: 3,
                    live: true
                })
                .html({
                    width: 8,
                    height: 3,
                    depth: 2,
                    expr: function(emit, el, i, j, k, l, time) {
                        // emit latex in order of the data
                        // emit(
                        //     el("latex", null, `\\color{#b0b0b0}\\frac{1}{\\sigma_{\\tiny Y|X}\\sqrt{2\\pi}} = ${marg_factor.value.toFixed(2)}`)
                        // )
                        emit(
                        el("latex", null, `\\frac{\\color{#bf616a}\\blacksquare}{\\color{#000000}\\blacksquare} = ${marg_factor.value.toFixed(2)}`)
                        )
                        // emit(
                        //     el("latex", null, "\\color{#a3be8c}\\text{Int. Factor}= " + marg_factor.value.toFixed(3))
                        // )
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
                
                const play = root.play({
                    target: "cartesian",
                    pace: 5,
                    from: 0,
                    to: 2,
                    loop: true,
                    script:[
                    {props: {scale: [1, 1, .5]}},
                    {props: {scale: [1, 0, .5]}},
                    {props: {scale: [1, 1, .5]}},
                    ]
                })
                const surfacePlay = root.play({
                    id: "surfacePlay",
                    target: "#marginalsurface",
                    pace: 5,
                    from: 0, 
                    to: 2,
                    loop: true,
                    script:[{
                        expr: function(emit, x, y, i, j, t) {
                            // emit(x, a.value * x * x - b.value * y * y, y);
                            const z = ((x - mu1.value)**2) / sigma1.value**2  + 
                            ((y-mu2.value)**2) / sigma2.value**2 - 
                            2 * rho.value * (x - mu1.value) * (y - eps.value * mu2.value) / sigma1.value/ sigma2.value
                            const joint_dens =1 / (2 * Math.PI * sigma1.value * sigma2.value * Math.sqrt(1 - rho.value**2)) * 
                            Math.exp(-z / (2* (1 -rho.value**2))) 
                            // emit(x,y,joint_dens / ((Math.sin(t/2.5) + 1) / 2 * (cond_factor - 1) + 1));
                            emit(x, y, joint_dens)
                        }
                    },
                    {
                        expr: function(emit, x, y, i, j, t) {
                            // emit(x, a.value * x * x - b.value * y * y, y);
                            const z = ((x - mu1.value)**2) / sigma1.value**2  + 
                            ((y-mu2.value)**2) / sigma2.value**2 - 
                            2 * rho.value * (x - mu1.value) * (y - eps.value * mu2.value) / sigma1.value/ sigma2.value
                            const cond_sd = Math.sqrt((1  - rho.value**2) * sigma2.value**2)
                            //   const norm_factor = 1/(Math.sqrt(2*Math.PI)*sigma2.value) * Math.exp(-1 * (y.value - mu2.value)**2 / 2 / sigma2.value ** 2)
                            //   emit(x, 0, )
                            const cond_factor = 1/(Math.sqrt(2 * Math.PI) * cond_sd)
                            const joint_dens =1 / (2 * Math.PI * sigma1.value * sigma2.value * Math.sqrt(1 - rho.value**2)) * 
                            Math.exp(-z / (2* (1 -rho.value**2))) 
                            emit(x,y,joint_dens / cond_factor);
                        }
                    },
                    {
                        expr: function(emit, x, y, i, j, t) {
                            // emit(x, a.value * x * x - b.value * y * y, y);
                            const z = ((x - mu1.value)**2) / sigma1.value**2  + 
                            ((y-mu2.value)**2) / sigma2.value**2 - 
                            2 * rho.value * (x - mu1.value) * (y - eps.value * mu2.value) / sigma1.value/ sigma2.value
                            const joint_dens =1 / (2 * Math.PI * sigma1.value * sigma2.value * Math.sqrt(1 - rho.value**2)) * 
                            Math.exp(-z / (2* (1 -rho.value**2))) 
                            emit(x,y,joint_dens);
                        }
                    }
                    ]
                })
                
                
                
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
            <div class="bivariate-marginal-applet">
                <div id="mvn-marginal-box" class="mvn-marginal-box" ref="mvnMarginalBox" style="min-height:350px;width:100%;margin:0 auto;">
                    <div class="marginal-animation-control">
                        
                        <VBtn class="marginal-play-control" variant="text" @click="togglePlay()">{{ isPlaying ? "Pause" : "Play" }}</VBtn>
                        <VBtn class="marginal-integration-control" variant="text" @click="toggleIntegration()">{{ isIntegrating ? "Profile" : "Integrate" }}</VBtn>
                    </div>
                </div>
                
                <div class="marginal-slider-group">
                    <v-app class="vuetify-app">
                        <v-row dense class="justify-space-around slider-row mx-0">
                            <v-col class="d-flex flex-column">
                                <VSlider v-model="mu1" min="-2" max="2" step="0.1" class="mt-0" color="var(--nord12)" density="compact">
                                    <!-- <template v-slot:append> -->
                                        <!-- </template> -->
                                    </VSlider>
                                    <v-label class="vuetify-slider-label mu1-marginal justify-center">
                                        <span v-html="katex.renderToString('\\mu_x')"></span>&nbsp;=&nbsp;{{ (mu1 >= 0 ? " " : "") + mu1.toFixed(1) }}
                                    </v-label>
                                </v-col>
                                <v-col class="d-flex flex-column">
                                    <VSlider v-model="mu2" min="-2" max="2" step="0.1" class="mt-0" color="var(--nord11)" density="compact">
                                        <!-- <template v-slot:append> -->
                                            <!-- </template> -->
                                        </VSlider>
                                        <v-label class="vuetify-slider-label mu2-marginal justify-center">
                                            <span v-html="katex.renderToString('\\mu_y')"></span>&nbsp;=&nbsp;{{ (mu2 >= 0 ? " " : "") + mu2.toFixed(1) }}
                                        </v-label>
                                    </v-col>
                                    
                                    <v-col class="d-flex flex-column">
                                        <VSlider v-model="sigma1" min="0.2" max="2" step="0.01" class="mt-0" color="var(--nord8)">
                                            <!-- <template v-slot:append> -->
                                                <!-- </template> -->
                                            </VSlider>
                                            <v-label class="vuetify-slider-label sigma1-marginal justify-center">
                                                <span v-html="katex.renderToString('\\sigma_x')"></span>&nbsp;=&nbsp;{{ sigma1.toFixed(2) }}
                                            </v-label>
                                        </v-col>
                                        
                                        <v-col class="d-flex flex-column">
                                            <VSlider v-model="sigma2" min="0.2" max="2" step="0.01" class="mt-0" color="var(--nord10)">
                                                <!-- <template v-slot:append> -->
                                                    <!-- </template> -->
                                                </VSlider>
                                                <v-label class="vuetify-slider-label justify-center sigma2-marginal">
                                                    <span v-html="katex.renderToString('\\sigma_y')"></span>&nbsp;=&nbsp;{{ sigma2.toFixed(2) }}
                                                </v-label>
                                            </v-col>
                                            <v-col class="d-flex flex-column px-0 mx-0">
                                                <VSlider v-model="rho" min="-.9" max=".9" step="0.01" class="" color="var(--nord13)" density="compact">
                                                    <!-- <template v-slot:append> -->
                                                        <!-- </template> -->
                                                    </VSlider>
                                                    <v-label class="vuetify-slider-label justify-center rho-marginal">
                                                        <span v-html="katex.renderToString('\\rho')"></span>&nbsp;=&nbsp;{{ (rho >= 0 ? " " : "") + rho.toFixed(1) }}
                                                    </v-label>
                                                </v-col>
                                            </v-row>
                                        </v-app>
                                    </div>
                                    <div class="bivariate-marginal-eqns">
                                        <div class="marginal-eqn__col1">
                                            <Katex src="
                                            \begin{aligned}
                                            E[X] &= \htmlClass{mu1-marginal}{\mu_x} \\
                                            &=\htmlClass{marginal-mean mu1-marginal}{0.0} \\[1em]
                                            \frac{\color{#bf616a} \blacksquare}{\color{#000000} \blacksquare}
                                            &= \frac{1}{\htmlClass{sigma2-marginal}{\sigma_y}\sqrt{2\pi(1-\htmlClass{rho-marginal}{\rho}^2)}} \\[.5em]
                                            &= \htmlClass{marginal-factor}{0.40}
                                            \end{aligned}"
                                            :inline="false"></Katex>
                                        </div>
                                        <div class="marginal-eqn__col2">
                                            <Katex src="\begin{aligned}
                                            \mathrm{Var}[X] &= \htmlClass{sigma1-marginal}{\sigma^2_x} \\
                                            &= \htmlClass{marginal-var sigma1-marginal}{1.00}
                                            \end{aligned}" :inline="false"></Katex>
                                        </div>
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
                                
                                .mvn-marginal-box {
                                    grid-area: mathbox;
                                }
                                .marginal-slider-group {
                                    grid-area: sliders
                                }
                                .vuetify-slider-label {
                                    // I'm being lazy and adjusting size based on screen instead of reorganizing flex
                                    font-size: min(calc(.7rem + 1vw), 1.1rem);
                                    // font-family: monospace;
                                    opacity: .8;
                                }
                                .bivariate-marginal-eqns {
                                    grid-area: eqns;
                                    user-select: none;
                                    -webkit-user-select: none;
                                    
                                    display: flex;
                                    flex-direction: row;
                                    align-content: start;
                                    
                                    & .marginal-eqn__col1 {
                                        flex-grow: 1;
                                        flex-basis: auto;
                                    }
                                    & .marginal-eqn__col2 {
                                        flex-grow: 1;
                                        flex-basis: auto;
                                    }
                                    
                                }
                                
                                .bivariate-marginal-applet {
                                    display: grid;
                                    grid-template-areas: "sliders" "mathbox" "eqns";
                                    grid-template-rows: 40px 1fr .5fr;
                                }
                                .marginal-animation-control {
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: end;
                                    & .marginal-integration-control {
                                        margin-top: 5px;
                                    }
                                    & .marginal-play-control {
                                    }
                                }
                                
                                :deep(.mu1-marginal) {
                                    &:hover, &:focus, &:active, &.active{
                                        // box-shadow: 0px 0px 10px 5px var(--nord12);
                                        text-shadow: var(--nord12) 0px 0px 10px;
                                        color: var(--nord12);
                                    }
                                    
                                }
                                :deep(.mu2-marginal) {
                                    &.active{
                                        text-shadow: var(--nord11) 0px 0px 10px;
                                        color: var(--nord11);
                                    }
                                }
                                :deep(.sigma1-marginal) {
                                    &.active {
                                        text-shadow: var(--nord8) 0px 0px 10px;
                                        color: var(--nord8);
                                    }
                                }
                                :deep(.sigma2-marginal){
                                    &.active {
                                        text-shadow: var(--nord10) 0px 0px 10px;
                                        color: var(--nord10);
                                    }
                                }
                                :deep(.rho-marginal) {
                                    &.active {
                                        color: var(--nord13);
                                        text-shadow: var(--nord13) 0px 0px 10px;
                                    }
                                }
                            </style>
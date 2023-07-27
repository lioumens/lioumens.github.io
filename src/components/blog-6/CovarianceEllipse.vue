<script setup lang="ts">
import {ref, computed, onMounted, watch, watchEffect} from "vue"
import Katex from "../blog-5/Katex.vue"
import katex from "katex"
import {VSlider} from "vuetify/components/VSlider"
import useDragNumber from "../../composables/blog-6/dragNumber.js"
import useLinkHover from "../../composables/blog-6/linkHover.ts"

const SVGBox = ref()
// const sig2 = ref(1)
// const rho = ref(0)
const a = computed(() => sig1.value**2)
const b = computed(() => rho.value * sig1.value * sig2.value)
const d = computed(() => sig2.value**2)
const trace = computed(() => a.value + d.value)
const det = computed(() => a.value * d.value - b.value**2)
const lambda1 = computed(() => (trace.value + Math.sqrt(trace.value**2 - 4 * det.value)) / 2)
const lambda2 = computed(() => (trace.value - Math.sqrt(trace.value**2 - 4 * det.value)) / 2)
// const theta = computed(() => Math.atan2(2 * b.value, a.value - d.value) / 2)
const theta = computed(() => Math.atan2(v1b.value, v1a.value))
const v1a = computed(() => Math.abs(rho.value) < .0001 ? 1 : lambda1.value - d.value)
const v1b = computed(() =>  Math.abs(rho.value) < .0001 ? 0 : b.value)
const v2a = computed(() => Math.abs(rho.value) < .0001 ? 0 : lambda2.value - d.value)
const v2b = computed(() => rho.value == 0 ? 1 : b.value)
// const theta = computed(() => Math.atan2(lambda1.value - a.value, b.value))

const basescale = 45
const minor_radius = computed(() => Math.sqrt((rho == 0 && sig1 < sig2) ? lambda1.value : lambda2.value)*basescale)
const major_radius = computed(() => Math.sqrt((rho == 0 && sig1 < sig2) ? lambda2.value : lambda1.value)*basescale)


const {num:sig1, isDragging:sig1EllipseActive} = useDragNumber(".sigma1-ellipse", 0.5, 2, 0.01, 1)
const {num:sig2, isDragging:sig2EllipseActive} = useDragNumber(".sigma2-ellipse", 0.5, 2, 0.01, 1)
const {num:rho, isDragging:rhoEllipseActive} = useDragNumber(".rho-ellipse", -0.9, 0.9, 0.01, 0)

useLinkHover(".sigma1-ellipse, .ellipse-slider__sig1", sig1EllipseActive)
useLinkHover(".sigma2-ellipse, .ellipse-slider__sig2", sig2EllipseActive)
useLinkHover(".rho-ellipse, .ellipse-slider__rho", rhoEllipseActive)


let sig1El : HTMLElement | null, 
sig2El : HTMLElement | null, 
rhoEl : NodeListOf<HTMLElement>, 
    lambda1El : HTMLElement | null,
    lambda2El : HTMLElement | null,
    v1aEl : HTMLElement | null,
    v1bEl : HTMLElement | null,
    v2aEl : HTMLElement | null,
    v2bEl: HTMLElement | null,
    thetaEl: HTMLElement | null
    
    onMounted(() => {
        sig1El = document.querySelector(".sigma1-latex-number>.mord")
        sig2El = document.querySelector(".sigma2-latex-number>.mord")
        rhoEl = document.querySelectorAll(".rho-latex-number>.mord")
        lambda1El = document.querySelector(".lambda1-latex-number>.mord")
        lambda2El = document.querySelector(".lambda2-latex-number>.mord")
        v1aEl = document.querySelector(".v1a-latex-number>.mord")
        v1bEl = document.querySelector(".v1b-latex-number>.mord")
        v2aEl = document.querySelector(".v2a-latex-number>.mord")
        v2bEl = document.querySelector(".v2b-latex-number>.mord")
        thetaEl = document.querySelector(".theta-latex-number>.mord")
        
    })
    
    watch([sig1, sig2, rho], () =>{
        if (sig1El) sig1El.innerText = (sig1.value ** 2).toFixed(2)
        if (sig2El) sig2El.innerText = (sig2.value ** 2).toFixed(2)
        if (rhoEl) {
            rhoEl.forEach(el => {
                el.innerText = (rho.value * sig1.value * sig2.value).toFixed(2)
            })
        }
        if (lambda1El) lambda1El.innerText = lambda1.value.toFixed(1)
        if (lambda2El) lambda2El.innerText = lambda2.value.toFixed(1)
        if (v1aEl) v1aEl.innerText = v1a.value.toFixed(1)
        if (v1bEl) v1bEl.innerText = v1b.value.toFixed(1)
        if (v2aEl) v2aEl.innerText = v2a.value.toFixed(1)
        if (v2bEl) v2bEl.innerText = v2b.value.toFixed(1)
        if (thetaEl) thetaEl.innerText = ( (sig2.value > sig1.value && rho.value == 0) ? "90.0" : 
            (Math.abs(theta.value - Math.PI) < .001) ? 
                "0.0" : 
                Math.abs(theta.value * 180 / Math.PI).toFixed(1)) + "°"
    })
    
</script>

<template>
    <!-- <input v-model="message" placeholder="edit me" /> -->
    <!-- <p>sig1: <input type="range" v-model="sig1" min=".5" max="2" step=".01"/>
        sig2: <input type="range" v-model="sig2" min=".5" max="2" step=".01"/>
        rho: <input type="range" v-model="rho" min="-.9" max=".9" step=".01"/></p>
        <p>{{ a }}, {{ b }}, {{ d }}</p>
        <p>Eigenvalues: {{ lambda1.toFixed(3) }}, {{ lambda2.toFixed(3) }}</p>
        <p>Eigenvectors: [{{ v1a.toFixed(2) }}, {{ v1b.toFixed(2) }}], [{{ v2a.toFixed(2) }}, {{ v2b.toFixed(2) }}]</p>
        <p>Theta: {{ theta*180 / Math.PI }}</p> -->
        <!-- <p>Message is: {{ message }}</p> -->
        
        <div class="cov-ellipse-applet">
            <div class="svg-section">
                <svg class="SVGBox" ref="SVGBox" viewBox="0 0 200 200" version="1.1">
                    <line x1="0" y1="100" x2="200" y2="100" stroke="#efefef" stroke-width="1" stroke-opacity=".2" />
                    <g :transform="`rotate(${Math.abs(-theta*180 / Math.PI + 180) < .0001 ? 0 : -theta*180 / Math.PI})`" style="transform-origin: center">
                        <ellipse class="svg-cov-ellipse" cx="100" cy="100" :rx="Math.sqrt((rho == 0 && sig1 < sig2) ? lambda2 : lambda1)*basescale" :ry="Math.sqrt((rho == 0 && sig1 < sig2) ? lambda1 : lambda2)*basescale" fill="none" stroke="var(--nord6)" />
                        <line x1="100" 
                        :y1="`${100 + Math.sqrt((rho == 0 && sig1 < sig2) ? lambda1 : lambda2)*basescale}`"
                        :y2="`${100 - Math.sqrt((rho == 0 && sig1 < sig2) ? lambda1 : lambda2)*basescale}`"
                        x2="100" 
                        stroke-width="2" :stroke="rho == 0 && (sig1 < sig2) ? 'var(--nord14)' : 'var(--nord15)'" />
                        <line
                        :x1="`${100 - Math.sqrt((rho == 0 && sig1 < sig2) ? lambda2 : lambda1) * basescale}`"
                        y1="100" y2="100" 
                        :x2="`${100 + Math.sqrt((rho == 0 && sig1 < sig2) ? lambda2 : lambda1)*basescale}`"
                        stroke-width="2" 
                        :stroke="rho == 0 && (sig1 < sig2) ? 'var(--nord15)' : 'var(--nord14)'"/>
                        <image :href="rho == 0 && (sig1 < sig2) ? '/src/assets/blog-6/minor_axis_label.svg' : '/src/assets/blog-6/major_axis_label.svg'" :x="`${100 + Math.max(Math.sqrt((rho == 0 && sig1 >= sig2) ? lambda1 : lambda2)*basescale / 2.2, 22)}`" y="100" :height="20" :width="20" style="transform-origin:center;transform-box:fill-box;transform: translate(-50%, -90%)
                            "></image>
                            <image :href="rho == 0 && (sig1 < sig2) ? '/src/assets/blog-6/major_axis_label.svg' : '/src/assets/blog-6/minor_axis_label.svg'"
                            :x="(rho == 0 && sig2 > 1.61) ? 85 : 100"
                            :y="`${100 - Math.min(Math.sqrt((rho == 0 && sig1 < sig2) ? lambda1 : lambda2)*basescale, (rho==0) ? 65 : 120) - 12}`"
                            :height="20" :width="20" style="transform-origin:center;transform-box:fill-box;transform: translate(-50%, -50%)"></image>
                        </g>
                        <path v-if="rho != 0" :d="`M ${100 + minor_radius / 1.5 * Math.sign(theta)} 100 A ${major_radius} ${minor_radius} ${theta * 180 / Math.PI} 0 ${theta >= 0 ? 0 : 1} ${100 + Math.cos(theta) * minor_radius / 1.5 * Math.sign(theta) } ${100 - Math.sin(theta) * minor_radius / 1.5 * Math.sign(theta)}`" stroke="var(--nord11)" stroke-width="1" fill="none"/>
                            <text v-if="rho != 0" :x="100 + Math.sign(theta) * minor_radius / 1.5" y="111" font-size="11" fill="var(--nord11)" style="font-family: monospace">θ</text>
                        </svg>
                    </div>
                    <div class="control-section>">
                        <Katex src="\begin{aligned}
                        \Sigma &= \begin{bmatrix}
                        \htmlClass{sigma1-ellipse}{\sigma^2_x}& \htmlClass{rho-ellipse}{\rho} \htmlClass{sigma1-ellipse}{\sigma_x}\htmlClass{sigma2-ellipse}{\sigma_y} \\
                        \htmlClass{rho-ellipse}{\rho} \htmlClass{sigma1-ellipse}{\sigma_x}\htmlClass{sigma2-ellipse}{\sigma_y} & \htmlClass{sigma2-ellipse}{\sigma^2_y}
                        \end{bmatrix} \\[1em]
                        &= \begin{bmatrix}
                        \htmlClass{sigma1-latex-number}{1.00} & \htmlClass{rho-latex-number}{0.00} \\
                        \htmlClass{rho-latex-number}{0.00} & \htmlClass{sigma2-latex-number}{1.00}
                        \end{bmatrix}
                        \end{aligned}" :inline="false">
                    </Katex>
                    <v-app class="ellipse-vuetify-app">
                        <v-row>
                            <v-col class="d-flex flex-column ellipse-slider-col">
                                <VSlider v-model="sig1" min="0.5" max="2" step="0.01" class="mt-0 ellipse-slider__sig1" color="var(--nord8)">
                                    <!-- <template v-slot:append> -->
                                        <!-- </template> -->
                                    </VSlider>
                                    <v-label class="vuetify-slider-label sigma1-ellipse  justify-center">
                                        <span v-html="katex.renderToString('\\sigma_x')"></span>&nbsp;=&nbsp;{{ sig1.toFixed(2) }}
                                    </v-label>
                                </v-col>
                                
                                <v-col class="d-flex flex-column ellipse-slider-col">
                                    <VSlider v-model="sig2" min="0.5" max="2" step="0.01" class="mt-0 ellipse-slider__sig2" color="var(--nord10)">
                                        <!-- <template v-slot:append> -->
                                            <!-- </template> -->
                                        </VSlider>
                                        <v-label class="vuetify-slider-label justify-center sigma2-ellipse">
                                            <span v-html="katex.renderToString('\\sigma_y')"></span>&nbsp;=&nbsp;{{ sig2.toFixed(2) }}
                                        </v-label>
                                    </v-col>
                                    <v-col class="d-flex flex-column px-0 mx-0 ellipse-slider-col">
                                        <VSlider v-model="rho" min="-.9" max=".9" step="0.01" class="ellipse-slider__rho" color="var(--nord13)" density="compact">
                                            <!-- <template v-slot:append> -->
                                                <!-- </template> -->
                                            </VSlider>
                                            <v-label class="vuetify-slider-label justify-center rho-ellipse">
                                                <span v-html="katex.renderToString('\\rho')"></span>&nbsp;=&nbsp;{{ (rho >= 0 ? " " : "") + rho.toFixed(2) }}
                                            </v-label>
                                        </v-col>
                                    </v-row>
                                </v-app>
                            </div>
                            <div class="info-section">
                                <div class="info-eigenvalues">
                                    
                                    <Katex src="\begin{aligned}
                                    {\color{#a3be8c} \lambda_1\,} &{\color{#a3be8c}= \htmlClass{lambda1-latex-number}{1.0}}\\
                                    {\color{#b48ead} \lambda_2\,} &{\color{#b48ead}= \htmlClass{lambda2-latex-number}{1.0}} \\
                                    {\color{#bf616a}\theta\,} &{\color{#bf616a}= \htmlClass{theta-latex-number}{0.0\degree}}
                                    \end{aligned}" :inline="false"></Katex>
                                </div>
                                <div class="info-eigenvectors">
                                    <Katex src="{\small\color{#a3be8c}
                                    \vec{v_1} = \begin{bmatrix}
                                    \htmlClass{v1a-latex-number}{1.0} \\
                                    \htmlClass{v1b-latex-number}{0.0}
                                    \end{bmatrix}}\;
                                    {\small\color{#b48ead}
                                    \vec{v_2} = \begin{bmatrix}
                                    \htmlClass{v2a-latex-number}{0.0} \\
                                    \htmlClass{v2b-latex-number}{1.0}
                                    \end{bmatrix} }
                                    " :inline="false"></Katex>
                                </div>
                            </div>
                        </div>
                    </template>
                    
                    <style scoped lang="scss">
                    .svg-cov-ellipse {
                        transform-origin: 300px 100px;
                    }
                    .cov-ellipse-applet {
                        display: grid;
                        grid-template-columns: 1fr 50%;
                        grid-template-rows: 1fr 1fr;
                        grid-template-areas: 
                        "svg control"
                        "svg info";
                        
                        & .svg-section {
                            grid-area: svg;
                            // display: flex;
                            // justify-content: center;
                            // align-items: center;
                        }
                        & .info-section {
                            grid-area: info;
                            display:flex;
                            padding-top: 1.5rem;
                            & .info-eigenvalues {
                                width: 50%;
                            }
                        }
                    }
                    .ellipse-vuetify-app {
                        height: fit-content;
                    }
                    .ellipse-vuetify-app :deep(.v-application__wrap) {
                        min-height: 0;
                    }
                    .ellipse-vuetify-app :deep(.v-input--horizontal) {
                        grid-template-rows: auto 0;
                    }
                    
                    .ellipse-slider-col {
                        height: fit-content;
                    }
                    
                    :deep(.sigma1-ellipse) {
                        &:hover, &:focus, &:active, &.active{
                            // box-shadow: 0px 0px 10px 5px var(--nord12);
                            text-shadow: var(--nord8) 0px 0px 10px;
                            color: var(--nord8);
                        }
                    }
                    :deep(.sigma2-ellipse) {
                        &:hover, &:focus, &:active, &.active{
                            // box-shadow: 0px 0px 10px 5px var(--nord12);
                            text-shadow: var(--nord10) 0px 0px 10px;
                            color: var(--nord10);
                        }
                    }
                    :deep(.rho-ellipse) {
                        &:hover, &:focus, &:active, &.active{
                            // box-shadow: 0px 0px 10px 5px var(--nord12);
                            text-shadow: var(--nord13) 0px 0px 10px;
                            color: var(--nord13);
                        }
                    }

                    @media screen and (max-width:700px) {
                    .cov-ellipse-applet {
                        grid-template-columns: 1fr;
                        grid-template-rows: .5fr 1fr .3fr;
                        grid-template-areas: 
                        "control"
                        "svg"
                        "info";
                        & .info-section {
                            padding-top: 0px;
                            z-index:1;
                            margin-top: -20px;
                        }
                    }
                }
                    
                </style>
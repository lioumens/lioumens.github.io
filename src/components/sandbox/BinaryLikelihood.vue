<script setup lang="ts">
import {computed, ref, watchEffect, onMounted, watch} from 'vue'
import createChart from "./chart.js"
import {VSlider} from 'vuetify/components/VSlider'
import katex from "katex"
import Katex from "../blog-5/Katex.vue"
import ActionText from '../blog-5/ActionText.vue'
import {gsap} from "gsap"
import { S } from '../../../dist/_astro/runtime-core.esm-bundler.a7f258e4'

const html = katex.renderToString("y_i \\sim \\text{Bernoulli}(p)")

// const p = ref(.5)
const n = ref(80)
const p = ref(.3)
const ySum = computed(() => Math.round(p.value * n.value))
const mle = computed(() => {
    if (ySum.value === 0) {
        return(0)
    } else if (ySum.value === n.value) {
        return(1)
    }
    return(ySum.value / n.value)
})
const showMLE = ref(false) // show line and label?
const svgBox = ref() // pointer to svg
const focus = ref(false)

// const binll = computed( () => {
//     return(y.value.reduce((a:number, b:number) => a + b, 0) * Math.log(p.value / (1-p.value)) + n.value * Math.log(1-p.value))
// })
const chart = createChart({
    svgSelector: svgBox, // ref to svg, chart will manage lifecycle
    xLim: [0, 1],
    yLim: [-200, 0],
    xTicks: [.25, .5, .75, 1.0],
    yTicks: [-200, -150, -100, -50, 0],
    xLabel: "p",
    yLabel: "Log Likelihood"
})

const makeBinLLPoints = computed(() =>{
    const steps = 100
    const xmin = .01
    const xmax = .99
    let pointString = ""
    for (let i = 0; i < steps; i++) {
        let xGrid = xmin + (xmax - xmin) * i / steps
        // let yGrid = (ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)) / n.value
        let yGrid = ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)
        // let yGrid = ySum.value * Math.log(xGrid / (1-xGrid))
        // console.log(ySum.value * Math.log(xGrid / (1 - xGrid)) + Math.log(1 - xGrid))
        let xSVG = chart.xScale(xGrid)
        let ySVG = chart.yScale(yGrid)
        pointString = pointString + `${xSVG},${ySVG} `
    }
    return pointString
})
// function makeBinLLPoints(xmin, xmax, steps) {
//     let pointString = ""
//     for (let i = 0; i < steps; i++) {
//         let xGrid = xmin + (xmax - xmin) * i / steps
//         // let yGrid = (ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)) / n.value
//         let yGrid = ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)
//         // let yGrid = ySum.value * Math.log(xGrid / (1-xGrid))
//         // console.log(ySum.value * Math.log(xGrid / (1 - xGrid)) + Math.log(1 - xGrid))
//         let xSVG = chart.xScale(xGrid)
//         let ySVG = chart.yScale(yGrid)
//         pointString = pointString + `${xSVG},${ySVG} `
//     }
//     return pointString
// }

// watchEffect(() => {
//     y.value = Array.from({length: n.value}, () => Math.random() < p.value ? 1 : 0)
// })

const makeMLELine = computed(() => {
    const y2 = (ySum.value === 0 || ySum.value === n.value) ? chart.yScale(0) : 
                   chart.yScale(ySum.value * Math.log(mle.value / (1-mle.value)) + n.value * Math.log(1-mle.value))
    return {
        x1: chart.xScale(mle.value),
        x2: chart.xScale(mle.value),
        y1: chart.yScale(0),
        y2: y2 
    } 
})
const mleLabelStyle = computed(() => { return {
    color: (showMLE.value ? "var(--nord10)" : ""),
    fontFamily: "monospace"
}})
// const mleLabelStyle = () => { return {color: (showMLE.value ? "var(--nord10)" : "") }}

function scrollToGraph(){
    const mediaQuery = window.matchMedia('(max-width: 1200px)')
  let visibleTop = mediaQuery.matches ? 50 : 0 // adjust for top bar in mobile view
  if (svgBox.value.getBoundingClientRect().top <= visibleTop) {
    // doesn't. work on mobile
    // graph not visible
    svgBox.value.scrollIntoView({behavior: "smooth"})
    return(true)
  } else {
    return(false)
  }
}

const tl = gsap.timeline();
function varyProp() {
    tl.clear()
    let delayScroll = scrollToGraph();
    showMLE.value = true
    tl.to(p, {value: Math.round(Math.random() * 98  + 1) / 100,
        duration: .2, delay: delayScroll ? .5 : 0, ease: "Power2.out"})
    tl.to(p, {value: Math.round(Math.random() * 98  + 1) / 100, duration: .2, delay: .7, ease: "Power2.out"})
    tl.to(p, {value: Math.round(Math.random() * 98  + 1) / 100, duration: .2, delay: .7, ease: "Power2.out"})
    
    // p.value = Math.round(Math.random() * 60) / 100
}

function varyN() {
    tl.clear()
    let delayScroll = scrollToGraph();
    tl.to(n, {value: Math.round(Math.random() * 19 + 1), duration: .2, delay: delayScroll ? .7 : 0, ease: "Power2.out"} )
    tl.to(n, {value: 100, duration: .2, delay: .7 , ease: "Power2.out"} )
    tl.to(n, {value: 40, duration: .2, delay: .7 , ease: "Power2.out"} )
    tl.to(n, {value: 100, duration: .2, delay: .7 , ease: "Power2.out"} )
}

</script>

<template>
    <!-- <p>Binomial Likelihood: {{ makeBinLLPoints(0.01, .99, 100) }}</p> -->
    <svg ref="svgBox" class="svgBox" viewBox="0 0 600 300">
        <polyline :points="makeBinLLPoints" stroke="var(--nord6)" stroke-width="1" fill = "none"/>
        <line v-if="showMLE" v-bind="makeMLELine" stroke="var(--nord10)" stroke-width="2"></line>
        <rect v-if="showMLE" :y="chart.yScale(0) - 23" :x="chart.xScale(mle)-20" height="20" width="40" fill="var(--nord10)" stroke="var(--nord10)" rx="10"></rect>
        <text v-if="showMLE" :y="chart.yScale(0) - 11" :x="chart.xScale(mle)" dominant-baseline="middle" text-anchor="middle" fill="var(--nord6)" font-size="16">{{ mle.toFixed(2) }}</text>
    </svg>
    <v-app class="llslider">
        <v-row justify="center" class="mt-0">
            <v-col sm="10">
                <v-slider
                color="var(--nord11)"
                v-model="n"
                hint="total number of observations"
                step="1"
                min="1"
                max="100"
                thumb-size="15">
            <template v-slot:append> <v-label><span style="font-family: monospace;color: var(--nord11);opacity: 1;">&nbsp;&nbsp;&nbsp;n = {{ n.toFixed(0).padEnd(3, "&nbsp;") }}&nbsp;</span></v-label> </template>
            </v-slider>
                <v-slider
                color="var(--nord13)"
                v-model="p"
                hint="proportion of 1's observed in the data (no stochasticity)"
                step=".01"
                min=".01"
                max=".99"
                thumb-size="15">
            <template v-slot:append> <v-label><span style="font-family: monospace;color: var(--nord13)"> prop =  {{ p.toFixed(2) }}</span></v-label> </template>
            </v-slider>
            <v-switch
                style="justify-items: right;margin-top: -10px;"
                v-model="showMLE"
                color="var(--nord10)">
        <template v-slot:label>
            <span>
                <span :style="mleLabelStyle">
                   &nbsp;MLE = {{ mle.toFixed(2).padEnd(3, "&nbsp;") }}&nbsp;
                    <!-- <Katex src="\widehat{p}_{\text{MLE}}" /> -->
                </span>
            </span>
        </template>
                </v-switch>
            </v-col>
        </v-row>
        <v-row justify="end" class="mt-0 mr-5" style="margin-top:-20px">
        </v-row>
    </v-app>
<ul>
    <li>
        I color coded the sliders, but <code>prop</code> is more a proxy for controlling the number of observed <Katex src="y_i" />. The observations are actually calculated by the function <span style="white-space: nowrap"><Katex display=false src="\sum_i^n y_i = \mathrm{round}(n \times \text{prop})"/>.</span> The MLE will bounce around due to that round function since our observations need to be a whole number.
    </li>
    <li>
        The maximum of the function (MLE) tends to <ActionText @click="varyProp()">follow the proportion of 1's</ActionText> observed in the data, as expected. If we saw a baseball player hit 20 / 100 pitches, we'd instinctively say they have a 20% change of hitting pitches.
    </li>
    <li>
        Notice changing <Katex src="n"/> does <ActionText @click="varyN()">not change the location of the maximum</ActionText> (other than rounding) but it <em>does</em> change the curvature of the likelihood around the maximum. The curvature is intimately related to the standard error, so it would make sense that as we observe more data with the same proportion of 1's, we'd be more certain about our estimate of <Katex src="p"/>.
    </li>
</ul>
</template>

<style scoped lang="scss">
.llslider :deep(.v-application__wrap) {
  min-height: 0;
}
.llslider :deep(.v-input__details){
    padding-top: 0rem;
    margin-top: -.5rem;
}
.llslider :deep(.v-messages){
    font-size: .9rem;
}
.llslider :deep(.v-label) {
    opacity: 1;
}
.llslider{
    height: fit-content;
}
// :deep(.v-application) {
//     height: fit-content;
// }
</style>
<script setup lang="ts">
import {ref, onMounted, watch, watchEffect} from "vue"
import * as d3 from "d3"
import DraggableCircle from "./DraggableCircle.vue"
import {logistic} from "../../lib/stats/lm.ts"

// Data
const datapoints = ref([
                {x: 0, y: 1},
                {x: 3, y: 1},
                {x: 4, y: 1},
                {x: -2, y: 0},
                {x: -3, y: 0}
               ])
const coef = ref({b0: 0, b1: 1})
const separated = ref(false)

const SVGBox = ref(null) // populated by svg box
const circlePoints = ref([]) // now attach event listeners?

// Methods
function positionXY(datapoint) {
    return { cx: xScale(datapoint.x), cy: yScale(datapoint.y) }
}

function makeLogisticPoints(xmin, xmax, n) {
    let pointString = ""
    for (let i = 0; i < n; i++) {
        let x = xmin + (xmax - xmin) * i / n
        let y = 1 / (1 + Math.exp(-(coef.value.b1 * x + coef.value.b0)))
        let xSVG = xScale(x)
        let ySVG = yScale(y)
        //STUB: translate from d3 to svg here
        pointString = pointString + `${xSVG},${ySVG} `
    }
    // console.log(pointString)
    return pointString
}

// update b0 and b1 when the datapoints change
watch(datapoints, () => {
    const X = datapoints.value.map(p => p.x)
    const Y = datapoints.value.map(p => p.y)
    const glmObj = logistic(Y, X)
    coef.value.b0 = glmObj.coef[0]
    coef.value.b1 = glmObj.coef[1]
    separated.value = glmObj.separationDetected
}, {deep:true})

// create the axes
const xScale = d3.scaleLinear()
    .domain([-5, 5])
    .range([30, 570])
const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([170, 30])

onMounted(() => {
    // console.log(circlePoints)
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
                    .tickValues([0.5,1])
    
    const xAxisSVG = d3.select(SVGBox.value)
      .append("g")
      .lower()
      .call(xAxis)
      .attr("transform", "translate(0, 170)")
    const yAxisSVG = d3.select(SVGBox.value)
      .append("g")
      .lower()
      .call(yAxis)
      .attr("transform", "translate(300, 0)")
})

function handleX(x, datapoint, i) {
    datapoint.x = xScale.invert(x)
}
function handleY(y, datapoint, i) {
    datapoint.y = yScale.invert(y)
}
</script>

<template>
    <svg ref="SVGBox" viewBox="0 0 600 200">
        <!-- <polyline points="0,0 10,10 20,10 30,20 40,20" fill="none" stroke="black" stroke-width="1" stroke-linejoin="round"/> -->
        <!-- <polyline :points="logisticPoints(-6, 6, 100, 0, 1)" fill="none" stroke="black" stroke-width="1" stroke-linejoin="round"/> -->
        <!-- <circle v-for="(point, index) in points" v-bind="getXY(point)" r="7" fill="red"/> -->

        <!-- <circle v-for="(datapoint, i) in points" v-bind="positionXY(datapoint)" ref="circlePoints" r="7" fill="red"/> -->

        <!-- <DraggableCircle @xThing="(x) => console.log('got x', x)" @yThing="(y) => console.log('got the y', y)" :radius=15 restrictDragAxis="x" /> -->
        <DraggableCircle v-for="(datapoint, i) in datapoints"
                         @xThing="(x) => handleX(x, datapoint, i)"
                         @yThing="(y) => handleY(y, datapoint, i)"
                         :key="i" :radius=10 restrictDragAxis="x" :initialX=xScale(datapoint.x) :initialY=yScale(datapoint.y) />

        <polyline v-if="!separated" :points="makeLogisticPoints(-6, 6, 100)" fill="none" stroke="var(--nord11)" stroke-width="1.5" stroke-linejoin="round"/>

    </svg>
</template>


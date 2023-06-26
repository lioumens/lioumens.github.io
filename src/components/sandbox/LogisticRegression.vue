<script setup lang="ts">
import {ref, onMounted, watchEffect} from "vue"
import * as d3 from "d3"
import DraggableCircle from "./DraggableCircle.vue"
import {logistic} from "../../lib/stats/lm.ts"

// Data
const points = ref([
                {x: 1.6, y: 1},
                {x: 0.3, y: 0},
                {x: 4, y: 1},
                {x: -.05, y: 1},
                {x: -3, y: 0}
               ])
const coef = ref({b0: 0, b1: 1})
const separated = ref(false)

const SVGBox = ref(null) // populated by svg box

const emit = defineEmits<{
    pointsEvent: [value: {x: number, y: number}[]],
    coefEvent: [value: {b0: number, b1: number}]
}>()

// Methods
function makeLogisticPoints(xmin, xmax, n) {
    let pointString = ""
    for (let i = 0; i < n; i++) {
        let xGrid = xmin + (xmax - xmin) * i / n
        let yGrid = 1 / (1 + Math.exp(-(coef.value.b1 * xGrid + coef.value.b0)))
        let xSVG = xScale(xGrid)
        let ySVG = yScale(yGrid)
        pointString = pointString + `${xSVG},${ySVG} `
    }
    return pointString
}

// update b0 and b1 when the datapoints change
watchEffect(() => {
    const X = points.value.map(p => p.x)
    const Y = points.value.map(p => p.y)
    const glmObj = logistic(Y, X)
    coef.value.b0 = glmObj.coef[0]
    coef.value.b1 = glmObj.coef[1]
    separated.value = glmObj.separationDetected
    emit("pointsEvent", points.value)
    emit("coefEvent", coef.value)
})

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

function handleX(x:number, datapoint: {x: number, y: number}) {
    datapoint.x = xScale.invert(x)
}
function handleY(y:number, datapoint: {x: number, y: number}) {
    datapoint.y = yScale.invert(y)
}
</script>

<template>
    <svg class="SVGBox" ref="SVGBox" viewBox="0 0 600 200">
        <DraggableCircle v-for="(datapoint, i) in points"
                         @xEvent="(x) => handleX(x, datapoint)"
                         @yEvent="(y) => handleY(y, datapoint)"
                         :key="i" :radius=10
                         restrictDragAxis="x"
                         :initialX=xScale(datapoint.x) :initialY=yScale(datapoint.y) />

        <polyline v-if="!separated" :points="makeLogisticPoints(-6, 6, 100)" fill="none" stroke="var(--nord11)" stroke-width="1.5" stroke-linejoin="round"/>

    </svg>
</template>

<style lang="scss" scoped>
.SVGBox{
    user-select:none;
}

</style>


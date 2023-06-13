<script>
import * as d3 from "d3"
import { convertClientToSVGCoord } from "../../lib/util.js"


let xScale = d3.scaleLinear()
    .domain([0, 600])
    .range([30, 500])
let yScale = d3.scaleLinear()
    .domain([0, 200])
    .range([370, 10])
let xAxis = d3.axisBottom(xScale)
let yAxis = d3.axisLeft(yScale)

export default {
    data() {
        return {
            circle: {
                x: 0,
                y: 0,
                r: 10
            },
            coord: {
                x: 0,
                y: 0,
                d3x: 0,
                d3y: 0
            }
        }
    },
    methods: {
        printCoord(e) {
            let {x, y} = convertClientToSVGCoord(this.$refs.coordBox, e.clientX, e.clientY);
            this.coord.x = x;
            this.coord.y = y;
            this.coord.d3x = xScale.invert(x); // allows coordinates smaller than sVG
            this.coord.d3y = yScale.invert(y);
            
        }
    },
    mounted() {
        // make the d3 coord system
        // console.log(this.$refs.coordBox)
        d3.select(this.$refs.coordBox)
          .append("g")
          .call(xAxis)
          .attr("transform", "translate(0, 370)")
        d3.select(this.$refs.coordBox)
          .append("g")
          .call(yAxis)
          .attr("transform", "translate(30, 0)")
        // this.$refs.coordBox.append("g").call(xAxis)

    },
    computed: {
        xScale() {
            return xScale
        },
        yScale() {
            return yScale
        }
    }
}
</script>

<template>
    <svg ref="coordBox" viewBox="0 0 600 400" preserve-aspect-ratio="xMinYMin meet" @click="printCoord">
        <!-- <circle :cx="circle.x" :cy="circle.y" :r="circle.r" fill="red"></circle> -->
        <line :x1="coord.x" :y1="0" :x2="coord.x" :y2="coord.y" stroke="red" stroke-width="2"></line>
        <line :x1="0" :y1="coord.y" :x2="coord.x" :y2="coord.y" stroke="red" stroke-width="2"></line>

        <line :x1="xScale(coord.d3x)" :y1="yScale(coord.d3y)" :x2="xScale(0)" :y2="yScale(coord.d3y)" stroke="blue" stroke-width="2"></line>
        <line :x1="xScale(coord.d3x)" :y1="yScale(0)" :x2="xScale(coord.d3x)" :y2="yScale(coord.d3y)" stroke="blue" stroke-width="2"></line>
    </svg>
    <p>SVG: {{ coord.x }}, {{ coord.y }}</p>
    <p>d3: {{ coord.d3x }}, {{ coord.d3y }}</p>
</template>
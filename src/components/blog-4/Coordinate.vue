<script>
import * as d3 from "d3"
import { convertClientToSVGCoord } from "../../lib/util.js"
import {VSwitch} from 'vuetify/components/VSwitch'

let xScale = d3.scaleLinear()
    .domain([0, 60])
    .range([30, 500])
let yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([370, 10])
let xAxis = d3.axisBottom(xScale)
let yAxis = d3.axisLeft(yScale)

export default {
    components: {
        VSwitch
    },
    data() {
        return {
            circle: {
                x: 0,
                y: 0,
                r: 10
            },
            coord: {
                svgx: 300,
                svgy: 100,
                d3x: 20,
                d3y: 10
            },
            switchValue: "SVG",
            colorCoord: {
                color: "var(--nord13)",
            }

        }
    },
    methods: {
        updateCoord(e) {
            let {x, y} = convertClientToSVGCoord(this.$refs.coordBox, e.clientX, e.clientY);
            this.coord.svgx = x;
            this.coord.svgy = y;
            this.coord.d3x = xScale.invert(x); // allows coordinates smaller than sVG
            this.coord.d3y = yScale.invert(y);
        }
    },
    mounted() {
        // make the d3 coord system
        // console.log(this.$refs.coordBox)
        d3.select(this.$refs.coordBox)
          .append("g").lower()
          .call(xAxis)
          .attr("transform", "translate(0, 370)")
        d3.select(this.$refs.coordBox)
          .append("g").lower()
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
        },
        xText() {
            const xOffset = (this.coord.svgx > 515) ? -10 : 10
            return this.coord.svgx + xOffset
        },
        yText() {
            const yOffset = (this.coord.svgy < 20) ? 20 : -10
            return this.coord.svgy + yOffset
        },
        avoidEdge() {
            if (this.coord.svgx > 515) {
                return "end"
            } else {
                return "start"
            }
        },
        avoidTop() {
            this.coord.svgy < 20 ? "hanging" : "auto"
        }
    },
    watch: {
        switchValue: function() {
            if (this.switchValue === "SVG") {
                this.colorCoord.color = "var(--nord13)"
            } else {
                this.colorCoord.color = "var(--nord11)"
            }
        }
    }
}
</script>

<template>
    <svg ref="coordBox"
        viewBox="0 0 600 400"
        preserve-aspect-ratio="xMinYMin meet"
        @pointermove="updateCoord" 
        @touchstart.prevent="" @dragstart.prevent="">
        <g v-if="switchValue === 'SVG'">
            <line :x1="coord.svgx" :y1="0" :x2="coord.svgx" :y2="coord.svgy" stroke="var(--nord13)" stroke-width="2"></line>
            <line :x1="0" :y1="coord.svgy" :x2="coord.svgx" :y2="coord.svgy" stroke="var(--nord13)" stroke-width="2"></line>
        </g>
        <g v-else>
            <line :x1="xScale(coord.d3x)" :y1="yScale(coord.d3y)" :x2="xScale(0)" :y2="yScale(coord.d3y)" stroke="var(--nord11)" stroke-width="2"></line>
            <line :x1="xScale(coord.d3x)" :y1="yScale(0)" :x2="xScale(coord.d3x)" :y2="yScale(coord.d3y)" stroke="var(--nord11)" stroke-width="2"></line>
        </g>

        <text :x="xText" :y="yText"
        :text-anchor="avoidEdge" :dominant-baseline="avoidTop" :fill="colorCoord.color">
            ({{ switchValue  === "SVG" ?
                Math.round(coord.svgx) :
                Math.round(coord.d3x)
             }},
             {{
                switchValue === "SVG" ?
                Math.round(coord.svgy) :
                Math.round(coord.d3y)
             }})
        </text>
    </svg>
    <v-switch class="ms-5 mt-n4 full-opacity"
              v-model="switchValue"
              false-value="SVG" true-value="d3">
        <template v-slot:label theme="dark">
            <span id="toggleCoordSwitch" class="full-opacity" style="opacity:100%">
                Showing
                <span :style="colorCoord">
                    &nbsp{{ switchValue.toString() }}&nbsp
                </span>
                coordinates
            </span>
        </template>
     </v-switch>

    <!-- <p>SVG: {{ coord.x }}, {{ coord.y }}</p>
    <p>d3: {{ coord.d3x }}, {{ coord.d3y }}</p> -->
</template>

<style scoped lang="scss">

/* >>> is a deep selector in vue */
.full-opacity :deep(.v-label) {
    opacity: 1 /* override vuetify label */
    
}
</style>
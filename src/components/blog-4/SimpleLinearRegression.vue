<script>
import * as d3 from "d3";

function clamp(value, lo, hi) {
  return value < lo ? lo : 
         value > hi ? hi : 
         value;
}

const height = 400;
const width = 600;
const marginL = 30; // bottom left margin
const margin7 = 10; // upper right margin

const extent = {x: [0, 30], y: [0, 20]}

let xScale = d3.scaleLinear()
    .domain(extent.x)
    .range([marginL, width - marginL])
let yScale = d3.scaleLinear()
    .domain(extent.y)
    .range([height - marginL, marginL])
let xAxis = d3.axisBottom(xScale)
let yAxis = d3.axisLeft(yScale)

export default {
    data() {
        return {
            // might make sense store as svg points for performance? or probably not matter much
            pointRadius: 7, // radius in svg units
            points : [
                {x: 10, y: 10},
                {x: 3, y: 5},
                {x: 22, y: 10},
                {x: 15, y: 15},
                {x: 5, y: 4}],
            isDragging: false,
        }
    },
    mounted() {
        d3.select(this.$refs.SLRBox)
          .append("g")
          .call(xAxis)
          .attr("transform", `translate(0, ${height - marginL})`)
        d3.select(this.$refs.SLRBox)
          .append("g")
          .call(yAxis)
          .attr("transform", `translate(${marginL}, 0)`)
    },
    methods: {
        // d3 -> SVG coord
        getXY(point) {
            return {cx: xScale(point.x), cy: yScale(point.y)}
        },
        calcSLR() {
            const X = this.points.map(p => p.x)
            const Y = this.points.map(p => p.y)
            const Xbar = X.reduce((a,b) => a+b, 0) / X.length
            const Ybar = Y.reduce((a,b) => a+b, 0) / Y.length
            const SXY = X.map((x,i) => (x - Xbar) * (Y[i] - Ybar)).reduce((a,b) => a+b, 0)
            const SXX = X.map((x,i) => (x - Xbar) * (x - Xbar)).reduce((a,b) => a+b, 0)
            const b1 = SXY / SXX
            const b0 = Ybar - b1 * Xbar
            return { b0, b1 }
        },
        startDragging(event) {
            this.isDragging = true;
            event.target.setPointerCapture(event.pointerId);
            //TODO: there's an offset to the pointer
        },
        doDrag(point, event) {
            if (this.isDragging) { 
                // console.log(point)
                // console.log(event)
                const svg = this.$refs.SLRBox;
                const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
                const svgP = pt.matrixTransform(svg.getScreenCTM().inverse()); // get svg coord

                const d3P = {x: xScale.invert(svgP.x), y: yScale.invert(svgP.y)} // get d3 coord
                // console.log(d3P ) // svg coord, need inverse for d3 value
                // clamp on d3 value
                point.x = clamp(d3P.x, 0, 30)
                point.y = clamp(d3P.y, 0, 20)
                // this.circle.x = clamp(svgP.x, svgXmin + this.circle.r, svgXmax - this.circle.r);
                // this.circle.y = clamp(svgP.y, svgYmin + this.circle.r, svgYmax - this.circle.r);
                
                // this.circle.x = event.offsetX;
                // this.circle.y = event.offsetY;
            }
        },
        stopDragging() {
            this.isDragging = false;
        },

    },
    computed : {
        getLine() {
            const {b0, b1} = this.calcSLR()
            return {
                x1:xScale(0),
                y1:yScale(b0),
                x2:xScale(1000),  // currently runs through axes
                y2:yScale(b0 + b1 * 1000)
            }
        },
        pauseAnimOnDrag() {
            return {
                animationPlayState: this.isDragging ? "paused" : "running"
            }
        }
    }
}
</script>

<template>
    <svg ref="SLRBox" viewBox="0 0 600 400" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <clipPath id="cut-bottom">
                <rect x="30" y="0" width="570" height="370" />
            </clipPath>
        </defs>
        <line v-bind="getLine" stroke="var(--nord11)" stroke-width="3" clip-path="url(#cut-bottom)" />
        <text x="570" y="23" fill="var(--nord6)" dominant-baseline="hanging" text-anchor="end" font-family="monospace">
            Intercept: {{ Math.round(calcSLR().b0 * 10)/10 }}&nbsp;&nbsp;
            Slope: {{ Math.round(calcSLR().b1 * 10)/10 }}
        </text>
        <!-- radar blip -->
        <circle
            class="pulsepoint"
            v-for="point in points"
            v-bind="getXY(point)"
            :r="`${pointRadius * 1.5}`"
            fill="var(--nord11)"
            stroke="var(--nord11)"
            opacity=".2"
            :style="pauseAnimOnDrag">
        </circle>
        <circle
            class="datapoint"
            v-for="point in points"
            v-bind="getXY(point)"
            :r="pointRadius"
            fill="var(--nord11)"
            @pointermove="doDrag(point, $event)"
            @touchstart.prevent=""
            @dragstart.prevent=""
            @pointerdown="startDragging"
            @pointerup="stopDragging"
            @pointercancel="stopDragging"
        stroke-width="20"
        stroke="transparent"
        :style="pauseAnimOnDrag">
        </circle>
    </svg>
    <!-- <p>Slope is {{ slope }}</p> -->
    <!-- can make the circle invisible radius larger to make draggin easier -->
</template>

<style scoped lang="scss">
@keyframes pulse {
	0% {
        transform: scale(1);
		box-shadow: 0 0 0 0 rgba(36, 201, 49, 0.7);
        animation-timing-function: ease-out;
	}

	80% {
        transform: scale(1.2);
		box-shadow: 0 0 5px 30px rgba(123, 36, 36, .3);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
	}

	100% {
        transform: scale(1);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        animation-timing-function: ease-in;
	}
}

@keyframes radar {
    0% {
        transform: scale(0);
        opacity: .3;
        fill: var(--nord11);
        stroke-width: 2;
        animation-timing-function: ease-out;
    }
    30% {
        transform: scale(1.2);
        opacity: .15;
        fill: var(--nord11);
        stroke-width: 4;
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
    }
    100% {
        transform: scale(1.3);
        opacity: .1;
        fill: none;
        stroke-width: 0;
        animation-timing-function: ease-in;
    }
}
.datapoint {
    transform-origin: center;
    transform-box: fill-box;
    animation: pulse 2s infinite;
    cursor: grab;
}

.pulsepoint {
    transform-origin: center;
    transform-box: fill-box;
    animation: radar 2s infinite;
}
</style>
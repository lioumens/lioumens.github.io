<script setup lang="ts">
import useD3Axes from "../../composables/D3Axes.ts"
import {ref, computed} from "vue"
import {VSlider} from 'vuetify/components/VSlider'
import katex from "katex"
import Katex from "./Katex.vue";
import ActionText from "./ActionText.vue";

const svg = ref()
const b0 = ref(0)
const b1 = ref(1)

const {xScale, yScale} = useD3Axes({
  svgRef: svg,
  xLim: [-5, 5],
  yLim: [0, 1],
  xTicks: [-5, -2.5, 0, 2.5, 5],
  yTicks: [.5, 1],
  yLabel: "",
  xLabel: "",
  yLabelRotate: 270,
  xLabelRotate: 0,
  xAxisPosition: "bottom",
  yAxisPosition: "zero"
})

const makeLogisticPoints = computed(() =>{
    const steps = 150
    const xmin = -5
    const xmax = 5
    let pointString = ""
    for (let i = 0; i < steps; i++) {
        let xGrid = xmin + (xmax - xmin) * i / steps
        let yGrid = 1 / (1 + Math.exp(-(b1.value * xGrid + b0.value))) 
        let xSVG = xScale(xGrid)
        let ySVG = yScale(yGrid)
        pointString = pointString + `${xSVG},${ySVG} `
    }
    return "M" + pointString
})
function b1label() {
  return katex.renderToString("\\color{#bf616a} \\beta_1=")
}
const b1Format = computed(() => {
  if (b1.value >= 0) {
    return "&nbsp;" + `${b1.value.toFixed(1)}"`
  } else {
    return b1.value.toFixed(1)
  }
})

const path = ref()

function resetCoef(coef: string) {
  path.value.style.transition = "d .3s ease"
  setTimeout(() => {
    path.value.style.transition = "" 
  }, 300);
  if (coef === "b0") b0.value = 0
  else b1.value = 1
}

</script>

<template>
  <svg ref="svg" viewBox="0 0 600 300">
    <!-- <polyline class="logistic-line" :points="makeLogisticPoints" stroke="var(--nord6)" fill="none" stroke-width="2"></polyline> -->
    <path ref="path" class="logistic-path" :d="makeLogisticPoints" stroke="var(--nord6)" fill="none" stroke-width="2"></path>
  </svg>
  
  <v-app class="logistic-param"> 
    <v-row justify="center" class="mt-0">
      <v-col sm="10">
        <v-slider
        @dblclick="resetCoef('b0')"
        color="var(--nord13)"
        v-model="b0"
        hint="Shifts the location of the inflection point"
        step=".1"
        min="-10"
        max="10"
        thumb-size="15">
        <template v-slot:append>
          <v-label style="user-select:none;opacity:1;font-family: monospace;color:var(--nord13)"><span v-html="katex.renderToString('\\color{#ebcb8b} \\beta_0 =')"></span>
            &nbsp;{{ ((b0 >= 0) ? " ": "") + b0.toFixed(1) }}
          </v-label>
        </template>
      </v-slider>
      <v-slider
      @dblclick="resetCoef('b1')"
      color="var(--nord11)"
      v-model="b1"
      hint="Controls the rate of inflection, and the location of the inflection point simultaneously."
      step=".1"
      min="-5"
      max="5"
      thumb-size="15">
      <template v-slot:append>
        <v-label style="user-select:none;opacity:1;font-family:monospace;color:var(--nord11)"><span v-html="katex.renderToString('\\color{#bf616a} \\beta_1 =')"></span>
          &nbsp;{{ ((b1>=0) ? " " : "") + b1.toFixed(1) }}
        </v-label> </template>
    </v-slider>
  </v-col>
</v-row>

</v-app>
<p>
There are a few things to note about this function <ActionText @click="resetCoef('b0')"> set <Katex src="\beta_0=0"/> and vary <Katex src="\beta_1"/></ActionText>
</p>
</template>

<style scoped lang="scss">
// .logistic-param {
//   height: fit-content;
// }
.logistic-param :deep(.v-application__wrap) {
  min-height: 0;
  
}
.logistic-param :deep(.v-messages) {
    font-size: .9rem;
}
.logistic-param :deep(.v-input__details){
    margin-top: -.7rem;
  }

// .logistic-line {
//   transition: all 2s ease;
// }

.link__container {
  display: inline-block;
  width: fit-content;
  overflow: hidden;  
  position: relative;
  padding: 0;
  margin: 0;
  vertical-align: bottom;
}
.content__item {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    counter-increment: itemcounter;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

// .content__item::before {
//     color: var(--color-number);
//     position: absolute;
//     top: 0;
//     left: 0;
//     content: counters(itemcounter, ".", decimal-leading-zero);
// }


a {
  outline: none;
  text-decoration: none;
  // position: relative;
  position: relative;
}

.link {
    cursor: pointer;
    font-size: 18px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    color: var(--color-text);
}

.link::before,
.link::after {
    position: absolute;
    width: 100%;
    height: 1px;
    background: currentColor;
    top: 100%;
    left: 0;
    pointer-events: none;
}

.link::before {
    content: '';
    /* show by default */
}
.link--iocaste {
    overflow: hidden;
    padding: 7px 0;
}

.link__graphic {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
    fill: none;
    stroke: var(--nord15);
    stroke-width: 1px;
}

.link__graphic--slide {
    top: -3px;
    stroke-width: 2px;
    transition: transform 0.7s;
    transition-timing-function: cubic-bezier(0, 0.25, 0.5, 1);
}

.link:hover .link__graphic--slide {
    transform: translate3d(-66.6%, 0, 0);
    transition: transform 0.7s ease infinite; 
}
.hover-action {
  cursor: pointer;
  color: var(--nord13);
  &::before {
    content: "";
    
  }
}
</style>
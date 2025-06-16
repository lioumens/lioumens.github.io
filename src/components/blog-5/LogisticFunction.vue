<script setup lang="ts">
import useD3Axes from "../../composables/D3Axes.ts"
import {ref, computed, onMounted } from "vue"
import {VSlider} from 'vuetify/components/VSlider'
import katex from "katex"
import Katex from "./Katex.vue";
import ActionText from "./ActionText.vue";
import {useScriptTag} from "@vueuse/core"

import {gsap} from "gsap"
//UMD seems to work better for

import {MotionPathPlugin} from "gsap/dist/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)


// crazy... but this seems to work
// let statement outside makes available to entire doc, typing satisfies ts
// Need to "destructure" the export, but {MotionPathPlugin} gets interpreted as block code
// await dynamic import, get the MotionPathPlugin from the default object
// register like normal
// let MotionPathPlugin : gsap.plugins.MotionPathPlugin;
// if (typeof window !== "undefined") {
//   console.log((await import("gsap/MotionPathPlugin")))
//   MotionPathPlugin = (await import("gsap/MotionPathPlugin")).MotionPathPlugin
//   // const {MotionPathPlugin} = await import("gsap/MotionPathPlugin")
// //   // import {MotionPathPlugin} from "gsap/MotionPathPlugin"
//   // gsap.registerPlugin(MotionPathPlugin)
// }


const svg = ref()
const b0 = ref(0)
const b1 = ref(1)

const {xScale, yScale} = useD3Axes({
  svgRef: svg,
  xLim: [-5, 5],
  yLim: [0, 1],
  xTicks: [-5, -2.5, 0, 2.5, 5],
  yTicks: [.5, 1],
  yLabel: "p(x)",
  xLabel: "x",
  xLabelPosition: "rightTop",
  yLabelPosition: "topRight",
  xLabelColor: "#b0b0b0",
  yLabelColor: "#b0b0b0",
  yLabelRotate: 0,
  xLabelRotate: 0,
  xAxisPosition: "bottom",
  yAxisPosition: "zero",
  height: 200
})

// polyfill for vuetify support, did not work though
// https://vuetifyjs.com/en/getting-started/browser-support/
// useScriptTag("https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver,ResizeObserver,WebAnimations,Object.fromEntries,Array.prototype.at")

let purpleBurst;
useScriptTag("https://cdn.jsdelivr.net/npm/@mojs/core", () => {
  // after mounted, define the object
  purpleBurst = new mojs.Burst({
    left: 0, top: 0,
    parent:       '#mojsparent',
    radius:       {0: 40},
    rotate:       {0: 180},
    count:        7,
    isShowStart: false,
    children: {
      shape:        'rect',
      fill:       'var(--nord15)',
      strokeWidth:  0,
      radiusY:      {2: 1},
      radiusX:      {5: 10},
      duration:     1000,
      easing: "cubic.out"
    }

  })
  // document.addEventListener("click", () => {
  //   purpleBurst.replay()
  // })
  // bouncyCircle.play()
  // bouncyCircle.tune({x: (svgBox.left), y: (svgBox.top + svgBox.bottom) / 2})
})
function makeBurst(moBurst, x:number, y:number) {
    const svgP = new DOMPoint(xScale(x), yScale(y)) // this probably changes depending on load?
    const domP = svgP.matrixTransform(svg.value?.getScreenCTM())
    moBurst.tune({x: domP.x + window.scrollX, y: domP.y + window.scrollY})
    moBurst.replay()
}

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

const path = ref()
// old method without gsap, css to animate path
function resetCoef(coef: string) {
  path.value.style.transition = "d .3s ease"
  setTimeout(() => {
    path.value.style.transition = "" 
  }, 300);
  if (coef === "b0") b0.value = 0
  else b1.value = 1
}

let tl : gsap.core.Timeline = gsap.timeline();
function killActiveTweens() {
  // if (gsap.isTweening(b1) || gsap.isTweening(b0)) {
  //   gsap.killTweensOf(b1)
  //   gsap.killTweensOf(b0)
  // }
  tl.kill()
  tl = gsap.timeline() // probably a better way to reset timeline
  tl2.revert()
  tl2.kill()
  tl2 = gsap.timeline()
}
function varyb1(){
  let delayScroll = scrollToGraph()
  killActiveTweens()
  let delayFirst = (b0.value !== 0)
  tl.to(b0, {duration: Math.abs(b0.value / 10), delay: (delayScroll ? .7 : 0), value: 0})

  let origb1 = b1.value
  let sign = b1.value === 0 ? 1 : Math.sign(b1.value)
    tl.to(b1, {duration: .5, delay: (delayFirst ? .5 : 0), value: sign * -3})
    tl.to(b1, {duration: .5, delay:.3, value: sign * 3})
    tl.to(b1, {duration: .5, delay:.3, value: sign * -3})
  tl.to(b1, {duration: .5, delay:.3, value: origb1})
}
function varyb0(){
  let delayScroll = scrollToGraph()
  killActiveTweens()
  tl2 = gsap.timeline()
  let delayFirst = (b1.value !== 0)
  let origb0 = b0.value
  // let origb1 = b1.value
  tl.to(b1, {duration: Math.abs(b1.value / 8), delay: (delayScroll ? .7 : 0), value: 0})

  let sign = b0.value === 0 ? 1 : Math.sign(b0.value)
    tl.to(b0, {duration: .6, delay: (delayFirst ? .5 : 0), value: sign * -4})
    tl.to(b0, {duration: .6, delay:.3, value: sign * 4})
    tl.to(b0, {duration: .6, delay:.3, value: sign * -4})
    tl.to(b0, {duration: .3, delay:.3, value: origb0})
    // tl.to(b1, {duration: .3, value: origb1}, "<") // dont need to return original b1
}
function stepb0(){
  let delayScroll = scrollToGraph()
  killActiveTweens()
  let delayFirst = (b0.value !== 0 || b1.value !== 0)
  tl.to(b1, {duration: Math.abs(b1.value / 10), delay: (delayScroll ? .7 : 0 ), value: 0})
  tl.to(b0, {duration: Math.abs(b0.value / 10), value: 0}, "<")

  tl.to(b0, {duration: .5, delay: (delayFirst ? .5 : 0), value: 1})
  tl.to(b0, {duration: .5, delay: .5, value: 2})
  tl.to(b0, {duration: .5, delay: .5, value: 3})
  tl.to(b0, {duration: .5, delay: .5, value: 4})
  tl.to(b0, {duration: .5, delay: .5, value: 5})
  tl.to(b0, {duration: .5, delay: .5, value: 6})
}

function scrollToGraph() {
  const mediaQuery = window.matchMedia('(max-width: 1200px)')
  let visibleTop = mediaQuery.matches ? 50 : 0
  if (svg.value.getBoundingClientRect().top <= visibleTop) {
    // doesn't. work on mobile
    // graph not visible
    svg.value.scrollIntoView({behavior: "smooth"})
    return(true)
  } else {
    return(false)
  }
}
function findHalfY(decreasing = false) {
  let rawPath = MotionPathPlugin.stringToRawPath(makeLogisticPoints.value)
  MotionPathPlugin.cacheRawPathMeasurements(rawPath)
  // let svgP = MotionPathPlugin.getPositionOnPath(rawPath, .5)
  let tol = .001
  const maxIter = 200
  let left = 0
  let right = 1
  for (let i = 0; i < maxIter; i++) {
     let mid = (left + right) / 2
      let midP = MotionPathPlugin.getPositionOnPath(rawPath, mid)
      if (Math.abs(yScale.invert(midP.y) - .5) < tol) {
        // console.log("converged")
        // console.log(yScale.invert(midP.y))
        // console.log(mid)
        return({progress : mid, xProgress : midP.x})
      }

      if (decreasing) {
        if (yScale.invert(midP.y) > 0.5) {
          left = mid
        } else {
          right = mid
        }
      } else {
        if (yScale.invert(midP.y) > 0.5) {
          right = mid
        } else {
          left = mid
        }  
      }
  }
  console.log("did not converge", left, right)
  return({progress: .5, xProgress: 0})
}
// other stuff should get it's own timeline
let tl2 = gsap.timeline()
function showRates() {
  let delayScroll = scrollToGraph()
  tl.kill()
  tl = gsap.timeline()
  tl2.revert()
  tl2.kill()
  tl2 = gsap.timeline()
  // check if we can use current function values
  let rawPath = MotionPathPlugin.getRawPath(makeLogisticPoints.value)
  MotionPathPlugin.cacheRawPathMeasurements(rawPath)
  let startP = MotionPathPlugin.getPositionOnPath(rawPath, 0)
  let endP = MotionPathPlugin.getPositionOnPath(rawPath, 1)
  let startY = yScale.invert(startP.y)
  let endY = yScale.invert(endP.y)
  const tweentl = gsap.timeline()
  let delayFirst = false
  if (!(((startY <= .5  && .5 <= endY) || (endY <= .5 && .5 <= startY)) && b1.value !== 0)) {
    // tween to usable values
    const tweenb0 = Math.round(Math.random() * 130 - 65) / 10 // between -6.5 and 6.5
    const b1rand = Math.round(Math.random() * 55 + 25) / 10 
    const tweenb1 = Math.random() > .5 ? b1rand : -b1rand
    delayFirst = true
    
    tweentl.to(b0, {duration: Math.abs(b0.value - tweenb0) / 10, delay: (delayScroll ? .7 : 0), value: tweenb0})
    tweentl.to(b1, {duration: Math.abs(b1.value - tweenb1) / 10, value: tweenb1}, "<")
  }
  tweentl.then(() => {
    // AFTER tweening to usable values,
    const {progress, xProgress} = findHalfY(b1.value < 0)

    // determine path start and end
    let animStart, animEnd;
    if (1 - progress > progress) {
      animStart = 0
      animEnd = progress * 2
    } else {
      animStart = progress * 2 - 1
      animEnd = 1
    }

    // needed tos
    tl2.set(".testcircle", { xPercent:-50, yPercent: -50, transformOrigin: "center center"})
    tl2.set(".testcircleleft", {xPercent:-50, yPercent: -50, transformOrigin: "center center"})
    tl2.set(".testline", {xPercent:-50, yPercent: -50, transformOrigin: "center center"})
    tl2.set(".testlineleft", {xPercent:-50, yPercent: -50, transformOrigin: "center center"})

    // if delay scroll & not tweened
    // delayFirst false & delay true
    tl2.to(".testcircle", {
      duration: 2,
      delay: ((delayScroll && !delayFirst) ?  .7 :
        delayFirst ?
        .5 : 0),
      visibility: "visible",
      // ease: "power2.in"
      motionPath: {
        path:"#testpath",
        align:"#testpath",
        start: animStart,
        end: progress
      }, 
  })
    tl2.to(".testcircleleft",{
      duration: 2,
      motionPath: {
        path:"#testpath",
        align:"#testpath",
        start: animEnd,
        end: progress
      },
    // ease: "power2.in"
    visibility: "visible",
  }, "<")
    tl2.to(".testline", {duration: 2, motionPath: {path:"#testpath", align:"#testpath", start: animStart, end: progress, autoRotate: true},
    // ease: "power2.in"
    visibility: "visible",
  }, "<")
    tl2.to(".testlineleft", {duration: 2, visibility: "visible", motionPath: {path:"#testpath", align:"#testpath", start: animEnd, end: progress, autoRotate: true},
    // ease: "power2.in",
    onComplete: () => {
      gsap.set(".hline", {visibility: "visible", attr:{x1: xProgress, x2: xProgress}})
      gsap.set(".testcircleleft", {visibility: "hidden"})
      // gsap.set(".testlineleft", {visibility: "hidden"})
      // gsap.set(".testline", {visibility: "hidden"})
    }}, "<")
    tl2.to(".hline", {duration: .4, attr:{x2: 300}, ease: "power2.out"})
    tl2.to(".testcircle", {duration: 1, attr:{r: 0}}, "<")
    tl2.to(".testline", {duration: .4, attr:{x1: xScale(0), x2: xScale(0)}, ease: "power1.out"}, "<")
    tl2.to(".testlineleft", {duration: .4, attr:{x1: 300, x2: 300}, ease: "power1.out"}, "<")
    tl2.to(".hline", {duration: .4, attr:{x1: 300}, ease: "power2.in"}, "<+.4")
       .call(makeBurst, [purpleBurst, 0, .5], "-=.2")
    tl2.then(() => {
      tl2.revert()
    })
  })
}

onMounted(() => {
  // manually add aria labels for sliders 
  const beta0Slider = document.querySelector(".beta0-slider .v-slider-thumb")
  const beta1Slider = document.querySelector(".beta1-slider .v-slider-thumb")
  beta0Slider?.setAttribute("aria-label", "beta0")
  beta1Slider?.setAttribute("aria-label", "beta1")
})
</script>


<template>
  <!-- <a ref="graphtop" id="logistic-plot-anchor" style="visibility:hidden;font-size:.1px;position:absolute;">Top of Logistic Plot</a> -->
  <div id="mojsparent"></div>
  <svg ref="svg" viewBox="0 0 600 200" style="user-select: none; -webkit-user-select: none;">
    <!-- <polyline class="logistic-line" :points="makeLogisticPoints" stroke="var(--nord6)" fill="none" stroke-width="2"></polyline> -->
    <path id = "testpath" ref="path" class="logistic-path" :d="makeLogisticPoints" stroke="var(--nord6)" fill="none" stroke-width="2"></path>
    <circle class="testcircle" cx="300" cy="100" r="7" fill="var(--nord15)" style="visibility:hidden"></circle>
    <circle class="testcircleleft" cx="300" cy="100" r="7" fill="var(--nord15)" style="visibility:hidden"></circle>
    <line class="testline" x1="100" x2="500" y1="100" y2="100" stroke="var(--nord15)" style="visibility:hidden"/>
    <line class="testlineleft" x1="100" x2="500" y1="100" y2="100" stroke="var(--nord15)" style="visibility:hidden"/>
    <line class="hline" x1="100" :x2="xScale(0)" :y1="yScale(.5)" :y2="yScale(.5)" stroke="var(--nord15)" stroke-width="2" style="visibility:hidden"></line>
  </svg>
  <v-app class="logistic-param"> 
    <v-row justify="center" class="mt-0">
      <v-col sm="10">
        <!-- hint="Shifts the location of the inflection point" -->
        <v-slider
        class="beta0-slider"
        @pointerdown="killActiveTweens()"
        color="var(--nord13)"
        v-model="b0"
        step=".1"
        min="-8"
        max="8"
        thumb-size="15">
        <template v-slot:append>
          <v-label @dblclick="resetCoef('b0')" style="user-select:none;opacity:1;font-family: monospace;color:var(--nord13)"><span v-html="katex.renderToString('\\color{#ebcb8b} \\beta_0 =')"></span>
            &nbsp;{{ ((b0 >= 0) ? " ": "") + b0.toFixed(1) }}
          </v-label>
        </template>
      </v-slider>

      <!-- hint="Controls the rate of inflection, and the location of the inflection point simultaneously." -->
      <v-slider
      class="beta1-slider"
      @pointerdown="killActiveTweens()"
      color="var(--nord14)"
      v-model="b1"
      step=".1"
      min="-8"
      max="8"
      thumb-size="15">
      <template v-slot:append>
        <v-label @dblclick="resetCoef('b1')" style="user-select:none;opacity:1;font-family:monospace;color:var(--nord14)"><span v-html="katex.renderToString('\\color{#a3be8c} \\beta_1 =')"></span>
          &nbsp;{{ ((b1>=0) ? " " : "") + b1.toFixed(1) }}
        </v-label>
      </template>
    </v-slider>
  </v-col>
</v-row>

</v-app>
<p>
There are a few things I'd like you to note about this function. 
</p>
<ul>
  <li>
    The range of this function is bounded between <Katex src="0" /> and <Katex src = "1" />, while <Katex src="x" /> can take on any value on the real line in the domain. This also means that <Katex src="\beta_0, \beta_1"/> are free to take on any value.
  </li>
  <li>
    When we <ActionText @click="varyb1()"> set <Katex src="\beta_0=0"/> and vary <Katex src="\beta_1"/></ActionText>, the <Katex src="p(x)"/>-intercept always stays fixed at <Katex src="0.5" />. In fact, <Katex src="\beta_0"/> by itself determines the <Katex src="p(x)" />-intercept which is why we call <Katex src="\beta_0"/> the <em>intercept parameter</em>.
  </li>
  <li>
    Similarly, <ActionText @click="varyb0()">fixing <Katex src="\beta_1=0"/> and varying <Katex src="\beta_0"/></ActionText> gives a completely flat line that shifts up and down implying <Katex src="x"/> is not useful information. Notice also that we get diminishing movement for values further from 0. The intercept will shift more <ActionText @click="stepb0()">between <Katex src="\beta_0=0 \rightarrow 1"/> than from <Katex src="\beta_0=1\rightarrow 2" /></ActionText>, etc.
  </li>
  <li>
    The function has a symmetry about the inflection point, meaning the rate that the function increases starting from the bottom is the same as the rate the function decreases starting from the top. This implies the <ActionText @click="showRates()">inflection point always occurs at <Katex src="y=0.5" />.</ActionText> A step-by-step proof of this can be found on <a href="https://socratic.org/questions/how-do-you-find-the-inflection-point-of-a-logistic-function#108227">Socratic Q&A</a>. 
  </li>
</ul>
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

</style>
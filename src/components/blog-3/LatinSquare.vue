<script>
const possibleLS = [[ 1, 2, 3,
                      2, 3, 1,
                      3, 1, 2
                    ],[
                      1, 2, 3,
                      3, 1, 2,
                      2, 3, 1
                    ],[
                      1, 3, 2,
                      2, 1, 3,
                      3, 2, 1
                    ],[
                      1, 3, 2,
                      3, 2, 1,
                      2, 1, 3
                    ],[
                      2, 1, 3,
                      1, 3, 2,
                      3, 2, 1
                    ],[
                      2, 1, 3,
                      3, 2, 1,
                      1, 3, 2
                    ],[
                      2, 3, 1,
                      1, 2, 3,
                      3, 1, 2
                    ],[
                      2, 3, 1,
                      3, 1, 2,
                      1, 2, 3
                    ],[
                      3, 1, 2,
                      1, 2, 3,
                      2, 3, 1
                    ],[
                      3, 1, 2,
                      2, 3, 1,
                      1, 2, 3
                    ],[
                      3, 2, 1,
                      1, 3, 2,
                      2, 1, 3
                    ],[
                      3, 2, 1,
                      2, 1, 3,
                      1, 3, 2
                    ]]
export default {
  data() {
    return {
      trts : [1, 2, 3,
              2, 3, 1,
              3, 1, 2],
      doctime : document.timeline.currentTime,
      isRowHighlighted: false,
      isColHighlighted: false,
      isEuHighlighted: false,
      animPaused: false,
    }
  },
  methods: {
    randomizePos() {
      this.trts = possibleLS[Math.floor(Math.random() * 8)]
      // pause all animations, and restart them all 
    document.getAnimations().forEach((animation) => {
      animation.currentTime = animation.effect.getTiming().duration * .6
      animation.play()
      this.animPaused = this.animPaused ? !this.animPaused : false
    })
    },
    highlightStuff(element) {
      switch (element) {
        case "row":
          this.isRowHighlighted = !this.isRowHighlighted;
          this.isColHighlighted = false;
          this.isEuHighlighted = false
          break;
        case "col":
          this.isRowHighlighted = false;
          this.isColHighlighted = !this.isColHighlighted
          this.isEuHighlighted = false;
          // console.log(this.isColHighlighted);
          break;
        case "eu":
          this.isRowHighlighted = false;
          this.isColHighlighted = false;
          this.isEuHighlighted = !this.isEuHighlighted
          break;
        default:
          // console.log("default")
          break;
      }
    },
    toggleAnimations() {
      document.getAnimations().forEach((animation) => {
        animation.playState == "paused" ? animation.play() : animation.pause()
      })
      this.animPaused = !this.animPaused
    }
  }, 
  // watch: {
    // animPaused()
    // {console.log("pause state toggled")}
  // },
  mounted() {
    // create keyframe for each of the texts
    const rightSpot = [
      {transform: "translate(0px, 0px)"},
      {transform: "translate(50px, 50px)"}
    ]

    
    // can probably achieve with just duration and delay
    // 0 explode the rows
    // 1. text for rows
    // 2. fade the rectangles
    // 3. animate the column blockstext for columns
    // 4. 
    
    // console.log(style.getPropertyValue("--x2")) // returns all the stuff with calc... so 
    const style = window.getComputedStyle(document.querySelector("svg.container"))
    
    //duplicated logic as javascript b/c its not much get get the constant representation in javascript
    const x0 = parseInt(style.getPropertyValue("--x0"))
    const y0 = parseInt(style.getPropertyValue("--y0"))
    const blockStrokeWidth = parseInt(style.getPropertyValue("--block-stroke-width"))
    const euStrokeWidth = parseInt(style.getPropertyValue("--eu-stroke-width"))
    const insetFactor = parseInt(style.getPropertyValue("--inset-factor"))
    const squareLength = parseInt(style.getPropertyValue("--square-length"))
    const blockShort = +(squareLength / 3).toFixed(3)
    const blockLong = squareLength
    const x1 = x0 + blockShort
    const x2 = x1 + blockShort
    const y1 = y0 + blockShort
    const y2 = y1 + blockShort

    // console.log(x0) // NAN
    // console.log(style.getPropertyValue(""))
    
    // animation timing array
    const animTiming = [2000, 4000, 5000, 7000]
    
    // row explosion
    // const rows = ["row1", "row2", "row3"].map((row)  => {
    //   document.querySelector(`.${row}`)
    // });
    
    const rowExplodeOptions = {
      duration: animTiming[3],
      delay: 0,
      iterations: Infinity,
      fill: "forwards",
      direction: "normal"
    }

    document.querySelectorAll(".row1, .row2 ,.row3").forEach((row, i) =>  {
      let translateModifier = row.classList.contains("row1") ? 1 : 
                                (row.classList.contains("row2") ? 0 : -1)
      let rowAnim = row.animate([
        {transform: `scale(1.3, 1.1) translate(0px, ${translateModifier * -5}px)`, opacity: "100%" },
        {transform: `scale(1.3, 1.1) translate(0px, ${translateModifier * -5}px)`, opacity: "100%", offset: .1}, // show row text
        // {transform: `scale(1.3, 1.1) translate(0px, ${-(i-1) * -5}px)`, opacity: "100%" },
        // {transform: `scale(1.3, 1.1) translate(0px, ${-(i-1) * -5}px)`, opacity: "100%", offset: .1}, // show row text
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "100%", offset: .15}, // scale down
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "20%", offset: .2}, // fade out
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "20%", offset: .4}, // hold fade
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "100%", offset: .5}, // fade in
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "100%", offset: 1}, // expose again
      ], rowExplodeOptions)
    })
    const rowLabels = {
      "row-label1" : {xPos: x1, yPos: y0},
      "row-label2" : {xPos: x1, yPos: y1},
      "row-label3" : {xPos: x1, yPos: y2}
    }
    // console.log(rowLabels)
    let rowAnim;
    Object.entries(rowLabels).forEach(([label, pos], i) => {
      let xlabel = pos.xPos + blockShort * .5;
      let ylabel = pos.yPos + blockShort * .5;
      let labelPosition = [
        {transform: `scale(1.1, 1.1) translate(${xlabel}px, ${ylabel - (i - 1) * -5}px)`, opacity: "100%" },
        {transform: `scale(1.1, 1.1) translate(${xlabel}px, ${ylabel - (i - 1) * -5}px)`, opacity: "100%" , offset: .1},
        {transform: `translate(${xlabel}px, ${ylabel}px)`, opacity: "100%", offset: .15},
        {transform: `translate(${xlabel}px, ${ylabel}px)`, opacity: "0%", offset: .2},
        {transform: `translate(${xlabel}px, ${ylabel}px)`, opacity: "0%", offset: 1},
      ]
      // console.log(label)

      rowAnim = document.querySelector(`g.${label}`).animate(labelPosition, rowExplodeOptions)
    })

    // column explosion events
    const colExplodeOptions = {
      duration: animTiming[3],
      delay: 0,
      iterations: Infinity,
      fill: "forwards",
      direction: "normal"
    }
    const colLabels = {
      "col-label1" : {xPos: x0, yPos: y1},
      "col-label2" : {xPos: x1, yPos: y1},
      "col-label3" : {xPos: x2, yPos: y1}
    }
    let colAnim;
    document.querySelectorAll(".col1, .col2, .col3").forEach((col, i) =>  {
      let translateModifier = col.classList.contains("col1") ? 1 : 
                                (col.classList.contains("col2") ? 0 : -1)
      colAnim = col.animate([
        {transform: `scale(1.15, 1.3) translate(${translateModifier * -5}px, 0px)`, opacity: "0%"},
        {transform: `scale(1.15, 1.3) translate(${translateModifier * -5}px, 0px)`, opacity: "0%", offset: .3}, // hold until row
        {transform: `scale(1.15, 1.3) translate(${translateModifier * -5}px, 0px)`, opacity: "100%", offset: .4}, // show col
        // {transform: `scale(1.15, 1.3) translate(${-(i-1) * -5}px, 0px)`, opacity: "0%"},
        // {transform: `scale(1.15, 1.3) translate(${-(i-1) * -5}px, 0px)`, opacity: "0%", offset: .3}, // hold until row
        // {transform: `scale(1.15, 1.3) translate(${-(i-1) * -5}px, 0px)`, opacity: "100%", offset: .4}, // show col
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "100%", offset: .45}, // scale down
        {transform: `scale(1, 1) translate(0px, 0px)`                 , opacity: "100%", offset: 1}, // 
      ], colExplodeOptions)
    })

    Object.entries(colLabels).forEach(([label, pos], i) => {
      let xlabel = pos.xPos + blockShort * .5;
      let ylabel = pos.yPos + blockShort * .5;

      let labelPosition = [
        {transform: `rotate(-90deg) scale(1.15, 1.3) translate(${ylabel}px, ${xlabel}px)`, opacity: "0%" },
        {transform: `rotate(-90deg) scale(1.15, 1.3) translate(${ylabel}px, ${xlabel}px)`, opacity: "0%" , offset: .3},
        {transform: `rotate(-90deg) scale(1.15, 1.3) translate(${ylabel}px, ${xlabel}px)`, opacity: "100%" , offset: .4},
        {transform: `rotate(-90deg) scale(1.0, 1.0) translate(${ylabel}px, ${xlabel}px)`, opacity: "100%", offset: .45},
        {transform: `rotate(-90deg) scale(1.0, 1.0) translate(${ylabel}px, ${xlabel}px)`, opacity: "0%", offset: .5},
        {transform: `rotate(-90deg) scale(1.0, 1.0) translate(${ylabel}px, ${xlabel}px)`, opacity: "0%", offset: 1},
      ]
      let colAnim = document.querySelector(`g.${label}`).animate(labelPosition, colExplodeOptions)
    })



    const cellAnimOptions = {
      duration: animTiming[3],
      iterations: Infinity,
      direction: "normal",
      fill: "forwards",
    }
    
    const labels = {
      "label1" : {xPos : x0, yPos: y0},
      "label2" : {xPos : x0, yPos: y1},
      "label3" : {xPos : x0, yPos: y2},
      "label4" : {xPos : x1, yPos: y0},
      "label5" : {xPos : x1, yPos: y1},
      "label6" : {xPos : x1, yPos: y2},
      "label7" : {xPos : x2, yPos: y0},
      "label8" : {xPos : x2, yPos: y1},
      "label9" : {xPos : x2, yPos: y2},
    }
    for (let [label, pos] of Object.entries(labels)) {
      let xlabel = pos.xPos + blockShort * .5
      let ylabel = pos.yPos + blockShort * .5
      let labelPosition = [
        {transform: "translate(90px, 125px)", opacity: "0%", offset: 0},
        {transform: "translate(90px, 125px)", opacity: "0%", offset: .6, easing: "cubic-bezier(0, 0, 0.38, 0.9)"}, //distribute labels
        {transform: `translate(${xlabel}px, ${ylabel}px)`, opacity: "100%", offset: .7}, // hold labels
        {transform: `translate(${xlabel}px, ${ylabel}px)`, opacity: "100%", offset: .8}, // fade labels
        {transform: `translate(${xlabel}px, ${ylabel}px)`, opacity: "0%", offset: 1}
      ]
      document.querySelector(`g.${label}`).animate(labelPosition, cellAnimOptions)
      }

    const euAnimOptions = {
      duration: animTiming[3],
      iterations: Infinity,
      direction: "normal",
      fill: "forwards",
    }
    const euHighlightAnimOptions = {
      duration: animTiming[3],
      iterations: Infinity,
      direction: "normal",
      fill:"forwards"
    }

    document.querySelectorAll(".eu").forEach(eu => {
      if (eu.classList.contains("eu-highlight")) {
        eu.animate([
          {opacity: "0%", offset: 0},
          {opacity: "0%", offset: .45},
          {opacity: "100%", offset: .5},
          {opacity: "100%", offset: 1},
        ], euHighlightAnimOptions)
        // console.log("highlight anim")
        return;
      }
      let euAnim = eu.animate([
        {opacity: "0%", offset: 0},
        {opacity: "0%", offset: .8},
        {opacity: "100%", offset: .85},
        {opacity: "100%", offset: 1},
      ], euAnimOptions)
    })
    
  },

}
</script>
<template>
  <!-- svg object definitions -->
  <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg" version="1.1" style="display:none">
    <defs>
      <pattern id="triangle-fill" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.24)"><path id="a" data-color="fill" fill="none" stroke="#0000ff" stroke-width="4" d="M-25 20h50L0-20z"></path><use xlink:href="#a" x="100"></use><use xlink:href="#a" y="100"></use><use xlink:href="#a" x="100" y="100"></use><use xlink:href="#a" x="50" y="50"></use><use xlink:href="#a" x="50" y="150"></use></pattern>
      <pattern id="circle-fill" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.25)"><circle id="circ-pattern" data-color="outline" fill="none" stroke="#0000FF" stroke-width="3.84" cx="0" cy="0" r="60"></circle><use xlink:href="#circ-pattern" x="100"></use><use xlink:href="#circ-pattern" x="100" y="100"></use><use xlink:href="#circ-pattern" y="100"></use></pattern>
      <pattern id="dot-fill" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(22) scale(0.2)"><circle data-color="outline" fill="none" stroke="#0000ff" stroke-width="22.17" cx="50" cy="50" r=".5"></circle></pattern>
      <filter id="marker-shape">
        <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
      </filter>
      <filter xmlns="http://www.w3.org/2000/svg" id="torn-filter">
        <feTurbulence result="TURBULENCE" baseFrequency="0.012" numOctaves="1" seed="1"/>
        <feDisplacementMap in="SourceGraphic" in2="TURBULENCE" scale="8"/>
        <feOffset in="displacementMap" dx="-2.5" dy="-3"/>
      </filter>
      
      <!-- play icon -->
      <symbol id="play-icon" viewBox="0 0 24 24"> <path d="M8 5v14l11-7z" fill="#fff"/> </symbol>

      <!-- play button -->
      <symbol id="play-button" viewBox="0 0 24 24"> 
        <circle cx="12" cy="12" r="10" fill="#ccc"/>
        <use xlink:href="#play-icon" height="14" width="14" x="5" y="5"/>
      </symbol>

      <!-- pause icon -->
      <symbol id="pause-button" viewBox="0 0 24 24">
        <circle id="circle" cx="12" cy="12" r="10" fill="#ccc"/>
        <rect x="8.2" y="6" width="2.5" height="12" fill="#fff"/>
        <rect x="13.2" y="6 " width="2.5" height="12" fill="#fff"/>
      </symbol>
    </defs>
  </svg>

  <div class="latinSquareDrawing">
  <!-- <h2 class="header">Latin Square Design</h2> -->
    <div class="explanation row-block__section">
      <h2 style="margin-top: 0px;"><a @click="highlightStuff('row')" :class="[{'row-block__explanation--highlighted' : isRowHighlighted }, 'row-block__explanation']">Row Block</a></h2>
      <p>Row blocks are chosen as a source of variation before the randomization of treatments to experimental units. In this 3x3 example, there are 3 row blocks in which every treatment will appear in every row.</p>
    </div>
    <div class="explanation col-block__section">
      <h2><a @click="highlightStuff('col')" :class="[{'col-block__explanation--highlighted' : isColHighlighted }, 'col-block__explanation']">Column Block</a></h2>
      <p>Column blocks are similarly chosen as a source of variation before randomization, which overlap with row blocks. There must be the same number of column blocks as there are row blocks in a Latin square design. All three levels of the treatment will appear in each column. </p>
    </div>
    <div class="explanation eu__section">
      <h2><a @click="highlightStuff('eu')" :class="[{'eu__explanation--highlighted' : isEuHighlighted }, 'eu__explanation']">Experimental Unit</a></h2>
      <p>Experimental units are the cells on which the treatment is applied. We have 9 experimental units in a 3x3 Latin square at the intersection of the row and column blocks.</p>
    </div>
  <div class="ls-animation">
  <svg viewBox="0 10 120 120" class="container" preserveAspectRatio="xMidYMid meet" width="200" height="230">
  <g @click="toggleAnimations">
  <rect class="block row1"></rect>
  <rect class="block row2"></rect>
  <rect class="block row3"></rect>

  <rect class="block col1"></rect>
  <rect class="block col2"></rect>
  <rect class="block col3"></rect>

  <!-- autogenerate the factor rectangles -->
  <rect v-for="(trt, i) in trts" :class="`eu square${i + 1} factor${trt}`"></rect>
  <g v-for="(trt, i) in trts" :class="`eu-label label${i + 1} factor${trt}`" >
  <text text-anchor="middle" dominant-baseline="middle">
    {{ "A" + trt }}
  </text>
  </g>
  <!-- <text x="40" y="60" ref="test" class="test">A1</text> -->

  <g class="row-label row-label1"><text text-anchor="middle" dominant-baseline="middle">Row 1</text></g>
  <g class="row-label row-label2"><text text-anchor="middle" dominant-baseline="middle">Row 2</text></g>
  <g class="row-label row-label3"><text text-anchor="middle" dominant-baseline="middle">Row 3</text></g>
  
  <g class="col-label col-label1"><text text-anchor="middle" dominant-baseline="middle">Col 1</text></g>
  <g class="col-label col-label2"><text text-anchor="middle" dominant-baseline="middle">Col 2</text></g>
  <g class="col-label col-label3"><text text-anchor="middle" dominant-baseline="middle">Col 3</text></g>

  <!-- // highlights need to be plotted on top -->
  <rect v-show="isRowHighlighted" class="block row3 row-highlight"></rect>
  <rect v-show="isColHighlighted" class="block col2 col-highlight"></rect>
  <rect v-show="isEuHighlighted" class="eu square6 eu-highlight"></rect>

  <use v-show="!animPaused" xlink:href="#play-button" x="50%" y="50%" width="40" height="40" class="play"/>
  <use v-show="animPaused" xlink:href="#pause-button" x="50%" y="50%" width="40" height="40" class="pause"/>
  </g>
  <text @click="randomizePos" class="randomize-text" text-anchor="middle" dominant-baseline="middle" x="50%" y ="104%" style="stroke-width: 0;">Rerandomize the <tspan>Treatments!</tspan></text>
  </svg>
  </div>

  <!-- <div class="rerandomize__section">
  </div> -->
</div>
</template>


<style lang="scss" scoped>
@use "sass:math";
@use "../../styles/nord" as *;


.container {
  height: 50%;
  // background-color: $nord12;

  --square-length: 90px;
  --x0: 15px;
  --y0: 15px;
  --block-stroke-width: 2px;
  --factor-color: #{$nord10};
  --factor1-color: #8ea7c5; // lighten
  --factor2-color: #{$nord10};
  --factor3-color: #3f5a7b;
  --block-stroke-color: #{$nord6};
  --block-text-color: #{$nord6};
  --highlight-color: #{$nord5};
  --highlight-stroke-width: 4px;

  --eu-stroke-width: 0px;
  --inset-factor: 2px; // inset the inner squares

  --block-long: calc(var(--square-length));
  --block-short: calc(var(--square-length) / 3);

  --x1: calc(var(--x0) + var(--block-short));
  --x2: calc(var(--x1) + var(--block-short));
  --y1: calc(var(--y0) + var(--block-short));
  --y2: calc(var(--y1) + var(--block-short));


}

@mixin marker-under($element, $width: 0.3em, $degree: -5deg, $highlight-color: $nord14) {
    #{$element}{
      position: relative;
      z-index: 0;
      white-space: nowrap;
      color: $nord6;
    }
    #{$element}::after {
      content: "";
      height: 0.3em;
      background-color : $highlight-color;
      position: absolute;
      width: $width;
      z-index: -1;
      filter: url(#torn-filter);
      left: -0.25em;
      top: 0.1em;
      padding: 0 0.25em;
      transform: rotate($degree) translate(0.2em, 1.3em);
    }
    #{$element}:hover::after {
      background-color: $nord9;
      transition: background-color .5s cubic-bezier(0.215, 0.610, 0.355, 1) forward;
    }
}
@include marker-under(".eu__explanation", $width: 8.5em, $degree: -2deg);
@include marker-under(".col-block__explanation", $width: 6em, $degree: -3deg);
@include marker-under(".row-block__explanation", $width: 5em, $degree: -3deg);

@keyframes highlight {
  0% {
    width: 0em;
    transform: rotate(var(--rotate-from)) translate(var(--fromX), var(--fromY));
  }
  100% {
    width: var(--highlight-width);
    transform: rotate(var(--rotate-to)) translate(var(--toX), var(--toY));
  }
}
@mixin click-highlight($element, 
  $width: 4.5em,
  $animation-time: 0.1s, 
  $rotate: -5deg, $translateX: 0.2em, $translateY: 0.4em,
  $rotate-from: -3deg, $rotate-to: -5deg,
  $fromX:.2em, $fromY:0.6em, $toX: 0.2em, $toY: 0.4em) {

  #{$element}::before {
    --highlight-width: #{$width};
    --rotate-from: #{$rotate-from};
    --rotate-to: #{$rotate-to};
    --fromX: #{$fromX};
    --fromY: #{$fromY};
    --toX: #{$toX};
    --toY: #{$toY};
    // --test-color: red;
    content: "";
    height: 1em;
    // background-color: #{$nord14};
    background-color: #{$nord14}; // won't work with css variables for some reason
    position: absolute;
    z-index: -1;
    width: $width;
    filter: url(#torn-filter);
    left: -0.25em;
    top: 0.1em;
    padding: 0 0.25em;
    transform: rotate($rotate) translate($translateX, $translateY);
    animation: highlight $animation-time ease-out; // inherited properties
  }
}
@include click-highlight(".row-block__explanation--highlighted", $width: 5em, $animation-time: .2s,
  $rotate: -3deg, $translateX: 0.2em, $translateY: 0.45em,
  $rotate-from:-3deg, $rotate-to: -3deg,
  $fromX: .2em, $fromY: 0.6em,
  $toX: 0.2em, $toY:0.45em);
@include click-highlight(".col-block__explanation--highlighted", $width: 6em, $animation-time: .2s,
  $rotate: -3deg, $translateX: 0.2em, $translateY: 0.45em,
  $rotate-from:-3deg, $rotate-to: -3deg,
  $fromX: .2em, $fromY: 0.6em,
  $toX: 0.2em, $toY:0.45em);
@include click-highlight(".eu__explanation--highlighted", $width: 8.5em, $animation-time: .2s,
  $rotate: -3deg, $translateX: 0.2em, $translateY: 0.4em,
  $rotate-from:-3deg, $rotate-to: -3deg,
  $fromX: .2em, $fromY: 0.6em,
  $toX: 0.2em, $toY:0.4em);

@keyframes draw-rect{
  0% {stroke-dashoffset: 1000; stroke-dasharray: 1000;}
  100% {stroke-dashoffset: 0; stroke-dasharray: 1000;}
}

.block {
  display:relative;
  stroke: var(--block-stroke-color);
  fill: none;
  transform-origin: center;
  stroke-width: var(--block-stroke-width);
  // mix-blend-mode: overlay;
}

.row1, .row2, .row3 {
  height: var(--block-short);
  width: var(--block-long);
  stroke-opacity: 100%;
}
.row1 {
  x: var(--x0);
  y: var(--y0);
}

.row2 {
  x: var(--x0);
  y: var(--y1);
}
.row3 {
  x: var(--x0);
  y: var(--y2);
}

.row-highlight {
  stroke: $nord14;;
  stroke-width: 4px;
  // filter: url("#torn-filter");
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
  animation: draw-rect 1.5s ease-in;
}

.col1, .col2, .col3 {
  opacity: 0%;
  height: var(--block-long);
  width: var(--block-short);
}
.col1 {
  x: var(--x0);
  y: var(--y0);
}

.col2 {
  x: var(--x1);
  y: var(--y0);
}
.col3 {
  x: var(--x2);
  y: var(--y0);
}
.col-highlight {
  stroke: $nord14;
  stroke-width: 4px;
  // filter: url("#torn-filter");
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
  animation: draw-rect 1.5s ease-out;
}

// position the squares
@for $i from 1 through 9 {
    //HACK: decided to try using css variables, but they're ugly to make
    $x : math.floor(math.div($i - 1,  3));
    $y : ($i + 2) %3;
    
    .square#{$i} {
      x: var(--x#{$x});
      y: var(--y#{$y});
    }
  }
.factor1{
  fill: var(--factor1-color);
  // -webkit-filter: brightness(70%);
  // filter: brightness(70%);
}
.factor2{
  fill: var(--factor2-color);

}
.factor3{
  fill: var(--factor3-color);
  // -webkit-filter: brightness(130%);
  // filter: brightness(130%);
}

.eu {
  opacity: 0%;
  height: calc(var(--block-short) - var(--inset-factor));
  width: calc(var(--block-short) - var(--inset-factor));
  stroke: black;
  stroke-width: 0px;
  transform: translate(calc(var(--inset-factor) * .5), calc(var(--inset-factor) * .5));
}

.eu.eu-highlight {
  stroke: $nord14;
  stroke-width: 4px;
  opacity: 0%;
  fill: none;
  // filter: url("#torn-filter");
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
  animation: draw-rect 1.5s ease-out;
}

.row-label, .col-label {
  opacity: 0%; 
  font-size: 1em;
  font-family: Verdana;
  fill: var(--block-text-color);
  transform-origin: center;
}
.eu-label {
  font-size: 1em;
  font-family: Verdana;
  opacity: 0%;
}

.header {
  // margin-left: 1em;
    grid-area: hd;
    // font-family: "Koho", sans-serif;
    // font-size: 3em;
    user-select: none; //disable standard highlighting of text
    justify-self: start;
    text-align: start;
  }


  .explanation {
  // grid-area: description;
  // margin-left: 3em;
  padding-right: 5%;
  color: $nord6;

  & p {
    // font-family: "Koho", sans-serif;
    font-size: 1.4rem;
  }

  & h2 {
    // font-size: 2em;
    font-family: "Gloria Hallelujah", cursive;
    user-select: none; // disable highlighting
    margin-top: 0px;
  }
  & h2>a:hover {
    // color: $nord4;
    cursor: pointer;
    color: $nord9;
    transition: color .5s cubic-bezier(0.215, 0.610, 0.355, 1) forward;
  }
}
.row-block__section {
  grid-area: "row";
}
.col-block__section {
  grid-area: "col";
}
.eu__section {
  grid-area: eu;
}


.play, .pause {
  opacity: 0%;
  // transform: translate(50%, 50%) scale(.4, .4) translate(-20px, -20px) translate(-50%,-50%);
  animation: animate-play-pause .4s ease-out forwards;
}
@keyframes animate-play-pause{
  0% {
    transform: translate(50%, 50%) scale(.4, .4) translate(-20px, -20px) translate(-50%,-50%);
    opacity: 100%;
  }

  100% {
    transform: translate(50%, 50%) scale(3, 3) translate(-20px, -20px) translate(-50%,-50%);
    opacity: 0%;
  }
}


.ls-animation {
  grid-area: animation;
  justify-self: start;
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &>svg {
    cursor: pointer;
    height: 100%;
    width: 100%;
    justify-self: center;
  }
}

.randomize-text {
  font-family: "Gloria Hallelujah", cursive;
  font-weight: 200;
  font-size: .4rem;
  user-select: none; //disable standard highlighting of text
  stroke: $nord6;
  fill: $nord6;
  // stroke-width: 0;
  cursor: pointer;
  & tspan {
    fill: $nord10
  }
  &:hover {
    fill: $nord10;
    transition: fill .1s ease-out;
  } 
}
// layout formatting with css grid
// breakpoint chosen to preserve the
.latinSquareDrawing {
  // parent container for css grid
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    grid-template-rows: .6fr 1fr;
    grid-template-areas: "row eu"
                         "col animation";
}

@media (max-width: 855px) {
  .explanation {
    padding: 0;
  }
  .latinSquareDrawing {
    display: flex;
    flex-direction: column;
    // grid-template-columns: auto;
    // grid-template-areas: "row col eu"
    //                      "animation";
  }
  .ls-animation {
    align-self: start;
    &>svg {
    // height: 100%;
    width: 100%;
    }
  }
}
 
</style>
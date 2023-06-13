<script>
import * as d3 from "d3";
// also script module,  or script src jsdeliver, esm? dynamic import?

function clamp(value, lo, hi) {
  return value < lo ? lo : 
         value > hi ? hi : 
         value;
}

const 
  svgXmin = 0,
  svgXmax = 400,
  svgYmin = 0,
  svgYmax = 200;


export default {
  data() {
    return {
        circle : {
          x: 200, 
          y: 100,
          r: 20,
          stroke: "none"
        },
        isDragging: false
    }
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      this.circle.stroke = "black"
      event.target.setPointerCapture(event.pointerId) // fixes moving cursor too fast
    },
    dragging(event) {
      // console.log(event)
      if (this.isDragging) { 
        const svg = this.$refs.dragBox;
        const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
        this.circle.x = clamp(svgP.x, svgXmin + this.circle.r, svgXmax - this.circle.r)
        this.circle.y = clamp(svgP.y, svgYmin + this.circle.r, svgYmax - this.circle.r)
      }
    },
    stopDrag() {
      this.circle.stroke = "none";
      this.isDragging = false;
    },
  }
}
</script>

<template>
    <svg viewBox="0 0 400 200" ref="dragBox" preserveAspectRatio="xMinYMin meet">
      <circle ref="dragCircle"
      :cx="circle.x" :cy="circle.y" :r="circle.r"
      fill="red"
      :stroke="circle.stroke" stroke-width="2"
      @pointermove="dragging" @pointerdown="startDrag" @pointerup="stopDrag"
      @touchstart.prevent="" @dragstart.prevent="" />
    </svg>
</template>

  
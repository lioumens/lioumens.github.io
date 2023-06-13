<script>
import * as d3 from "d3"
export default {
  data() {
    return {
        circle : {
          x: 200, 
          y: 100,
          r: 20,
          stroke: "none"
        },
    }
  },
  methods: {
    createDrag() {
        // capture vue component context `this`
        const vm  = this
        return d3.drag()
                 .on("drag", function(e, d) {
                   // `this` inside the call back is the circle element
                   vm.circle.x = e.x;
                   vm.circle.y = e.y;
                 })
    }
  },
  mounted() {
    d3.select(this.$refs.dragCircle)
      .call(this.createDrag())
  }
}
</script>

<template>
    <p style="font-family:monospace">x: {{ Math.round(circle.x) }}, y: {{ Math.round(circle.y) }}</p>
    <svg viewBox="0 0 400 200" ref="dragBox" preserveAspectRatio="xMinYMin meet">
      <circle ref="dragCircle"
      :cx="circle.x" :cy="circle.y" :r="circle.r"
      fill="red"
      :stroke="circle.stroke" stroke-width="2" />
    </svg>
</template>


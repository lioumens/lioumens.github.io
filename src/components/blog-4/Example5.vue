<script>
export default {
  data() {
    return {
      circles: [
      {cx: 50,  cy: 50, r: 20, fill: "red"},
      {cx: 150, cy: 50, r: 20, fill: "red"},
      {cx: 250, cy: 50, r: 20, fill: "red"},
      {cx: 350, cy: 50, r: 20, fill: "red"}
      ],
    }
  },
  methods : {
    newCircles() {
      // update reactive data state "this.circles"
      this.circles.forEach((circle) => {
        circle.r = Math.floor(Math.random() * 40 + 2)
        circle.fill = "#"+ Math.floor(Math.random() * 16777215).toString(16)
      })
    },
  }
}
</script>

<template>
  <svg viewBox="0 0 400 100">
    <circle v-for="(circle, index) in circles"
    :key="index"
    :cx="circle.cx"
    cy="50"
    :r="circle.r"
    :fill="circle.fill"
    style="transition: all 1s ease-out;"/>
  </svg>
  <button @click="newCircles">New Circles</button>
  <p style="font-family: monospace;font-size:1rem"> Colors: {{ circles.map(d => d.fill) }}</p>
  <p style="font-family: monospace;font-size:1rem"> Radii: {{  circles.map(d => Math.round(d.r)) }}</p>
</template>
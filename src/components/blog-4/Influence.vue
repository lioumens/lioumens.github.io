
<script>
import * as d3 from "d3";
// also scrip module,  or script src jsdeliver, esm? dynamic import?

export default {
  data() {
    return {
        message: "nothing"
    }
  },
  methods: {
    randomradius() {
      console.log("weird")
      d3.selectAll("circle")
        .transition()
        .duration(200)
        .style("fill", () => "#"+ Math.floor(Math.random() * 16777215).toString(16))
        .attr("r", () => Math.random() * 50)
    }
  }, 
  watch: {
  },
  mounted() {
  }
}
</script>

<template>
    <h2>{{ message }}</h2>
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="70" r="20" fill="red" />
      <circle cx="120" cy="70" r="20" fill="red" />
      <circle cx="240" cy="70" r="20" fill="red" />
      <circle cx="360" cy="70" r="20" fill="red" />
    </svg>
    <button @click="randomradius">Random</button>
</template>


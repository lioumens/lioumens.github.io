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
  svgXmax = 600,
  svgYmin = 0,
  svgYmax = 200;


export default {
  data() {
    return {
        message: "nothing",
        radii: [10, 30, 70, 80],
        numCircles: 4,
        circles: [
          {cx:20, cy:70, r:50, fill:"red"},
          {cx:120, cy:70, r:12, fill:"red"},
          {cx:240, cy:70, r:20, fill:"red"},
          {cx:360, cy:70, r:20, fill:"red"}],
        circle : {
          x: 10, 
          y: 10,
          r: 10
        },
        isDragging: false
    }
  },
  methods: {
    randomradius() {
      // console.log(this.circles)
      //i think d3
      // d3.selectAll("circle")
      //   .transition()
      //   .duration(200)
      //   .style("fill", () => "#"+ Math.floor(Math.random() * 16777215).toString(16))
      //   .attr("r", () => Math.random() * 50)

     this.circles.forEach((circle) => {
       circle.r = Math.floor(Math.random() * 50)
       circle.fill = "#"+ Math.floor(Math.random() * 16777215).toString(16)
     })
    },
    makeOrange(circle) {
      // console.log(circle)
        circle.fill = "orange"
    },
    createDragBehavior() {
      const vdom = this // need to capture the vdom context before the call
      return d3.drag()
        .on("drag", function(e, d) {
          // `this` inside the call back is the circle element
          vdom.circle.x = e.x;
          vdom.circle.y = e.y;
        })
    },
    startDragging(event) {
      // console.log("down detected")
      this.isDragging = true;
      event.target.setPointerCapture(event.pointerId); 
    },
    doDrag(event) {
      // console.log(this.$refs.dragBox)
      // console.log(event)
      if (this.isDragging) { 
        const svg = this.$refs.dragBox;
        const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        this.circle.x = clamp(svgP.x, svgXmin + this.circle.r, svgXmax - this.circle.r);
        this.circle.y = clamp(svgP.y, svgYmin + this.circle.r, svgYmax - this.circle.r);
        
        // this.circle.x = event.offsetX;
        // this.circle.y = event.offsetY;
      }
    },
    stopDragging() {
      this.isDragging = false;
    },
    // printCoord(e) {
    //   const svg = document.querySelector(".point-box")
    //   const pt = svg.createSVGPoint();
      
    //   console.log(domPt)
    //   // console.log(svg.getScreenCTM()) // returns matrix for  SVG -> DOM
    //   pt.x = e.clientX;
    //   pt.y = e.clientY;
    //   console.log(pt.x, pt.y)
    //   const domPt = new DOMPoint(e.clientX, e.clientY) // gives the same coordinates as pt

    //   const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    //   console.log(svgP.x, svgP.y)
    //   this.circle.x = svgP.x;
    //   this.circle.y = svgP.y;
      
    // }
    
    
  }, 
  watch: {
    isDragging: () => {
      console.log("isDragging changed")
    }
  },
  mounted() {
    this.$refs.dragBox.setAttribute("viewBox", `${svgXmin} ${svgYmin} ${svgXmax} ${svgYmax}`)
    
    // d3.select(".drag-circle").call(this.createDragBehavior()); // create drag behavior

    // console.log(this.xpos)
    // this 
    // let data = [], width = 600, height = 200, numPoints = 10;
    // let dragged = function(e) {
    //   console.log(this) // this in this context is DIFFERENT than 
    //   // console.log(e.subject, "vs", e.x, e.y)
    //   e.subject.x = e.x;
    //   this.xpos = e.x
    //   e.subject.y = e.y;
    //   // console.log(this.circle)
    //   update()
    // }
    // let drag = d3.drag()
    //   .on("drag", dragged)
    // // function handleDrag(e) {
    // //   e.subject.x = e.x;
    // //   e.subject.y = e.y;
    // //   // console.log(this.circle)
    // //   update()
    // // }
    // function updateData() {
    //   data = [];
    //   for (let i=0; i<numPoints; i++) {
    //     data.push({
    //       id: i,
    //       x: Math.random() * width,
    //       y: Math.random() * height
    //     });
    //   }
    // }
    // function update() {
    //   d3.select(".drag-box")
    //     .selectAll('circle')
    //     .data(data)
    //     .join("circle")
    //     .attr('cx', function(d) { return d.x })
    //     .attr('cy', function(d) { return d.y })
    //     .attr('r', 20)
    // }
    // updateData();
    // update();
      // this.circle.x = 200;
      // this.circle.y = 10;
      // update()
    // d3.selectAll("circle")
    // .on("click", function(e, d) {
    //   this.fill = "orange"
    //   console.log(e) // the pointer event
    //   // console.log(d) // undefined
    //   d3.select(this).style("fill", "orange")
    // })
  }
}
</script>

<template>
    <h2>{{ message }}</h2>
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <!-- <circle cx="20" cy="70" r="20" fill="red" />
      <circle cx="120" cy="70" r="20" fill="red" />
      <circle cx="240" cy="70" r="20" fill="red" />
      <circle cx="360" cy="70" r="20" fill="red" /> -->

      <!-- <circle v-for="(circle, index) in circles" :key="circle.index" :cx="circle.cx" cy="70" :r="circle.r" :fill="circle.fill" /> -->

      <!-- can return the event itself with $event -->
      <circle @click="makeOrange(circle)" v-for="(circle, index) in circles" :key="circle.index" :cx="circle.cx" cy="70" :r="circle.r" :fill="circle.fill" />
    </svg>
    <button @click="randomradius">Random</button>
    <p>Circle radii are {{ circles.map(circ => circ.r) }}</p>
    <p>Circle colors are {{ circles.map(circ => circ.fill) }}</p>


    <!-- d3 implementation with vue state -->
    <!-- <svg class="drag-box" ref="dragBox" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
      <circle class="drag-circle" ref="dragCircle" :cx="circle.x" :cy="circle.y" r="20" fill="red"/>
    </svg>
    <p>circle: {{ circle }}</p> -->
    <!-- <p>Circle radii are {{ circles.map(circle => { circle.cx }) }}</p> -->


    <!-- doDrag on top work, but a better solution is to use setPointerCapture -->
   <!-- viewbox set in js  -->
    <svg ref="dragBox" preserveAspectRatio="xMinYMin meet">

      <circle ref="dragCircle" :cx="circle.x" :cy="circle.y" :r="circle.r" fill="red" @pointermove="doDrag" @touchstart.prevent="" @dragstart.prevent="" @pointerdown="startDragging" @pointerup="stopDragging" />
    <!-- <circle :cx="circle.x" :cy="circle.y" r="20" fill="red"/> -->
    </svg>

    <p>circle: {{ circle }}</p>
</template>


<style lang="scss" scoped>
// circle {
//   transition: all 0.5s ease-in-out;
// }
</style>
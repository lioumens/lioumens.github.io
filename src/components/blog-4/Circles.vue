<script>
import * as d3 from "d3"

export default {
    mounted() {
        const svg = d3.select(".box1")
        
        // add circle
        // svg.append("circle")
        //    .attr("cx", 50)
        //    .attr("cy", 100)
        //    .attr("r", 20)
        //    .attr("fill", "red");
       
        // // remove circle (blank canvas)
        // svg.remove("circle")


        const xPositions = [50, 150, 250, 350]
        svg.selectAll("circle").data(xPositions).join("circle")
           .attr("cx", d => d)
           .attr("cy", 100)
           .attr("r", 20)
           .attr("fill", "red")
        

        svg.transition()

        const circles = [
            {cx:50, cy:100, r:20, fill:"red"},
            {cx:150, cy:100, r:20, fill:"blue"},
            {cx:250, cy:100, r:20, fill:"green"}]
        
        
    },
}
</script>

<template>
    <svg class="box1" viewBox="0 0 400 200">
    </svg>
</template>
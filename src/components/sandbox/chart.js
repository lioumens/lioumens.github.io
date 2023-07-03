import {unref, ref, onMounted, toValue} from "vue"
import * as d3 from "d3"

export default function createChart({
    svgSelector,
    xLim = [0, 1],
    yLim = [-200, 0],
    xLabel = "x",
    yLabel = "y",
    xTicks = [0, .25, .5, .75, 1],
    yTicks = [-200, -150, -100, -50, 0],
    height=300,
    width=600
}={}) {
        const marginL = yLabel ? 50 : 30 // spacing for axis labels
        const margin7 = xLabel ? 45 : 30
        // const svg = d3.create("svg")
        // svg.attr("viewBox", `0 0 ${width} ${height}`)
        
        // console.log(axisOptions)
        // if error
        
        
        const xScale = d3.scaleLinear().domain(xLim).range([marginL, width - margin7])
        const yScale = d3.scaleLinear().domain(yLim).range([height - 10, margin7])
        const xAxis = d3.axisTop(xScale).tickValues(xTicks).tickSizeOuter(0).tickFormat(d3.format(".2f"))
        const yAxis = d3.axisLeft(yScale).tickValues(yTicks).tickSizeOuter(0)
        
        onMounted(() => {
            // const svg = d3.select(".svgBox").append("svg").attr("viewBox", "0 0 200 100")
            const [xMin, yMin, xMax, yMax] = toValue(svgSelector).getAttribute("viewBox")?.split(" ")

            const svg = d3.select(toValue(svgSelector))
            const xAxisSVG = svg.append("g")
            .call(xAxis)
            .lower()
            .attr("transform", `translate(0, ${margin7})`)
            xAxisSVG.selectAll(".tick line, .domain")
            .attr("stroke", "#9f9f9f")
            xAxisSVG.selectAll(".tick text")
            .attr("fill", "#9f9f9f")
            
            const yAxisSVG = svg.append("g")
            .call(yAxis)
            .lower()
            .attr("transform", `translate(${marginL}, 0)`)
            yAxisSVG.selectAll(".tick line, .domain")
            .attr("stroke", "#9f9f9f")
            yAxisSVG.selectAll(".tick text")
            .attr("fill", "#9f9f9f")

            svg.append("text")
               .text(xLabel)
               .attr("x", width / 2)
               .attr("y", 0)
               .attr("text-anchor", "end")
               .attr("dominant-baseline", "hanging")
               .attr("fill", "var(--nord6)")
            svg.append("text")
               .text(yLabel)
               .attr("x", -50)
               .attr("y", height / 2)
               .attr("text-anchor", "start")
               .attr("dominant-baseline", "hanging")
               .attr("fill", "var(--nord6)")
               .style("transform-box", "fill-box")
               .style("transform-origin", "center")
            //    .style("font-family", "monospace")
               .attr("transform", "rotate(-90)")

            
            // attach to dom
            // const svgSelect = d3.select(svgSelector).append(() => svg.node()) // idk why needs to be getter...?
        })
        return {xScale, yScale}
    }
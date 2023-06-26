import {unref, ref, onMounted, toValue, Ref} from "vue"
import * as d3 from "d3"

export interface D3AxesOptions {
      svgRef?: Ref<SVGElement | undefined>,
      xLim?: [number, number],
      yLim?: [number, number],
      xLabel?: string,
      yLabel?: string,
      xLabelRotate?: number,
      yLabelRotate?: number,
      xAxisPosition?: "top" | "zero" | "bottom",
      yAxisPosition?: "left" | "zero" | "right",
      xTicks?: number[],
      yTicks?: number[],
      margin?:{
            top: number,
            right: number,
            bottom: number,
            left: number
      }
      height?: number,
      width?: number
}

export default function useD3Axes({
    svgRef = ref(),
    xLim = [0, 1],
    yLim = [-200, 0],
    xLabel = "x",
    yLabel = "y",
    xLabelRotate = 0, // unused for now
    yLabelRotate = 270,
    xAxisPosition = "bottom",
    yAxisPosition = "left",
    xTicks = [0, .25, .5, .75, 1],
    yTicks = [-200, -150, -100, -50, 0],
    margin = {
         top: 30,
         right: 30,
         bottom: 30,
         left: 30
    },
    height=300,
    width=600
} : D3AxesOptions = {}) {
        const marginL = yLabel ? 50 : 30 // spacing for axis labels
        const margin7 = xLabel ? 45 : 30
        // const svg = d3.create("svg")
        // svg.attr("viewBox", `0 0 ${width} ${height}`)
        if (xAxisPosition === "bottom") {
         // adjust bottom margin for text
         margin.bottom = xLabel ? margin.bottom + 10 : margin.bottom
        } else if (xAxisPosition === "top"){
         margin.top = xLabel ? margin.top + 10 : margin.top
        }
        if (yAxisPosition === "left") {
         margin.left = yLabel ? margin.left + 15 : margin.left
        } else if (yAxisPosition === "right"){
         margin.right = yLabel ? margin.right + 15 : margin.right
      }
        
        
        const xScale = d3.scaleLinear().domain(xLim).range([margin.left, width - margin.right])
        const yScale = d3.scaleLinear().domain(yLim).range([height - margin.bottom, margin.top])

        const xAxisFunction = xAxisPosition === "top" ? d3.axisTop : d3.axisBottom
        const yAxisFunction = yAxisPosition === "right" ? d3.axisRight : d3.axisLeft
        const xAxis = xAxisFunction(xScale).tickValues(xTicks).tickSizeOuter(0).tickFormat(d3.format(".2f"))
        const yAxis = yAxisFunction(yScale).tickValues(yTicks).tickSizeOuter(0)

        
        onMounted(() => {
            // const svg = d3.select(".svgBox").append("svg").attr("viewBox", "0 0 200 100")
            const [xMin, yMin, xMax, yMax] = toValue(svgRef).getAttribute("viewBox")?.split(" ")

            const svg = d3.select(toValue(svgRef))

            // create axes
            const xAxisSVG = svg.append("g")
            .lower()
            .call(xAxis)
            .attr("transform", () => {
               const xAxisTranslate = xAxisPosition === "top" ? margin.top : 
                                       xAxisPosition === "bottom" ? height - margin.bottom :
                                       yScale(0) // zero
               return `translate(0, ${xAxisTranslate})`
            })

            // style x axis
            xAxisSVG.selectAll(".tick line, .domain")
            .attr("stroke", "#9f9f9f")
            xAxisSVG.selectAll(".tick text")
            .attr("fill", "#9f9f9f")
           
            // create y axis
            const yAxisSVG = svg.append("g")
            .lower()
            .call(yAxis)
            .attr("transform", () => {
               const yAxisTranslate = yAxisPosition === "left" ? margin.left : 
                                       yAxisPosition === "right" ? width - margin.right :
                                       xScale(0) // zero
               return `translate(${yAxisTranslate}, 0)`
            })
            yAxisSVG.selectAll(".tick line, .domain")
            .attr("stroke", "#9f9f9f")
            yAxisSVG.selectAll(".tick text")
            .attr("fill", "#9f9f9f")

            svg.append("text")
               .text(xLabel)
               .attr("x", margin.left + ( width - margin.right - margin.left) / 2)
               .attr("y", () => {
                  if (xAxisPosition === "top") {
                     return 0
                  } else if (xAxisPosition === "bottom") {
                     return height - 5
                  }
                  return 0
               })
               .attr("text-anchor", "middle")
               .attr("dominant-baseline", () => {
                  if (xAxisPosition === "top") {
                     return "hanging"
                  } else if (xAxisPosition === "bottom") {
                     return "baseline"
                  }
                  return "center"
               })
               .attr("fill", "var(--nord6)")
               .style("font-family", "monospace")
            svg.append("text")
               .text(yLabel)
               .attr("x", () => {
                  if (yAxisPosition === "left") {
                     return 8
                  } else if (yAxisPosition === "right") {
                     return width - 8
                  }
                  return 0
               })
               .attr("y", margin.top + (height - margin.top - margin.bottom) / 2)
               .attr("text-anchor", "middle")
               .attr("dominant-baseline", "middle")
               .attr("fill", "var(--nord6)")
               .style("transform-box", "fill-box")
               .style("transform-origin", "center")
               .style("font-family", "monospace")
               .style("font-size", "16px")
               .attr("transform", `rotate(${yLabelRotate})`)

            
            // attach to dom
            // const svgSelect = d3.select(svgSelector).append(() => svg.node()) // idk why needs to be getter...?
        })
        return {xScale, yScale}
    }
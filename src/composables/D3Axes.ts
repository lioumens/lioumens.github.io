import {unref, ref, onMounted, toValue, Ref} from "vue"
import * as d3 from "d3"

export interface D3AxesOptions {
  svgRef?: Ref<SVGElement>,
  xLim?: [number, number],
  yLim?: [number, number],
  /** x-axis label */
  xLabel?: string,
  yLabel?: string,
  /** 
   * where to place x-axis label 
   * 
   * @default "center"
   * @todo implement everything else haha
   */
  xLabelPosition?: "center" | "left" | "right" | "leftTop" | "rightTop" | "leftBottom" | "rightBottom",
  /** @default "center" */
  yLabelPosition?: "center" | "top" | "bottom" | "topRight" | "bottomLeft" | "topLeft" | "bottomRight",
  /** @default "#eceff4" // nord6 */
  xLabelColor?: string,
  /** @default "#eceff4" // nord6 */
  yLabelColor?: string,
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
  svgRef,
  xLim = [0, 1],
  yLim = [-200, 0],
  xLabel = "x",
  yLabel = "y",
  xLabelPosition = "center",
  yLabelPosition = "center",
  xLabelColor = "#eceff4", // nord6
  yLabelColor = "#eceff4", // nord6
  xLabelRotate = 0, // unused for now
  yLabelRotate = 270,
  xAxisPosition = "bottom",
  yAxisPosition = "left",
  xTicks = [0, .25, .5, .75, 1], //TODO: needs more intelligent defaults?
  yTicks = [-200, -150, -100, -50, 0], //TODO:  more intelligent defaults
  margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  },
  height=300, //TODO: needs to default to viewBox size of svg
  width=600 //TODO: needs to default to viewBox size of svg
} : D3AxesOptions = {}) {
  if (xAxisPosition === "bottom") {
    // adjust bottom margin for axis label if it's there
    margin.bottom = xLabel ? margin.bottom + 10 : margin.bottom
  } else if (xAxisPosition === "top"){
    margin.top = xLabel ? margin.top + 10 : margin.top
  }
  if (yAxisPosition === "left") {
    margin.left = yLabel ? margin.left + 15 : margin.left
  } else if (yAxisPosition === "right"){
    margin.right = yLabel ? margin.right + 15 : margin.right
  }

  // if (yLabelPosition === "top") {
  //   margin.top = yLabel ? margin.top + 15 : margin.top
  // } else if (yLabelPosition === "bottom"){ 
  //   margin.bottom = yLabel ? margin.bottom + 15 : margin.bottom
  // } else if (yLabelPosition === "center" || yLabelPosition === "topRight") {
  //   // do nothing, topRight is meant to offset the yaxis
  // }
  
  
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
    
    // create x axis
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
    .attr("stroke", "#b0b0b0")
    xAxisSVG.selectAll(".tick text")
    .attr("fill", "#b0b0b0")
    
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
    
    // style y axis
    yAxisSVG.selectAll(".tick line, .domain")
    .attr("stroke", "#b0b0b0")
    yAxisSVG.selectAll(".tick text")
    .attr("fill", "#b0b0b0")
    
    
    // attach labels to x axis
    svg.append("text")
    .text(xLabel)
    .attr("x", () => {
      if (xLabelPosition === "center") {
        return(margin.left + ( width - margin.right - margin.left) / 2)
      } else if (xLabelPosition === "left" || xLabelPosition === "leftTop" || xLabelPosition === "leftBottom") {
        return(margin.left / 2)
      } else if (xLabelPosition === "right" || xLabelPosition === "rightTop" || xLabelPosition === "rightBottom") {
        return(width - margin.right/ 2)
      }
      return(0)
    })
    .attr("y", () => {
      let xLabelYPos = 0
      if (xAxisPosition === "bottom") {
        xLabelYPos = height - margin.bottom // replace with y-axis size constant  
      } else if (xAxisPosition === "top") {
        xLabelYPos = margin.top // replace with y-axis size constant
      } else if (xAxisPosition === "zero") {
        xLabelYPos = yScale(0)
      }
      if (xLabelPosition === "leftTop" || xLabelPosition === "rightTop") {
        xLabelYPos -= 10 // replace with bump constant?
      }
      else if (xLabelPosition === "leftBottom" || xLabelPosition === "rightBottom") {
        xLabelYPos += 10 // replace with bump constant?
      } else if ( xLabelPosition === "center" && xAxisPosition === "top") {
        // needs more of a bump up
        xLabelYPos -= margin.top / 1.3
      } else if (xLabelPosition === "center" && xAxisPosition === "bottom" || (xLabelPosition === "center" && xAxisPosition === "zero")) {
        xLabelYPos += margin.bottom / 1.3
      }
      return xLabelYPos
      // if (xAxisPosition === "top") {
      //   return 0
      // } else if (xAxisPosition === "bottom") {
      //   return height - 5
      // }
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", () => {
      // if (xAxisPosition === "top") {
      //   return "hanging"
      // } else if (xAxisPosition === "bottom") {
      //   return "baseline"
      // }
      return "middle"
    })
    .attr("fill", xLabelColor)
    .style("font-family", "monospace")
    
    // attach labels to y axis
    svg.append("text")
    .text(yLabel)
    .attr("x", () => {
      let yLabelXPos = 0
      if (yAxisPosition === "left") {
        yLabelXPos = margin.left // replace with y-axis size constant  
      } else if (yAxisPosition === "right") {
        yLabelXPos = width - margin.right // replace with y-axis size constant
      } else if (yAxisPosition === "zero") {
        yLabelXPos = xScale(0)
      }
      if (yLabelPosition === "topRight" || yLabelPosition === "bottomRight") {
        yLabelXPos += 5
      }
      else if (yLabelPosition === "topLeft" || yLabelPosition === "bottomLeft" || 
      (yLabelPosition === "center" && yAxisPosition === "left")) {
        yLabelXPos -= 5
      } else if ( yLabelPosition === "center" && yAxisPosition === "right") {
        // needs more of a bump right
        yLabelXPos += margin.right / 1.1
      } else if (yLabelPosition === "center" && yAxisPosition === "left" || (yLabelPosition === "center" && yAxisPosition === "zero")) {
        yLabelXPos -= margin.left / 1.1
      }
      return yLabelXPos
    })
    .attr("y", () => {
      if (yLabelPosition === "center") {
        return(margin.top + (height - margin.top - margin.bottom) / 2)
      } else if (yLabelPosition === "top" || yLabelPosition === "topRight" || yLabelPosition === "topLeft") {
        return(margin.top / 2)
      } else if (yLabelPosition === "bottom" || yLabelPosition === "bottomRight" || yLabelPosition === "bottomLeft") {
        return(height - margin.bottom / 2)
      }
      return(0)
    })
    .attr("text-anchor", () => {
      if (yLabelPosition === "topRight" || yLabelPosition === "bottomRight") {
        // depends on length of yLabel, easier to adjust anchor
        return "start"
      } else if (yLabelPosition === "topLeft" || yLabelPosition === "bottomLeft") {
        // depends on length of yLabel, easier to adjust anchor
        return "end"
      } else {
        // easier to position when everything is centered
        return "middle"
      }
    }) 
    .lower()
    .attr("dominant-baseline", "middle")
    .attr("fill", yLabelColor)
    .style("transform-box", "fill-box")
    .style("transform-origin", "center") // easier to rotate when positioning by center
    .style("font-family", "monospace")
    .style("font-size", "16px")
    .attr("transform", `rotate(${yLabelRotate})`)
    
    // attach to dom
    // const svgSelect = d3.select(svgSelector).append(() => svg.node()) // idk why needs to be getter...?
  })
  return {xScale, yScale}
}
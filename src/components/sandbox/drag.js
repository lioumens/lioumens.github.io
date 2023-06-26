import { ref, onMounted, onUnmounted, toValue, onBeforeUnmount} from 'vue'

import {clamp} from "../../lib/util.ts"

// by convention, composable function names start with "use"
// ideas for extension: x or y only, custom constrained drag
export function useDrag(target, innerMargin, constrainAxis, initialX, initialY) {


  // should be passed in a reactive state x, y. Then this composable just needs to animate it and allow it to be dragged? don't pulse while dragging. should just implement drag behavior first.
  // this does NOT need the svg i'm pretty sure. just the target

  // drag behavior first
  

  // state encapsulated and managed by the composable
  const isDragging = ref(false) // manage dragging state
  const x = ref(initialX) // let the user bind the values
  const y = ref(initialY) // let the user bind the values
  let xOff, yOff;
  let xFreeze, yFreeze;
  // const style = ""
  let {minX,  maxX, minY, maxY} = 0;
  let svg;


  function startDrag(event) {
    if (event.pointerType !== "mouse" || event.button === 0) {
      // console.log("down detected")
      isDragging.value = true;
      event.target.setPointerCapture(event.pointerId); 
      [minX, minY, maxX, maxY] = svg.getAttribute("viewBox").split(" ")

      // calculate grab offset position, save position
      const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse()) // get svg coord
      xOff = svgP.x - x.value
      yOff = svgP.y - y.value
      xFreeze = svgP.x - xOff
      yFreeze = svgP.y - yOff
    }
  }
  function doDrag(event) {
    if (isDragging.value) {
      // console.log("move detected")
      // toValue(parentSVG).getBBox()
      // parentSVG.getScreenCTM().inverse()
      // console.log(minX, minY, maxX, maxY)
      const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      x.value = constrainAxis === "y" ? xFreeze : clamp(svgP.x - xOff, minX + innerMargin, maxX - innerMargin)
      y.value = constrainAxis === "x" ? yFreeze : clamp(svgP.y - yOff, minY + innerMargin, maxY - innerMargin)
    }
  }

  function stopDrag(event) {
    // console.log("up detected")
    event.target.releasePointerCapture(event.pointerId)
    isDragging.value = false;
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => {
    svg = toValue(target).ownerSVGElement
    // const viewBox = toValue(parentSVG).getAttribute("viewBox").split(" ")
    toValue(target).addEventListener('pointerdown', startDrag)
    toValue(target).addEventListener('pointermove', doDrag)
    toValue(target).addEventListener('pointerup', stopDrag)
  })

  // was getting null on unmounted
  onBeforeUnmount(() => {
      toValue(target).removeEventListener('pointerdown', startDrag)
      toValue(target).removeEventListener('pointermove', doDrag)
      toValue(target).removeEventListener('pointerup', stopDrag)
    }
  )

  // expose managed state as return value
  return { x, y, isDragging }
}
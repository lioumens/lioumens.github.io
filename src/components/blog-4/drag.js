import { ref, onMounted, onUnmounted, toValue, onBeforeUnmount } from 'vue'

import {clamp} from "../../lib/util.js"

// by convention, composable function names start with "use"
// ideas for extension: x or y only, custom constrained drag
export function useDrag(target, parentSVG, innerMargin) {

  // should be passed in a reactive state x, y. Then this composable just needs to animate it and allow it to be dragged? don't pulse while dragging. should just implement drag behavior first.

  // drag behavior first
  

  // state encapsulated and managed by the composable
  const isDragging = ref(false) // manage dragging state
  const x = ref(0) // let the user bind the values
  const y = ref(0) // let the user bind the values
  // const style = ""
  let {minX,  maxX, minY, maxY} = 0;

  // a composable can update its managed state over time.
  function update(event) {
    const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
    const svgP = pt.matrixTransform(toValue(target).getScreenCTM().inverse());
    x.value = svgP.x
    y.value = svgP.y
  }

  function startDrag(event) {
    if (event.pointerType !== "mouse" || event.button === 0) {
      // console.log("down detected")
      isDragging.value = true;
      event.target.setPointerCapture(event.pointerId); 
    }
  }
  function doDrag(event) {
    if (isDragging.value) {
      // console.log("move detected")
      // toValue(parentSVG).getBBox()
      // parentSVG.getScreenCTM().inverse()
      // console.log(minX, minY, maxX, maxY)
      const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
      const svgP = pt.matrixTransform(toValue(parentSVG).getScreenCTM().inverse());
      x.value = clamp(svgP.x, minX + innerMargin, maxX - innerMargin)
      y.value = clamp(svgP.y, minY + innerMargin, maxY - innerMargin)
    }
  }

  function stopDrag() {
    // console.log("up detected")
    isDragging.value = false;
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => {
    // const viewBox = toValue(parentSVG).getAttribute("viewBox").split(" ")
    [minX, minY, maxX, maxY] =  toValue(parentSVG).getAttribute("viewBox").split(" ")
    // [minX, minY, maxY, maxY] = viewBox
    toValue(target).addEventListener('pointerdown', startDrag)
    toValue(target).addEventListener('pointermove', doDrag)
    toValue(target).addEventListener('pointerup', stopDrag)
  })
  onBeforeUnmount(() => {
      toValue(target).removeEventListener('pointerdown', startDrag)
      toValue(target).removeEventListener('pointermove', doDrag)
      toValue(target).removeEventListener('pointerup', stopDrag)
    }
  )

  // expose managed state as return value
  return { x, y, isDragging }
}
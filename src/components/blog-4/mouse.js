// mouse.js
import { ref, onMounted, onBeforeUnmount, onUnmounted, toValue } from 'vue'

// by convention, composable function names start with "use"
export function useMouse(target) {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    const pt = new DOMPoint(event.clientX, event.clientY) // gives the same coordinates as pt
    const svgP = pt.matrixTransform(toValue(target).getScreenCTM().inverse());
    x.value = svgP.x
    y.value = svgP.y
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => toValue(target).addEventListener('mousemove', update))
  onBeforeUnmount(() => toValue(target).removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}
// using
import { ref, onMounted, onUnmounted, toValue, onBeforeUnmount} from 'vue'
import {scaleLinear, scaleQuantize } from "d3-scale"
import {useEventListener} from "@vueuse/core"

// if it's a string, treat it as a selector
// if it's an element, use it directly?
// if its a ref, to value it?

export default function useDragNumber(target, min, max, step, initial) {
    let el;
    const isDragging = ref(false)
    const num = ref(initial)
    let xStart = 0;
    let yStart = 0;
    let numStart = 0;

    const scale = scaleLinear()
        .domain([min, max])
        .range([-200, 200])
        .clamp(true)

    const sensitivityScale = scaleQuantize()
        .domain([-400, 0])
        .range([.125, .25, .5, 1])

    function startDrag(event){
        isDragging.value = true;
        event.target.setPointerCapture(event.pointerId)
        xStart = event.clientX 
        yStart = event.clientY
        numStart = num.value
    }
    function doDrag(event) {
        if (isDragging.value) {
            const xDiff = event.clientX - xStart
            const yDiff = event.clientY - yStart
            const sensitivity = sensitivityScale(yDiff)
            const contValue = scale.invert(scale(numStart) + sensitivity * xDiff)
            num.value = Math.round(contValue / step) * step
        }
    }
    function endDrag(event) {
        isDragging.value = false;
    }
    function resetDrag(event) {
        num.value = initial
    }

    onMounted(() => {
        const els = document.querySelectorAll(target)
        if (els.length === 0) {
            throw new Error("No element found matching selector " + target)
        }
        els.forEach(el => {
            el.style.cursor = "ew-resize"
            el.style.userSelect = "none"
            el.style.zIndex = 10
            el.style.position = "relative"
            useEventListener(el, "pointerdown", startDrag)
            useEventListener(el, "pointermove", doDrag)
            useEventListener(el, "lostpointercapture", endDrag)
            useEventListener(el, "dblclick", resetDrag)
            useEventListener(el, "dragstart", (e) => e.preventDefault())
            useEventListener(el, "touchstart", (e) => e.preventDefault())
        })



    })

    return({num, isDragging})

}
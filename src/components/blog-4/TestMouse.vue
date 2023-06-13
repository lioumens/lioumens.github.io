<!-- <script setup>
import {useMouse} from "./mouse.js"
import {ref, onMounted } from "vue"
const el = ref(null)

// const {x, y } = useMouse(el)

console.log(el)
</script> -->
<script setup>
import { ref, onMounted } from 'vue'
import {useMouse} from "./mouse.js"
import { useDrag } from "./drag.js"

const el = ref(null)
const circ = ref(null)
const box = ref(null)

// const {cx, cy, style} = useDraggable(circ, {drag: (event) => {
//     console.log(event)
// }})

const {x, y} = useMouse(el)
const {x:cx, y:cy, isDragging} = useDrag(circ, el, 10) // some reason the const ref needs to match...

</script>

<script>
export default {
    watch: {
        isDragging(val) {
            console.log(val)
        }
    },
}
</script>


<template>
    <svg class="mouse" ref="el" viewBox="0 0 300 100">
       <rect x="0" y="0" width="400" height="100" fill="white" stroke="black" />
       <circle ref="circ" :cx="cx" :cy="cy" r="10" fill="red" />
    </svg>
    <!-- <div ref="box" :style="style" style="position: fixed"> -->
    <!-- Drag me! I am at {{xb}}, {{yb}} -->
  <!-- </div> -->
    <p>
    Mouse position is {{ x }}, {{ y }}. 
</p>

<p>
    Is Draggin {{ isDragging }}
    Circle position is {{ cx }}, {{ cy }}
</p>
</template>
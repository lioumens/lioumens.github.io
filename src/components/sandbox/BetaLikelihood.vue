<script setup lang="ts">
// import "mathbox/mathbox.css"
// import * as THREE from "three"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
// import MathBox from "mathbox"

import {onMounted, ref, computed, toValue, watch, watchEffect} from "vue"
import * as d3 from "d3"
import { seq, seqn } from "../../lib/util.js"
import {Matrix} from "ml-matrix"
import { x } from "../../../dist/_astro/runtime-core.esm-bundler.a7f258e4";


const xGrid = ref(seqn(-5, 5, 100))
const yGrid = ref(seqn(-5, 5, 100))
const X = ref(new Matrix([[1, 1],[1, 2],[1, 3],[1, 4]]))
const y = ref([1, 0, 1, 1])
const zGrid = computed(() => 
    outer(xGrid.value, yGrid.value, (x,y) => x + y + Math.random())
)

// import Plotly from 'plotly.js-dist'
const Plotly = await import('plotly.js-dist')

const layout = {
    title: "A 3d plot",
    autosize: false,
    width:500,
    height:500,
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 60,
        pad: 0
    },
    yaxis: {fixedrange: true},
    xaxis: {fixedrange: true},
    zaxis: {fixedrange: true},
    modeBarButtonsToRemove: [
        "toImage", "orbitRotation", "pan3d", "resetCameraLastSave3d", "pan3d"
    ],
}

function outer(x:ArrayLike<any>,y:ArrayLike<any>, f:(x:any, y:any) => any) {
    let z = []
    for (let i = 0; i < x.length; i++) {
        z.push([])
        for (let j = 0; j < y.length; j++) {
            z[i].push(f(x[i], y[j]))
        }
    }
    return z
}
// dom element
const tester = ref()

function updatePlot() {
    xGrid.value = xGrid.value.map(x => x + 1)
    // const vuedata = [{
    //     x: xGrid.value,
    //     y: yGrid.value,
    //     z: zGrid.value,
    //     type: 'surface',
    // }]
    // Plotly.react(tester.value, vuedata, layout, {displaylogo: false, responsive:true, displayModeBar:false,scrollZoom: true})
}


function betall(b0, b1) {
    // console.log(X.value.clone())
    // console.log([b0, b1])
    // console.log(Matrix.rowVector([b0, b1]))
    const eta = X.value.clone().mmul(Matrix.columnVector([b0, b1])).getColumn(0)
    const mui = eta.map(x => 1 / (1 + Math.exp(-x)))
    const sumll = mui.map((x,i) => y.value[i] * Math.log(x) + (1 - y.value[i]) * Math.log(1 - x)).reduce((a,b) => a+b, 0)
    return(sumll)
}
const calcZ = computed(() => {        
    return(outer(xGrid.value, yGrid.value, betall))
})

watchEffect(() => {
    console.log("trying to change")
    const vuedata = [{
        x: xGrid.value,
        y: yGrid.value,
        z: calcZ.value,
        type: 'surface',
    }]
    console.log(calcZ.value)
    tester.value ? Plotly.react(tester.value, vuedata, layout, {displaylogo: false, responsive:true, displayModeBar:false,scrollZoom: true}) : null
})





onMounted(() => {
    d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv').then(function(d) {
        const z = []
        d.forEach(function(row) {
            z.push([...Array(24).keys()].map(i => row[i]))
        });

        const TESTER = document.getElementById('tester')
        // const data = [{
        //     x: [...Array(24).keys()].map(i => i / 24),
        //     y: [...Array(24).keys()].map(i => i / 24),
        //     z: z,
        //     showlegend: false,
        //     showscale: false,
        //     type: 'surface',
        //     hoverinfo: "z",
        //     colorbar: {
        //         orientation:"h"
        //     }
        // }]

        const vuedata = [{
            x: xGrid.value,
            y: yGrid.value,
            z: calcZ.value,
            type: 'surface',
        }]
        Plotly.react(tester.value, vuedata, layout, {displaylogo: false, responsive:true, displayModeBar:false,scrollZoom: true})
    })    //     const TESTER = document.getElementById('tester');
    // 	Plotly.newPlot( TESTER, [{
        // 	x: [1, 2, 3, 4, 5],
        // 	y: [1, 2, 4, 8, 16] }], {
            // 	margin: { t: 0 }, 
            //     displayModeBar: false } );
            //  // get a 3d plot displayed
})
        
        
    </script>
    
    <template>
        <div id="tester" ref="tester" style="width:800px;height:500px;"></div>
        <button style="display:block" @click="updatePlot">Reverse</button>
    </template>
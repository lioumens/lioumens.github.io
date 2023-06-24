<script setup lang="ts">
// import "mathbox/mathbox.css"
// import * as THREE from "three"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
// import MathBox from "mathbox"

import {onMounted, ref, computed, toValue} from "vue"
import * as d3 from "d3"
import { seq, seqn } from "../../lib/util.js"


const xGrid = ref(seqn(-5, 5, 100))
const yGrid = ref(seqn(-5, 5, 100))
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
    const vuedata = [{
        x: xGrid.value,
        y: yGrid.value,
        z: zGrid.value,
        type: 'surface',
    }]
    Plotly.react(tester.value, vuedata, layout, {displaylogo: false, responsive:true, displayModeBar:false,scrollZoom: true})
}


onMounted(() => {
    d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv').then(function(d) {
        const z = []
        d.forEach(function(row) {
            z.push([...Array(24).keys()].map(i => row[i]))
        });

        const TESTER = document.getElementById('tester')
        console.log(TESTER)
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
            z: zGrid.value,
            type: 'surface',
        }]
        console.log(toValue(tester))
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
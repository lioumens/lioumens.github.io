<script setup lang="ts">
import {ref, watchEffect, watch, onMounted} from "vue"

const Plotly = await import("plotly.js-dist")

const el = ref(null)
const props = defineProps<{
    x: number[],
    y: number[],
    z: number[][],
    beta0: number, // coef
    beta1: number, // coef
    maxLL: number
}>()


const layout = {
    // title: "A 3d plot",
    autosize: true,
    // width: 500, // commented out to make responsive 
    // height: 400,
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
    },
    scene: {
        xaxis: {
            title: "Beta0",
            gridcolor: "#eceff4",
            color: "#eceff4",
            showspikes: false,
            showgrid: true,
            zeroline: true,
        },
        yaxis: {
            title: "Beta1",
            gridcolor: "#eceff4",
            color: "#eceff4",
            showspikes: false,
            showgrid: true,
            showline: false,
            zeroline: true,
        },
        zaxis: {
            title: "Log Likelihood",
            gridcolor: "#eceff4",
            color: "#eceff4",
            showspikes: false,
            showgrid: true,
        },
        // https://plotly.com/javascript/text-and-annotations/#3d-annotations
        annotations: [{
            showarrow: true,
            x: props.beta0,
            y: props.beta1,
            z: props.maxLL,
            text: "MLE",
            font: {
                color: "#5e81ac",
                size: 16
            },
            arrowcolor: "#5e81ac",
            arrowsize: 2,
            arrowwidth: 1,
            arrowhead: 1,
            ax: 0,
            ay:-50
        }],
        camera: {
            eye: {
                x: -1.5,
                y: -1.5,
                z: 1
            },
            center: {
                x: 0,
                y: 0,
                z: 0,
            }
        },
        aspectmode: "cube",
    },
    xaxis: {
        color: "#eceff4" // nord 6
    },
    yaxis: {
        color: "#eceff4"
    },
    zaxis: {
        color: "#eceff4"
    },
    paper_bgcolor: "#3b4252",
    modeBarButtonsToRemove: [
    "toImage", "orbitRotation", "pan3d", "resetCameraLastSave3d", "pan3d"
    ],
}
const data = [{
    x: props.x,
    y: props.y,
    z: props.z,
    type: 'surface', // surface geom
    hovertemplate: "Beta0: %{x}<br>Beta1: %{y}<br>LL: %{z}<extra></extra>",
    xhoverformat: ".2f",
    yhoverformat: ".2f",
    zhoverformat: ".2f",
    // colorscale: [[0, "#5e81ac"],[1, "#bf616a"]],
    // colorscale: "Viridis",
    // colorscale: "Picnic",
    // colorscale: "Portland",
    // colorscale: "Blackbody",
    // colorscale: "Jet",
    // colorscale: "Hot",
    colorscale: [[0, "#2e3440"],[.3, "#a3be8c"], [.5, "#ebcb8b"],[.7, "#d08770"], [1, "#bf616a"]],
    // colorscale: "Cividis",
    showscale: false, // color bar
    contours: {
        x: {
            highlight: false,
        },
        y: {
            highlight: false,
        },
        z: {
            // show:true,
            highlight: true, // contour
            usecolormap: true,
            project: {z: true}, // contour
            size: .02
        }
    }
}]

watch([() => props.z, () => props.beta0, () => props.beta1, () => props.maxLL ], ([newz, newBeta0, newBeta1, newMaxLL]) => {
    const noBeta0 = isNaN(newBeta0) || newBeta0 <= -3 || newBeta0 >= 3
    const noBeta1 = isNaN(newBeta1) || newBeta1 <= -3 || newBeta1 >= 3
    if (noBeta0 || noBeta1) {
        layout.scene.annotations[0].x = 0
        layout.scene.annotations[0].y = 0
        layout.scene.annotations[0].z = 0
        layout.scene.annotations[0].text = ""
        layout.scene.annotations[0].showarrow= false
    } else {
        layout.scene.annotations[0].x = newBeta0
        layout.scene.annotations[0].y = newBeta1
        layout.scene.annotations[0].z = newMaxLL
        layout.scene.annotations[0].text = "MLE"
        layout.scene.annotations[0].showarrow= true
    }
    data[0].z = props.z
    el.value ? 
    Plotly.react(el.value, data, layout, {displaylogo: false, responsive:true, displayModeBar:false,scrollZoom: false}) :
    null
})
// console.log(props.x)

onMounted(() => {
    // const data = [{
        //     x: props.x,
        //     y: props.y,
        //     z: props.z,
        //     type: 'surface',
        //     showscale: false
        // }]
        
        
        Plotly.newPlot(el.value, data, layout, {displaylogo: false, responsive:true, displayModeBar:false,scrollZoom: false})
        let prevClick = Date.now()
        el.value.on('plotly_click', function(){
            const currentClick = Date.now()
            if (currentClick - prevClick < 300) {
                const newlayout = {
                    autosize: true,
                    margin: {
                        l: 0,
                        r: 0,
                        b: 0,
                        t: 0,
                        pad: 0
                    },
                    scene: {
                        xaxis: {
                            title: "Beta0",
                            gridcolor: "#eceff4",
                            color: "#eceff4",
                            showspikes: false,
                            showgrid: true,
                            zeroline: true,
                        },
                        yaxis: {
                            title: "Beta1",
                            gridcolor: "#eceff4",
                            color: "#eceff4",
                            showspikes: false,
                            showgrid: true,
                            showline: false,
                            zeroline: true,
                        },
                        zaxis: {
                            title: "Log Likelihood",
                            gridcolor: "#eceff4",
                            color: "#eceff4",
                            showspikes: false,
                            showgrid: true,
                        },
                        // https://plotly.com/javascript/text-and-annotations/#3d-annotations
                        annotations: [{
                            showarrow: true,
                            x: props.beta0,
                            y: props.beta1,
                            z: props.maxLL,
                            text: "MLE",
                            font: {
                                color: "#5e81ac",
                                size: 16
                            },
                            arrowcolor: "#5e81ac",
                            arrowsize: 2,
                            arrowwidth: 1,
                            arrowhead: 1,
                            ax: 0,
                            ay:-50
                        }],
                        camera: {
                            eye: {
                                x: -1.5,
                                y: -1.5,
                                z: 1
                            },
                            center: {
                                x: 0,
                                y: 0,
                                z: 0,
                            }
                        },
                        aspectmode: "cube",
                    },
                    xaxis: {
                        color: "#eceff4" // nord 6
                    },
                    yaxis: {
                        color: "#eceff4"
                    },
                    zaxis: {
                        color: "#eceff4"
                    },
                    paper_bgcolor: "#3b4252",
                    modeBarButtonsToRemove: [
                    "toImage", "orbitRotation", "pan3d", "resetCameraLastSave3d", "pan3d"
                    ],
                }
                Plotly.relayout(el.value, newlayout)
            }
            prevClick = Date.now()
            return
        });
    })
    
</script>

<template>
    <div ref="el" style="width:70%;height:400px;margin:0 auto;cursor: grab;"></div>
</template>


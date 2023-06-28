<script setup lang="ts">
import {onMounted} from "vue"
import {useScriptTag} from "@vueuse/core"

useScriptTag("https://cdn.jsdelivr.net/npm/@mojs/core", () => {
    const bouncyCircle = new mojs.Shape({
    parent:       '#bouncyCircle',
    shape:        'circle',
    fill:         {'#F64040': '#FC46AD'},
    radius:       {20: 80},
    duration:     2000,
    isYoyo:       true,
    isShowStart:  true,
    easing:       'elastic.inout',
    repeat:       10,
    });

    bouncyCircle.play()
})


</script>

<!-- <script>
export default {
    data() {
        return {
            bouncyCircle: "hello world"
        }
    },
    mounted() {
        const bouncyCircle = new mojs.Shape({
        parent:       '#bouncyCircle',
        shape:        'circle',
        fill:         {'#F64040': '#FC46AD'},
        radius:       {20: 80},
        duration:     2000,
        isYoyo:       true,
        isShowStart:  true,
        easing:       'elastic.inout',
        repeat:       1,
        });

        bouncyCircle.play()

    },
}
</script> -->

<template>
    <div style="height:200;width:200;background:beige;" id="bouncyCircle">
    </div>
</template>
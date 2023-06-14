<script>

import {VSwitch} from 'vuetify/components/VSwitch'

export default {
    components: {
        VSwitch
    },
    data() {
        return {
            toggleValue: "SVG"
        }
    },
}
</script>


<template>
    <v-switch v-model="toggleValue" false-value="SVG" true-value="d3" :label="`Showing ${toggleValue.toString()} coordinates`" value="d3"> </v-switch>
    <p>{{ toggleValue }}</p>
</template>
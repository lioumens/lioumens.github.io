<script>
import Vuetify from "vuetify"

export default {
    data() {
        return {
            toggleValue: false 
        }
    },
}
</script>


<template>
    <v-switch v-model="toggleValue"> </v-switch>
        
</template>
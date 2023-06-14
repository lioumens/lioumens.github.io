import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import '../styles/main-vuetify.scss'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives
})

export default (app: App) => {
  app.use(vuetify);
}
import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const nordDarkTheme = {
  dark: false,
  colors: {
    background: "#3b4252", // nord1
    surface: '#EDEFF3',
    primary: '#1976D2',
    'primary-darken-1': '#FF0000',
    secondary: '#FF0000',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "nordDarkTheme",
      themes:{
        nordDarkTheme
      }
    }
})

export default (app: App) => {
  app.use(vuetify);
}
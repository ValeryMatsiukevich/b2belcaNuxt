import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { VTreeview } from 'vuetify/labs/VTreeview'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#06b6d4',
    'primary-darken-1': '#0891b2',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}



export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VTreeview,
    },
    ssr: true,
    blueprint: md3,
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      },
    }
  })
  app.vueApp.use(vuetify)
})
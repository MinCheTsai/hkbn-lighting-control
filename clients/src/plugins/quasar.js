import Vue from 'vue'

import '@/styles/quasar.scss'
import 'quasar/dist/quasar.ie.polyfills'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar, Notify } from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {},
  directives: {},
  plugins: {
    Notify
  }
})

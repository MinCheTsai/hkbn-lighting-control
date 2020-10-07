import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import notifyMixins from '@/mixins/notify.js'

import '@/plugins/quasar'
import '@/plugins/moment'
import '@/plugins/amplify'

Vue.config.productionTip = false

Vue.mixin(notifyMixins)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

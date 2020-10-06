import Vue from 'vue'
import Vuex from 'vuex'

import device from './device'
import schedule from './schedule'
import location from './location'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    DrawerOpen: true
  },
  mutations: {
    ToggleDrawer (state) {
      state.DrawerOpen = !state.DrawerOpen
    }
  },
  actions: {
  },
  modules: {
    device,
    schedule,
    location
  }
})

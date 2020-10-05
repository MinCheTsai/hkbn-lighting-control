import { Gateway, Controller, Group } from './model/device'

export default {
  namespaced: true,
  state: {
    Gateways: [],
    Controllers: [],
    Groups: [],
    Locations: ['TAC - 10F', 'TAC - 11F', 'TAC - 12F', 'TAC - 13F']
  },
  getters: {
    GatewaysArray (state) {
      const array = []
      array.push(...state.Gateways)
      array.forEach((a, i) => {
        a.number = i + 1
      })
      return array
    },
    ControllersArray (state) {
      const array = []
      array.push(...state.Controllers)
      array.forEach((a, i) => {
        a.number = i + 1
      })
      return array
    },
    GroupsArray (state) {
      const array = []
      array.push(...state.Groups)
      array.forEach((a, i) => {
        a.number = i + 1
      })
      return array
    }
  },
  mutations: {
    initDevices (state) {
      state.Gateways = []
      state.Controllers = []
      state.Groups = []
    },
    SetGateways (state, gateways) {
      if (!Array.isArray(gateways)) return
      gateways.forEach((gateway, index) => {
        state.Gateways.push(new Gateway(gateway, index))
      })
    },
    SetControllers (state, controllers) {
      if (!Array.isArray(controllers)) return
      controllers.forEach((controller, index) => {
        state.Controllers.push(new Controller(controller, index))
      })
    },
    SetGroups (state, groups) {
      if (!Array.isArray(groups)) return
      groups.forEach((group, index) => {
        state.Groups.push(new Group(group, index))
      })
    },
    SwitchController (state, { controller, status }) {
      state.Controllers[controller.number - 1].switch = status
    },
    SwitchGroup (state, { group, status }) {
      state.Groups[group.number - 1].switch = status
    }
  },
  actions: {
  }
}

import { API } from 'aws-amplify'
import { Controller } from './model/device'
import { gateways, groups } from '../../config'

export default {
  namespaced: true,
  state: {
    Gateways: gateways,
    Groups: groups
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
    InitControllers (state, panid) {
      const gIndex = state.Groups.findIndex(group => group.panid === panid)
      if (gIndex < 0) return
      state.Groups[gIndex].controllers = []
    },
    SetControllers (state, { controllers, panid }) {
      const gIndex = state.Groups.findIndex(group => group.panid === panid)
      if (gIndex < 0) return
      if (!Array.isArray(controllers)) return
      if (!state.Groups[gIndex].controllers) state.Groups[gIndex].controllers = []
      controllers.forEach((controller, index) => {
        state.Groups[gIndex].controllers.push(new Controller(controller, index))
      })
      console.log(state.Groups)
    },
    SetGroupLoading (state, { loading, panid }) {
      const index = state.Groups.findIndex(group => group.panid === panid)
      if (index < 0) return
      state.Groups[index].loading = loading
    },
    SetGroupSwitch (state, { switchGroup, panid }) {
      const gIndex = state.Groups.findIndex(group => group.panid === panid)
      if (gIndex < 0) return
      state.Groups[gIndex].switch = switchGroup
      if (state.Groups[gIndex].controllers) {
        state.Groups[gIndex].controllers.forEach(controller => {
          controller.switch = switchGroup
        })
      }
    },
    SetControllerSwitch (state, { index, switchLight, panid }) {
      const gIndex = state.Groups.findIndex(group => group.panid === panid)
      if (gIndex < 0) return
      const newController = state.Groups[gIndex].controllers[index]
      newController.switch = switchLight
      state.Groups[gIndex].controllers.splice(index, 1, newController)
    }
  },
  actions: {
    GetControllersByGroup ({ commit, state, rootState }, { UID, PanID }) {
      const body = {
        UID,
        PanID
      }
      return API.post('proxy-light-control', '/ubec/GroupStatusSearch', { body, headers: { Authorization: rootState.user.Token } })
    },
    GroupLightOn ({ commit, state, rootState }, { UID, PanID }) {
      const body = {
        UID,
        PanID
      }
      return API.post('proxy-light-control', '/ubec/GroupLightOn', { body, headers: { Authorization: rootState.user.Token } })
    },
    GroupLightOff ({ commit, state, rootState }, { UID, PanID }) {
      const body = {
        UID,
        PanID
      }
      return API.post('proxy-light-control', '/ubec/GroupLightOff', { body, headers: { Authorization: rootState.user.Token } })
    },
    SingleLightOn ({ commit, state, rootState }, { UID, mac }) {
      const body = {
        UID,
        destMac: mac
      }
      return API.post('proxy-light-control', '/ubec/SingleLightOn', { body, headers: { Authorization: rootState.user.Token } })
    },
    SingleLightOff ({ commit, state, rootState }, { UID, mac }) {
      const body = {
        UID,
        destMac: mac
      }
      return API.post('proxy-light-control', '/ubec/SingleLightOff', { body, headers: { Authorization: rootState.user.Token } })
    }
  }
}

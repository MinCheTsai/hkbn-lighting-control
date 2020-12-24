import { API } from 'aws-amplify'
import { Controller } from './model/device'
import { gateways } from '../../config'

export default {
  namespaced: true,
  state: {
    Gateways: gateways,
    Groups: null
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
      if (state.Groups) return state.Groups
      else return []
    }
  },
  mutations: {
    SetGroups (state, groups) {
      state.Groups = groups
    },
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
    GetControllersByGroup ({ rootState }, { UID, PanID }) {
      const body = {
        UID,
        PanID
      }
      return API.post('lambda-api', '/ubec-cors/group-status-search', { body, headers: { Authorization: rootState.user.Token } })
    },
    GetControllersConsume ({ rootState }, { uid, macs }) {
      const body = {
        macs
      }
      return API.post('lambda-api', `/group/get-consume/${uid}`, { body })
    },
    GetControllersConsumeByDateRange ({ rootState }, { macs, group, range }) {
      const body = {
        macs,
        group,
        range
      }
      return API.post('lambda-api', '/group/get-consume', { body })
    },
    GroupLightOn ({ rootState }, { UID, PanID }) {
      const body = {
        UID,
        PanID
      }
      return API.post('proxy-light-control', '/ubec/GroupLightOn', { body, headers: { Authorization: rootState.user.Token } })
    },
    GroupLightOff ({ rootState }, { UID, PanID }) {
      const body = {
        UID,
        PanID
      }
      return API.post('proxy-light-control', '/ubec/GroupLightOff', { body, headers: { Authorization: rootState.user.Token } })
    },
    SingleLightOn ({ rootState }, { UID, mac }) {
      const body = {
        UID,
        destMac: mac
      }
      return API.post('proxy-light-control', '/ubec/SingleLightOn', { body, headers: { Authorization: rootState.user.Token } })
    },
    SingleLightOff ({ rootState }, { UID, mac }) {
      const body = {
        UID,
        destMac: mac
      }
      return API.post('proxy-light-control', '/ubec/SingleLightOff', { body, headers: { Authorization: rootState.user.Token } })
    }
  }
}

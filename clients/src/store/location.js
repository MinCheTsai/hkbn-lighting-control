import { Location } from './model/location'

export default {
  namespaced: true,
  state: {
    Locations: []
  },
  getters: {
    LocationsArray (state) {
      const array = []
      array.push(...state.Locations)
      array.forEach((a, i) => {
        a.number = i + 1
      })
      return array
    }
  },
  mutations: {
    InitLocations (state) {
      state.Locations = []
    },
    SetLocations (state, locations) {
      if (!Array.isArray(locations)) return
      locations.forEach((location, index) => {
        state.Locations.push(new Location(location, index))
      })
    },
    ActiveLocation (state, { location, active }) {
      state.Locations[location.number - 1].active = active
    }
  },
  actions: {
  }
}

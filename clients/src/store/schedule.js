import { Schedule } from './model/schedule'

export default {
  namespaced: true,
  state: {
    Schedules: []
  },
  getters: {
    SchedulesArray (state) {
      const array = []
      array.push(...state.Schedules)
      array.forEach((a, i) => {
        a.number = i + 1
      })
      return array
    }
  },
  mutations: {
    InitSchedules (state) {
      state.Schedules = []
    },
    SetSchedules (state, schedules) {
      if (!Array.isArray(schedules)) return
      schedules.forEach((schedule, index) => {
        state.Schedules.push(new Schedule(schedule, index))
      })
    },
    ActiveSchedule (state, { schedule, active }) {
      state.Schedules[schedule.number - 1].active = active
    }
  },
  actions: {
  }
}

import { API } from 'aws-amplify'
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
    SetSchedule (state, schedule) {
      state.Schedules.push(schedule)
    },
    SetSchedules (state, schedules) {
      if (!Array.isArray(schedules)) return
      schedules.forEach((schedule) => {
        state.Schedules.push(new Schedule(schedule))
      })
    },
    RenewSchedule (state, updatedSchedule) {
      const index = state.Schedules.find(schedule => {
        return schedule.id === updatedSchedule.id
      })
      state.Schedules[index] = updatedSchedule
    },
    RemoveSchedule (state, deletedSchedule) {
      const index = state.Schedules.find(schedule => {
        return schedule.id === deletedSchedule.id
      })
      state.Schedules.splice(index, 1)
    }
    // ActiveSchedule (state, { schedule, active }) {
    //   state.Schedules[schedule.number - 1].active = active
    // }
  },
  actions: {
    CreateSchedule ({ commit }, { uid, panid, name, mode, days, time }) {
      const body = {
        panid,
        name,
        switch: mode,
        days,
        time
      }
      return API.post('schedule-api', `/schedule/group/${uid}`, { body })
    },
    // UpdateSchedule ({ commit }, { uid, panid, name, mode, days, time }) {
    //   const body = {
    //     panid,
    //     name,
    //     switch: mode,
    //     days,
    //     time
    //   }
    //   return API.post('schedule-api', `/schedule/group/${uid}`, { body })
    // },
    UpdateSchedule ({ commit }, { uid, panid, ruleId, mode, days, time }) {
      const body = {
        panid,
        ruleId,
        switch: mode,
        days,
        time
      }
      return API.put('schedule-api', `/schedule/group/${uid}`, { body })
    },
    DeleteSchedule ({ commit }, { uid, statementId, ruleId, targetId }) {
      const body = {
        statementId,
        ruleId,
        targetId // bqmmohm4q
      }
      return API.del('schedule-api', `/schedule/group/${uid}`, { body })
    },
    GetSchedules ({ commit }, { uid, nextToken }) {
      return API.get('schedule-api', `/schedule/group/${uid}`, { nextToken })
    },
    GetScheduleTarget ({ commit }, { uid, ruleId }) {
      return API.get('schedule-api', `/schedule/group/${uid}/${ruleId}`)
    }
  }
}

import { API } from 'aws-amplify'
import { Schedule } from './model/schedule'

export default {
  namespaced: true,
  state: {
    Schedules: []
  },
  getters: {
    SchedulesArray (state) {
      return state.Schedules
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
      const index = state.Schedules.findIndex(schedule => {
        return schedule.id === updatedSchedule.id
      })
      state.Schedules[index] = Object.assign(state.Schedules[index], updatedSchedule)
    },
    RemoveSchedule (state, deletedSchedule) {
      const index = state.Schedules.findIndex(schedule => {
        return schedule.id === deletedSchedule.id
      })
      state.Schedules.splice(index, 1)
    }
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
      return API.post('lambda-api', `/schedule/group/${uid}`, { body })
    },
    UpdateSchedule ({ commit }, { uid, panid, statementId, ruleId, targetId, mode, days, time }) {
      const body = {
        panid,
        statementId,
        ruleId,
        targetId,
        switch: mode,
        days,
        time
      }
      return API.put('lambda-api', `/schedule/group/${uid}`, { body })
    },
    DeleteSchedule ({ commit }, { uid, statementId, ruleId, targetId }) {
      const body = {
        statementId,
        ruleId,
        targetId // bqmmohm4q
      }
      return API.del('lambda-api', `/schedule/group/${uid}`, { body })
    },
    GetSchedules ({ commit }, { uid, nextToken }) {
      return API.get('lambda-api', `/schedule/group/${uid}`, { nextToken })
    },
    GetScheduleTarget ({ commit }, { uid, ruleId }) {
      return API.get('lambda-api', `/schedule/group/${uid}/${ruleId}`)
    },
    ChangeScheduleState ({ commit }, { uid, ruleId, active }) {
      const body = {
        active
      }
      return API.put('lambda-api', `/schedule/group/${uid}/${ruleId}`, { body })
    },
    NotifyEmail ({ commit }, { type, panid, name, mode, days, time }) {
      const body = {
        type,
        panid,
        name,
        mode,
        days,
        time
      }
      return API.post('lambda-api', '/schedule/notice', { body })
    }
  }
}

import { Auth, API } from 'aws-amplify'
import { user } from '../../config'

export default {
  namespaced: true,
  state: {
    Token: null,
    TokenValidityPeriod: null,
    User: user
  },
  getters: {
  },
  mutations: {
    SetToken (state, token) {
      state.Token = token
      state.TokenValidityPeriod = Date.now()
    }
  },
  actions: {
    Login ({ commit }, { email, password }) {
      return Auth.signIn(email, password)
    },
    ForceChangePassword ({ commit }, { result, newPassword }) {
      return Auth.completeNewPassword(result, newPassword)
    },
    SignOut () {
      return Auth.signOut()
    },
    ChangePassword ({ commit }, { user, oldPassword, newPassword }) {
      return Auth.changePassword(user, oldPassword, newPassword)
    },
    CurrentAuthenticatedUser () {
      return Auth.currentAuthenticatedUser()
    },
    GetToken ({ commit, state }) {
      const body = {
        email: state.User.email,
        password: state.User.password
      }
      return API.post('proxy-light-control', '/login', { body })
    }
  }
}

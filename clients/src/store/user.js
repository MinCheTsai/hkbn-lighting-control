import { Auth } from 'aws-amplify'

export default {
  namespaced: true,
  state: {
    Token: null,
    TokenValidityPeriod: null,
    defaultEmail: 'xxx@xxx.com'
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
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('12345678abc')
        }, 1500)
      })
    }
  }
}

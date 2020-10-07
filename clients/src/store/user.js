import { Auth } from 'aws-amplify'

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
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
    }
  }
}

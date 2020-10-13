import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('user', [
      'Token',
      'TokenValidityPeriod'
    ])
  },
  methods: {
    ...mapMutations('user', [
      'SetToken'
    ]),
    ...mapActions('user', [
      'GetToken'
    ]),
    checkTokenValidityPeriod () {
      if (this.Token) {
        if (Date.now() - this.TokenValidityPeriod > 1000 * 60 * 55) return false
        else return true
      } else {
        return false
      }
    },
    refreshToken () {
      return new Promise((resolve, reject) => {
        this
          .GetToken()
          .then(result => {
            if (result.status === 'success') {
              this.SetToken(result.data.token)
              resolve(true)
            } else {
              reject(new Error(result))
            }
          })
          .catch(error => {
            console.log('error', error)
            reject(new Error(false))
          })
      })
    }
  }
}

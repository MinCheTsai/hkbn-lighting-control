<template>
  <q-form @submit="login" class="row justify-center text-primary">
    <div class="row col-6">
      <div class="col-12">
        <h3 class="text-weight-medium">Login</h3>
      </div>
      <div class="col-12">
        <h6 class="q-mb-sm">Email</h6>
        <q-input dense v-model="email" outlined :rules="[ val => val && /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(val) || 'Invalid email format']" />
      </div>
      <div class="col-12">
        <h6 class="q-my-sm">Password</h6>
        <q-input v-model="password" type="password" dense outlined :rules="[ val => val && val.length > 7 || 'At least 8 characters']"/>
      </div>
      <div class="col-12 text-right q-mt-xl">
        <q-btn :loading="loading" type="submit" color="primary" label="Login" class="glossy"></q-btn>
      </div>
    </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      email: null,
      password: null
    }
  },
  methods: {
    ...mapActions('user', [
      'Login'
    ]),
    login () {
      this.loading = true
      this
        .Login({ email: this.email, password: this.password })
        .then(result => {
          if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this.$router.push({ name: 'ForceChangePassword', params: { email: this.email } })
            this.loading = false
          } else {
            this.$router.push({ name: 'Dashboard' })
            this._showSuccessNotify('Success Login')
            this.loading = false
          }
        })
        .catch(error => {
          this._showErrorNotify(`Error: ${error.message}`)
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

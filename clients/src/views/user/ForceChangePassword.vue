<template>
  <q-form @submit="loginAndChangePassword" class="row justify-center text-primary">
    <div class="row col-6">
      <div class="col-12">
        <h4 class="text-weight-medium">Change Your Temporary Password</h4>
      </div>
      <div class="col-12">
        <h6 class="q-my-sm">Old Password</h6>
        <q-input v-model="oldPassword" dense type="password" outlined :rules="[ val => val && val.length > 7 || 'At least 8 characters']"/>
      </div>
      <div class="col-12">
        <h6 class="q-my-sm">New Password</h6>
        <q-input v-model="newPassword" dense type="password" outlined :rules="[ val => val && val.length > 7 || 'At least 8 characters']"/>
      </div>
      <div class="col-12">
        <h6 class="q-my-sm">Comfirm New Password</h6>
        <q-input v-model="comfirmNewPassword" dense type="password" outlined :rules="[ val => val && val.length > 7 && val === this.newPassword || 'At least 8 characters & equal to new password']"/>
      </div>
      <div class="col-12 text-right q-mt-xl">
        <q-btn :loading="loading" type="submit" color="primary" label="Change" class="glossy"></q-btn>
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
      oldPassword: null,
      newPassword: null,
      comfirmNewPassword: null
    }
  },
  methods: {
    ...mapActions('user', [
      'Login',
      'ForceChangePassword'
    ]),
    loginAndChangePassword () {
      this.loading = true
      this
        .Login({ email: this.$route.params.email, password: this.oldPassword })
        .then(result => {
          if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this
              .ForceChangePassword({ result, newPassword: this.newPassword })
              .then(result => {
                this.$router.push({ name: 'Dashboard' })
                this._showSuccessNotify('Success change your password.')
                this.loading = false
              })
              .catch(error => {
                this._showErrorNotify(`Error: ${error.message}`)
                console.log(error)
                this.loading = false
              })
            this.loading = false
          } else {
            this.$router.push({ name: 'Dashboard' })
            this.loading = false
          }
        })
        .catch(error => {
          this._showErrorNotify(`Error: ${error.message}`)
          console.log(error)
          this.loading = false
        })
    }
  }
}
</script>

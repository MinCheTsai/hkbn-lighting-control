<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Change Password</div>
    </div>
    <q-form @submit="submitChangePassword">
      <div class="q-pa-md">
        <q-input v-model="oldPassword" dense outlined type="password" label="Old Password" :rules="[ val => val && val.length > 7 || 'At least 8 characters']" class="q-mt-md" />
        <q-input v-model="newPassword" dense outlined type="password" label="New Password" :rules="[ val => val && val.length > 7 || 'At least 8 characters']" class="q-mt-md" />
        <q-input v-model="confirmNewPassword" dense outlined type="password" label="Confirm New Password" :rules="[ val => val === newPassword || 'New Password not equal']" class="q-mt-md" />
      </div>
      <div class="row justify-end q-pa-md q-gutter-x-md">
        <q-btn @click="$emit('close')" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
        <q-btn :loading="loading" type="submit" unelevated no-caps color="secondary" label="Change" class="glossy" style="width:72px"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null
    }
  },
  methods: {
    ...mapActions('user', [
      'ChangePassword'
    ]),
    closePopup () {
      if (this.loading) return
      this.$emit('close')
    },
    submitChangePassword () {
      this.loading = true
      this
        .ChangePassword({ user: this.user, oldPassword: this.oldPassword, newPassword: this.newPassword })
        .then(() => {
          this._showSuccessNotify('Success Change Password.')
          this.loading = false
          this.closePopup()
        })
        .catch(error => {
          this._showErrorNotify(error.message || 'Change Password Fail')
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

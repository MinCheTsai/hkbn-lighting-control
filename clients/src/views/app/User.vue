<template>
  <div>
    <h4 class="q-mt-none">User Management</h4>
    <div class="row justify-end">
      <q-btn @click="popupChangePassword=true" color="primary" label="Change Password" no-caps class="glossy"></q-btn>
    </div>
    <div class="row">
      <div class="col-8">
        <label class="text-subtitle1 q-mb-sm">Name</label>
        <q-input disable dense outlined v-model="name" />
        <label class="text-subtitle1 q-mb-sm q-mt-md">Email</label>
        <q-input disable dense outlined v-model="email" />
      </div>
    </div>
    <!-- <q-btn :loading="loading" @click="test">Test</q-btn> -->
    <q-dialog v-model="popupChangePassword" persistent transition-show="scale" transition-hide="scale">
      <change-password :user="user" @close="popupChangePassword=false" />
    </q-dialog>
  </div>
</template>

<script>
import ChangePassword from '@/components/user/ChangePassword.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    'change-password': ChangePassword
  },
  data () {
    return {
      name: 'Jack',
      email: 'jack@jack.com',
      popupChangePassword: false,
      user: null,
      loading: false
    }
  },
  beforeMount () {
    this
      .CurrentAuthenticatedUser()
      .then(user => {
        this.user = user
      })
      .catch(error => {
        console.log('currentAuthenticatedUser', error)
      })
  },
  methods: {
    ...mapActions('user', [
      'CurrentAuthenticatedUser'
    ]),
    async test () {
      this.loading = true
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
        console.log(this.Token)
        console.log(this.TokenValidityPeriod)
        this.loading = false
      } catch (error) {
        console.log('test error', error)
        this.loading = false
      }
    }
  }
}
</script>

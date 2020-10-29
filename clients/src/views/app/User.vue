<template>
  <div>
    <h4 class="q-mt-none">User Management</h4>
    <div class="row justify-end">
      <q-btn @click="popupChangePassword=true" color="primary" label="Change Password" no-caps class="glossy"></q-btn>
    </div>
    <div class="row items-center q-col-gutter-xs col-12">
      <div class="col-12">
        <label class="text-subtitle1">Name</label>
      </div>
      <div class="col-8">
        <q-input :disable="!isEdit" dense outlined v-model="nickname" />
      </div>
      <div class="col-4">
        <q-btn :loading="loading" @click="updateUserName()" v-if="isEdit" color="primary" round flat icon="save"></q-btn>
        <q-btn :loading="loading" @click="isEdit=true" v-else color="primary" round flat icon="edit"></q-btn>
      </div>
      <div class="col-12">
        <label class="text-subtitle1 q-mb-sm q-mt-md">Email</label>
      </div>
      <div class="col-8">
        <q-input disable dense outlined v-model="email" />
      </div>
    </div>
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
      nickname: null,
      email: null,
      popupChangePassword: false,
      user: null,
      loading: false,
      isEdit: false
    }
  },
  beforeMount () {
    this
      .CurrentAuthenticatedUser()
      .then(user => {
        this.email = user.attributes.email || null
        this.nickname = user.attributes.nickname || null
        this.user = user || null
      })
      .catch(error => {
        console.log('currentAuthenticatedUser', error)
      })
  },
  methods: {
    ...mapActions('user', [
      'CurrentAuthenticatedUser',
      'UpdateUserAttributes'
    ]),
    updateUserName () {
      this.loading = true
      this
        .UpdateUserAttributes({ user: this.user, newUserAttributes: { nickname: this.nickname } })
        .then(() => {
          this.loading = false
          this.isEdit = false
        })
        .catch(error => {
          this.loading = false
          this.isEdit = false
          console.log(error)
        })
    }
  }
}
</script>

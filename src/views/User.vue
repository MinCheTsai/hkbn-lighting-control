<template>
  <div>
    <h4 class="q-mt-none">User Management</h4>
    <div class="row justify-end">
      <q-btn @click="popupChangePassword=true" color="primary" label="Change Password" no-caps class="glossy"></q-btn>
    </div>
    <div class="row">
      <div class="col-8">
        <label class="text-subtitle1 q-mb-sm">Name</label>
        <q-input dense outlined v-model="name" :rules="[ val => val && val.length > 0 || 'This feild is required']"/>
        <label class="text-subtitle1 q-mb-sm q-mt-md">Email</label>
        <q-input dense outlined v-model="email" :rules="[ val => val && val.length > 0 || 'This feild is required']"/>
        <div class="row justify-end q-mt-lg">
          <q-btn color="primary" label="Save" no-caps class="glossy"></q-btn>
        </div>
      </div>
    </div>
    <q-dialog v-model="popupChangePassword" persistent transition-show="scale" transition-hide="scale">
      <change-password @close="popupChangePassword=false" />
    </q-dialog>
  </div>
</template>

<script>
import ChangePassword from '@/components/user/ChangePassword.vue'

export default {
  components: {
    'change-password': ChangePassword
  },
  data () {
    return {
      name: 'Jack',
      email: 'jack@jack.com',
      popupChangePassword: false
    }
  }
}
</script>

<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Change Password</div>
    </div>
    <q-form @submit="submitChangePassword">
      <div class="q-pa-md">
        <q-input dense outlined v-model="oldPassword" label="Old Password" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md" />
        <q-input dense outlined v-model="newPassword" label="New Password" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md" />
        <q-input dense outlined v-model="confirmNewPassword" label="Confirm New Password" :rules="[ val => val === newPassword || 'New Password not equal']" class="q-mt-md" />
      </div>
      <div class="row justify-end q-pa-md q-gutter-x-md">
        <q-btn @click="$emit('close')" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
        <q-btn type="submit" unelevated no-caps color="secondary" label="Change" class="glossy" style="width:72px"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null
    }
  },
  computed: {
    // ...mapGetters('device', [
    //   'GatewaysArray'
    // ])
  },
  methods: {
    submitChangePassword () {
    }
  }
}
</script>

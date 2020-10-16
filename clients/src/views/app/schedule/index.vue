<template>
  <div>
    <span>
      <router-link :to="{ name: 'SchedulingManagement' }">Schedule Home Page</router-link>
    </span>
    <p class="text-subtitle1 q-mt-xl">Select Your Gateway :</p>
    <div class="row">
      <template v-for="(gateway,index) in GatewaysArray">
        <div class="col-4" :key="`gateway-${index}`">
          <q-card @click="routeToScheduleListManagement(gateway.UID)" class="text-center text-primary q-py-lg cursor-pointer">UID: {{ gateway.UID }}</q-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('device', [
      'GatewaysArray'
    ])
  },
  methods: {
    routeToScheduleListManagement (UID) {
      if (!UID) return
      this.$router.push({ name: 'SchedulingManagementList', params: { gateway: UID } })
    }
  }
}
</script>

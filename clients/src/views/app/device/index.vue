<template>
  <div>
    <span>
      <router-link :to="{ name: 'GatewaysManagement' }">Gateway List</router-link>
    </span>
    <p class="text-subtitle1 q-mt-xl">Select Your Gateway :</p>
    <div class="row">
      <template v-for="(gateway,index) in GatewaysArray">
        <div class="col-4" :key="`gateway-${index}`">
          <q-card @click="routeToGroupsManagement(gateway.UID)" class="text-center text-primary q-py-lg cursor-pointer">UID: {{ gateway.UID }}</q-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      fetchingGateways: false
    }
  },
  beforeMount () {
    this.check()
    this.InitDevices()
    this.fetchGateways()
  },
  computed: {
    ...mapGetters('device', [
      'GatewaysArray'
    ])
  },
  methods: {
    ...mapMutations('device', [
      'InitDevices'
    ]),
    async check () {
      this.loading = true
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
        console.log(this.Token)
        console.log(this.TokenValidityPeriod)
        this.loading = false
      } catch (error) {
        console.log('checkTokenValidityPeriod error', error)
        this.loading = false
      }
    },
    fetchGateways () {
      this.fetchingGateways = true
      setTimeout(() => {
        this.fetchingGateways = false
      }, 2000)
    },
    routeToGroupsManagement (UID) {
      if (!UID) return
      this.$router.push({ name: 'GroupsManagement', params: { gateway: UID } })
    }
  }
}
</script>

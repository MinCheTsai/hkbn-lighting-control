<template>
  <div>
    <span>
      <router-link :to="{ name: 'GatewaysManagement' }">Gateway List</router-link>
    </span>
    <p class="text-subtitle1 q-mt-xl">Select Your Gateway :</p>
    <div class="row q-gutter-x-lg">
      <template v-for="(gateway,index) in GatewaysArray">
        <div class="col-4" :key="`gateway-${index}`">
          <q-card @click="routeToGroupsManagement(gateway)" class="text-center text-primary q-py-lg cursor-pointer">
            <p class="q-my-none">{{ gateway.name }}</p>
          </q-card>
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
    routeToGroupsManagement (gateway) {
      if (!gateway.UID && !gateway.groups) return
      this.$router.push({ name: 'GroupsManagement', params: { gateway: gateway.UID } })
    }
  }
}
</script>

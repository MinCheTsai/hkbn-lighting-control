<template>
  <div>
    <q-tabs v-model="tab" active-color="primary" align="justify" narrow-indicator content-class="bg-primary shadow-2 glossy">
      <q-tab no-caps content-class="text-h4 text-white" name="device" label="Device List" />
      <q-tab no-caps content-class="text-h4 text-white" name="group" label="Group List" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <q-tab-panel name="device">
        <keep-alive>
          <Gateway :loading="fetchingGateways" />
        </keep-alive>
          <Controller :loading="fetchingControllers" />
      </q-tab-panel>

      <q-tab-panel name="group">
        <keep-alive>
          <Group :loading="fetchingGroups" />
        </keep-alive>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import Gateway from '@/components/device/Gateway.vue'
import Controller from '@/components/device/Controller.vue'
import Group from '@/components/device/Group.vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    Gateway,
    Controller,
    Group
  },
  data () {
    return {
      fetchingGateways: false,
      fetchingControllers: false,
      fetchingGroups: false,
      tab: 'device'
    }
  },
  beforeMount () {
    this.initDevices()
    this.fetchGateways()
    this.fetchControllers()
    this.fetchGroups()
  },
  methods: {
    ...mapMutations('device', [
      'initDevices',
      'SetGateways',
      'SetControllers',
      'SetGroups'
    ]),
    fetchGateways () {
      this.fetchingGateways = true
      setTimeout(() => {
        const fakeData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.SetGateways(fakeData)
        this.fetchingGateways = false
      }, 2000)
    },
    fetchControllers () {
      this.fetchingControllers = true
      setTimeout(() => {
        const fakeData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.SetControllers(fakeData)
        this.fetchingControllers = false
      }, 2000)
    },
    fetchGroups () {
      this.fetchingGroups = true
      setTimeout(() => {
        const fakeData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.SetGroups(fakeData)
        this.fetchingGroups = false
      }, 2000)
    }
  }
}
</script>

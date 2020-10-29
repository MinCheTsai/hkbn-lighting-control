<template>
  <div>
    <span>
      <router-link :to="{ name: 'GatewaysManagement' }">Gateway List</router-link> >
      <router-link :to="{ name: 'GroupsManagement' }">Group &#38; Controller List</router-link>
    </span>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data="GroupsArray"
        :columns="tableColumns"
        :loading="loading"
        :row-key="row => row.panid"
        virtual-scroll
        :virtual-scroll-item-size="54"
        :virtual-scroll-sticky-size-start="200"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="sc-table-tr-th">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.selected ? 'bg-secondary' : ''" class="sc-subtitle-2 sc-table-tr-td text-dark">
            <q-td auto-width>
              <q-btn size="sm" color="secondary" round dense @click="fecthControllers(props)" :icon="props.expand ? 'expand_less' : 'expand_more'" />
            </q-td>
            <q-td key="id" :props="props">
              {{ props.row.panid || '' }}
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name || '' }}
            </q-td>
            <!-- <q-td key="type" :props="props">
              {{ props.row.type || '' }}
            </q-td> -->
            <!-- <q-td key="status" :props="props">
              {{ props.row.status || 'Available' }}
            </q-td> -->
            <q-td key="control" :props="props" class="q-gutter-x-sm">
              <q-btn @click="TurnOnGroup(props.row)" :outline="!(props.row.switch===true)" color="positive" label="ON" no-caps class="text-caption text-weight-medium"></q-btn>
              <q-btn @click="TurnOffGroup(props.row)" :outline="!(props.row.switch===false)" color="negative" label="OFF" no-caps class="text-caption text-weight-medium"></q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <q-skeleton v-if="props.row.loading" type="text" />
              <div v-else>
                <table class="full-width">
                  <tr>
                    <td>Controller ID</td>
                    <!-- <td class="text-center">Type</td> -->
                    <td class="text-center">Status</td>
                    <td class="text-center">Total (min)</td>
                    <td class="text-center">Control</td>
                  </tr>
                  <template v-for="(controller, index) in props.row.controllers">
                    <tr :key="`${props.row.panid}-controller-${index}`" class="text-primary">
                      <td>{{ controller.mac }}</td>
                      <!-- <td class="text-center">{{ controller.type }}</td> -->
                      <td class="text-center">{{ controller.connect ? 'Connect' : 'Disconnect' }}</td>
                      <td class="text-center">{{ controller.totalTime }}</td>
                      <td class="text-center q-gutter-x-sm">
                        <q-btn @click="TurnOnController(controller, index, props)" :outline="!controller.switch" color="positive" label="ON" no-caps class="text-caption text-weight-medium"></q-btn>
                        <q-btn @click="TurnOffController(controller, index, props)" :outline="controller.switch" color="negative" label="OFF" no-caps class="text-caption text-weight-medium"></q-btn>
                      </td>
                    </tr>
                  </template>
                </table>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fetchingControllers: false,
      tableColumns: [
        {
          name: 'id',
          label: 'Group ID',
          align: 'left',
          field: row => row.panid,
          sortable: true
        },
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        // {
        //   name: 'type',
        //   align: 'left',
        //   label: 'Type',
        //   field: row => row.type,
        //   sortable: true
        // },
        // {
        //   name: 'status',
        //   align: 'left',
        //   label: 'Status',
        //   field: row => row.status,
        //   sortable: true
        // },
        {
          name: 'control',
          align: 'center',
          label: 'Control',
          field: row => row.switch
        }
      ]
    }
  },
  computed: {
    ...mapGetters('device', [
      'GatewaysArray',
      'GroupsArray'
    ])
  },
  beforeMount () {
    const currentGateway = this.GatewaysArray.find(gateway => gateway.UID === this.$route.params.gateway)
    this.SetGroups(currentGateway.groups)
  },
  methods: {
    ...mapMutations('device', [
      'SetGroups',
      'SetGroupLoading',
      'SetGroupSwitch',
      'InitControllers',
      'SetControllers',
      'SetControllerSwitch'
    ]),
    ...mapActions('device', [
      'GetControllersByGroup',
      'GetControllersConsumeByGroup',
      'GroupLightOn',
      'GroupLightOff',
      'SingleLightOn',
      'SingleLightOff'
    ]),
    async fecthControllers (props) {
      props.expand = !props.expand
      if (!props.expand) return
      if (props.row.controllers) return
      this.InitControllers(props.row.panid)
      this.SetGroupLoading({ loading: true, panid: props.row.panid })
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        this.SetGroupLoading({ loading: false, panid: props.row.panid })
        return
      }
      this.InitControllers()
      this
        .GetControllersByGroup({ UID: this.$route.params.gateway, PanID: props.row.panid })
        .then(({ data, status }) => {
          if (status === 'fail') throw Error({ data, status })
          this
            .GetControllersConsumeByGroup(props.row.panid)
            .then(result => {
              const controllersData = data.map(controller => {
                const controllerData = result.data.find(dbData => dbData.mac === controller.mac)
                return Object.assign({}, controller, { totalTime: controllerData.totalTime })
              })
              this.SetControllers({ controllers: controllersData, panid: props.row.panid })
              this.SetGroupLoading({ loading: false, panid: props.row.panid })
            })
            .catch(error => {
              console.log(error)
              this._showErrorNotify('Get Controllers Failed')
              this.SetGroupLoading({ loading: false, panid: props.row.panid })
            })
        })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Get Controllers Failed')
          this.SetGroupLoading({ loading: false, panid: props.row.panid })
        })
    },
    async TurnOnGroup (group) {
      this.SetGroupSwitch({ panid: group.panid, switchGroup: true })
      this.$forceUpdate()
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        return
      }
      this
        .GroupLightOn({ UID: this.$route.params.gateway, PanID: group.panid })
        .then(({ status }) => {
          if (status === 'fail') throw Error({ status })
        })
        .catch(error => {
          console.log(error)
          this.SetGroupSwitch({ panid: group.panid, switchGroup: false })
          this.$forceUpdate()
          this._showErrorNotify('Control Failed')
          this.fetchingControllers = false
        })
    },
    async TurnOffGroup (group) {
      this.SetGroupSwitch({ panid: group.panid, switchGroup: false })
      this.$forceUpdate()
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        return
      }
      this
        .GroupLightOff({ UID: this.$route.params.gateway, PanID: group.panid })
        .then(({ status }) => {
          if (status === 'fail') throw Error({ status })
        })
        .catch(error => {
          console.log(error)
          this.SetGroupSwitch({ panid: group.panid, switchGroup: true })
          this.$forceUpdate()
          this._showErrorNotify('Control Failed')
          this.fetchingControllers = false
        })
    },
    async TurnOnController (controller, index, props) {
      this.SetControllerSwitch({ index, switchLight: true, panid: props.row.panid })
      this.$forceUpdate()
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        return
      }
      this
        .SingleLightOn({ UID: this.$route.params.gateway, mac: controller.mac })
        .then(({ status }) => {
          if (status === 'fail') throw Error({ status })
        })
        .catch(error => {
          console.log(error)
          this.SetControllerSwitch({ index, switchLight: false, panid: props.row.panid })
          this.$forceUpdate()
          this._showErrorNotify('Control Failed')
          this.fetchingControllers = false
        })
    },
    async TurnOffController (controller, index, props) {
      this.SetControllerSwitch({ index, switchLight: false, panid: props.row.panid })
      this.$forceUpdate()
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        return
      }
      this
        .SingleLightOff({ UID: this.$route.params.gateway, mac: controller.mac })
        .then(({ status }) => {
          if (status === 'fail') throw Error({ status })
        })
        .catch(error => {
          console.log(error)
          this.SetControllerSwitch({ index, switchLight: true, panid: props.row.panid })
          this.$forceUpdate()
          this._showErrorNotify('Control Failed')
          this.fetchingControllers = false
        })
    },
    onScroll () {
    }
  }
}
</script>

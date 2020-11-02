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
            <q-th>Export</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.selected ? 'bg-secondary' : ''" class="sc-subtitle-2 sc-table-tr-td text-dark">
            <q-td auto-width>
              <q-btn size="sm" color="secondary" round dense @click="expendControllerList(props)" :icon="props.expand ? 'expand_less' : 'expand_more'" />
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
            <q-td auto-width>
              <q-btn :loading="props.row.exporting" flat @click="exportCSV(props.row)" color="primary" icon="save"></q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <q-skeleton v-if="props.row.loading" type="text" />
              <div v-else>
                <table class="full-width">
                  <tr class="text-center">
                    <td class="text-left">Controller ID</td>
                    <!-- <td class="text-center">Type</td> -->
                    <td>Status</td>
                    <td>Total (min)</td>
                    <td>Control</td>
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
      'SetControllerSwitch',
      'SetGroupExporting'
    ]),
    ...mapActions('device', [
      'GetControllersByGroup',
      'GetControllersConsumeByGroup',
      'GroupLightOn',
      'GroupLightOff',
      'SingleLightOn',
      'SingleLightOff'
    ]),
    async expendControllerList (props) {
      props.expand = !props.expand
      if (!props.expand) return
      if (props.row.controllers) return
      await this.fecthControllers(props.row.panid)
    },
    async fecthControllers (panId) {
      this.InitControllers(panId)
      this.SetGroupLoading({ loading: true, panid: panId })
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        this.SetGroupLoading({ loading: false, panid: panId })
        return
      }
      this.InitControllers()
      try {
        const { data, status } = await this.GetControllersByGroup({ UID: this.$route.params.gateway, PanID: panId })
        if (status === 'fail') throw Error({ data, status })
        const macs = data.map(controller => controller.mac)
        const result = await this.GetControllersConsumeByGroup({ uid: this.$route.params.gateway, macs })
        const controllersData = data.map(controller => {
          const controllerData = result.data.find(dbData => dbData.mac === controller.mac)
          if (controllerData) {
            return Object.assign({}, controller, { totalTime: controllerData.totalTime, lastUpdated: controllerData.lastUpdated, createdTime: controllerData.createdTime })
          } else {
            return Object.assign({}, controller, { totalTime: 0, lastUpdated: 'none', createdTime: 'none' })
          }
        })
        this.SetControllers({ controllers: controllersData, panid: panId })
        this.SetGroupLoading({ loading: false, panid: panId })
      } catch (error) {
        console.log(error)
        this._showErrorNotify('Get Controllers Failed')
        this.SetGroupLoading({ loading: false, panid: panId })
        throw new Error(error)
      }
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
    async exportCSV (groupData) {
      this.SetGroupExporting({ exporting: true, panid: groupData.panid })
      try {
        if (!groupData.controllers) {
          await this.fecthControllers(groupData.panid)
        }
        let csvContent = 'data:text/csv;charset=utf-8,'
        const controllerDataset = groupData.controllers.map(controller => {
          return {
            mac: controller.mac,
            totalTime: controller.totalTime,
            lastUpdated: this.$moment(controller.lastUpdated).format('YYYY-MM-DD hh:mm'),
            createdTime: this.$moment(controller.createdTime).format('YYYY-MM-DD hh:mm')
          }
        })
        const column = Object.keys(controllerDataset[0])
        csvContent += column + '\r\n'
        controllerDataset.forEach(controller => {
          const controllerData = Object.values(controller)
          const row = controllerData.join(',')
          csvContent += row + '\r\n'
        })
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('id', 'exportCSV')
        link.setAttribute('download', `${this.$moment().format('YYYYMMDD')}-${groupData.panid}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.SetGroupExporting({ exporting: false, panid: groupData.panid })
      } catch (error) {
        this.SetGroupExporting({ exporting: false, panid: groupData.panid })
      }
    },
    onScroll () {
    }
  }
}
</script>

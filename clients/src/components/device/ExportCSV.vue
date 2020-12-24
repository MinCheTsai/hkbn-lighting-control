<template>
  <div class="bg-white" style="width:400px">
    <div class="q-pa-md bg-primary glossy text-white row justify-between">
      <h6 v-if="!successDownload && !exporting"  class="text-h6 q-my-none inline-block">Choose Date Range</h6>
      <h6 v-if="exporting" class="text-h6 q-my-none inline-block">Calculating...</h6>
      <h6 v-if="successDownload" class="text-h6 q-my-none inline-block">Success</h6>
      <q-icon @click="closePopup" name="close" size="sm" class="cursor-pointer q-pa-xs"></q-icon>
    </div>
    <div v-if="successDownload" class="q-pa-md q-pb-lg text-center">
      <q-icon name="check_circle_outline" class="text-primary q-mb-md text-h2"></q-icon><br>
      <q-btn @click="downloadAgain" no-caps label="Download Again" color="primary" icon-right="get_app" class="glossy"></q-btn>
    </div>
    <div v-else class="q-pa-md q-pb-lg text-center">
      <q-date v-show="!exporting" v-model="dateRage" mask="YYYY-MM-DD" range /><br>
      <q-linear-progress v-show="exporting" query />
      <h5 class="q-my-md">{{ dateRage.from }} ~ {{  dateRage.to }}</h5>
      <q-btn @click="exportCSV" :loading="exporting" color="primary" no-caps class="glossy">Generate CSV</q-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      exporting: false,
      dateRage: {},
      successDownload: false
    }
  },
  computed: {
    ...mapGetters('device', [
      'GroupsArray'
    ])
  },
  beforeDestroy () {
    const link = document.querySelector('#exportCSV')
    if (link) {
      document.body.removeChild(link)
    }
  },
  methods: {
    ...mapActions('device', [
      'GetControllersByGroup',
      'GetControllersConsumeByDateRange'
    ]),
    closePopup () {
      if (this.exporting) return
      this.$emit('close')
    },
    async exportCSV (date) {
      if (!this.dateRage.to && !this.dateRage.from) {
        this._showErrorNotify('Choose Date Range First')
        return
      }
      this.exporting = true
      try {
        if (!this.checkTokenValidityPeriod()) {
          await this.refreshToken()
        }
      } catch (error) {
        this._showErrorNotify('Refresh Token Error')
        console.log('checkTokenValidityPeriod error', error)
        this.exporting = false
        return
      }
      let controllerListByGroup
      try {
        controllerListByGroup = await Promise.all(this.GroupsArray.map(group => this.GetControllersByGroup({ UID: this.$route.params.gateway, PanID: group.panid })))
        controllerListByGroup.forEach(({ data, status }) => {
          if (status !== 'success') throw Error({ data, status })
        })
        controllerListByGroup.forEach((result, index) => {
          result.group = { name: this.GroupsArray[index].name, panid: this.GroupsArray[index].panid }
        })
      } catch (error) {
        this._showErrorNotify('Get Controllers Failed')
        console.log(error)
        this.exporting = false
        return
      }
      let controllersDataByGroup
      try {
        controllersDataByGroup = await Promise.all(controllerListByGroup.map(controllers => {
          const macs = controllers.data.map(controller => controller.mac)
          return this.GetControllersConsumeByDateRange({ macs, group: controllers.group, range: this.dateRage })
        }))
      } catch (error) {
        this._showErrorNotify('Get Data Failed')
        console.log(error)
        this.exporting = false
        return
      }
      try {
        const csvData = []
        controllersDataByGroup.forEach(controllers => {
          controllers.data.forEach(data => {
            if (data) {
              csvData.push({
                group: controllers.group.name,
                mac: data.mac,
                totalTime: data.duration,
                firstUpdate: this.formatTime(data.firstUpdate),
                lastUpdate: this.formatTime(data.lastUpdate)
              })
            }
          })
        })
        if (csvData.length < 1) {
          this._showErrorNotify('No Data To Generate.')
          this.exporting = false
          return
        }
        let csvContent = 'data:text/csv;charset=utf-8,'
        const column = Object.keys(csvData[0])
        csvContent += column.join(',') + '\r\n'
        csvContent = csvContent.replace('totalTime', 'totalTime(mins)')
        csvData.forEach(data => {
          const rowData = Object.values(data)
          csvContent += rowData.join(',') + '\r\n'
        })
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('id', 'exportCSV')
        link.setAttribute('download', `${this.dateRage.from.replace(/-/g, '')}-${this.dateRage.to.replace(/-/g, '')}.csv`)
        document.body.appendChild(link)
        link.click()
        this.exporting = false
        this.successDownload = true
      } catch (error) {
        this._showErrorNotify('Generate Data Failed')
        console.log(error)
        this.exporting = false
      }
    },
    formatTime (timestamp) {
      const dateTime = new Date(timestamp - (8 * 60 * 60 * 1000))
      const YYYY = dateTime.getFullYear()
      const MM = dateTime.getMonth() + 1
      const DD = dateTime.getDate()
      const hh = ('0' + dateTime.getHours()).slice(-2)
      const mm = ('0' + dateTime.getMinutes()).slice(-2)
      return `${YYYY}-${MM}-${DD} ${hh}:${mm}`
    },
    downloadAgain () {
      const link = document.querySelector('#exportCSV')
      if (link) {
        link.click()
      }
    }
  }
}
</script>

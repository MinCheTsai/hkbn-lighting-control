<template>
  <div class="q-pt-lg">
    <div class="row justify-between">
      <h6 class="q-ma-none">Controller</h6>
      <q-btn @click="popupCreateController=true" color="secondary" label="Add Controller" no-caps class="text-caption text-weight-medium glossy"></q-btn>
    </div>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data="DefaultControllers"
        :columns="tableColumns"
        :loading="loading"
        :row-key="row => row.number"
        virtual-scroll
        :virtual-scroll-item-size="54"
        :virtual-scroll-sticky-size-start="200"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="sc-table-tr-th">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.selected ? 'bg-secondary' : ''" class="sc-subtitle-2 sc-table-tr-td text-dark">
            <q-td key="number" :props="props">
              {{ props.row.number || '' }}
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.mac || '' }}
            </q-td>
            <q-td key="location" :props="props">
              {{ props.row.location || '' }}
            </q-td>
            <q-td key="status" :props="props">
              {{ props.row.status ? 'Connected' : 'Disconnected' }}
            </q-td>
            <q-td key="control" :props="props" class="q-gutter-x-sm">
              <q-btn @click="turnOnOff(props.row.mac)">Switch</q-btn>
              <!-- <q-btn :disable="!props.row.status" @click="switchControl(props.row, true)" :outline="!props.row.switch" color="positive" label="ON" no-caps class="text-caption text-weight-medium glossy"></q-btn> -->
              <!-- <q-btn :disable="!props.row.status" @click="switchControl(props.row, false)" :outline="props.row.switch" color="negative" label="OFF" no-caps class="text-caption text-weight-medium glossy"></q-btn> -->
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="popupCreateController" persistent transition-show="scale" transition-hide="scale">
      <create-controller @close="popupCreateController=false" />
    </q-dialog>
  </div>
</template>

<script>
import createController from './CreateController'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'create-controller': createController
  },
  data () {
    return {
      popupCreateController: false,
      tableColumns: [
        {
          name: 'number',
          label: 'No.',
          align: 'left',
          field: row => row.number,
          sortable: true
        },
        {
          name: 'name',
          label: 'Device Name(Mac)',
          align: 'left',
          field: row => row.mac,
          sortable: true
        },
        {
          name: 'location',
          align: 'left',
          label: 'Location',
          field: row => row.location,
          sortable: true
        },
        {
          name: 'status',
          align: 'left',
          label: 'Connect status',
          field: row => row.status,
          sortable: true
        },
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
    ...mapState('device', [
      'DefaultControllers'
    ])
  },
  methods: {
    ...mapMutations('device', [
      'SwitchController'
    ]),
    ...mapActions('device', [
      'SingleLightOn'
    ]),
    switchControl (controller, status) {
      this.SwitchController({ controller, status })
    },
    turnOnOff (mac) {
      this
        .SingleLightOn(mac)
        .then(result => {
          console.log(result)
        })
        .catch(error => {
          console.log(error)
        })
    },
    onScroll ({ to, ref }) {
    }
  }
}
</script>

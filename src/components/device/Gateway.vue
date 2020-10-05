<template>
  <div class="q-my-lg">
    <div class="row justify-between">
      <h6 class="q-ma-none">Gateway</h6>
      <q-btn @click="popupCreateGateway=true" color="secondary" label="Add Gateway" no-caps class="text-caption text-weight-medium glossy"></q-btn>
    </div>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data="GatewaysArray"
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
            <q-td key="updateAt" :props="props">
              {{ props.row.updateAt ? $moment(props.row.updateAt).format('YYYY/M/DD hh:mm') : 'None' }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="popupCreateGateway" persistent transition-show="scale" transition-hide="scale">
      <create-gateway @close="popupCreateGateway=false" />
    </q-dialog>
  </div>
</template>

<script>
import createGateway from './CreateGateway'
import { mapGetters } from 'vuex'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'create-gateway': createGateway
  },
  data () {
    return {
      popupCreateGateway: false,
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
          name: 'updateAt',
          align: 'left',
          label: 'Update Time',
          field: row => row.updateAt,
          format: val => val ? `${this.$moment(val).format('YYYY/M/DD hh:mm')}` : 'None',
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters('device', [
      'GatewaysArray'
    ])
  },
  methods: {
    onScroll ({ to, ref }) {
    }
  }
}
</script>

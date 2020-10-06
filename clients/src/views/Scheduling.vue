<template>
  <div class="q-my-lg">
    <div class="row justify-between">
      <h6 class="q-ma-none">Schedule List</h6>
      <q-btn @click="popupCreateSchedule=true" color="secondary" label="Add Schedule" no-caps class="text-caption text-weight-medium glossy"></q-btn>
    </div>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data="SchedulesArray"
        :columns="tableColumns"
        :loading="fetchingSchedules"
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
              {{ props.row.name || '' }}
            </q-td>
            <q-td key="mode" :props="props">
              {{ props.row.mode || '' }}
            </q-td>
            <q-td key="time" :props="props">
              {{ props.row.time || '' }}
            </q-td>
            <q-td key="repeat" :props="props">
              {{ props.row.repeat ? props.row.repeat.join(', ') : 'None' }}
            </q-td>
            <q-td key="active" :props="props">
              <q-toggle v-model="props.row.active" color="secondary" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="popupCreateSchedule" persistent transition-show="scale" transition-hide="scale">
      <create-schedule @close="popupCreateSchedule=false" />
    </q-dialog>
  </div>
</template>

<script>
import createSchedule from '@/components/schedule/CreateSchedule.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    'create-schedule': createSchedule
  },
  data () {
    return {
      fetchingSchedules: false,
      popupCreateSchedule: false,
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
          label: 'Name',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        {
          name: 'mode',
          align: 'left',
          label: 'Mode',
          field: row => row.mode,
          sortable: true
        },
        {
          name: 'time',
          align: 'left',
          label: 'Time',
          field: row => row.time,
          sortable: true
        },
        {
          name: 'repeat',
          align: 'left',
          label: 'Repeat',
          field: row => row.repeat,
          format: val => val ? val.join(', ') : 'None',
          sortable: true
        },
        {
          name: 'active',
          align: 'left',
          label: 'Active',
          field: row => row.active
        }
      ]
    }
  },
  computed: {
    ...mapGetters('schedule', [
      'SchedulesArray'
    ])
  },
  beforeMount () {
    this.InitSchedules()
    this.fetchSchedules()
  },
  methods: {
    ...mapMutations('schedule', [
      'InitSchedules',
      'SetSchedules'
    ]),
    fetchSchedules () {
      this.fetchingSchedules = true
      setTimeout(() => {
        const fakeData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.SetSchedules(fakeData)
        this.fetchingSchedules = false
      }, 2000)
    },
    onScroll ({ to, ref }) {
    }
  }
}
</script>

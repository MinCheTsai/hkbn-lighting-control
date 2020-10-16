<template>
  <div>
    <div class="row justify-between">
      <div>
        <router-link :to="{ name: 'SchedulingManagement' }">Schedule Home Page</router-link> >
        <router-link :to="{ name: 'SchedulingManagementList' }">Schedule List</router-link>
      </div>
      <q-btn @click="popupCreateSchedule=true" color="secondary" label="Add Schedule" no-caps class="text-caption text-weight-medium glossy"></q-btn>
    </div>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data.sync="SchedulesArray"
        :columns="tableColumns"
        :loading="fetchingSchedules"
        :row-key="row => row.name"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="100"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="sc-table-tr-th">
            <q-th></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.selected ? 'bg-secondary' : ''" class="sc-subtitle-2 sc-table-tr-td text-dark">
            <q-td></q-td>
            <q-td key="name" :props="props">
              <p @click="openUpdateScheduleDialog(props.row)" class="q-my-none text-primary hover-underline cursor-pointer">{{ props.row.name || '' }}</p>
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
              <q-toggle v-model="props.row.active" @input="switchSchedule(props.row)" color="secondary" />
            </q-td>
            <q-td>
              <q-btn @click="openDeleteScheduleDialog(props.row)" flat color="info" icon="delete"></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="popupCreateSchedule" persistent transition-show="scale" transition-hide="scale">
      <create-schedule @close="popupCreateSchedule=false" />
    </q-dialog>
    <q-dialog v-model="popupUpdateSchedule" persistent transition-show="scale" transition-hide="scale">
      <update-schedule @close="popupUpdateSchedule=false;currentSchedule=null" :schedule="currentSchedule" />
    </q-dialog>
    <q-dialog v-model="popupDeleteSchedule" persistent transition-show="scale" transition-hide="scale">
      <delete-schedule @close="popupDeleteSchedule=false;currentSchedule=null" :schedule="currentSchedule" />
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import createSchedule from '@/components/schedule/CreateSchedule.vue'
import updateSchedule from '@/components/schedule/UpdateSchedule.vue'
import deleteSchedule from '@/components/schedule/DeleteSchedule.vue'

export default {
  components: {
    'create-schedule': createSchedule,
    'update-schedule': updateSchedule,
    'delete-schedule': deleteSchedule
  },
  data () {
    return {
      fetchingSchedules: false,
      popupCreateSchedule: false,
      popupUpdateSchedule: false,
      popupDeleteSchedule: false,
      currentSchedule: null,
      tableColumns: [
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
      ],
      nextToken: null
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
    ...mapActions('schedule', [
      'GetSchedules',
      'GetScheduleTarget',
      'ChangeScheduleState'
    ]),
    fetchSchedules () {
      this.fetchingSchedules = true
      this
        .GetSchedules({ uid: this.$route.params.gateway, nextToken: this.nextToken })
        .then(({ Rules, NextToken }) => {
          this.SetSchedules(Rules)
          this.nextToken = NextToken
          this.fetchingSchedules = false
        })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Get Schedules Failed')
          this.fetchingSchedules = false
        })
    },
    switchSchedule (schedule) {
      this
        .ChangeScheduleState({ uid: this.$route.params.gateway, ruleId: schedule.id, active: schedule.active })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Switch Schedule Active Failed')
        })
    },
    openUpdateScheduleDialog (shedule) {
      this.currentSchedule = shedule
      this.popupUpdateSchedule = true
    },
    openDeleteScheduleDialog (shedule) {
      this.currentSchedule = shedule
      this.popupDeleteSchedule = true
    },
    onScroll ({ to, ref }) {
    }
  }
}
</script>

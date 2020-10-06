<template>
  <div class="q-my-lg">
    <div class="row justify-between">
      <h6 class="q-ma-none">Location List</h6>
      <q-btn @click="popupCreateLocation=true" color="secondary" label="Add Location" no-caps class="text-caption text-weight-medium glossy"></q-btn>
    </div>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data="LocationsArray"
        :columns="tableColumns"
        :loading="fetchingLocations"
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
            <q-th></q-th>
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
            <q-td key="floor" :props="props">
              {{ props.row.floor || '' }}
            </q-td>
            <q-td>
              <q-btn @click=";" round flat icon="edit"></q-btn>
              <q-btn @click=";" round flat icon="delete"></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="popupCreateLocation" transition-show="scale" transition-hide="scale">
    <!-- <q-dialog v-model="popupCreateLocation" persistent transition-show="scale" transition-hide="scale"> -->
      <create-schedule @close="popupCreateLocation=false" />
    </q-dialog>
  </div>
</template>

<script>
import createLocation from '@/components/setting/CreateLocation.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    'create-schedule': createLocation
  },
  data () {
    return {
      fetchingLocations: false,
      popupCreateLocation: false,
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
          label: 'Building',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        {
          name: 'floor',
          align: 'left',
          label: 'Floor',
          field: row => row.floor,
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters('location', [
      'LocationsArray'
    ])
  },
  beforeMount () {
    this.InitLocations()
    this.fetchLocations()
  },
  methods: {
    ...mapMutations('location', [
      'InitLocations',
      'SetLocations'
    ]),
    fetchLocations () {
      this.fetchingLocations = true
      setTimeout(() => {
        const fakeData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.SetLocations(fakeData)
        this.fetchingLocations = false
      }, 2000)
    },
    onScroll ({ to, ref }) {
    }
  }
}
</script>

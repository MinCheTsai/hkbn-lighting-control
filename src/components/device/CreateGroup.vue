<template>
  <div class="bg-white" style="width:720px;max-width:720px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Add Group</div>
    </div>
    <q-form @submit="submitCreate">
      <div class="q-pa-md">
        <q-input dense outlined v-model="name" label="Name" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md" />
        <q-select dense outlined v-model="locations" :options="Locations" label="Location" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-my-md"/>
        <h6 class="q-my-none text-info">Controllers</h6>
        <q-table
          class="q-custom-table no-shadow"
          style="border:1px solid #999999"
          :data="ControllersArray"
          :columns="tableColumns"
          selection="multiple"
          :selected.sync="tickedControllers"
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
              <q-th class="text-left">
                <q-checkbox color="secondary" dense v-model="props.selected"/>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" class="sc-subtitle-2 sc-table-tr-td text-dark">
              <q-td key="number" :props="props">
                {{ props.row.number || '' }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.mac || '' }}
              </q-td>
              <q-td key="gateway" :props="props">
                {{ props.row.gateway || '' }}
              </q-td>
              <q-td key="location" :props="props">
                {{ props.row.location || '' }}
              </q-td>
              <q-td>
                <q-checkbox dense v-model="props.selected" color="secondary" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="row justify-end q-pa-md q-gutter-x-md">
        <q-btn @click="$emit('close')" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
        <q-btn type="submit" unelevated no-caps color="secondary" label="Add" class="glossy" style="width:72px"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      name: null,
      locations: null,
      tickedControllers: [],
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
          name: 'gateway',
          align: 'left',
          label: 'Gateway',
          field: row => row.gateway,
          sortable: true
        },
        {
          name: 'location',
          align: 'left',
          label: 'Location',
          field: row => row.location,
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapState('device', [
      'Locations'
    ]),
    ...mapGetters('device', [
      'ControllersArray'
    ])
  },
  methods: {
    submitCreate () {
    }
  }
}
</script>

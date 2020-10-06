<template>
  <div>
    <div class="row justify-between">
      <h6 class="q-ma-none">Group</h6>
      <q-btn @click="popupCreateGroup=true" color="secondary" label="Add Group" no-caps class="text-caption text-weight-medium glossy"></q-btn>
    </div>
    <q-card class="full-width q-mt-md">
      <q-table
        color="secondary"
        class="q-custom-table"
        :data="GroupsArray"
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
              {{ props.row.name || '' }}
            </q-td>
            <q-td key="location" :props="props">
              {{ props.row.location || '' }}
            </q-td>
            <q-td key="qty" :props="props">
              {{ props.row.qty }}
            </q-td>
            <q-td key="control" :props="props" class="q-gutter-x-sm">
              <q-btn @click="switchControl(props.row, true)" :outline="!props.row.switch" color="positive" label="ON" no-caps class="text-caption text-weight-medium glossy"></q-btn>
              <q-btn @click="switchControl(props.row, false)" :outline="props.row.switch" color="negative" label="OFF" no-caps class="text-caption text-weight-medium glossy"></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="popupCreateGroup" persistent transition-show="scale" transition-hide="scale">
      <create-group @close="popupCreateGroup=false" />
    </q-dialog>
  </div>
</template>

<script>
import createGroup from './CreateGroup'
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'create-group': createGroup
  },
  data () {
    return {
      popupCreateGroup: false,
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
          label: 'Group Name',
          align: 'left',
          field: row => row.name,
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
          name: 'qty',
          align: 'left',
          label: 'Qty',
          field: row => row.qty,
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
    ...mapGetters('device', [
      'GroupsArray'
    ])
  },
  methods: {
    ...mapMutations('device', [
      'SwitchGroup'
    ]),
    switchControl (group, status) {
      this.SwitchGroup({ group, status })
    },
    onScroll ({ to, ref }) {
    }
  }
}
</script>

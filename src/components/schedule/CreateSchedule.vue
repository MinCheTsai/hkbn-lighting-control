<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Add Schedule</div>
    </div>
    <q-form @submit="submitCreate">
      <div class="q-pa-md">
        <q-input dense outlined v-model="name" label="Name" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md" />
        <q-select @filter="fetchGroups" dense outlined v-model="group" :options="groupList" label="Group" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md"/>
        <div class="q-gutter-x-md q-my-sm">
          <h6 class="q-my-none text-info">Mode</h6>
          <q-radio v-model="mode" val="Open" label="Open" color="secondary" />
          <q-radio v-model="mode" val="Close" label="Close" color="info" />
        </div>
        <h6 class="q-my-none text-info">Time</h6>
        <div class="row">
          <div class="col-6">
            <q-input outlined v-model="time" mask="time" :rules="['time']">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="time" color="secondary">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="secondary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <h6 class="q-my-none text-info">Repeat</h6>
        <div class="q-gutter-sm">
          <q-checkbox v-model="repeat" val="Mon" label="Mon" color="secondary" />
          <q-checkbox v-model="repeat" val="Tue" label="Tue" color="secondary" />
          <q-checkbox v-model="repeat" val="Wed" label="Wed" color="secondary" />
          <q-checkbox v-model="repeat" val="Thu" label="Thu" color="secondary" />
          <q-checkbox v-model="repeat" val="Fri" label="Fri" color="secondary" />
          <q-checkbox v-model="repeat" val="Sat" label="Sat" color="secondary" />
          <q-checkbox v-model="repeat" val="Sun" label="Sun" color="secondary" />
        </div>
      </div>
      <div class="row justify-end q-pa-md q-gutter-x-md">
        <q-btn @click="$emit('close')" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
        <q-btn type="submit" unelevated no-caps color="secondary" label="Add" class="glossy" style="width:72px"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      fetchingGroups: false,
      name: null,
      mode: 'Open',
      group: null,
      time: null,
      repeat: []
    }
  },
  computed: {
    ...mapGetters('device', [
      'GroupsArray'
    ]),
    groupList () {
      return this.GroupsArray.map(group => group.name)
    }
  },
  beforeMount () {
    this.InitDevices()
  },
  methods: {
    ...mapMutations('device', [
      'InitDevices',
      'SetGroups'
    ]),
    ...mapActions('device', [
      'GetGroups'
    ]),
    fetchGroups (val, update, abort) {
      // this.fetchingGroups = true
      if (this.groupList.length > 0) {
        update()
        return
      }
      setTimeout(() => {
        const fakeData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.SetGroups(fakeData)
        // this.fetchingGroups = false
        update()
      }, 2000)
    },
    submitCreate () {
    }
  }
}
</script>

<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Add Schedule</div>
    </div>
    <q-form @submit="submitCreate">
      <div class="q-pa-md">
        <q-input dense outlined v-model="name" label="Name" :rules="[ val => val && val.length > 0 || 'This feild is required', val => val.length <= 30 || 'Max Length 30 Characters', val => /^[\.\-A-Za-z0-9]+$/.test(val) || 'Format Example: My-Schedule1.0']" class="q-mt-md" />
        <q-select dense emit-value map-options outlined v-model="group" :options="GroupsArray" option-label="name" option-value="panid" label="Group" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label v-html="scope.opt.name" />
                <q-item-label caption>{{ scope.opt.panid }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="q-gutter-x-md q-my-sm">
          <h6 class="q-my-none text-info">Mode</h6>
          <q-radio v-model="mode" val="on" label="On" color="secondary" />
          <q-radio v-model="mode" val="off" label="Off" color="info" />
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
        <h6 class="q-my-none text-info">Repeat <span v-if="repeatError" class="text-caption text-negative">This feild is required</span></h6>
        <div class="q-gutter-sm">
          <q-checkbox v-model="repeat" val="MON" label="Mon" color="secondary" />
          <q-checkbox v-model="repeat" val="TUE" label="Tue" color="secondary" />
          <q-checkbox v-model="repeat" val="WED" label="Wed" color="secondary" />
          <q-checkbox v-model="repeat" val="THU" label="Thu" color="secondary" />
          <q-checkbox v-model="repeat" val="FRI" label="Fri" color="secondary" />
          <q-checkbox v-model="repeat" val="SAT" label="Sat" color="secondary" />
          <q-checkbox v-model="repeat" val="SUN" label="Sun" color="secondary" />
        </div>
      </div>
      <div class="row justify-end q-pa-md q-gutter-x-md">
        <q-btn @click="closePopup" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
        <q-btn :loading="creating" type="submit" unelevated no-caps color="secondary" label="Add" class="glossy" style="width:72px"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      creating: false,
      name: null,
      mode: 'Open',
      group: null,
      time: null,
      repeat: [],
      repeatError: false
    }
  },
  computed: {
    ...mapGetters('device', [
      'GroupsArray'
    ])
  },
  watch: {
    repeat (val) {
      if (val.length < 1) this.repeatError = true
      else this.repeatError = false
    }
  },
  beforeMount () {
    console.log(process.env.NODE_ENV)
  },
  methods: {
    ...mapMutations('schedule', [
      'SetSchedule'
    ]),
    ...mapActions('schedule', [
      'CreateSchedule',
      'NotifyEmail'
    ]),
    closePopup () {
      if (this.creating) return
      this.$emit('close')
    },
    submitCreate () {
      if (this.repeat.length < 1) {
        this.repeatError = true
        return
      }
      this.creating = true
      this
        .CreateSchedule({
          uid: this.$route.params.gateway,
          panid: this.group,
          name: this.name,
          mode: this.mode,
          days: this.repeat,
          time: this.time
        })
        .then(({ data }) => {
          this.SetSchedule({ id: data, name: this.name, mode: this.mode, time: this.time, repeat: this.repeat, group: this.group, active: true })
          if (process.env.NODE_ENV === 'production') this.NotifyEmail({ type: 'Create', name: this.name, mode: this.mode, time: this.time, days: this.repeat, panid: this.group })
          this._showSuccessNotify('Create Schedule Success')
          this.creating = false
          this.closePopup()
        })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Create Schedule Failed')
          this.creating = false
        })
    }
  }
}
</script>

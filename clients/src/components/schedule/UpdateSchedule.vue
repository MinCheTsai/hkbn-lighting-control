<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Add Schedule</div>
    </div>
    <div class="relative-position">
      <div v-if="loading&&!scheduleTarget" style="height:200px" class="full-width">
        <div v-if="loading" class="loading-mask">
          <q-inner-loading showing color="primary" />
        </div>
      </div>
      <q-form v-else @submit="submitUpdate">
        <div class="q-pa-md">
          <q-input disable dense outlined v-model="name" label="Name" :rules="[ val => val && val.length > 0 || 'This feild is required', val => val.length < 49 || 'Max Length 48 Characters', val => /^[\.\-A-Za-z0-9]+$/.test(val) || 'Format Example: My-Schedule1.0']" class="q-mt-md" />
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
          <q-btn :loading="updating" type="submit" unelevated no-caps color="secondary" label="Update" class="glossy" style="width:72px"></q-btn>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    schedule: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      updating: false,
      name: null,
      mode: null,
      group: null,
      time: null,
      repeat: [],
      repeatError: false,
      scheduleTarget: null
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
    this.fetchScheduleTarget()
    this.name = this.schedule.name
    this.mode = this.schedule.mode
    this.group = this.schedule.group
    this.time = this.schedule.time
    this.repeat = this.schedule.repeat
  },
  methods: {
    ...mapMutations('schedule', [
      'RenewSchedule'
    ]),
    ...mapActions('schedule', [
      'GetScheduleTarget',
      'UpdateSchedule',
      'NotifyEmail'
    ]),
    closePopup () {
      if (this.updating || this.loading) return
      this.$emit('close')
    },
    fetchScheduleTarget () {
      this.loading = true
      this
        .GetScheduleTarget({ uid: this.$route.params.gateway, ruleId: this.schedule.id })
        .then(({ Targets }) => {
          this.scheduleTarget = Targets[0]
          this.scheduleTarget.Input = JSON.parse(this.scheduleTarget.Input)
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Get Schedule Infomation Failed')
          this.loading = false
        })
    },
    submitUpdate () {
      if (this.repeat.length < 1) {
        this.repeatError = true
        return
      }
      this.updating = true
      this
        .UpdateSchedule({
          uid: this.$route.params.gateway,
          panid: this.group,
          statementId: this.scheduleTarget.Input.statementId,
          ruleId: this.schedule.id,
          targetId: this.scheduleTarget.Id,
          mode: this.mode,
          days: this.repeat,
          time: this.time
        })
        .then(() => {
          this.RenewSchedule({ id: this.schedule.id, mode: this.mode, time: this.time, repeat: this.repeat, group: this.group })
          if (process.env.NODE_ENV === 'production') this.NotifyEmail({ type: 'Update', name: this.name, mode: this.mode, time: this.time, days: this.repeat, panid: this.group })
          this._showSuccessNotify('Update Schedule Success')
          this.updating = false
          this.closePopup()
        })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Update Schedule Failed')
          this.updating = false
        })
    }
  }
}
</script>

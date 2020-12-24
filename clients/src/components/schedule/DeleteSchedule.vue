<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Delete Schedule</div>
    </div>
    <div class="relative-position">
      <div v-if="loading&&!scheduleTarget" style="height:200px" class="full-width">
        <div v-if="loading" class="loading-mask">
          <q-inner-loading showing color="primary" />
        </div>
      </div>
      <div v-else>
        <div class="q-pa-md bg-white">
          <p>Are you sure to delete this schedule? <b>( {{ schedule.name }} )</b></p>
        </div>
        <div class="row justify-end q-pa-md q-gutter-x-md">
          <q-btn @click="closePopup" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
          <q-btn :loading="deleting" @click="submitDelete" unelevated no-caps color="secondary" label="Delete" class="glossy" style="width:72px"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { Env } from '../../../config'

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
      deleting: false,
      scheduleTarget: null
    }
  },
  beforeMount () {
    this.fetchScheduleTarget()
  },
  methods: {
    ...mapMutations('schedule', [
      'RemoveSchedule'
    ]),
    ...mapActions('schedule', [
      'GetScheduleTarget',
      'DeleteSchedule',
      'NotifyEmail'
    ]),
    closePopup () {
      if (this.deleting || this.loading) return
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
    submitDelete () {
      this.deleting = true
      this
        .DeleteSchedule({
          uid: this.$route.params.gateway,
          statementId: this.scheduleTarget.Input.statementId,
          ruleId: this.schedule.id,
          targetId: this.scheduleTarget.Id
        })
        .then(() => {
          this.RemoveSchedule(this.schedule)
          if (process.env.NODE_ENV === 'production' && Env.isPoc) {
            this.NotifyEmail({ type: 'Delete', name: this.schedule.name, mode: this.schedule.mode, time: this.schedule.time, days: this.schedule.repeat, panid: this.schedule.group })
          }
          this._showSuccessNotify('Delete Schedule Success')
          this.deleting = false
          this.closePopup()
        })
        .catch(error => {
          console.log(error)
          this._showErrorNotify('Delete Schedule Failed')
          this.deleting = false
        })
    }
  }
}
</script>

<template>
  <div class="bg-white" style="width:480px">
    <div class="q-pa-md bg-primary glossy">
      <div class="text-h6 text-white">Add Gateway</div>
    </div>
    <q-form @submit="submitCreate">
      <div class="q-pa-md">
        <q-input dense outlined v-model="mac" label="Mac Number" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md" />
        <q-select dense outlined v-model="location" :options="Locations" label="Location" :rules="[ val => val && val.length > 0 || 'This feild is required']" class="q-mt-md"/>
      </div>
      <div class="row justify-end q-pa-md q-gutter-x-md">
        <q-btn @click="$emit('close')" outline no-caps color="info" label="Cancel" style="width:72px"></q-btn>
        <q-btn type="submit" unelevated no-caps color="secondary" label="Add" class="glossy" style="width:72px"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      mac: null,
      location: null
    }
  },
  computed: {
    ...mapState('device', [
      'Locations'
    ])
  },
  methods: {
    submitCreate () {
    }
  }
}
</script>

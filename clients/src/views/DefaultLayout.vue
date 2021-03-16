<template>
  <q-layout view="hHh lpR lFf">
    <span style="position:fixed;left:0;bottom:0;z-index:10000;">{{ app_version }}</span>
    <sc-header />
    <sc-drawer />
    <q-page-container>
      <q-page class="bg-accent q-pa-xl">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'

export default {
  components: {
    'sc-header': Header,
    'sc-drawer': Drawer
  },
  data () {
    return {
      app_version: process.env.VUE_APP_VERSION
    }
  },
  async beforeMount () {
    try {
      if (!this.checkTokenValidityPeriod()) {
        await this.refreshToken()
      }
    } catch (error) {
      this._showErrorNotify('Refresh Token Error')
      console.log('checkTokenValidityPeriod error', error)
    }
  }
}
</script>

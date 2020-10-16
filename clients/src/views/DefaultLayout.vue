<template>
  <q-layout view="hHh lpR lFf">
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

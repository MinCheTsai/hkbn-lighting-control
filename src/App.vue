<template>
  <q-layout view="hHh lpR lFf">
    <sc-header />
    <sc-drawer />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from './components/Header'
import Drawer from './components/Drawer'

export default {
  components: {
    'sc-header': Header,
    'sc-drawer': Drawer
  }
}
</script>

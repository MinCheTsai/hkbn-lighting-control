<template>
  <q-layout view="hHh lpR lFf">
    <sc-header />
    <q-page-container>
      <q-page class="bg-accent q-pa-xl">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from '@/components/Header'
export default {
  components: {
    'sc-header': Header
  }
}
</script>

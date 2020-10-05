<template>
  <q-header elevated class="glossy">
    <q-toolbar>
      <q-btn flat round @click="toggleDrawer()" aria-label="Menu" icon="menu" />
      <q-toolbar-title>Lighting Control</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  methods: {
    toggleDrawer () {
      this.$store.commit('ToggleDrawer')
    }
  }
}
</script>

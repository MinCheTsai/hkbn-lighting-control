export default {
  methods: {
    _showErrorNotify (message) {
      this.$q.notify({
        message,
        color: 'negative',
        // textColor: 'negative',
        position: this.$q.screen.xs ? 'bottom' : 'top-left',
        icon: 'error_outline',
        classes: 'notify-custom sc-subtitle-1',
        actions: [
          { label: 'close', color: 'white', handler: () => { /* ... */ } }
        ],
        timeout: 10000
      })
    },
    _showSuccessNotify (message) {
      this.$q.notify({
        message: message,
        color: 'positive',
        position: 'top-left',
        icon: 'check_circle_outline',
        classes: 'notify-custom sc-subtitle-1',
        timeout: 3000
      })
    }
  }
}

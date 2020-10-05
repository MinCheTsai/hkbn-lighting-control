<template>
  <div>
    <h3 class="q-mt-none">Dashboard</h3>
    <h5>Gateway</h5>
    <table class="sc-table">
      <tr>
        <td>Number of Gateway(Connected)</td>
        <td>Total of Gateway(on-board)</td>
      </tr>
      <tr>
        <td>10</td>
        <td>15</td>
      </tr>
    </table>
    <h5>Controller</h5>
    <table class="sc-table">
      <tr>
        <td>Number of Controller(Connected)</td>
        <td>Total of Controller(on-board)</td>
      </tr>
      <tr>
        <td>10</td>
        <td>15</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.sc-table{
  border-collapse: collapse;
  tr {
    td {
      padding: 12px;
      text-align: center;
      border: 1px solid var(--q-color-dark);
    }
  }
}
</style>

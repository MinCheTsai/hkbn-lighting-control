<template>
  <div>
    <h4 class="q-mt-none">Dashboard</h4>
    <h6 class="q-mb-none">Gateway</h6>
    <table class="sc-table q-mt-sm">
      <tr>
        <td>Number of Gateway(Connected)</td>
        <td>Total of Gateway(on-board)</td>
      </tr>
      <tr>
        <td>10</td>
        <td>15</td>
      </tr>
    </table>
    <h6 class="q-mb-none">Controller</h6>
    <table class="sc-table q-mt-sm">
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

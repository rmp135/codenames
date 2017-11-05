<template lang="pug">
  div
    div Enter game id
    input(v-model="id")
    nuxt-link(:to="{ name: 'game', query: { 'id': id } }") Play
</template>
<style lang="scss">

</style>
<script>
  export default {
    data: () => ({
      id: ''
    })
  }
</script>

<template lang="pug">
  div
    div Enter game id
    input(v-model="id")
    div
      nuxt-link(:to="{ name: 'game', query: { 'id': id } }") Play
    div
      a.link(@click="create") Create
</template>
<style lang="scss">

</style>
<script>
  import axios from '~/plugins/axios'
  import socket from '~/plugins/socket.io' // eslint-disable-line

  export default {
    data: () => ({
      id: ''
    }),
    methods: {
      async create () {
        try {
          const res = await axios.post(`/api/game`)
          this.$router.push({ name: 'game', query: { 'id': res.data.id, 'spytoken': res.data.spyToken } })
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
</script>

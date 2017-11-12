<template lang="pug">
  div
    div Enter game id
    input(v-model="id")
    div Spy Password
    input(v-model="spyPassword")
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
      id: '',
      spyPassword: ''
    }),
    methods: {
      async create () {
        try {
          const res = await axios.post(`/api/game`, { spyPassword: this.spyPassword })
          this.$router.push({ name: 'game', query: { 'id': res.data } })
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
</script>

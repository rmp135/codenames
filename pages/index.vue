<template lang="pug">
  .section
    .container.is-fluid
      .column.is-4.is-offset-4
        .field
          label.label Game Token
          .control
            input.input(v-model="id")
        .field
          label.label Spy Password
          .control
            input.input(v-model="spyPassword")
        article.message.is-danger
          .message-body Note: Password will be sent in plain text.
        .field
          nuxt-link(:to="{ name: 'game', query: { 'token': id, 'spypassword': spyPassword } }") Play
        .field
          a.link(@click="create") Create
</template>
<style lang="scss">

</style>
<script>
  import axios from '~/plugins/axios'
  import '~/plugins/socket.io'

  export default {
    data: () => ({
      id: '',
      spyPassword: ''
    }),
    methods: {
      async create () {
        try {
          const res = await axios.post(`/api/game`, { spyPassword: this.spyPassword })
          this.$router.push({ name: 'game', query: { 'token': res.data, 'password': this.spyPassword } })
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
</script>

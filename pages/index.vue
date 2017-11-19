<template lang="pug">
  .section
    .container.is-fluid
      .columns.is-centered
        .column.is-4
          .field
            label.label Game Token
            .control
              input.input(v-model="id")
          .field
            label.label Password
            .control
              input.input(v-model="password")
          article.message.is-danger
            .message-body Note: Password will be sent in plain text.
          .columns.is-centered
            .column
              button.button(:disabled="isPlayDisabled" @click="play") Play
            .column
              button.button(:disabled="isCreateDisabled" @click="create") Create
        .column.is-4
          .content
            .message.is-info
              .message-header Joining
              .message-body
                p To join a game, enter the game token and click Play. 
                p If you are playing as a Spy, also enter the game password.
            .message.is-info
              .message-header Creating
              .message-body
                p The Spy must create the game.
                p To create a game, enter the game password and click Create. The game token will be ignored.
                p This password will be required for other Spies but not Agents.
</template>
<style lang="scss">

</style>
<script>
  import axios from '~/plugins/axios'
  import '~/plugins/socket.io'

  export default {
    data: () => ({
      id: '',
      password: ''
    }),
    computed: {
      isCreateDisabled () {
        return this.password === ''
      },
      isPlayDisabled () {
        return this.id === ''
      }
    },
    methods: {
      async play () {
        if (this.isPlayDisabled) return
        this.$router.push({ name: 'game', query: { 'token': this.id, 'password': this.password } })
      },
      async create () {
        if (this.isCreateDisabled) return
        try {
          const res = await axios.post(`/api/game`, { password: this.password })
          this.$router.push({ name: 'game', query: { 'token': res.data, 'password': this.password } })
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
</script>

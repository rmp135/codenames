<template lang="pug">
  .section
    .container.is-fluid
      .columns.is-centered
        .column.is-4
          .field
            label.label Game Name
            .control
              input.input(v-model="name")
          .field
            label.label Password
            .control
              input.input(v-model="password")
          .columns
            .column
              .message.is-danger(v-show="errorText !== ''")
                .message-body {{errorText}}
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
                p To join a game, enter the game name and click Play. 
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
      name: '',
      password: '',
      errorText: ''
    }),
    computed: {
      isCreateDisabled () {
        return this.password === ''
      },
      isPlayDisabled () {
        return this.name === ''
      }
    },
    methods: {
      async play () {
        if (this.isPlayDisabled) return
        let res = null
        try {
          res = await axios.post(`/api/game/${this.name}/join`, { password: this.password })
        } catch (err) {
          if (err.response.status === 404) {
            this.errorText = 'Game not found.'
          } else {
            this.errorText = 'An unknown error has occurred.'
          }
          return
        }
        localStorage.setItem('token', res.data.token)
        this.$router.push({ name: 'game', query: { 'name': this.name } })
      },
      async create () {
        if (this.isCreateDisabled) return
        try {
          const res = await axios.post(`/api/game`, { password: this.password })
          localStorage.setItem('token', res.data.token)
          this.$router.push({ name: 'game', query: { 'name': res.data.name } })
        } catch (err) {
          this.error = 'An error has occurred creating the game. Sorry about that. :('
        }
      }
    }
  }
</script>

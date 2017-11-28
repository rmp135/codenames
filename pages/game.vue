<style lang="scss" scoped>
  .gameid {
    text-align: center;
    font-size: 3rem;
  }
  .playnotes {
    .green {
      color: green;
    }
  }
  .connectionerror {
    text-align: center;
    color: red;
  }
  .columns {
    .column {
      .cardcontainer {
        user-select: none;
        .numwrapper {
          width: 100%;
          position: absolute;
          .text {
            margin-left: auto;
            margin-right: 0;
          }
        }
        .textwrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: inherit;
          width: 100%;
          text-shadow:
            -2px -2px 0 white,
            2px -2px 0 white,
            -2px 2px 0 white,
            2px 2px 0 white;
          font-size: 2rem;
        }
        &.chosen {
          box-shadow: 0px 0px 7px 1px grey;
        }
        background-size: 100px;
        background-repeat: no-repeat;
        height: 100px;
        margin: 10px;
        border: 1px black solid;
        border-radius: 5px;
        display: flex;
        flex-grow: 0;
        flex-basis: 0 0;
        &:hover {
          cursor: pointer;
        }
        &.revealed {
          border-color: green;
          box-shadow: 0px 0px 7px 1px green;
        }
        &.C {
          background-image: url("~assets/img/baby.png");
        }
        &.R {
          background-image: url("~assets/img/redspy.png");
        }
        &.B {
          background-image: url("~assets/img/bluespy.png");
        }
        &.A {
          background-image: url("~assets/img/blackspy.png");
        }
        .picknumber {
          position: static;
          text-align: right;
        }
      }
    }
  }
</style>
<template lang="pug">
  #game.container
    .gameid {{game.name}} - {{playerType}}
    .message.is-danger(v-show="errorText !== ''")
      .message-body {{errorText}}
    .columns
      .column(v-for="column in board")
        .cardcontainer(v-for="card in column" :class="[card.team, { chosen: card.chosen, revealed: card.revealed }]" @click="onCardClick(card)")
          .textwrapper
            .text {{card.text}}
    .playnotes
      .message.is-info
        template(v-if="game.isSpy")
          .message-header Spy
          .message-body
            p Click a card to reveal it to the Agents. Once revealed, a card cannot be hidden again!
            p
              span Once revealed, the card will be highlighted with a
              span.green  green 
              span background and the Agent will see the team icon.
            p Cards that the Agents want revealing will be highlighted with a black shadow.
        template(v-else)
          .message-header Agent
          .message-body
            p Click a card to let the Spy know that you want it revealed. These cards will be highlighted with a black shadow.
            p Once the Spy has revealed a card, it's team icon will show.
</template>
<script>
  import axios from '~/plugins/axios'
  import socket from '~/plugins/socket.io'
  export default {
    computed: {
      playerType () {
        return this.game.isSpy ? 'Spy' : 'Agent'
      },
      board () {
        const board = []
        for (let i = 0; i < this.game.cards.length; i++) {
          if (board[i % 5] === undefined) {
            board[i % 5] = []
          }
          board[i % 5].push(this.game.cards[i])
        }
        return board
      }
    },
    data: () => ({
      isLoading: true,
      isSpy: false,
      name: '',
      errorText: '',
      game: {
        cards: []
      }
    }),
    async asyncData (context) {
      const options = {}
      if (context.isServer) {
        options.headers = context.req.headers
      }
      try {
        const res = await axios.get(`/api/game/${context.query.name}`, options)
        return { game: res.data }
      } catch (err) {
        console.log(err)
        context.error({ statusCode: 404, message: 'Game not found.' })
      }
    },
    async mounted () {
      socket.on('disconnect', () => {
        this.errorText = 'Server disconnected. Please reload the page.'
      })
      socket.emit('join', { token: this.game.name })
      socket.on('select', msg => {
        const card = this.game.cards.find(c => c.id === msg.id)
        if (card === undefined) return
        card.chosen = !card.chosen
      })
      socket.on('reveal', msg => {
        const card = this.game.cards.find(c => c.id === msg.id)
        if (card === undefined) return
        card.chosen = false
        if (this.game.isSpy) {
          card.revealed = true
        } else {
          card.team = msg.team
        }
      })
    },
    methods: {
      async onCardClick (card) {
        const action = this.game.isSpy ? 'reveal' : 'action'
        try {
          await axios.post(`/api/game/${this.game.name}/action`, { 'action': action, 'cardId': card.id })
          this.errorText = ''
        } catch (err) {
          if (err.response.status === 404) {
            this.errorText = 'Game not found. The game may have been deleted due to inactivity.'
          } else if (err.response.status === 403) {
            this.errorText = 'Permission denied. Try rejoining the game.'
          } else {
            this.errorText = 'An unknown error has occurred updating the game.'
          }
        }
      }
    }
  }
</script>
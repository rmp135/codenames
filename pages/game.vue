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
  #game(v-show="!isLoading")
    .gameid {{game.name}} - {{playerType}}
    .columns.section
      .column(v-for="column in board")
        .cardcontainer(v-for="card in column" :class="[card.team, { chosen: card.chosen, revealed: card.revealed }]" @click="onCardClick(card)")
          .textwrapper
            .text {{card.text}}
    .section.playnotes
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
      game: {
        cards: []
      }
    }),
    async mounted () {
      try {
        // debugger // eslint-disable-line
        const res = await axios.get(`/api/game/${this.$route.query.name}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        this.game = res.data
        this.isLoading = false
      } catch (err) {
        console.log({ statusCode: 404, message: 'Game not found.' })
      }
      socket.emit('join', { token: this.game.name })
      socket.on('select', msg => {
        if (msg.token === this.game.name) {
          const card = this.game.cards.find(c => c.id === msg.id)
          if (card === null) return
          card.chosen = !card.chosen
        }
      })
      socket.on('reveal', msg => {
        if (msg.token === this.game.name) {
          const card = this.game.cards.find(c => c.id === msg.id)
          if (card === null) return
          card.chosen = false
          if (this.game.isSpy) {
            card.revealed = true
          } else {
            card.team = msg.team
          }
        }
      })
    },
    methods: {
      onCardClick (card) {
        if (this.game.isSpy) {
          socket.emit('reveal', { id: card.id, token: this.game.name, password: this.password })
        } else {
          if (card.team !== null) return
          socket.emit('select', { id: card.id, token: this.game.name })
        }
      }
    }
  }
</script>
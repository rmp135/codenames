<style lang="scss" scoped>
  .gameid {
    text-align: center;
    font-size: 3rem;
  }
  .columns {
    .column {
      .cardcontainer {
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
  #game
    .gameid {{game.JoinToken}} - {{playerType}}
    .columns
      .column(v-for="column in board")
        .cardcontainer(v-for="card in column" :class="[card.Team, { chosen: card.Chosen, revealed: card.Revealed }]" @click="onCardClick(card)")
          .textwrapper
            .text {{card.Text}}
</template>
<script>
  import axios from '~/plugins/axios'
  import socket from '~/plugins/socket.io'
  export default {
    asyncData ({ params, error, query }) {
      return axios.get(`/api/game/${query.token}`, { params: { password: query.password } })
        .then(res => {
          return { game: res.data, password: query.password }
        })
        .catch(err => { // eslint-disable-line
          error({ statusCode: 404, message: 'Game not found.' })
        })
    },
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
    mounted () {
      socket.on('select', msg => {
        if (msg.token === this.game.JoinToken) {
          const card = this.game.cards.find(c => c.ID === msg.id)
          if (card === null) return
          card.Chosen = !card.Chosen
        }
      })
      socket.on('reveal', msg => {
        console.log(msg)
        if (msg.token === this.game.JoinToken) {
          const card = this.game.cards.find(c => c.ID === msg.id)
          if (card === null) return
          card.Chosen = false
          if (this.game.isSpy) {
            card.Revealed = true
          } else {
            // debugger // eslint-disable-line
            card.Team = msg.team
          }
        }
      })
    },
    methods: {
      onCardClick (card) {
        if (this.game.isSpy) {
          socket.emit('reveal', { id: card.ID, token: this.game.JoinToken, password: this.password })
        } else {
          if (card.Team !== null) return
          socket.emit('select', { id: card.ID, token: this.game.JoinToken })
        }
      }
    }
  }
</script>
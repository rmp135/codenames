<style lang="scss" scoped>
  .gameid {
    text-align: center;
    font-size: 3rem;
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
  #game
    .gameid {{game.joinToken}} - {{playerType}}
    .columns
      .column(v-for="column in board")
        .cardcontainer(v-for="card in column" :class="[card.team, { chosen: card.chosen, revealed: card.revealed }]" @click="onCardClick(card)")
          .textwrapper
            .text {{card.text}}
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
      socket.emit('join', { token: this.game.joinToken })
      socket.on('select', msg => {
        if (msg.token === this.game.joinToken) {
          const card = this.game.cards.find(c => c.id === msg.id)
          if (card === null) return
          card.chosen = !card.chosen
        }
      })
      socket.on('reveal', msg => {
        if (msg.token === this.game.joinToken) {
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
          socket.emit('reveal', { id: card.id, token: this.game.joinToken, password: this.password })
        } else {
          if (card.team !== null) return
          socket.emit('select', { id: card.id, token: this.game.joinToken })
        }
      }
    }
  }
</script>
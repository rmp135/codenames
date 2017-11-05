<style lang="scss">
  .grid {
    display: flex;
    .column {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      .card {
        .textwrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: inherit;
          width: 100%;
        }
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-shadow:
          -2px -2px 0 white,
          2px -2px 0 white,
          -2px 2px 0 white,
          2px 2px 0 white;
        font-size: 1.5rem;
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
    .grid
      .column(v-for="column in cards")
        .card(v-for="card in column" :class="[card.team]")
          .textwrapper
            .text {{card.text}}
</template>
<script>
  import { generateBoard } from '~/src/GameHelpers.js'
  export default {
    data: () => ({
      cards: []
    }),
    mounted () {
      this.cards = generateBoard()
    }
  }
</script>
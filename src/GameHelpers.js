import cards from './cards.json'
import * as _ from 'lodash'

export function generateBoard () {
  const board = []
  let teamCards = []
  teamCards.push('A')
  for (let i = 0; i < 9; i++) {
    teamCards.push('R')
    teamCards.push('B')
  }
  for (let i = 0; i < 7; i++) {
    teamCards.push('C')
  }
  teamCards = _.shuffle(teamCards)
  const cardSample = _.sampleSize(cards, 25)
  for (let i = 0; i < cardSample.length; i++) {
    if (board[i % 5] === undefined) {
      board[i % 5] = []
    }
    board[i % 5].push({ text: cardSample[i], team: teamCards[i], chosen: Math.random() < 0.5 })
  }
  return board
}

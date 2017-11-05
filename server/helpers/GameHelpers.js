import cards from './cards.json'
import * as _ from 'lodash'

/**
 * Generates a populated board with text and teams.
 * 
 * @export
 * @returns 
 */
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
    board.push({ text: cardSample[i], team: teamCards[i], chosen: false })
  }
  return board
}

import cards from './cards.json'
import * as _ from 'lodash'

/**
 * Generates a populated board with text and teams.
 * @export
 * @returns Generated board with cards.
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
    board.push({ Text: cardSample[i], Team: teamCards[i], Chosen: false, Revealed: false })
  }
  return board
}

export function sanitizeGameForAgent (game) {
  return {
    isSpy: false,
    JoinToken: game.JoinToken,
    cards: game.cards.map(c => ({
      ID: c.ID,
      Text: c.Text,
      Chosen: c.Chosen,
      Team: c.Revealed ? c.Team : null
    }))
  }
}

export function sanitizeGameForSpy (game) {
  return {
    isSpy: true,
    JoinToken: game.JoinToken,
    cards: game.cards.map(c => ({
      ID: c.ID,
      Text: c.Text,
      Chosen: c.Chosen,
      Team: c.Team,
      Revealed: c.Revealed
    }))
  }
}

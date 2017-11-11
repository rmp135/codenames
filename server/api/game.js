import { Router } from 'express'
import { generateBoard } from '../Helpers/GameHelpers'
import nanoid from 'nanoid'
import generate from 'nanoid/generate'

const router = Router()

const games = []

router.post('/', (req, res) => {
  const game = {
    id: generate('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    spyToken: nanoid(),
    cards: generateBoard()
  }
  games.push(game)
  res.json(game)
})

router.get('/:id', (req, res, next) => {
  let game = games.find(g => g.id === req.params.id)
  if (game !== undefined) {
    if (req.query.spytoken !== game.spyToken) {
      game.cards = game.cards.map(c => ({ ...c, team: undefined }))
    }
    return res.json(game)
  }
  next()
})

export default router

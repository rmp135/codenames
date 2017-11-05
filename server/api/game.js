import { Router } from 'express'
import { generateBoard } from '../Helpers/GameHelpers'
import * as nanoid from 'nanoid/generate'

const router = Router()

const games = []

router.post('/', (req, res) => {
  const game = {
    id: nanoid('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    cards: generateBoard()
  }
  games.push(game)
  res.json(game)
})

router.get('/:id', (req, res, next) => {
  const game = games.find(g => g.id === req.params.id)
  if (game !== undefined) {
    return res.json(game)
  }
  next()
})

export default router

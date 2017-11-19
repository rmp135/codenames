import { Router } from 'express'
import * as GameHelpers from '../Helpers/GameHelpers'
import generate from 'nanoid/generate'
import * as GameRepository from '../helpers/GameRepository'

const router = Router()

router.post('/', async (req, res) => {
  const game = {
    JoinToken: generate('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    cards: GameHelpers.generateBoard(),
    Password: req.body.password
  }
  const newGame = await GameRepository.insertGame(game)
  res.json(newGame.JoinToken)
})

router.get('/:token', async (req, res, next) => {
  let game = await GameRepository.getGameByToken(req.params.token)
  if (game !== undefined) {
    if (req.query.password === game.SpyPassword) {
      game = GameHelpers.sanitizeGameForSpy(game)
    } else {
      game = GameHelpers.sanitizeGameForAgent(game)
    }
    console.log(game)
    return res.json(game)
  }
  next()
})

export default router

import { Router } from 'express'
import { generateBoard, sanitizeGameForAgent, sanitizeGameForSpy } from '../Helpers/GameHelpers'
import generate from 'nanoid/generate'
import * as GameRepository from '../helpers/GameRepository';

const router = Router()

router.post('/', async (req, res) => {
  const game = {
    JoinToken: generate('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    cards: generateBoard(),
    SpyPassword: req.body.spyPassword
  }
  const newGame = await GameRepository.InsertGame(game)
  res.json(newGame.JoinToken)
})

router.get('/:token', async (req, res, next) => {
  let game = await GameRepository.GetGameByToken(req.params.token)
  if (game !== undefined) {
    if (req.query.password === game.SpyPassword) {
      game = sanitizeGameForSpy(game)
    } else {
      game = sanitizeGameForAgent(game)
    }
    return res.json(game)
  }
  next()
})

router.post('/:token/action', async (req, res, next) => {

})

export default router

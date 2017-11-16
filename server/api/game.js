import { Router } from 'express'
import { generateBoard, santizeGameForAgent, santizeGameForSpy } from '../Helpers/GameHelpers'
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
    if (req.query.spypassword === game.SpyPassword) {
      game = santizeGameForSpy(game)
    } else {
      game = santizeGameForAgent(game)
    }
    return res.json(game)
  }
  next()
})

export default router

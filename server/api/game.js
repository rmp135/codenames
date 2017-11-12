import { Router } from 'express'
import { generateBoard } from '../Helpers/GameHelpers'
import nanoid from 'nanoid'
import generate from 'nanoid/generate'
import * as DBHelper from '../helpers/DBHelper'

const router = Router()

const games = []

router.post('/', async (req, res) => {
  const game = {
    JoinToken: generate('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    cards: generateBoard(),
    SpyPassword: req.body.spyPassword
  }
  const newGame = await DBHelper.InsertGame(game)
  res.json(newGame.ID)
})

router.get('/:id', async (req, res, next) => {
  const game = await DBHelper.GetGameByID(req.params.id)
  if (game !== undefined) {
    if (req.query.spyPassword !== game.spy_password) {
    }
    return res.json(game)
  }
  next()
})

export default router

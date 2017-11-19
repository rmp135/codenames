import { Router } from 'express'
import * as GameHelpers from '../Helpers/GameHelpers'
import generate from 'nanoid/generate'
import * as GameRepository from '../helpers/GameRepository'
import * as CardRepository from '../helpers/CardRepository'
import * as jwt from 'jsonwebtoken'
import { io } from '../index'

const router = Router()

router.post('/', async (req, res) => {
  const game = {
    Name: generate('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    cards: GameHelpers.generateBoard(),
    Password: req.body.password
  }
  const newGame = await GameRepository.insertGame(game)
  const token = await GameRepository.generateGameName(newGame, true)
  res.json({ name: newGame.Name, token })
})

router.get('/:name', async (req, res, next) => {
  let game = await GameRepository.getGameByName(req.params.name)
  if (game === undefined) return next()
  let isSpy = false
  if (req.token !== undefined) {
    let decodeToken = null
    try {
      decodeToken = await jwt.verify(req.token, 'password')
      isSpy = decodeToken.id === game.ID && decodeToken.isSpy
    } catch (error) { } // Doesn't really matter if the token is invalid. Game is public.
  }
  if (isSpy) {
    game = GameHelpers.sanitizeGameForSpy(game)
  } else {
    game = GameHelpers.sanitizeGameForAgent(game)
  }
  return res.json(game)
})

router.post('/:name/join', async (req, res, next) => {
  let game = await GameRepository.getGameByName(req.params.name)
  if (game === undefined) return next()
  const isSpy = req.body.password === game.Password
  const token = await GameRepository.generateGameName(game, isSpy)
  return res.send({ token })
})

router.post('/:name/action', async (req, res, next) => {
  // const decodeToken = await jwt.verify(req.token, 'password')
  switch (req.body.action) {
    case 'select':
      await CardRepository.updateCard(req.body.cardId, { Chosen: true })
      io.sockets.in(req.params.name).emit('select', req.body)
      return res.sendStatus(200)

    case 'reveal':
    
      break
  }
  next()
})

export default router

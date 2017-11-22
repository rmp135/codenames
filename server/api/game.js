import { Router } from 'express'
import * as GameHelpers from '../Helpers/GameHelpers'
import generate from 'nanoid/generate'
import * as GameRepository from '../helpers/GameRepository'
import * as CardRepository from '../helpers/CardRepository'
import * as jwt from 'jsonwebtoken'
import { io } from '../index'
import * as bcrypt from 'bcrypt'

const router = Router()

router.post('/', async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10)
  const game = {
    Name: generate('1234567890abcdefghijklmnopqrstuvwxyz', 7),
    cards: GameHelpers.generateBoard(),
    PasswordHash: password
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
    } catch (error) { } // Doesn't really matter if the token is invalid. Treat as public.
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
  const isSpy = await bcrypt.compare(req.body.password, game.PasswordHash)
  const token = await GameRepository.generateGameName(game, isSpy)
  return res.send({ token })
})

router.post('/:name/action', async (req, res, next) => {
  if (req.body.action === 'select') {
    const game = await GameRepository.getGameByName(req.params.name)
    if (game === undefined) return next()
    const card = await CardRepository.getCardByID(req.body.cardId)
    if (card.GameID !== game.ID) return res.sendStatus(403)
    await CardRepository.updateCard(card.ID, { Chosen: true })
    io.sockets.in(req.params.name).emit('select', { id: card.ID })
    return res.sendStatus(200)
  }
  if (req.body.action === 'reveal') {
    let decodeToken = null
    try {
      decodeToken = await jwt.verify(req.token, 'password') // eslint-ignore-line
    } catch (error) {
      return res.sendStatus(403)
    }
    if (!decodeToken.isSpy) return res.sendStatus(403)
    const card = await CardRepository.updateCard(req.body.cardId, { Revealed: true, Chosen: false })
    io.sockets.in(req.params.name).emit('reveal', { id: card.ID, team: card.Team })
    return res.sendStatus(200)
  }
  next()
})

export default router

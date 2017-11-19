import GameModel from '../models/Game'
import * as jwt from 'jsonwebtoken'

export async function getGameByID (id) {
  return await GameModel
  .query()
  .first()
  .findById(id)
  .eager('cards')
}

export async function getGameByName (name) {
  return await GameModel
  .query()
  .first()
  .where({ Name: name })
  .eager('cards')
}

export async function insertGame (game) {
  return await GameModel.query().insertGraph(game)
}

export async function isSpy (name, password) {
  return await GameModel
  .query()
  .first()
  .where({ Name: name, Password: password })
}

export async function generateGameName (game, isSpy) {
  return await jwt.sign({ id: game.ID, isSpy }, 'password')
}

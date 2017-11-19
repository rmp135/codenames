import GameModel from '../models/Game'

export async function getGameByID (id) {
  return await GameModel
  .query()
  .findById(id)
  .eager('cards')
}

export async function getGameByToken (token) {
  return await GameModel
  .query()
  .first()
  .where({ JoinToken: token })
  .eager('cards')
}

export async function insertGame (game) {
  return await GameModel.query().insertGraph(game)
}

export async function isSpy (token, password) {
  return await GameModel
  .query()
  .first()
  .where({ JoinToken: token, SpyPassword: password })
}

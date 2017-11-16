import GameModel from '../models/Game'

export async function GetGameByID (id) {
  return await GameModel
  .query()
  .findById(id)
  .eager('cards')
}

export async function GetGameByToken (token) {
  return await GameModel
  .query()
  .first()
  .where({ JoinToken: token })
  .eager('cards')
}

export async function InsertGame (game) {
  return await GameModel.query().insertGraph(game)
}

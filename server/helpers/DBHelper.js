import * as knex from 'knex'
import { Model } from 'objection'
import GameModel from '../models/Game'

const db = knex({
  client: 'sqlite',
  connection: './db.sqlite3',
  useNullAsDefault: true,
  debug: false
})

Model.knex(db)

export async function GetGameByID(id) {
  return await GameModel
  .query()
  .findById(id)
  .eager('cards')
}

export async function InsertGame(game) {
  return await GameModel.query().insertGraph(game)
}

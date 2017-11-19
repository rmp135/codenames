import * as knex from 'knex'
import { Model } from 'objection'

export function setup () {
  const db = knex({
    client: 'sqlite',
    connection: './db.sqlite3',
    useNullAsDefault: true,
    debug: false
  })
  Model.knex(db)
}

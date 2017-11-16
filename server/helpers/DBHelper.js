import * as knex from 'knex'
import { Model } from 'objection'

const db = knex({
  client: 'sqlite',
  connection: './db.sqlite3',
  useNullAsDefault: true,
  debug: true
})

Model.knex(db)

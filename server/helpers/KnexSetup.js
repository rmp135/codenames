import * as knex from 'knex'
import config from '../../knexfile.js'

export function createDB () {
  const envConfig = config[process.env.NODE_ENV]
  if (envConfig === undefined) throw new Error(`Unable to find suitable knex configuration for environment ${process.env.NODE_ENV}.`)
  const db = knex(envConfig)
  return db
}

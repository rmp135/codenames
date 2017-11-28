
exports.up = function (knex, Promise) {
  return knex.schema.createTable('Session', table => {
    table.increments('ID')
    table.string('SessionID')
    table.string('SessionData')
    table.datetime('LastTouched')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Session')
}

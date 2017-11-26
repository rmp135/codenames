exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('Game', table => {
      table.increments('ID')
      table.string('Name')
      table.string('PasswordHash')
    }),
    knex.schema.createTable('Card', table => {
      table.increments('ID')
      table.string('Text')
      table.string('Team')
      table.boolean('Chosen')
      table.boolean('Revealed')
      table.integer('GameID')
      table.foreign('GameID').references('Game.ID')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('Card'),
    knex.schema.dropTable('Game')
  ])
}

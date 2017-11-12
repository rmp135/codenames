// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite3'
    }
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3'
    }
  }
};

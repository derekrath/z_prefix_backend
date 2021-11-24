// Update with your config settings.
// Update with your config settings.
// const connection = process.env.DB_CONNECTION_STRING;
const connection = {
  connectionString: process.env.DB_CONNECTION_STRING, // IMPORTANT - HEROKU SETS THIS AND CHANGES IT PERIODICALLY
  ssl: {
    rejectUnauthorized: false,
  },
};
require("dotenv").config();

module.exports = {

  development: {
    client: 'pg',
    connection: connection
    // connection: 'postgres://postgres:docker@localhost/postgres'
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

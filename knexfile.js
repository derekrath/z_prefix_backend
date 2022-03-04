//for production on heroku, need SSL settings
const connection = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};
require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://postgres:docker@localhost/postgres",
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection,
  },
};

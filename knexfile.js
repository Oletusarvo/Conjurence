require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'dev_user',
      database: 'socialize_dev_db',
      password: process.env.DB_DEV_PASSWORD,
      host: 'localhost',
      port: 5432,
    },
    pool: {
      min: 0,
      max: 2,
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

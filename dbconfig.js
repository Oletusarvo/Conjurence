require('dotenv').config();
const knexfile = require('./knexfile');
const knex = require('knex');

const env = process.env.NODE_ENV;
const configKey = env || 'development';

const config = knexfile[configKey];
const db = knex(config);

/**@type {import("knex").Knex} */
module.exports = db;

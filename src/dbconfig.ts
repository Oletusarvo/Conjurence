require('dotenv').config();
import knexfile from '../knexfile';
import knex from 'knex';

const env = process.env.NODE_ENV;
const configKey = env || 'development';

const config = knexfile[configKey];
const db = knex(config);
export default db;

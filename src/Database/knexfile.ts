import { config } from 'dotenv';

config({ path: './../../.env' })

const knexConfig = {
  client: 'pg',
  connection: process.env.DB_URL 
  ?? 
  { 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME, 
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT 
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
    extensions: 'ts'
  },
  seeds: {
    directory: 'seeds',
    extensions: 'ts'
  },
  timezone: 'UTC'
};

export default knexConfig;

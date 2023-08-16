import { DB_URL, DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../Config/migration";

const knexConfig = {
  client: 'pg',
  connection: DB_URL 
  ?? 
  { 
    user: DB_USER, 
    password: DB_PASS, 
    database: DB_NAME, 
    host: DB_HOST, 
    port: DB_PORT 
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
  timezone: 'UTC',
  ssl: true
};

export default knexConfig;

import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_URL, DB_USER } from '@/Config';
import { logger } from '@/Logger';
import { knex as knexObject } from 'knex';

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
  timezone: 'UTC'
}

const knex = knexObject(knexConfig);

export class BaseAdapter {
  public catchError = (error: any) => {
    logger.error(error);
    throw new Error("Failed at db level")
  }
}

export default knex;
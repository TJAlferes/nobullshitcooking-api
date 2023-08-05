import { Pool } from 'mysql2/promise';

import { pool } from '../../lib/connections/mysql';

// Base abstract class to be extended
export abstract class MySQLRepo {
  pool: Pool = pool;
  
  insert() {}
  select() {}
  update() {}
  delete() {}
}

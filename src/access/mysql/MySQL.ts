import { Pool } from 'mysql2/promise';

import { pool } from '../../lib/connections/mysql';

// Base abstract class to be extended
// I would say "Repository" in a much larger app, but for this app, I think "Repo" is good enough.
export class MySQLRepo {
  pool: Pool = pool;
}

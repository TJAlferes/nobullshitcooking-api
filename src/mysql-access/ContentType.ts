import { Pool } from 'mysql2/promise';

export class ContentType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
}
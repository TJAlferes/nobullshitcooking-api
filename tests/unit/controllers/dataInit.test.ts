import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { DataInitController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new DataInitController(<Pool>pool);

describe('dataInit controller', () => {
  describe('viewInitialData method', () => {
    it('needs finished tests', () => {
      expect(1).toEqual(1);
    });
  });
});
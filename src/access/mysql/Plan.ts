import { Pool, RowDataPacket } from 'mysql2/promise';
//import { Plan } from '../domain/plan';

export class PlanRepository implements IPlanRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
  
  async viewAll(ownerId: number) {
    const sql = `SELECT id, name, data FROM plans WHERE owner_id = ?`;
    const [ rows ] = await this.pool.execute<Plan[]>(sql, [ownerId]);
    return rows;
  }

  async viewOne(id: number, ownerId: number) {
    const sql = `SELECT id, name, data FROM plans WHERE owner_id = ? AND id = ?`;
    const [ row ] = await this.pool.execute<Plan[]>(sql, [ownerId, id]);
    return row;
  }

  async create({ authorId, ownerId, name, data }: ICreatingPlan) {
    const sql = `INSERT INTO plans (id, owner_id, name, data) VALUES (?, ?, ?, ?)`;
    await this.pool.execute(sql, [authorId, ownerId, name, data]);
  }

  async update({ id, ownerId, name, data }: IUpdatingPlan) {
    const sql = `UPDATE plans SET name = ?, data = ? WHERE owner_id = ? AND id = ? LIMIT 1`;
    await this.pool.execute(sql, [name, data, ownerId, id]);
  }

  async deleteAll(ownerId: number) {
    const sql = `DELETE FROM plans WHERE owner_id = ?`;
    await this.pool.execute(sql, [ownerId]);
  }

  async deleteOne(id: number, ownerId: number) {
    const sql = `DELETE FROM plans WHERE owner_id = ? AND id = ? LIMIT 1`;
    await this.pool.execute(sql, [ownerId, id]);
  }
}

export interface IPlanRepository {
  pool:      Pool;
  viewAll:   (ownerId: number) =>             Promise<Plan[]>;
  viewOne:   (id: number, ownerId: number) => Promise<Plan[]>;
  create:    (plan: ICreatingPlan) =>         Promise<void>;
  update:    (plan: IUpdatingPlan) =>         Promise<void>;
  deleteAll: (ownerId: number) =>             Promise<void>;
  deleteOne: (id: number, ownerId: number) => Promise<void>;
}

type Plan = RowDataPacket & {
  id:   number;
  name: string;
  data: string;
};

type ICreatingPlan = {
  authorId: number;
  ownerId:  number;
  name:     string;
  data:     string;
};

type IUpdatingPlan = ICreatingPlan & {
  id: number;
};

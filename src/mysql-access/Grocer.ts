import { Pool, RowDataPacket } from 'mysql2/promise';

interface ICreatingGrocer {
  ownerId: number;
  grocerName: string;
  grocerAddress: string;
  grocerNotes: string;
}

interface IEditingGrocer extends ICreatingGrocer {
  grocerId: number;
}

export class Grocer {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllMyPrivateUserGrocers = this.viewAllMyPrivateUserGrocers.bind(this);
    //this.viewMyPrivateUserGrocer = this.viewMyPrivateUserGrocer.bind(this);
    this.createMyPrivateUserGrocer = this.createMyPrivateUserGrocer.bind(this);
    this.updateMyPrivateUserGrocer = this.updateMyPrivateUserGrocer.bind(this);
    this.deleteMyPrivateUserGrocer = this.deleteMyPrivateUserGrocer.bind(this);
  }

  async viewAllMyPrivateUserGrocers(ownerId: number) {
    const sql = `
      SELECT grocer_id, grocer_name, grocer_address, grocer_notes
      FROM nobsc_grocers
      WHERE owner_id = ?
      ORDER BY grocer_name ASC
    `;
    const [ allMyPrivateUserGrocers ] = await this.pool.execute(sql, [ownerId]);
    return allMyPrivateUserGrocers;
  }

  /* we may not need this method -- can just filter in react/redux
  async viewMyPrivateUserGroceryStore() {
    const sql = `
      SELECT
    `;
  }*/

  async createMyPrivateUserGrocer({
    ownerId,
    grocerName,
    grocerAddress,
    grocerNotes
  }: ICreatingGrocer) {
    const sql = `
      INSERT INTO nobsc_grocers
      (owner_id, grocer_name, grocer_address, grocer_notes)
      VALUES
      (?, ?, ?, ?)
    `;
    const [ createdPrivateUserGrocer ] = await this.pool.execute(sql, [
      ownerId,
      grocerName,
      grocerAddress,
      grocerNotes
    ]);
    return createdPrivateUserGrocer;
  }

  async updateMyPrivateUserGrocer({
    grocerId,
    ownerId,
    grocerName,
    grocerAddress,
    grocerNotes
  }: IEditingGrocer) {
    const sql = `
      UPDATE nobsc_grocers
      SET
        grocer_name = ?,
        grocer_address = ?,
        grocer_notes = ?
      WHERE owner_id = ? AND grocer_id = ?
      LIMIT 1
    `;
    const [ updatedPrivateUserGrocer ] = await this.pool.execute(sql, [
      grocerName,
      grocerAddress,
      grocerNotes,
      ownerId,
      grocerId
    ]);
    return updatedPrivateUserGrocer;
  }

  async deleteMyPrivateUserGrocer(ownerId: number, grocerId: number) {
    const sql = `
      DELETE
      FROM nobsc_grocers
      WHERE owner_id = ? AND grocer_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserGrocer ] = await this.pool.execute(sql, [
      ownerId,
      grocerId
    ]);
    return deletedPrivateUserGrocer;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IGrocer {
  pool: Pool;
}
import { Pool } from 'mysql2/promise';

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

  async viewAllMyPrivateUserGrocers(ownerId) {
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

  async createMyPrivateUserGrocer(grocerToCreate) {
    const { ownerId, grocerName, grocerAddress, grocerNotes } = grocerToCreate;
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

  async updateMyPrivateUserGrocer(grocerToUpdateWith, grocerId) {
    const { ownerId, grocerName, grocerAddress, grocerNotes } = grocerToUpdateWith;
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

  async deleteMyPrivateUserGrocer(ownerId, grocerId) {
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
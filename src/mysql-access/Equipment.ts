import { Pool, RowDataPacket } from 'mysql2/promise';

export class Equipment implements IEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getAllPublicEquipmentForElasticSearchBulkInsert =
      this.getAllPublicEquipmentForElasticSearchBulkInsert.bind(this);
    this.getEquipmentForElasticSearchInsert =
      this.getEquipmentForElasticSearchInsert.bind(this);
    this.viewEquipment = this.viewEquipment.bind(this);
    this.viewEquipmentById = this.viewEquipmentById.bind(this);
    this.createEquipment = this.createEquipment.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);
    this.createMyPrivateUserEquipment =
      this.createMyPrivateUserEquipment.bind(this);
    this.updateMyPrivateUserEquipment =
      this.updateMyPrivateUserEquipment.bind(this);
    this.deleteMyPrivateUserEquipment =
      this.deleteMyPrivateUserEquipment.bind(this);
  }

  async getAllPublicEquipmentForElasticSearchBulkInsert() {
    const ownerId = 1;
    const sql1 = `
      SELECT
        CAST(e.equipment_id AS CHAR),
        e.equipment_type_id,
        e.owner_id,
        et.equipment_type_name,
        e.equipment_name,
        e.equipment_description,
        e.equipment_image
      FROM nobsc_equipment e
      INNER JOIN
        nobsc_equipment_types et ON
        et.equipment_type_id = e.equipment_type_id
      WHERE e.owner_id = ?
    `;
    const [ equipmentForBulkInsert ] = await this.pool
    .execute<RowDataPacket[]>(sql1, [ownerId]);
    let final = [];

    // allows the sequence of awaits we want
    for (let equipment of equipmentForBulkInsert) {
      const { equipment_id } = equipment;
      final.push(
        {index: {_index: 'equipment', _id: equipment_id}},
        equipment
      );
    }

    return final;
  }
  
  async getEquipmentForElasticSearchInsert(equipmentId: number) {
    const ownerId = 1;
    const sql = `
      SELECT
        CAST(e.equipment_id AS CHAR),
        e.equipment_type_id,
        e.owner_id,
        et.equipment_type_name,
        e.equipment_name,
        e.equipment_description,
        e.equipment_image
      FROM nobsc_equipment e
      INNER JOIN
        nobsc_equipment_types et ON
        et.equipment_type_id = e.equipment_type_id
      WHERE e.equipment_id = ? e.owner_id = ?
    `;
    const [ equipmentForInsert ] = await this.pool
    .execute<RowDataPacket[]>(sql, [equipmentId, ownerId]);
    /*const { equipment_id } = equipmentForInsert;
    return [
      {index: {_index: 'equipment', _id: equipment_id}},
      equipmentForInsert
    ];*/
    return equipmentForInsert;
  }

  async viewEquipment(authorId: number, ownerId: number) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_type_id AS equipment_type_id,
        e.owner_id AS owner_id,
        t.equipment_type_name AS equipment_type_name,
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description,
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN
        nobsc_equipment_types t ON
        e.equipment_type_id = t.equipment_type_id
      WHERE e.author_id = ? AND e.owner_id = ?
      ORDER BY equipment_name ASC
    `;
    const [ equipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return equipment;
  }

  async viewEquipmentById(
    equipmentId: number,
    authorId: number,
    ownerId: number
  ) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_type_id AS equipment_type_id,
        e.owner_id AS owner_id,
        t.equipment_type_name AS equipment_type_name,
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description,
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN
        nobsc_equipment_types t
        ON e.equipment_type_id = t.equipment_type_id
      WHERE e.equipment_id = ? AND e.author_id = ? AND e.owner_id = ?
    `;
    const [ equipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [equipmentId, authorId, ownerId]);
    return equipment;
  }

  async createEquipment({
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: ICreatingEquipment) {
    const sql = `
      INSERT INTO nobsc_equipment (
        equipment_type_id,
        author_id,
        owner_id,
        equipment_name,
        equipment_description,
        equipment_image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdEquipment ] = await this.pool.execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    ]);
    return createdEquipment;
  }

  async updateEquipment({
    equipmentId,
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: IUpdatingEquipment) {
    const sql = `
      UPDATE nobsc_equipment
      SET
        equipment_type_id = ?,
        equipment_name = ?,
        equipment_description = ?,
        equipment_image = ?
      WHERE equipment_id = ?
      LIMIT 1
    `;
    const [ updatedEquipment ] = await this.pool.execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      equipmentName,
      equipmentDescription,
      equipmentImage,
      equipmentId
    ]);
    return updatedEquipment;
  }

  async deleteEquipment(equipmentId: number) {
    const sql = `
      DELETE
      FROM nobsc_equipment
      WHERE equipment_id = ?
      LIMIT 1
    `;
    const [ deletedEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [equipmentId]);
    return deletedEquipment;
  }

  async createMyPrivateUserEquipment({
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: ICreatingEquipment) {
    const sql = `
      INSERT INTO nobsc_equipment (
        equipment_type_id,
        author_id,
        owner_id,
        equipment_name,
        equipment_description,
        equipment_image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdPrivateUserEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    ]);
    return createdPrivateUserEquipment;
  }

  async updateMyPrivateUserEquipment({
    equipmentId,
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: IUpdatingEquipment) {
    const sql = `
      UPDATE nobsc_equipment
      SET
        equipment_type_id = ?,
        author_id = ?,
        owner_id = ?,
        equipment_name = ?,
        equipment_description = ?,
        equipment_image = ?
      WHERE owner_id = ? AND equipment_id = ?
      LIMIT 1
    `;
    const [ updatedPrivateUserEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage,
      ownerId,
      equipmentId
    ]);
    return updatedPrivateUserEquipment;
  }

  async deleteMyPrivateUserEquipment(equipmentId: number, ownerId: number) {
    const sql = `
      DELETE
      FROM nobsc_equipment
      WHERE owner_id = ? AND equipment_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, equipmentId]);
    return deletedPrivateUserEquipment;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IEquipment {
  pool: Pool;
  getAllPublicEquipmentForElasticSearchBulkInsert(): any;  // finish
  getEquipmentForElasticSearchInsert(equipmentId: number): Data;
  viewEquipment(authorId: number, ownerId: number): Data;
  viewEquipmentById(
    equipmentId: number,
    authorId: number,
    ownerId: number
  ): Data;
  createEquipment({
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: ICreatingEquipment): Data;
  updateEquipment({
    equipmentId,
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: IUpdatingEquipment): Data;
  deleteEquipment(equipmentId: number): Data;
  createMyPrivateUserEquipment({
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: ICreatingEquipment): Data;
  updateMyPrivateUserEquipment({
    equipmentId,
    equipmentTypeId,
    authorId,
    ownerId,
    equipmentName,
    equipmentDescription,
    equipmentImage
  }: IUpdatingEquipment): Data;
  deleteMyPrivateUserEquipment(equipmentId: number, ownerId: number): Data;
}

interface ICreatingEquipment {
  equipmentTypeId: number;
  authorId: number;
  ownerId: number;
  equipmentName: string;
  equipmentDescription: string;
  equipmentImage: string;
}

interface IUpdatingEquipment extends ICreatingEquipment {
  equipmentId: number;
}
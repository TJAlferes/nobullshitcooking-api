import { Pool, RowDataPacket } from 'mysql2/promise';

export class Measurement implements IMeasurement {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewMeasurements = this.viewMeasurements.bind(this);
    this.viewMeasurementById = this.viewMeasurementById.bind(this);
  }

  async viewMeasurements() {
    const sql = `
      SELECT measurement_id, measurement_name
      FROM nobsc_measurements
    `;
    const [ allMeasurements ] = await this.pool.execute<RowDataPacket[]>(sql);
    return allMeasurements;
  }

  async viewMeasurementById(measurementId: number) {
    const sql = `
      SELECT measurement_id, measurement_name
      FROM nobsc_measurements
      WHERE measurement_id = ?
    `;
    const [ measurement ] = await this.pool
    .execute<RowDataPacket[]>(sql, [measurementId]);
    return measurement;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMeasurement {
  pool: Pool;
  viewMeasurements(): Data;
  viewMeasurementById(measurementId: number): Data;
}
import { Pool, RowDataPacket } from 'mysql2/promise';

export class Measurement {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllMeasurements = this.viewAllMeasurements.bind(this);
    this.viewMeasurementById = this.viewMeasurementById.bind(this);
  }

  async viewAllMeasurements() {
    const sql = `
      SELECT measurement_id, measurement_name
      FROM nobsc_measurements
    `;
    const [ allMeasurements ] = await this.pool.execute(sql);
    return allMeasurements;
  }

  async viewMeasurementById(measurementId: number) {
    const sql = `
      SELECT measurement_id, measurement_name
      FROM nobsc_measurements
      WHERE measurement_id = ?
    `;
    const [ measurement ] = await this.pool.execute(sql, [measurementId]);
    return measurement;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMeasurement {
  pool: Pool;
}
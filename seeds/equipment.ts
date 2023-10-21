import type { PoolConnection } from 'mysql2/promise';

//import { images } from '../prod/equipment/generated-images.js';
import { equipment } from '../prod/equipment/generated-equipment.js';

export async function seedEquipment(conn: PoolConnection) {
  // TO DO: seed image table here first
  
  const placeholders = '(?, ?, ?, ?, ?, ?),'.repeat(equipment.length).slice(0, -1);

  const sql = `
    INSERT INTO equipment (
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    ) VALUES ${placeholders}
  `;

  await conn.query(sql, equipment);
}

import type { PoolConnection } from 'mysql2/promise';

import { images }    from './prod/equipment/generated-images.js';
import { equipment } from './prod/equipment/generated-equipment.js';

export async function seedEquipment(conn: PoolConnection) {
  const placeholders1 = '(?, ?, ?, ?, ?),'.repeat(images.length).slice(0, -1);
  const sql1 = `
    INSERT INTO image (
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    ) VALUES ${placeholders1}
  `;
  await conn.query(sql1, images);
  
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

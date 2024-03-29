import type { PoolConnection } from 'mysql2/promise';

import { production_images as images } from '../production/equipment/images';
import { production_equipment as equipment } from '../production/equipment/equipment';
import { format } from './format';

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
  await conn.execute(sql1, format(images));
  
  const placeholders2 = '(?, ?, ?, ?, ?, ?),'.repeat(equipment.length).slice(0, -1);
  const sql2 = `
    INSERT INTO equipment (
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    ) VALUES ${placeholders2}
  `;
  await conn.execute(sql2, format(equipment));
}

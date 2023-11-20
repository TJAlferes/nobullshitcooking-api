import type { PoolConnection } from 'mysql2/promise';

import { format } from '../../common/format';
import { production_equipment } from '../../production/equipment/equipment.js';
import { production_images } from '../../production/equipment/images.js';
import { test_equipment } from './equipment.js';
import { test_images } from './images.js';

const images = [...production_images, ...test_images];
const equipment = [...production_equipment, ...test_equipment];

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

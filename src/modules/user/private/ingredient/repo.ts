import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../../shared/MySQL';

export class PrivateIngredientRepo extends MySQLRepo implements IPrivateIngredientRepo {
  async viewAll(owner_id: string) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id,
        t.ingredient_type_name,
        i.owner_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS fullname,
        i.notes,
        m.image_url
      FROM private_ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.owner_id = ?
      ORDER BY i.ingredient_name ASC
    `;
    const [ row ] = await this.pool.execute<IngredientView[]>(sql, owner_id);
    return row;
  }

  async viewOne(params: ViewOneParams) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id
        t.ingredient_type_name,
        i.owner_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS fullname,
        i.notes,
        m.image_url
      FROM private_ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.ingredient_id = :ingredient_id AND i.owner_id = :owner_id
    `;
    const [ [ row ] ] = await this.pool.execute<IngredientView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO private_ingredient (
        ingredient_id
        ingredient_type_id,
        owner_id,
        ingredient_brand,
        ingredient_variety,
        ingredient_name,
        notes
      ) VALUES (
        :ingredient_id
        :ingredient_type_id,
        :owner_id,
        :ingredient_brand,
        :ingredient_variety,
        :ingredient_name,
        :notes
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE private_ingredient
      SET
        ingredient_type_id = :ingredient_type_id,
        ingredient_brand   = :ingredient_brand,
        ingredient_variety = :ingredient_variety,
        ingredient_name    = :ingredient_name,
        notes              = :notes
      WHERE ingredient_id = :ingredient_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM private_ingredient WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `
      DELETE FROM private_ingredient
      WHERE ingredient_id = :ingredient_id AND owner_id = :owner_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }
}

export interface IPrivateIngredientRepo {
  viewAll:   (owner_id: string) =>        Promise<IngredientView[]>;
  viewOne:   (params: ViewOneParams) =>   Promise<IngredientView>;
  insert:    (params: InsertParams) =>    Promise<void>;
  update:    (params: InsertParams) =>    Promise<void>;
  deleteAll: (owner_id: string) =>        Promise<void>;
  deleteOne: (params: DeleteOneParams) => Promise<void>;
}

type IngredientView = RowDataPacket & {
  ingredient_id:        string;
  ingredient_type_id:   number;
  ingredient_type_name: string;
  owner_id:             string;
  ingredient_brand:     string;
  ingredient_variety:   string;
  ingredient_name:      string;
  fullname:             string;
  notes:                string;
  image_url:            string;
};

type InsertParams = {
  ingredient_id:      string;
  ingredient_type_id: number;
  owner_id:           string;
  ingredient_brand:   string;
  ingredient_variety: string;
  ingredient_name:    string;
  notes:              string;
  image_id:           string;
};

type ViewOneParams = {
  ingredient_id: string;
  owner_id:      string;
};

type DeleteOneParams = {
  ingredient_id: string;
  owner_id:      string;
};

import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Ingredient implements IIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.search =     this.search.bind(this);
    this.view =       this.view.bind(this);
    this.viewById =   this.viewById.bind(this);
    this.create =     this.create.bind(this);
    this.update =     this.update.bind(this);
    this.delete =     this.delete.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async search(term: string) {
    const ownerId = 1;  // only public ingredients are searchable
    const sql = `
      SELECT
        i.id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON t.id = i.ingredient_type_id
      WHERE i.owner_id = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    return rows;
  }

  async view(authorId: number, ownerId: number) {
    const sql = `
      SELECT
        i.id,
        i.ingredient_type_id,
        i.owner_id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON i.ingredient_type_id = t.id
      WHERE i.author_id = ? AND i.owner_id = ?
      ORDER BY i.name ASC
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return row;
  }

  async viewById(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        i.id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON i.ingredient_type_id = t.id
      WHERE owner_id = 1 AND i.id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create(ingredient: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredients (
        ingredient_type_id,
        author_id,
        owner_id,
        brand,
        variety,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[] & ResultSetHeader>(sql, [
      ingredient.ingredientTypeId, ingredient.authorId, ingredient.ownerId, ingredient.brand, ingredient.variety, ingredient.name, ingredient.description, ingredient.image
    ]);
    return row;
  }

  async update(ingredient: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredients
      SET
        ingredient_type_id = ?,
        brand = ?,
        variety = ?,
        name = ?,
        description = ?,
        image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ingredient.ingredientTypeId, ingredient.brand, ingredient.variety, ingredient.name, ingredient.description, ingredient.image, ingredient.id
    ]);
    return row;
  }

  async delete(ownerId: number) {
    const sql = `DELETE FROM ingredients WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }

  async deleteById(id: number, ownerId: number) {
    const sql = `DELETE FROM ingredients WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IIngredient {
  pool:                                                    Pool;
  search(term: string):                                    Data;
  view(authorId: number, ownerId: number):                 Data;
  viewById(id: number, authorId: number, ownerId: number): Data;
  create(ingredient: ICreatingIngredient):                 DataWithHeader;
  update(ingredient: IUpdatingIngredient):                 Data;
  delete(ownerId: number):                                 void;
  deleteById(id: number, ownerId: number):                 Data;
}

type ICreatingIngredient = {
  ingredientTypeId: number;
  authorId: number;
  ownerId: number;
  brand: string;
  variety: string;
  name: string;
  description: string;
  image: string;
};

type IUpdatingIngredient = ICreatingIngredient & {
  id: number;
};

/*interface ISavingIngredient {
  id:                   number;
  ingredient_type_name: string;
  fullname:             string;
  brand:                string;
  variety:              string;
  name:                 string;
  description:          string;
  image:                string;
}*/
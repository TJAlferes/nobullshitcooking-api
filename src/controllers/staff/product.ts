import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Product } from '../../access/mysql';
import { validProduct } from '../../lib/validations';

export class StaffProductController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const productCategoryId = Number(req.body.productInfo.productCategoryId);
    const productTypeId =     Number(req.body.productInfo.productTypeId);
    const { brand, variety, name, altNames, description, specs, image } = req.body.productInfo;

    const args = {productCategoryId, productTypeId, brand, variety, name, altNames, description, specs, image};
    assert(args, validProduct);

    const product = new Product(this.pool);
    await product.create(args);

    return res.send({message: 'Product created.'});
  }

  async update(req: Request, res: Response) {
    const id =                Number(req.body.productInfo.id);
    const productCategoryId = Number(req.body.productInfo.productCategoryId);
    const productTypeId =     Number(req.body.productInfo.productTypeId);
    const { brand, variety, name, altNames, description, specs, image } = req.body.productInfo;

    const args = {productCategoryId, productTypeId, brand, variety, name, altNames, description, specs, image};
    assert(args, validProduct);

    const product = new Product(this.pool);
    await product.update({id, ...args});

    return res.send({message: 'Product updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);

    const product = new Product(this.pool);
    await product.delete(id);

    return res.send({message: 'Product deleted.'});
  }
}
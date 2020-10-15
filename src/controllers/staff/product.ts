import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { ProductSearch } from '../../access/elasticsearch/ProductSearch';
import { Product } from '../../access/mysql/Product';
import { validProductEntity } from '../../lib/validations/product/entity';

export class StaffProductController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const productCategoryId = Number(req.body.productInfo.productCategoryId);
    const productTypeId = Number(req.body.productInfo.productTypeId);
    const {
      brand,
      variety,
      name,
      altNames,
      description,
      specs,
      image
    } = req.body.productInfo;
    const productCreation = {
      productCategoryId,
      productTypeId,
      brand,
      variety,
      name,
      altNames,
      description,
      specs,
      image
    };
    assert(productCreation, validProductEntity);
    const product = new Product(this.pool);
    const createdProduct = await product.create(productCreation);
    const generatedId = createdProduct.insertId;
    const productForInsert = await product.getForElasticSearch(generatedId);
    const productSearch = new ProductSearch(this.esClient);
    await productSearch.save(productForInsert);
    return res.send({message: 'Product created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.productInfo.id);
    const productCategoryId = Number(req.body.productInfo.productCategoryId);
    const productTypeId = Number(req.body.productInfo.productTypeId);
    const {
      brand,
      variety,
      name,
      altNames,
      description,
      specs,
      image
    } = req.body.productInfo;
    const productUpdate = {
      productCategoryId,
      productTypeId,
      brand,
      variety,
      name,
      altNames,
      description,
      specs,
      image
    };
    assert(productUpdate, validProductEntity);
    const product = new Product(this.pool);
    await product.update({id, ...productUpdate});
    const productForInsert = await product.getForElasticSearch(id);
    const productSearch = new ProductSearch(this.esClient);
    await productSearch.save(productForInsert);
    return res.send({message: 'Product updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const product = new Product(this.pool);
    const productSearch = new ProductSearch(this.esClient);
    await product.delete(id);
    await productSearch.delete(String(id));
    return res.send({message: 'Product deleted.'});
  }
}
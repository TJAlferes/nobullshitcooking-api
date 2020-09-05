import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { ProductSearch } from '../../elasticsearch-access/ProductSearch';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';
import {
  validProductEntity
} from '../../lib/validations/product/productEntity';
import { Product } from '../../mysql-access/Product';

export const staffProductController = {
  create: async function(req: Request, res: Response) {
    const productTypeId = Number(req.body.productInfo.productTypeId);
    const brand = req.body.productInfo.brand
      ? req.body.productInfo.brand : "";
    const variety = req.body.productInfo.variety
      ? req.body.productInfo.variety : "";
    const { name, description, specs, image } = req.body.productInfo;

    const productToCreate = {
      productTypeId,
      brand,
      variety,
      name,
      description,
      specs,
      image
    };

    assert(productToCreate, validProductEntity);

    const product = new Product(pool);

    const createdProduct = await product.create(productToCreate);

    const generatedId = createdProduct.insertId;

    const productForInsert = await product.getForElasticSearch(generatedId);
    
    const productSearch = new ProductSearch(esClient);

    await productSearch.save(productForInsert);

    return res.send({message: 'Product created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.productInfo.id);
    const productTypeId = Number(req.body.productInfo.productTypeId);
    const brand = req.body.productInfo.brand
      ? req.body.productInfo.brand : "";
    const variety = req.body.productInfo.variety
      ? req.body.productInfo.variety : "";
    const { name, description, specs, image } = req.body.productInfo;

    const productToUpdateWith = {
      productTypeId,
      brand,
      variety,
      name,
      description,
      specs,
      image
    };

    assert(productToUpdateWith, validProductEntity);

    const product = new Product(pool);

    await product.update({id, ...productToUpdateWith});

    const productForInsert = await product.getForElasticSearch(id);

    const productSearch = new ProductSearch(esClient);

    await productSearch.save(productForInsert);

    return res.send({message: 'Product updated.'});
  },
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);

    const product = new Product(pool);
    const productSearch = new ProductSearch(esClient);

    await product.delete(id);
    await productSearch.delete(String(id));

    return res.send({message: 'Product deleted.'});
  }
};
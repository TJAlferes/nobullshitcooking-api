import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { ProductSearch } from '../../elasticsearch-access/ProductSearch';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { validProductEntity } from '../../lib/validations/product/entity';
import { Product } from '../../mysql-access/Product';

export const staffProductController = {
  create: async function(req: Request, res: Response) {
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

    const product = new Product(pool);

    const createdProduct = await product.create(productCreation);

    const generatedId = createdProduct.insertId;

    const productForInsert = await product.getForElasticSearch(generatedId);
    
    const productSearch = new ProductSearch(esClient);

    await productSearch.save(productForInsert);

    return res.send({message: 'Product created.'});
  },
  update: async function(req: Request, res: Response) {
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

    const product = new Product(pool);

    await product.update({id, ...productUpdate});

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
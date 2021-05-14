import { Client } from '@elastic/elasticsearch';

export class ProductSearch implements IProductSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.find = this.find.bind(this);
    this.auto = this.auto.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
  }

  // deep pagination can kill performance, set upper bounds 
  async find(searchBody: any) {
    const { body } =
      await this.client.search({index: "products", body: searchBody});
    return body;
  }

  async auto(term: string) {
    const { body } = await this.client.search({
      index: "products",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {fullname: {}}
        },
        query: {
          bool: {must: [{match: {fullname: {query: term, operator: "and"}}}]}
        }
      },
      from: 0,
      size: 5
    });
    return body;
  }

  // (staff only)
  async save({
    id,
    product_type_name,
    fullname,
    brand,
    variety,
    name,
    image
  }: ISavingProduct) {
    const row = await this.client.index({
      index: 'products',
      id,
      body: {id, product_type_name, fullname, brand, variety, name, image}
    });
    await this.client.indices.refresh({index: 'products'});
    return row;
  }

  // (staff only)
  async delete(id: string) {
    const row =
      await this.client.delete({index: 'products', id}, {ignore: [404]});
    await this.client.indices.refresh({index: 'products'});
    return row;
  }
}

export interface IProductSearch {
  client: Client;
  find(searchBody: any): any;  // finish
  auto(term: string): any;  // finish
  save(product: ISavingProduct): void;
  delete(id: string): void;
}

interface ISavingProduct {
  id: string;
  product_type_name: string;
  fullname: string;
  brand: string;
  variety: string;
  name: string;
  image: string;
}
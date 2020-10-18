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

  async auto(searchTerm: string) {
    const { body } = await this.client.search({
      index: "products",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {fullname: {}}
        },
        query: {
          bool: {
            must: [
              {
                match: {
                  fullname: {query: searchTerm, operator: "and"}
                }
                /*multi_match: {
                  fields: ["brand", "variety", "name"],
                  type: "cross_fields",
                  query: searchTerm
                }*/
              }
            ],
          }
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
    type,
    fullname,
    brand,
    variety,
    name,
    image
  }: ISavingProduct) {
    const saved = await this.client.index({
      index: 'products',
      id,
      body: {id, type, fullname, brand, variety, name, image}
    });
    await this.client.indices.refresh({index: 'products'});
    return saved;
  }

  // (staff only)
  async delete(id: string) {
    const deleted =
      await this.client.delete({index: 'products', id}, {ignore: [404]});
    await this.client.indices.refresh({index: 'products'});
    return deleted;
  }
}

export interface IProductSearch {
  client: Client;
  find(searchBody: any): any;  // finish
  auto(searchTerm: string): any;  // finish
  save({
    id,
    type,
    fullname,
    brand,
    variety,
    name,
    image
  }: ISavingProduct): void;
  delete(id: string): void;
}

interface ISavingProduct {
  id: string;
  type: string;
  fullname: string;
  brand: string;
  variety: string;
  name: string;
  image: string;
}
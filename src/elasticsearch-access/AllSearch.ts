import { Client } from '@elastic/elasticsearch';

export class AllSearch {
  client: Client;
  constructor(esClient: Client) {
    this.client = esClient;
    this.findAll = this.findAll.bind(this);
    this.autoAll = this.autoAll.bind(this);
  }

  async findAll(searchBody: object) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "_all",
      body: searchBody
    });
    return body;
  }

  async autoAll(searchTerm: string) {
    const { body } = await this.client.search({
      index: "_all",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {title: {}}
        },
        query: {
          bool: {
            should: [
              {match: {title: {query: searchTerm, operator: "and"}}},
              {match: {ingredientName: {query: searchTerm, operator: "and"}}}
            ]
          }
        }
      },
      from: 0,
      size: 5
    });
    return body;
  }
}
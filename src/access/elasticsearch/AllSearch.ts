/*import { Client } from '@elastic/elasticsearch';

export class AllSearch implements IAllSearch {
  client: Client;
  
  constructor(esClient: Client) {
    this.client = esClient;
    this.find = this.find.bind(this);
    this.auto = this.auto.bind(this);
  }

  // deep pagination can kill performance, set upper bounds 
  async find(searchBody: any) {
    const { body } =
      await this.client.search({index: "_all", body: searchBody});
    return body;
  }

  async auto(searchTerm: string) {
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
              {match: {name: {query: searchTerm, operator: "and"}}}
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

interface IAllSearch {
  client: Client;
  find(searchBody: any): any;  // finish
  auto(searchTerm: string): any;  // finish
}*/
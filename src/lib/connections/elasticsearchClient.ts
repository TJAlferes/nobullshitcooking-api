'use strict';

import { Client } from '@elastic/elasticsearch';

export const esClient = process.env.NODE_ENV === 'production'
? new Client({node: process.env.ELASTICSEARCH_PROD})
: process.env.NODE_ENV === 'test'
  ? new Client({node: "http://192.168.99.100:9200"})
  : new Client({node: "http://192.168.99.100:9200"});
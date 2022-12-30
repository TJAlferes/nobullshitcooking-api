'use strict';

import { Client } from '@elastic/elasticsearch';

const host = process.env.NODE_ENV === 'production'
  ? process.env.ELASTICSEARCH_PROD
  : process.env.NODE_ENV === 'test'
    ? 'elasticsearch-test'
    : 'elasticsearch-dev';
const esHost = host || 'localhost';
const node =   'http://' + esHost + ':9200';

export const esClient = new Client({node});
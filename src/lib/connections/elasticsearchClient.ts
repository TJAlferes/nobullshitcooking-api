'use strict';

const { Client, errors } = require('@elastic/elasticsearch');
/*const {
  createAWSConnection,
  awsCredsifyAll,
  awsGetCredentials
} = require('@acuris/aws-es-connection');*/

/*const esClient = (async function() {
  let makeClient;

  if (process.env.NODE_ENV === 'production') {
    const awsCredentials = await awsGetCredentials();
    const AWSConnection = createAWSConnection(awsCredentials);
    makeClient = awsCredsifyAll(
      new Client({
        Connection: AWSConnection,
        node: 'https://YOUR-DOMAIN-NAME.us-east-1.es.amazonaws.com'
      })
    );
  } else {
    makeClient = new Client({
      node: 'http://localhost:9200'
    });
  }

  return makeClient;  // () ?
})();*/

//import { createAWSConnector, awsCredsifyAll } from 'aws-es-connection';
//import { Client } from '@elastic/elasticsearch';
//import AWS from 'aws-sdk';

/*export function createElasticsearchClient({ endpoint }) {
  const AWSConnector = createAWSConnector(AWS.config.credentials);
  return awsCredsifyAll(
    new Client({
      node: endpoint,
      Connection: AWSConnector
    })
  )
}*/

/*async function getAWSConnection() {
  const awsCredentials = await awsGetCredentials();  // or try the AWS.config.credentials
  console.log('awsCredentials: ', awsCredentials);
  const AWSConnection = createAWSConnection(awsCredentials);
  return AWSConnection;
}

const AWSConnection = getAWSConnection();

const createESClient = awsCredsifyAll(
  new Client({
    node: process.env.ELASTICSEARCH_PROD,
    Connection: AWSConnection
  })
);
console.log(createESClient);*/

const esClient = process.env.NODE_ENV === 'production'
? new Client({node: process.env.ELASTICSEARCH_PROD})
: new Client({node: process.env.ES_DEV_NODE});

/*const esClient = new Client({
  node: process.env.ES_DEV_NODE
});*/

//console.log(errors);

module.exports = esClient;  // () ?
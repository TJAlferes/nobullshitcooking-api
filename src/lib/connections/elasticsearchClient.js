'use strict';

const { Client, errors } = require('@elastic/elasticsearch');
const { createAWSConnection, awsCredsifyAll, awsGetCredentials } = require('@acuris/aws-es-connection');

const esClient = async function() {
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
      host: 'elasticsearch-dev',
      port: 9200
    });
  }

  return makeClient;
}

console.log(errors);

module.exports = esClient;
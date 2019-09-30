
const esClient = require('../lib/connections/elasticsearchClient');
const pool = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');

const bulkUp = async function() {
  /*
  const recipe = new Recipe(pool);
  const toBulk = await recipe.getAllPublicRecipesForElasticSearchBulkInsert();

  try {
    const wasDeleted = await esClient.indices.delete({index: "recipes"});
    console.log('wasDeleted: ', wasDeleted);
  } catch (err) {
    console.log(err);
  }

  try {
    const wasCreated = await esClient.indices.create({
      index: "recipes",
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {
                tokenizer: "autocomplete",
                filter: ["lowercase"]
              },
              autocomplete_search: {tokenizer: "lowercase"}
            },
            tokenizer: {
              autocomplete: {type: "edge_ngram", min_gram: 2, max_gram: 10, token_chars: ["letter"]}
            }
          }
        },
        mappings: {
          properties: {
            recipeId: {type: 'integer'},
            authorName: {type: 'keyword'},
            recipeTypeName: {type: 'keyword'},
            cuisineName: {type: 'keyword'},
            title: {type: 'text', analyzer: 'autocomplete', search_analyzer: 'autocomplete_search'},
            description: {type: 'text'},
            directions: {type: 'text'},
            //methodNames: {type: 'keyword'},  // finish
            //equipmentNames: {type: 'keyword'},  // finish
            //ingredientNames: {type: 'keyword'},  // finish
            //subrecipeNames: {type: 'keyword'}  // finish
          }
        }
      }
    });
    console.log('wasCreated: ', wasCreated);
  } catch (err) {
    console.log(err);
  }

  try {
    const wasRefreshed1 = await esClient.indices.refresh({index: "recipes"});
    console.log('wasRefreshed1: ', wasRefreshed1);
  } catch (err) {
    console.log(err);
  }

  try {
    const doesExist = await esClient.indices.exists({index: "recipes"});
    console.log('doesExist: ', doesExist);
  } catch (err) {
    console.log(err);
  }

  try {
    const wasBulked = await esClient.bulk({index: "recipes", body: toBulk, refresh: "true"});
    console.log('wasBulked: ', wasBulked);
  } catch (err) {
    console.log(err);
  }

  try {
    const wasRefreshed2 = await esClient.indices.refresh({index: "recipes"});
    console.log('wasRefreshed2: ', wasRefreshed2);
  } catch (err) {
    console.log(err);
  }
  
  try {
    const { body } = await esClient.indices.analyze({
      index: "recipes",
      body: {
        analyzer: "autocomplete",
        text: "Grilled Chicken and Seasoned Rice"
      }
    });
    console.log('testAnalyze: ', body.tokens);
  } catch (err) {
    console.log(err);
  }
  */

  let tryNumber = 0;
  const repeatTries = setInterval(async function() {
    if (tryNumber == 2) clearInterval(repeatTries);
    tryNumber = tryNumber + 1;
    console.log('=========== tryNumber: ', tryNumber);
    try {
      const { body } = await esClient.search({
        index: "recipes",
        body: {
          query: {
            match: {
              title: {query: "Grill", operator: "and"}
            }
          },
          from: 0,
          size: 5
        }
      });
      console.log('body.hits.hits: ', body.hits.hits);
    } catch (err) {
      console.log(err);
    }
  }, 10000);
};

module.exports = bulkUp;

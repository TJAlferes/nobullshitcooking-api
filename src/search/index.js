const esClient = require('../lib/connections/elasticsearchClient');
const pool = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');

const bulkUp = async function() {  // generator instead? timeout first?
  
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
                //filter: ["lowercase"]
              },
              //autocomplete_search: {tokenizer: "lowercase"}
            },
            tokenizer: {
              autocomplete: {type: "edge_ngram", min_gram: 2, max_gram: 10}
            }
          }
        },
        mappings: {
          properties: {
            recipeId: {type: 'integer'},
            authorName: {type: 'keyword'},
            recipeTypeName: {type: 'keyword'},
            cuisineName: {type: 'keyword'},
            title: {type: 'text', analyzer: 'autocomplete', search_analyzer: 'standard'},  // autocomplete_search? or remove lowercase tokenizer?
            description: {type: 'text'},
            directions: {type: 'text'},
            //recipeImage: {type: 'keyword'},
            //methodNames: {type: 'keyword'},
            //equipmentNames: {type: 'keyword'},
            //ingredientNames: {type: 'keyword'},
            //subrecipeNames: {type: 'keyword'}
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
  

  let tryNumber = 0;
  const repeatTries = setInterval(async function() {
    if (tryNumber == 2) clearInterval(repeatTries);
    tryNumber = tryNumber + 1;
    console.log('=========== tryNumber: ', tryNumber);
    try {
      /*const { body } = await esClient.search({
        index: "recipes",
        //analyzer: string,
        //default_operator: 'AND' | 'OR',
        //from: number,
        //q: string,
        //scroll: string,
        //search_type: 'query_then_fetch' | 'dfs_query_then_fetch',
        //size: number,
        //suggest_field: string,
        //suggest_mode: 'missing' | 'popular' | 'always',
        //suggest_size: number,
        //suggest_text: string,
        //track_scores: boolean,
        //track_total_hits: boolean,
        //allow_partial_search_results: boolean,
        //request_cache: boolean,
        //rest_total_hits_as_int: boolean,
        body: {
          query: {
            match_all: {}
          }
        }
      });
      console.log('wasGood body: ', body.hits.hits);*/

      const { body } = await esClient.search({
        index: "recipes",
        body: {
          query: {
            match: {
              //title: {query: "Coffee Vani", operator: "and"}
              title: {query: "Chicke"}
            }
          }
        }
      });
      console.log('wasGood2 body: ', body.hits.hits);
    } catch (err) {
      console.log(err);
    }

  }, 10000);
};

/*{
  index: 'recipes',
  id: recipeId,
  type: 'recipe',
  body: {
    recipeId,
    authorName,
    recipeTypeName,
    cuisineName,
    title,
    description,
    recipeImage,
    methodNames,
    equipmentNames,
    ingredientNames,
    subrecipeNames
  }
}*/

module.exports = bulkUp;
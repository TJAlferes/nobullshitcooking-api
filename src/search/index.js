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
              autocomplete: {tokenizer: "autocomplete", filter: ["lowercase"]},
              autocomplete_search: {tokenizer: "lowercase"}
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
            title: {type: 'text', analyzer: 'autocomplete', search_analyzer: 'autocomplete_search'},  // type: 'text',
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
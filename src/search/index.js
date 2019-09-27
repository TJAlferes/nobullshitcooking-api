const { esClient } = require('../lib/connections/elasticsearchClient');
const { pool } = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');

const bulkUp = async function() {  // generator instead?
  const recipe = new Recipe(pool);
  const toBulk = await recipe.getAllPublicRecipesForElasticSearchBulkInsert();

  await esClient.indices.create({
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
          authorName: {type: 'string'},
          recipeTypeName: {type: 'string'},
          cuisineName: {type: 'string'},
          title: {type: 'string', analyzer: 'autocomplete', search_analyzer: 'autocomplete_search'},  // type: 'text',
          description: {type: 'string'},
          directions: {type: 'text'},
          recipeImage: {type: 'string'}
        }
      }
    }
  });

  await esClient.bulk({
    index: "recipes",
    refresh: "true",
    body: toBulk,
    type: "recipe"
  });
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
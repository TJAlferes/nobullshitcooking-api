const { esClient } = require('../lib/connections/elasticsearchClient');
const { pool } = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');

const bulkUp = async function() {
  const recipe = new Recipe(pool);

  try {
    const toBulk = await recipe.getAllPublicRecipesForElasticSearchBulkInsert();
    console.log('========== toBulkSucceeded ==========');
    console.log('toBulk: ', toBulk);
  } catch(err) {
    console.log('========== toBulkFailed ==========');
    console.log(err);
  }

  /*let toBulkFormatted = [];
  toBulk.map(recipe => {
    toBulkFormatted.push(
      {
        index: {
          _index: 'recipes',
          _id: recipe.recipeId,
          //_type: 'recipe'
        }
      },
      {
        recipeId: recipe.recipeId,
        authorName: recipe.authorName,
        recipeTypeName: recipe.recipeTypeName,
        cuisineName: recipe.cuisineName,
        title: recipe.title,
        description: recipe.description,
        recipeImage: recipe.recipeImage,
        methodNames: recipe.methodNames,
        equipmentNames: recipe.equipmentNames,
        ingredientNames: recipe.ingredientNames,
        subrecipeNames: recipe.subrecipeNames
      }
    );
  });

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
    body: toBulkFormatted,
    type: "recipe"
  });*/
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
/*
const esClient = require('../lib/connections/elasticsearchClient');
const pool = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');
const Ingredient = require('../mysql-access/Ingredient');
const Equipment = require('../mysql-access/Equipment');

const bulkUp = async function() {
  const recipe = new Recipe(pool);
  const ingredient = new Ingredient(pool);
  const equipment = new Equipment(pool);
  const toBulk = await recipe.getAllPublicRecipesForElasticSearchBulkInsert();
  const toBulk2 = await ingredient.getAllPublicIngredientsForElasticSearchBulkInsert();
  const toBulk3 = await equipment.getAllPublicEquipmentForElasticSearchBulkInsert();



  // delete

  try {
    const wasDeleted = await esClient.indices.delete({index: "recipes"});
    //console.log('wasDeleted: ', wasDeleted);

    const wasDeleted2 = await esClient.indices.delete({index: "ingredients"});
    //console.log('wasDeleted2: ', wasDeleted2);

    const wasDeleted3 = await esClient.indices.delete({index: "equipment"});
    //console.log('wasDeleted3: ', wasDeleted3);
  } catch (err) {
    console.log(err);
  }



  // create

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
            methodNames: {type: 'keyword'},
            equipmentNames: {type: 'keyword'},
            ingredientNames: {type: 'keyword'},
            subrecipeNames: {type: 'keyword'}
          }
        }
      }
    });
    //console.log('wasCreated: ', wasCreated);

    const wasCreated2 = await esClient.indices.create({
      index: "ingredients",
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
            ingredientId: {type: 'integer'},
            ingredientTypeName: {type: 'keyword'},
            ingredientName: {type: 'text', analyzer: 'autocomplete', search_analyzer: 'autocomplete_search'}
          }
        }
      }
    });
    //console.log('wasCreated2: ', wasCreated2);

    const wasCreated3 = await esClient.indices.create({
      index: "equipment",
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
            equipmentId: {type: 'integer'},
            equipmentTypeName: {type: 'keyword'},
            equipmentName: {type: 'text', analyzer: 'autocomplete', search_analyzer: 'autocomplete_search'}
          }
        }
      }
    });
    //console.log('wasCreated3: ', wasCreated3);

  } catch (err) {
    console.log(err);
  }



  // refresh

  try {
    //const wasRefreshed = await esClient.indices.refresh({index: "recipes"});
    //console.log('wasRefreshed: ', wasRefreshed);

    //const wasRefreshed2 = await esClient.indices.refresh({index: "ingredients"});
    //console.log('wasRefreshed2: ', wasRefreshed2);

    //const wasRefreshed3 = await esClient.indices.refresh({index: "equipment"});
    //console.log('wasRefreshed3: ', wasRefreshed3);
  } catch (err) {
    console.log(err);
  }



  // check existence

  try {
    //const doesExist = await esClient.indices.exists({index: "recipes"});
    //console.log('doesExist: ', doesExist);

    const doesExist2 = await esClient.indices.exists({index: "ingredients"});
    console.log('doesExist2: ', doesExist2);
  } catch (err) {
    console.log(err);
  }



  // bulk insert

  try {
    const wasBulked = await esClient.bulk({index: "recipes", body: toBulk, refresh: "true"});
    console.log('wasBulked: ', wasBulked);

    const wasBulked2 = await esClient.bulk({index: "ingredients", body: toBulk2, refresh: "true"});
    //console.log('wasBulked2: ', wasBulked2);

    const wasBulked3 = await esClient.bulk({index: "equipment", body: toBulk3, refresh: "true"});
    //console.log('wasBulked3: ', wasBulked3);
  } catch (err) {
    console.log(err);
  }



  // refresh again

  try {
    const wasRefreshedAgain = await esClient.indices.refresh({index: "recipes"});
    //console.log('wasRefreshedAgain: ', wasRefreshedAgain);

    const wasRefreshedAgain2 = await esClient.indices.refresh({index: "ingredients"});
    //console.log('wasRefreshedAgain2: ', wasRefreshedAgain2);

    const wasRefreshedAgain3 = await esClient.indices.refresh({index: "equipment"});
    //console.log('wasRefreshedAgain3: ', wasRefreshedAgain3);
  } catch (err) {
    console.log(err);
  }
  


  // sample analyzers

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

  try {
    const { body } = await esClient.indices.analyze({
      index: "ingredients",
      body: {
        analyzer: "autocomplete",
        text: "Asparagus"
      }
    });
    console.log('testAnalyze: ', body.tokens);
  } catch (err) {
    console.log(err);
  }
  


  // sample searches

  let tryNumber = 0;
  const repeatTries = setInterval(async function() {
    if (tryNumber == 2) clearInterval(repeatTries);
    tryNumber = tryNumber + 1;
    console.log('=========== tryNumber: ', tryNumber);
    try {
      const { body } = await esClient.search({
        index: "recipes",
        body: {
          query: {match: {title: {query: "Grill", operator: "and"}}},
          from: 0,
          size: 5
        }
      });
      console.log('body.hits.hits: ', body.hits.hits);
    } catch (err) {
      console.log(err);
    }
  }, 10000);

  let tryNumber2 = 0;
  const repeatTries2 = setInterval(async function() {
    if (tryNumber2 == 2) clearInterval(repeatTries2);
    tryNumber2 = tryNumber2 + 1;
    console.log('=========== tryNumber2: ', tryNumber2);
    try {
      const { body } = await esClient.search({
        index: "ingredients",
        body: {
          query: {match: {ingredientName: {query: "Mushr", operator: "and"}}},
          from: 0,
          size: 5
        }
      });
      console.log('body.hits.hits: ', body.hits.hits);
    } catch (err) {
      console.log(err);
    }
  }, 10000);

  let tryNumber3 = 0;
  const repeatTries3 = setInterval(async function() {
    if (tryNumber3 == 2) clearInterval(repeatTries3);
    tryNumber3 = tryNumber3 + 1;
    console.log('=========== tryNumber2: ', tryNumber3);
    try {
      const { body } = await esClient.search({
        index: "equipment",
        body: {
          query: {match: {equipmentName: {query: "Cutti", operator: "and"}}},
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
*/
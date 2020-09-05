import { esClient } from '../lib/connections/elasticsearchClient';
import { pool } from '../lib/connections/mysqlPoolConnection';
import { Equipment } from '../mysql-access/Equipment';
import { Ingredient } from '../mysql-access/Ingredient';
import { Product } from '../mysql-access/Product';
import { Recipe } from '../mysql-access/Recipe';

export async function bulkUp() {
  const recipe = new Recipe(pool);
  const ingredient = new Ingredient(pool);
  const product = new Product(pool);
  const equipment = new Equipment(pool);
  
  const [ bulkRecipes, bulkIngredients, bulkProducts, bulkEquipment ] =
    await Promise.all([
      recipe.getAllForElasticSearch(),
      ingredient.getAllForElasticSearch(),
      product.getAllForElasticSearch(),
      equipment.getAllForElasticSearch()
    ]);

  // delete
  await Promise.all([
    esClient.indices.delete({index: "recipes"}),
    esClient.indices.delete({index: "ingredients"}),
    esClient.indices.delete({index: "products"}),
    esClient.indices.delete({index: "equipment"})
  ]);

  // create
  await Promise.all([
    esClient.indices.create({
      index: "recipes",
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {tokenizer: "autocomplete", filter: ["lowercase"]},
              autocomplete_search: {tokenizer: "lowercase"}
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 10,
                token_chars: ["letter"]
              }
            }
          }
        },
        mappings: {
          properties: {
            id: {type: 'integer'},
            author: {type: 'keyword'},
            recipe_type_name: {type: 'keyword'},
            cuisine_name: {type: 'keyword'},
            title: {
              type: 'text',
              analyzer: 'autocomplete',
              search_analyzer: 'autocomplete_search'
            },
            description: {type: 'text'},
            directions: {type: 'text'},
            method_names: {type: 'keyword'},
            equipment_names: {type: 'keyword'},
            ingredient_names: {type: 'keyword'},
            subrecipe_titles: {type: 'keyword'}
          }
        }
      }
    }),
    esClient.indices.create({
      index: "ingredients",
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {tokenizer: "autocomplete", filter: ["lowercase"]},
              autocomplete_search: {tokenizer: "lowercase"}
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 10,
                token_chars: ["letter"]
              }
            }
          }
        },
        mappings: {
          properties: {
            id: {type: 'integer'},
            ingredient_type_name: {type: 'keyword'},
            fullname: {
              type: 'text',
              analyzer: 'autocomplete',
              search_analyzer: 'autocomplete_search'
            }
          }
        }
      }
    }),
    esClient.indices.create({
      index: "equipment",
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {tokenizer: "autocomplete", filter: ["lowercase"]},
              autocomplete_search: {tokenizer: "lowercase"}
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 10,
                token_chars: ["letter"]
              }
            }
          }
        },
        mappings: {
          properties: {
            id: {type: 'integer'},
            equipment_type_name: {type: 'keyword'},
            name: {
              type: 'text',
              analyzer: 'autocomplete',
              search_analyzer: 'autocomplete_search'
            }
          }
        }
      }
    }),
    esClient.indices.create({
      index: "products",
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {tokenizer: "autocomplete", filter: ["lowercase"]},
              autocomplete_search: {tokenizer: "lowercase"}
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 10,
                token_chars: ["letter"]
              }
            }
          }
        },
        mappings: {
          properties: {
            id: {type: 'integer'},
            product_category_name: {type: 'keyword'},
            product_type_name: {type: 'keyword'},
            fullname: {
              type: 'text',
              analyzer: 'autocomplete',
              search_analyzer: 'autocomplete_search'
            }
          }
        }
      }
    })
  ]);

  // bulk insert
  await Promise.all([
    esClient.bulk({
      index: "recipes",
      body: bulkRecipes,
      refresh: "true"
    }),
    esClient.bulk({
      index: "ingredients",
      body: bulkIngredients,
      refresh: "true"
    }),
    esClient.bulk({
      index: "equipment",
      body: bulkEquipment,
      refresh: "true"
    }),
    esClient.bulk({
      index: "products",
      body: bulkProducts,
      refresh: "true"
    })
  ]);

  // refresh
  await Promise.all([
    esClient.indices.refresh({index: "recipes"}),
    esClient.indices.refresh({index: "ingredients"}),
    esClient.indices.refresh({index: "equipment"}),
    esClient.indices.refresh({index: "products"})
  ]);

  /*
  This should all be moved to some sort of (integration?) test file.

  // sample analyzers

  const { body } = await esClient.indices.analyze({
    index: "recipes",
    body: {
      analyzer: "autocomplete",
      text: "Grilled Chicken and Seasoned Rice"
    }
  });
  console.log('testAnalyze: ', body.tokens);

  const { body } = await esClient.indices.analyze({
    index: "ingredients",
    body: {
      analyzer: "autocomplete",
      text: "Asparagus"
    }
  });
  console.log('testAnalyze: ', body.tokens);
  
  // sample searches

  let tryNumber = 0;
  const repeatTries = setInterval(async function() {
    if (tryNumber == 2) clearInterval(repeatTries);
    tryNumber = tryNumber + 1;
    console.log('=========== tryNumber: ', tryNumber);
    const { body } = await esClient.search({
      index: "recipes",
      body: {
        query: {match: {title: {query: "Grill", operator: "and"}}},
        from: 0,
        size: 5
      }
    });
    console.log('body.hits.hits: ', body.hits.hits);
  }, 10000);

  let tryNumber2 = 0;
  const repeatTries2 = setInterval(async function() {
    if (tryNumber2 == 2) clearInterval(repeatTries2);
    tryNumber2 = tryNumber2 + 1;
    console.log('=========== tryNumber2: ', tryNumber2);
    const { body } = await esClient.search({
      index: "ingredients",
      body: {
        query: {match: {ingredient_name: {query: "Mushr", operator: "and"}}},
        from: 0,
        size: 5
      }
    });
    console.log('body.hits.hits: ', body.hits.hits);
  }, 10000);

  let tryNumber3 = 0;
  const repeatTries3 = setInterval(async function() {
    if (tryNumber3 == 2) clearInterval(repeatTries3);
    tryNumber3 = tryNumber3 + 1;
    console.log('=========== tryNumber2: ', tryNumber3);
    const { body } = await esClient.search({
      index: "equipment",
      body: {
        query: {match: {equipment_name: {query: "Cutti", operator: "and"}}},
        from: 0,
        size: 5
      }
    });
    console.log('body.hits.hits: ', body.hits.hits);
  }, 10000);
  */
}
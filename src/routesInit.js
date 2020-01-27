//const { buildSchema } = require('graphql');  // move also
//const expressGraphQL = require('express-graphql');  // move also

const {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  methodRoutes,
  measurementRoutes,
  favoriteRecipeRoutes,
  staffRoutes,
  userRoutes,
  searchRoutes
} = require('./routes');

function routesInit(app) {
  app.get('/', (req, res) => {
    res.send(`No Bullshit Cooking Backend API.`);
  });
  app.use('/equipment', equipmentRoutes);
  app.use('/equipment-type', equipmentTypeRoutes);
  app.use('/ingredient', ingredientRoutes);
  app.use('/ingredient-type', ingredientTypeRoutes);
  app.use('/recipe', recipeRoutes);
  app.use('/recipe-type', recipeTypeRoutes);
  app.use('/cuisine', cuisineRoutes);
  app.use('/method', methodRoutes);
  app.use('/measurement', measurementRoutes);
  app.use('/favorite-recipe', favoriteRecipeRoutes);
  app.use('/staff', staffRoutes);
  app.use('/user', userRoutes);
  app.use('/search', searchRoutes);
  //app.use('/graphql', expressGraphQL({schema, rootValue, graphiql: true}));  // move also
}

module.exports = routesInit;
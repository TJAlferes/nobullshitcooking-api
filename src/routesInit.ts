import { Application } from 'express';

import {
  staffRoutes,
  userRoutes,
  contentRoutes,
  contentTypeRoutes,
  cuisineRoutes,
  cuisineEquipmentRoutes,
  cuisineIngredientRoutes,
  cuisineSupplierRoutes,
  dataInitRoutes,
  equipmentRoutes,
  equipmentTypeRoutes,
  favoriteRecipeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  measurementRoutes,
  methodRoutes,
  profileRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  searchRoutes,
  supplierRoutes
} from './routes';

export function routesInit(app: Application) {
  app.get('/', (req, res) => {
    res.send(`
      No Bullshit Cooking Backend API.
      Documentation at https://github.com/tjalferes/nobullshitcooking-api
    `);
  });
  app.use('/staff', staffRoutes);
  app.use('/user', userRoutes);
  app.use('/content', contentRoutes);
  app.use('/content-type', contentTypeRoutes);
  app.use('/cuisine', cuisineRoutes);
  app.use('/cuisine-equipment', cuisineEquipmentRoutes);
  app.use('/cuisine-ingredient', cuisineIngredientRoutes);
  app.use('/cuisine-supplier', cuisineSupplierRoutes);
  app.use('/data-init', dataInitRoutes);
  app.use('/equipment', equipmentRoutes);
  app.use('/equipment-type', equipmentTypeRoutes);
  app.use('/favorite-recipe', favoriteRecipeRoutes);
  app.use('/ingredient', ingredientRoutes);
  app.use('/ingredient-type', ingredientTypeRoutes);
  app.use('/measurement', measurementRoutes);
  app.use('/method', methodRoutes);
  app.use('/profile', profileRoutes);
  app.use('/recipe', recipeRoutes);
  app.use('/recipe-type', recipeTypeRoutes);
  app.use('/search', searchRoutes);
  app.use('/supplier', supplierRoutes);
}
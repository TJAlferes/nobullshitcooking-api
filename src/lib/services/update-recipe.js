'use strict';

async function updateRecipeService({
  recipe,
  recipeMethod,
  recipeEquipment,
  recipeIngredient,
  recipeSubrecipe,
  recipeSearch,
  ownerId,
  recipeToUpdateWith,
  requiredMethods,
  requiredEquipment,
  requiredIngredients,
  requiredSubrecipes
}) {
  await recipe.updateMyUserRecipe(recipeToUpdateWith, recipeId);

  //

  let recipeMethodsToUpdateWith = "none";
  let recipeMethodsPlaceholders = "none";

  if (requiredMethods !== "none") {
    recipeMethodsToUpdateWith = [];

    requiredMethods.map(rM => {
      recipeMethodsToUpdateWith.push(recipeId, rM.methodId)
    });

    recipeMethodsPlaceholders = '(?, ?),'
    .repeat(requiredMethods.length)
    .slice(0, -1);
  }

  await recipeMethod.updateRecipeMethods(
    recipeMethodsToUpdateWith,
    recipeMethodsPlaceholders,
    recipeId
  );

  //

  let recipeEquipmentToUpdateWith = "none";
  let recipeEquipmentPlaceholders = "none";

  if (requiredEquipment !== "none") {
    recipeEquipmentToUpdateWith = [];

    requiredEquipment.map(rE => {
      recipeEquipmentToUpdateWith.push(recipeId, rE.equipment, rE.amount)
    });

    recipeEquipmentPlaceholders = '(?, ?, ?),'
    .repeat(requiredEquipment.length)
    .slice(0, -1);
  }

  await recipeEquipment.updateRecipeEquipment(
    recipeEquipmentToUpdateWith,
    recipeEquipmentPlaceholders,
    recipeId
  );

  //

  let recipeIngredientsToUpdateWith = "none";
  let recipeIngredientsPlaceholders = "none";

  if (requiredIngredients !== "none") {
    recipeIngredientsToUpdateWith = [];

    requiredIngredients.map(rI => {
      recipeIngredientsToUpdateWith
      .push(recipeId, rI.ingredient, rI.amount, rI.unit);
    });

    recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredIngredients.length)
    .slice(0, -1);
  }

  await recipeIngredient.updateRecipeIngredients(
    recipeIngredientsToUpdateWith,
    recipeIngredientsPlaceholders,
    recipeId
  );

  //

  let recipeSubrecipesToUpdateWith = "none";
  let recipeSubrecipesPlaceholders = "none";

  if (requiredSubrecipes !== "none") {
    recipeSubrecipesToUpdateWith = [];

    requiredSubrecipes.map(rS => {
      recipeSubrecipesToUpdateWith
      .push(recipeId, rS.subrecipe, rS.amount, rS.unit);
    });

    recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredSubrecipes.length)
    .slice(0, -1);
  }

  await recipeSubrecipe.updateRecipeSubrecipes(
    recipeSubrecipesToUpdateWith,
    recipeSubrecipesPlaceholders,
    recipeId
  );

  if (ownerId === 1) {
    const recipeInfoForElasticSearch = await recipe
    .getPublicRecipeForElasticSearchInsert(recipeId);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch);
  }
}

module.exports = updateRecipeService;
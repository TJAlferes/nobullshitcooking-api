'use strict';

async function createRecipeService({
  recipe,
  recipeMethod,
  recipeEquipment,
  recipeIngredient,
  recipeSubrecipe,
  recipeSearch,
  ownerId,
  recipeToCreate,
  requiredMethods,
  requiredEquipment,
  requiredIngredients,
  requiredSubrecipes
}) {
  const createdRecipe = await recipe.createRecipe(recipeToCreate);

  const generatedId = createdRecipe.insertId;

  if (requiredMethods !== "none") {
    let recipeMethodsToCreate = [];
    requiredMethods.map(rM => {
      recipeMethodsToCreate.push(generatedId, rM.methodId)
    });

    const recipeMethodsPlaceholders = '(?, ?),'
    .repeat(requiredMethods.length)
    .slice(0, -1);

    await recipeMethod.createRecipeMethods(
      recipeMethodsToCreate,
      recipeMethodsPlaceholders
    );
  }

  if (requiredEquipment !== "none") {
    let recipeEquipmentToCreate = [];

    requiredEquipment.map(rE => {
      recipeEquipmentToCreate.push(generatedId, rE.equipment, rE.amount);
    });

    const recipeEquipmentPlaceholders = '(?, ?, ?),'
    .repeat(requiredEquipment.length)
    .slice(0, -1);

    await recipeEquipment.createRecipeEquipment(
      recipeEquipmentToCreate,
      recipeEquipmentPlaceholders
    );
  }

  if (requiredIngredients !== "none") {
    let recipeIngredientsToCreate = [];

    requiredIngredients.map(rI => {
      recipeIngredientsToCreate
      .push(generatedId, rI.ingredient, rI.amount, rI.unit);
    });

    const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredIngredients.length)
    .slice(0, -1);

    await recipeIngredient.createRecipeIngredients(
      recipeIngredientsToCreate,
      recipeIngredientsPlaceholders
    );
  }

  if (requiredSubrecipes !== "none") {
    let recipeSubrecipesToCreate = [];

    requiredSubrecipes.map(rS => {
      recipeSubrecipesToCreate
      .push(generatedId, rS.subrecipe, rS.amount, rS.unit);
    })

    const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredSubrecipes.length)
    .slice(0, -1);

    await recipeSubrecipe.createRecipeSubrecipes(
      recipeSubrecipesToCreate,
      recipeSubrecipesPlaceholders
    );
  }

  if (ownerId === 1) {
    const recipeInfoForElasticSearch = await recipe
    .getPublicRecipeForElasticSearchInsert(generatedId);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch);
  }
}

module.exports = createRecipeService;
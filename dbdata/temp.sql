SELECT
  r.recipe_id AS recipeId,
  u.username AS authorName,
  rt.recipe_type_name AS recipeTypeName,
  c.cuisine_name AS cuisineName,
  r.title AS title,
  r.description AS recipeDescription,
  r.directions AS directions,
  r.recipe_image AS recipeImage,
  m.method_name AS methodNames,
  e.equipment_name AS equipmentNames,
  i.ingredient_name AS ingredientNames,
  sr.title AS subrecipeTitles
FROM nobsc_recipes r
INNER JOIN nobsc_users u ON u.user_id = r.author_id
INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
INNER JOIN nobsc_recipe_methods rm ON rm.recipe_id = r.recipe_id
INNER JOIN nobsc_methods m ON m.method_id = rm.method_id
INNER JOIN nobsc_recipe_equipment re ON re.recipe_id = r.recipe_id
INNER JOIN nobsc_equipment e ON e.equipment_id = re.equipment_id
INNER JOIN nobsc_recipe_ingredients ri ON ri.recipe_id = r.recipe_id
INNER JOIN nobsc_ingredients i ON i.ingredient_id = ri.ingredient_id
INNER JOIN nobsc_recipe_subrecipes rs ON rs.recipe_id = r.recipe_id
INNER JOIN nobsc_recipes sr ON sr.recipe_id = rs.recipe_id
WHERE r.owner_id = 1;
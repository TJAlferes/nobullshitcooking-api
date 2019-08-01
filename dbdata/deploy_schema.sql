-- create tables
\i '/docker-entrypoint-initdb.d/tables/nobsc_staff.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_users.sql'

\i '/docker-entrypoint-initdb.d/tables/nobsc_recipe_types.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_ingredient_types.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_equipment_types.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_methods.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_cuisines.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_measurements.sql'

\i '/docker-entrypoint-initdb.d/tables/nobsc_recipes.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_ingredients.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_equipment.sql'

\i '/docker-entrypoint-initdb.d/tables/nobsc_recipe_subrecipes.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_recipe_ingredients.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_recipe_equipment.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_recipe_methods.sql'

\i '/docker-entrypoint-initdb.d/tables/nobsc_friendships.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_plans.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_favorite_recipes.sql'
\i '/docker-entrypoint-initdb.d/tables/nobsc_saved_recipes.sql'

\i '/docker-entrypoint-initdb.d/tables/nobsc_notifications.sql'



-- seed them
\i '/docker-entrypoint-initdb.d/seed/nobsc_staff.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_users.sql'

\i '/docker-entrypoint-initdb.d/seed/nobsc_recipe_types.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_ingredient_types.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_equipment_types.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_methods.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_cuisines.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_measurements.sql'

\i '/docker-entrypoint-initdb.d/seed/nobsc_recipes.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_ingredients.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_equipment.sql'

\i '/docker-entrypoint-initdb.d/seed/nobsc_recipe_subrecipes.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_recipe_ingredients.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_recipe_equipment.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_recipe_methods.sql'

\i '/docker-entrypoint-initdb.d/seed/nobsc_friendships.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_plans.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_favorite_recipes.sql'
\i '/docker-entrypoint-initdb.d/seed/nobsc_saved_recipes.sql'

\i '/docker-entrypoint-initdb.d/seed/nobsc_notifications.sql'
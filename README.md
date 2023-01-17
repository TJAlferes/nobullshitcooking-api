![nobsc-logo-large-white](https://user-images.githubusercontent.com/19824877/39939802-090658c8-551d-11e8-9f0c-55872add67b2.png)

[![codecov](https://codecov.io/gh/tjalferes/nobullshitcooking-api/branch/master/graph/badge.svg)](https://codecov.io/gh/tjalferes/nobullshitcooking-api)

# [No Bullshit Cooking](https://nobullshitcooking.com/)

> "All civilization is the deoccultization of knowledge."

> "Simplicity is the secret to everything really. The more you add, the more you take away."

## MySQL Database

### TABLES

content
content_types
cuisines
cuisine_equipment
cuisine_ingredients
cuisine_suppliers
customers
equipment
equipment_types
favorite_recipes
friendships
ingredients
ingredient_types
measurements
methods
notifications
orders
order_products
plans
products
product_suppliers
recipes
recipe_equipment
recipe_ingredients
recipe_methods
recipe_subrecipes
recipe_types
saved_recipes
staff
suppliers
users

## Redis store

MessengerChat
MessengerRoom
MessengerUser

## ElasticSearch indices

Equipment
Ingredient
Product
Recipe

## Node.js Express API endpoints

### GENERAL

**/content GET**

View all official content.

**/content/links/:name GET**

View all links to content categorized under one content type.

**/content:id GET**

View one content by id.

**/content-type GET**

View all content types.

**/content-type/:id GET**

View one content type by id.

**/cuisine GET**

View all cuisines.

**/cuisine/detail/:id GET**

View the details of one cuisine by id.

**/cuisine/:id GET**

View one cuisine by id.

**/cuisine-equipment/:id GET**

View the equipment of one cuisine by cuisine id.

**/cuisine-ingredient/:id GET**

View the ingredients of one cuisine by cuisine id.

**/cuisine-supplier/:id GET**

View the suppliers of one cuisine by cuisine id.

**/data-init GET**

View all initial data when first visiting the site.

**/equipment/official/all GET**

View all official equipment.

**/equipment/:id GET**

View one equipment by id.

**/equipment-type GET**

View all equipment types.

**/equipment-type/:id GET**

View one equipment type by id.

**/favorite-recipe GET**

View most favorited. (TO DO: fix this)

**/ingredient/official/all GET**

View all official ingredients.

**/ingredient/:id GET**

View one ingredient by id.

**/ingredient-type GET**

View all ingredient types.

**/ingredient-type/:id GET**

View one ingredient type by id.

**/measurement GET**

View all measurements.

**/measurement/:id GET**

View one measurement by id.

**/method GET**

View all methods.

**/method/:id GET**

View one method by id.

**/profile/:username GET**

View the profile of one user by name.

**/recipe/official/all GET**

View all official recipes.

**/recipe/:id GET**

View the details of one recipe by id.

**/recipe-type GET**

View all recipe types.

**/recipe-type/:id GET**

View one recipe type by id.

**/search/autocomplete/equipment POST**

View equipment search autocompletions.

**/search/autocomplete/ingredients POST**

View ingredients search autocompletions.

**/search/autocomplete/recipes POST**

View recipes search autocompletions.

**/search/find/equipment POST**

View equipment search results.

**/search/find/ingredients POST**

View ingredients search results.

**/search/find/recipes POST**

View recipes search results.

**/supplier GET**

View all official suppliers.

**/supplier/:id GET**

View one supplier by id.

### USER

**/user/auth/register POST**

Create a new user account.

**/user/auth/verify POST**

Verify a user account.

**/user/auth/resend-confirmation-code POST**

Email another confirmation code so the user can verify their account.

**/user/auth/login POST**

Attempt to sign the user in.

**/user/auth/logout POST**

Sign the user out.

**/user/auth/update-account POST**

Update the user account.

**/user/auth/delete-account POST**

Delete the user account.

**/user/content/all POST**

View all content (posts) created by the authenticated user.

**/user/content/one POST**

View one content (posts) created by the authenticated user.

**/user/content/subscribed/all POST**

View all content (posts) from users the authenticated user is subscribed to.

**/user/equipment/all POST**

View all equipment created by the authenticated user.

**/user/equipment/one POST**

View one equipment created by the authenticated user.

**/user/equipment/create POST**

Create a new equipment by the authenticated user.

**/user/equipment/update PUT**

Update one equipment by the authenticated user.

**/user/equipment/delete DELETE**

Delete one equipment by the authenticated user.

**/user/favorite-recipe POST**

View recipes favorited by a user.

**/user/favorite-recipe/create POST**

Favorite one recipe by the authenticated user.

**/user/favorite-recipe/delete DELETE**

Unfavorite one recipe by the authenticated user.

**/user/friendship/ POST**

View all friendships of the authenticated user.

**/user/friendship/create POST**

Create a new pending friendship.

**/user/friendship/accept PUT**

Accept a pending friendship.

**/user/friendship/reject PUT**

Reject a pending friendship.

**/user/friendship/delete DELETE**

Delete a friendship.

**/user/friendship/block POST**

Block a user.

**/user/friendship/unblock DELETE**

Unblock a user.

**/user/get-signed-url/avatar POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/content POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/equipment POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/ingredient POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/recipe POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/recipe-cooking POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/recipe-equipment POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/get-signed-url/recipe-ingredients POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/user/ingredient/all POST**

View all ingredients created by the authenticated user.

**/user/ingredient/one POST**

View one ingredient created by the authenticated user.

**/user/ingredient/create POST**

Create a new ingredient by the authenticated user.

**/user/ingredient/update PUT**

Update one ingredient by the authenticated user.

**/user/ingredient/delete DELETE**

Delete one ingredient by the authenticated user.

**/user/plan/all POST**

View all plans created by the authenticated user.

**/user/plan/one POST**

View one plan created by the authenticated user.

**/user/plan/create POST**

Create a new plan by the authenticated user.

**/user/plan/update PUT**

Update one plan by the authenticated user.

**/user/plan/delete DELETE**

Delete one plan by the authenticated user.

**/user/recipe/create POST**

Create a new recipe by the authenticated user.

**/user/recipe/update PUT**

Update one recipe by the authenticated user.

**/user/recipe/delete/private DELETE**

Delete one private recipe by the authenticated user.

**/user/recipe/disown/public DELETE**

Disown one public recipe by the authenticated user.

**/user/recipe/private/all POST**

View all private recipes by the authenticated user.

**/user/recipe/public/all POST**

View all public recipes by the authenticated user.

**/user/recipe/private/one POST**

View one private recipe by the authenticated user.

**/user/recipe/public/one POST**

View one public recipe by the authenticated user.

**/user/recipe/edit/private POST**

Get information necessary to edit a private recipe by the authenticated user.

**/user/recipe/edit/public POST**

Get information necessary to edit a public recipe by the authenticated user.

**/user/saved-recipe POST**

View recipes saved by a user.

**/user/saved-recipe/create POST**

Save one recipe by the authenticated user.

**/user/saved-recipe/delete DELETE**

Unsave one recipe by the authenticated user.

### STAFF

**/staff/auth/login POST**

Attempt to sign the staff in.

**/staff/auth/logout POST**

Sign the staff out.

**staff/content/create POST**

Create a new official content (page or post).

**staff/content/update PUT**

Update one official content (page or post).

**staff/content/delete DELETE**

Delete one official content (page or post).

**staff/cuisine-equipment/create POST**

Add an equipment to the cuisine.

**staff/cuisine-equipment/delete DELETE**

Delete an equipment from the cuisine.

**staff/cuisine-ingredient/create POST**

Add an ingredient to the cuisine.

**staff/cuisine-ingredient/delete DELETE**

Delete an ingredient from the cuisine.

**staff/cuisine-supplier/create POST**

Add a supplier to the cuisine.

**staff/cuisine-supplier/delete DELETE**

Delete a supplier from the cuisine.

**staff/equipment/create POST**

Create a new official equipment.

**staff/equipment/update PUT**

Update one official equipment.

**staff/equipment/delete DELETE**

Delete one official equipment.

**staff/ingredient/create POST**

Create a new official ingredient.

**staff/ingredient/update PUT**

Update one official ingredient.

**staff/ingredient/delete DELETE**

Delete one official ingredient.

**staff/recipe/create POST**

Create a new official recipe.

**staff/recipe/update PUT**

Update one official recipe.

**staff/recipe/delete DELETE**

Delete one official recipe.

**staff/supplier/create POST**

Create a new official supplier.

**staff/supplier/update PUT**

Update one official supplier.

**staff/supplier/delete DELETE**

Delete one official supplier.
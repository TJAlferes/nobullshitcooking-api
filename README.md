![nobsc-logo-large-white](https://user-images.githubusercontent.com/19824877/39939802-090658c8-551d-11e8-9f0c-55872add67b2.png)

[![codecov](https://codecov.io/gh/tjalferes/nobullshitcooking-api/branch/master/graph/badge.svg)](https://codecov.io/gh/tjalferes/nobullshitcooking-api)

# [https://nobullshitcooking.com](https://nobullshitcooking.com/)

> "All civilization is the deoccultization of knowledge."

> "Simplicity is the secret to everything really. The more you add, the more you take away."

## Database Tables
![schema-a](https://github.com/TJAlferes/nobullshitcooking-api/assets/19824877/9b17c72e-84b6-4a44-917e-d9580bf15c4a)
![schema-b](https://github.com/TJAlferes/nobullshitcooking-api/assets/19824877/b59d6e61-916a-40a3-b232-6a986012fe14)

cuisine
equipment
equipment_type
favorite_recipe
friendship
ingredient
ingredient_type
unit
method
plan
recipe
recipe_equipment
recipe_ingredient
recipe_method
recipe_subrecipe
recipe_type
saved_recipe
staff
user

## API Endpoints (Version 1)

**GET /v1/cuisines**

View all cuisines.

**GET /v1/cuisines/:cuisine_id**

View one cuisine by cuisine_id.

**/v1/cuisine-equipment/:id GET**

View the equipment of one cuisine by cuisine id.

**/v1/cuisine-ingredient/:id GET**

View the ingredients of one cuisine by cuisine id.

**/v1/cuisine-supplier/:id GET**

View the suppliers of one cuisine by cuisine id.

**/v1/data-init GET**

View all initial data when first visiting the site.

**/v1/equipment/official/all GET**

View all official equipment.

**/v1/equipment/:id GET**

View one equipment by id.

**/v1/equipment-type GET**

View all equipment types.

**/v1/equipment-type/:id GET**

View one equipment type by id.

**/v1/favorite-recipe GET**

View most favorited. (TO DO: fix this)

**/v1/ingredient/official/all GET**

View all official ingredients.

**/v1/ingredient/:id GET**

View one ingredient by id.

**/v1/ingredient-type GET**

View all ingredient types.

**/v1/ingredient-type/:id GET**

View one ingredient type by id.

**/v1/measurement GET**

View all measurements.

**/v1/measurement/:id GET**

View one measurement by id.

**/v1/method GET**

View all methods.

**/v1/method/:id GET**

View one method by id.

**/v1/profile/:username GET**

View the profile of one user by name.

**/v1/recipe/official/all GET**

View all official recipes.

**/v1/recipe/:id GET**

View the details of one recipe by id.

**/v1/recipe-type GET**

View all recipe types.

**/v1/recipe-type/:id GET**

View one recipe type by id.

**/v1/search/autocomplete/equipment POST**

View equipment search autocompletions.

**/v1/search/autocomplete/ingredients POST**

View ingredients search autocompletions.

**/v1/search/autocomplete/recipes POST**

View recipes search autocompletions.

**/v1/search/find/equipment POST**

View equipment search results.

**/v1/search/find/ingredients POST**

View ingredients search results.

**/v1/search/find/recipes POST**

View recipes search results.

**/v1/supplier GET**

View all official suppliers.

**/v1/supplier/:id GET**

View one supplier by id.

### USER

**/v1/user/auth/register POST**

Create a new user account.

**/v1/user/auth/verify POST**

Verify a user account.

**/v1/user/auth/resend-confirmation-code POST**

Email another confirmation code so the user can verify their account.

**/v1/user/auth/login POST**

Attempt to sign the user in.

**/v1/user/auth/logout POST**

Sign the user out.

**/v1/user/auth/update-account POST**

Update the user account.

**/v1/user/auth/delete-account POST**

Delete the user account.

**/v1/user/content/all POST**

View all content (posts) created by the authenticated user.

**/v1/user/content/one POST**

View one content (posts) created by the authenticated user.

**/v1/user/content/subscribed/all POST**

View all content (posts) from users the authenticated user is subscribed to.

**/v1/user/equipment/all POST**

View all equipment created by the authenticated user.

**/v1/user/equipment/one POST**

View one equipment created by the authenticated user.

**/v1/user/equipment/create POST**

Create a new equipment by the authenticated user.

**/v1/user/equipment/update PUT**

Update one equipment by the authenticated user.

**/v1/user/equipment/delete DELETE**

Delete one equipment by the authenticated user.

**/v1/user/favorite-recipe POST**

View recipes favorited by a user.

**/v1/user/favorite-recipe/create POST**

Favorite one recipe by the authenticated user.

**/v1/user/favorite-recipe/delete DELETE**

Unfavorite one recipe by the authenticated user.

**/v1/user/friendship/ POST**

View all friendships of the authenticated user.

**/v1/user/friendship/create POST**

Create a new pending friendship.

**/v1/user/friendship/accept PUT**

Accept a pending friendship.

**/v1/user/friendship/reject PUT**

Reject a pending friendship.

**/v1/user/friendship/delete DELETE**

Delete a friendship.

**/v1/user/friendship/block POST**

Block a user.

**/v1/user/friendship/unblock DELETE**

Unblock a user.

**/v1/user/get-signed-url/avatar POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/content POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/equipment POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/ingredient POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/recipe POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/recipe-cooking POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/recipe-equipment POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/get-signed-url/recipe-ingredients POST**

Get a signed URL to allow access to upload image to AWS S3 bucket.

**/v1/user/ingredient/all POST**

View all ingredients created by the authenticated user.

**/v1/user/ingredient/one POST**

View one ingredient created by the authenticated user.

**/v1/user/ingredient/create POST**

Create a new ingredient by the authenticated user.

**/v1/user/ingredient/update PUT**

Update one ingredient by the authenticated user.

**/v1/user/ingredient/delete DELETE**

Delete one ingredient by the authenticated user.

**/v1/user/plan/all POST**

View all plans created by the authenticated user.

**/v1/user/plan/one POST**

View one plan created by the authenticated user.

**/v1/user/plan/create POST**

Create a new plan by the authenticated user.

**/v1/user/plan/update PUT**

Update one plan by the authenticated user.

**/v1/user/plan/delete DELETE**

Delete one plan by the authenticated user.

**/v1/user/recipe/create POST**

Create a new recipe by the authenticated user.

**/v1/user/recipe/update PUT**

Update one recipe by the authenticated user.

**/v1/user/recipe/delete/private DELETE**

Delete one private recipe by the authenticated user.

**/v1/user/recipe/disown/public DELETE**

Disown one public recipe by the authenticated user.

**/v1/user/recipe/private/all POST**

View all private recipes by the authenticated user.

**/v1/user/recipe/public/all POST**

View all public recipes by the authenticated user.

**/v1/user/recipe/private/one POST**

View one private recipe by the authenticated user.

**/v1/user/recipe/public/one POST**

View one public recipe by the authenticated user.

**/v1/user/recipe/edit/private POST**

Get information necessary to edit a private recipe by the authenticated user.

**/v1/user/recipe/edit/public POST**

Get information necessary to edit a public recipe by the authenticated user.

**/v1/user/saved-recipe POST**

View recipes saved by a user.

**/v1/user/saved-recipe/create POST**

Save one recipe by the authenticated user.

**/v1/user/saved-recipe/delete DELETE**

Unsave one recipe by the authenticated user.

### STAFF

**/v1/staff/auth/login POST**

Attempt to sign the staff in.

**/v1/staff/auth/logout POST**

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

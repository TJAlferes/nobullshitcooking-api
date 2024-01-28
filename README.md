![nobsc-logo-large-white](https://user-images.githubusercontent.com/19824877/39939802-090658c8-551d-11e8-9f0c-55872add67b2.png)

[![codecov](https://codecov.io/gh/tjalferes/nobullshitcooking-api/branch/master/graph/badge.svg)](https://codecov.io/gh/tjalferes/nobullshitcooking-api)

# Website: [https://nobullshitcooking.com](https://nobullshitcooking.com/)

## Database Tables
![schema-a](https://github.com/TJAlferes/nobullshitcooking-api/assets/19824877/9b17c72e-84b6-4a44-917e-d9580bf15c4a)
![schema-b](https://github.com/TJAlferes/nobullshitcooking-api/assets/19824877/067c9ebe-b499-4155-b38f-a7796e45ef82)

## API Endpoints (Version 1)

**GET /v1/search/auto**

View search autosuggestions.

**GET /v1/search/find**

View search results.

**POST /v1/aws-s3-private-uploads

**GET /v1/cuisines**

View all cuisines.

**GET /v1/cuisines/:cuisine_id**

View one cuisine by cuisine_id.

**/v1/equipment/:id GET**

View one equipment by id.

**/v1/equipment-type GET**

View all equipment types.

**/v1/equipment-type/:id GET**

View one equipment type by id.

**/v1/favorite-recipe GET**

View most favorited.

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

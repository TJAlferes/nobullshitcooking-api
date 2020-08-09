![nobsc-logo-large-white](https://user-images.githubusercontent.com/19824877/39939802-090658c8-551d-11e8-9f0c-55872add67b2.png)

API

GENERAL


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

USER


**/user/auth/register POST**

Create a new user account.


**/user/auth/verify POST**

Verify a user account.


**/user/auth/resend-confirmation-code POST**

Email another confirmation code so the user can verify their account.


**/user/auth/login POST**

Attempt to sign the user in.


**/user/auth/logout POST**

Log the user out.


**/user/auth/update-account POST**

Update the user account.


**/user/auth/delete-account POST**

Delete the user account.


**/user/content/all POST**

View all content created by the user.


**/user/content/one POST**

View one content created by the user.

**/user/content/subscribed/all POST**

View all content from users the user is subscribed to.

/user/

STAFF

/staff
const pool = require('../../lib/connections/mysqlPoolConnection');
const User = require('../../mysql-access/User');
const Recipe = require('../../mysql-access/Recipe');
const FavoriteRecipe = require('../../mysql-access/FavoriteRecipe');

const userProfileController = {
  viewProfile: async function(req, res) {
    const username = req.sanitize(req.params.username);

    const user = new User(pool);
    const userExists = await user.getUserIdByUsername(username);
    const id = userExists[0].user_id;
    const avatar = userExists[0].avatar;
    
    const recipe = new Recipe(pool);
    const publicRecipes = await recipe.viewAllMyPublicUserRecipes(id, id);

    const favoriteRecipe = new FavoriteRecipe(pool);
    const favoriteRecipes = favoriteRecipe.viewMyFavoriteRecipes(id);

    res.send({message: 'Success.', avatar, publicRecipes, favoriteRecipes});
  }
};

module.exports = userProfileController;
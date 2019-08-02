const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const ingredientController = require('../controllers/ingredient');

const router = Router();

// /v1/... ?

// for /ingredient/...

/*
move

router.get(
  '/submit-edit-form',
  catchExceptions(async function(req, res, next) {
    try {
      const sql = `
        SELECT ingredient_id, ingredient_type_id, ingredient_name
        FROM nobsc_ingredients
        ORDER BY ingredient_name ASC
      `;
      const [ rows ] = await pool.execute(sql);
      console.log('rows in ingredient controller: ', rows);
      res.send(rows);
    } catch(err) {
      next(err);
    }
  })
);
*/

router.post(
  '/',
  catchExceptions(ingredientController.viewIngredient)
);

router.get(
  '/:ingredientId',
  catchExceptions(ingredientController.viewIngredientDetail)
);

module.exports = router;
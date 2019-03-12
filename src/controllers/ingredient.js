const pool = require('../data-access/dbPoolConnection');  // move?
const Ingredient = require('../data-access/Ingredient');
const validator = require('../lib/validations/ingredient');

// object versus class?
const ingredientController = {
  viewIngredient: async function(req, res) {  // split into three methods?
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const ingredient = new Ingredient(pool);
      // query all ingredients of checked ingredient types (multiple filters checked on frontend UI)
      if (types.length > 1) {
        let typeIds = [];
        for (i = 0; i < types.length; i++) {
          typeIds.push(types[i]);
        };
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const [ rows ] = await ingredient.viewIngredientsOfTypes(starting, display, placeholders, typeIds);
        const [ rowCount ] = await ingredient.countIngredientsOfTypes(placeholders, typeIds);
        // pagination (up to 25 ingredients per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
      // query all ingredients of checked ingredient type (one filter checked on frontend UI)
      if (types.length == 1) {
        let typeId = `${types}`;  // convert array element to string for SQL query
        const [ rows ] = await ingredient.viewIngredientsOfType(starting, display, typeId);
        const [ rowCount ] = await ingredient.countIngredientsOfType(typeId);
        // pagination (up to 25 ingredients per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
      // query all ingredients (no filtration on frontend UI)
      if (types.length == 0) {
        const [ rows ] = await ingredient.viewAllIngredients(starting, display);
        const [ rowCount ] = await ingredient.countAllIngredients();
        // pagination (up to 25 ingredients per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  viewIngredientDetail: async function(req, res) {
    try {
      const ingredientId = req.params.id;  // sanitize and validate
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.viewIngredientById(ingredientId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  createIngredient: async function(req, res) {
    try {
      const ingredientInfo = req.body.ingredientInfo;  // sanitize and validate
      validator.validate(ingredientInfo);  // implement control flow here
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  updateIngredient: async function(req, res) {
    try {
      const ingredientInfo = req.body.ingredientInfo;  // sanitize and validate
      validator.validate(ingredientInfo);  // implement control flow here
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  deleteIngredient: async function(req, res) {
    try {
      const ingredientId = req.body.ingredientId;  // sanitize and validate
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.deleteIngredient(ingredientId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = ingredientController;



/*// 3. submit new ingredient
router.post('/', async (req, res) => {
  try {
    const { id, name, typeId, image } = req.params;  // sanitize and validate
    const sql = `INSERT INTO nobsc_ingredients
                 (ingredient_id, ingredient_name, ingredient_type_id, ingredient_image)
                 VALUES
                 (?, ?, ?, ?)`;
    const [ rows ] = await pool.execute(sql, [id, name, typeId, image]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});


// 4. edit specific ingredient
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `UPDATE ingredient_id, ingredient_name
                 FROM nobsc_ingredients
                 WHERE ingredient_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});


// 5. delete specific ingredient
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `DELETE ingredient_id, ingredient_name
                 FROM nobsc_ingredients
                 WHERE ingredient_id = ?
                 LIMIT 1`;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});*/

/*
// 6. list all ingredient types
router.get('/types/all', async (req, res) => {
  try {
    const sql = `SELECT ingredient_type_id, ingredient_type_name
                 FROM nobsc_ingredient_types`;
    const [ rows ] = await pool.execute(sql);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});


// 7. list specific ingredient type     (is this one needed?)
router.get('/types/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `SELECT ingredient_type_id, ingredient_type_name
                 FROM nobsc_ingredient_types
                 WHERE ingredient_type_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
*/
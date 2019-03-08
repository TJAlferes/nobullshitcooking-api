const pool = require('../data-access/dbPoolConnection');  // move?
const Recipe = require('../data-access/Recipe');

// object versus class?
const recipeController = {
  viewRecipe: async function(req, res) {  // split into three methods?
    try {

      const recipe = new Recipe(pool);

    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  viewRecipeDetail: async function(req, res) {
    try {
      const recipeId = req.params.id;  // sanitize and validate
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.viewRecipeById(recipeId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = recipeController;



/*
// 1. list all recipes
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
    `;
    const [ rows ] = await pool.execute(sql);
    res.send(rows);  // res.json(rows) instead?
  } catch(err) {
    console.log(err);
  }
});

// 2. list specific recipe
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_id = ?
    `;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});

// 3. submit new recipe
router.post('/', async (req, res) => {
  try {
    const {
      id,
      name,
      typeId,
      image,
      equipmentImage,
      ingredientsImage,
      cookingImage
    } = req.body;  // sanitize and validate
    const sql = `
      INSERT INTO nobsc_recipes (
        recipe_id,
        recipe_name,
        recipe_type_id,
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      )
      VALUES (
        ?,
        ?,
        ?,
        ?
      )
    `;
    await pool.execute(
      sql,
      [id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage]
    );
    res.status(201).json({
      message: 'Recipe submitted',
      id,
      name,
      typeId,
      image,
      equipmentImage,
      ingredientsImage,
      cookingImage
    });
  } catch(err) {
    console.log(err);
  }
});

// 4. edit specific recipe
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `UPDATE recipe_id, recipe_name
                 FROM nobsc_recipes
                 WHERE recipe_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);

    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

// 5. delete specific recipe
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `DELETE recipe_id, recipe_name
                 FROM nobsc_recipes
                 WHERE recipe_id = ?
                 LIMIT 1`;
    const [ rows ] = await pool.execute(sql, [id]);

    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

// 6. list all recipe types
router.get('/types/all', async (req, res) => {
  try {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
    `;
    const [ rows ] = await pool.execute(sql);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});

// 7. list specific recipe type     (is this one needed?)
router.get('/types/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
      WHERE recipe_type_id = ?
    `;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});

//8. list all recipes of specified type(s)     (this is the most important one)
//     >>>>>     here, either make the route '/recipes-by-type/:id' or read query
//     >>>>>     add logic for determining and querying any give number types simultaeneously
router.get('/by-type/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
    `;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
*/
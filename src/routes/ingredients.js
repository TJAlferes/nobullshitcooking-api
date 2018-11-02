const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

const pool = (process.env.NODE_ENV === 'production') ? (
  mysql.createPool({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    queueLimit: process.env.DB_QUEUE_LIMIT
  })
) : (
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    queueLimit: process.env.DB_QUEUE_LIMIT
  })
);


// 1. list ingredients
router.post('/', async (req, res) => {
  try {
    const types = (req.body.types) ? req.body.types : [];
    const starting = (req.body.start) ? req.body.start : 0;
    const display = 25;

    // query all ingredients of checked ingredient types (multiple filters checked on frontend UI)
    if (types.length > 1) {
      let ids = [];
      for (i = 0; i < types.length; i++) {
        ids.push(types[i]);
      };
      const placeholders = '?, '.repeat(types.length - 1) + '?';
      let queryIngredients = `
        SELECT
          ingredient_id,
          ingredient_name,
          ingredient_type_id,
          ingredient_image
        FROM nobsc_ingredients
        WHERE ingredient_type_id IN (${placeholders})
        ORDER BY ingredient_name ASC
        LIMIT ${starting}, ${display}
      `;
      const [ rows ] = await pool.execute(queryIngredients, ids);
      let countIngredients = `
        SELECT COUNT(*) AS total
        FROM nobsc_ingredients
        WHERE ingredient_type_id IN (${placeholders})
      `;
      const [ rowCount ] = await pool.execute(countIngredients, ids);
      // pagination (up to 25 ingredients per page)
      let total = rowCount[0].total;
      let pages = (total > display) ? Math.ceil(total / display) : 1;
      let resObj = {rows, pages, starting};
      res.send(resObj);
    }
  
    // query all ingredients of checked ingredient type (one filter checked on frontend UI)
    if (types.length == 1) {
      let id = `${types}`;  // convert array element to string for SQL query
      let queryIngredients = `
        SELECT
          ingredient_id,
          ingredient_name,
          ingredient_type_id,
          ingredient_image
        FROM nobsc_ingredients
        WHERE ingredient_type_id = ?
        ORDER BY ingredient_name ASC
        LIMIT ${starting}, ${display}
      `;
      const [ rows ] = await pool.execute(queryIngredients, [id]);
      let countIngredients = `
        SELECT COUNT(*) AS total
        FROM nobsc_ingredients
        WHERE ingredient_type_id = ?
      `;
      const [ rowCount ] = await pool.execute(countIngredients, [id]);
      // pagination (up to 25 ingredients per page)
      let total = rowCount[0].total;
      let pages = (total > display) ? Math.ceil(total / display) : 1;
      let resObj = {rows, pages, starting};
      res.send(resObj);
    }
  
    // query all ingredients (no filtration on frontend UI)
    if (types.length == 0) {
      let queryIngredients = `
        SELECT
          ingredient_id,
          ingredient_name,
          ingredient_type_id,
          ingredient_image
        FROM nobsc_ingredients
        ORDER BY ingredient_name ASC
        LIMIT ${starting}, ${display}
      `;
      const [ rows ] = await pool.execute(queryIngredients);
      let countIngredients = "SELECT COUNT(*) AS total FROM nobsc_ingredients";
      const [ rowCount ] = await pool.execute(countIngredients);
      // pagination (up to 25 ingredients per page)
      let total = rowCount[0].total;
      let pages = (total > display) ? Math.ceil(total / display) : 1;
      let resObj = {rows, pages, starting};
      res.send(resObj);
    }
  } catch(err) {
    console.log(err);
  }
});


// 2. list specific ingredient
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        i.ingredient_name AS ingredient_name,
        i.ingredient_type_id AS ingredient_type,
        i.ingredient_image AS ingredient_image,
        t.ingredient_type_name AS ingredient_type_name
      FROM nobsc_ingredient_types t
      LEFT JOIN nobsc_ingredients i ON i.ingredient_type_id = t.ingredient_type_id
      WHERE ingredient_id = ?
    `;
    const [ row ] = await pool.execute(sql, [id]);
    res.send(row);
  } catch(err) {
    console.log(err);
  }
});


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
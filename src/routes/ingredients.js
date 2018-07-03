const express = require('express');
const router = express.Router();


const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  //host: process.env.DB_HOST,
  //user: process.env.DB_USER,
  //password: process.env.DB_PASSWORD,
  //database: process.env.DB_DATABASE,
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
});


// 1. list all ingredients
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
                 FROM nobsc_ingredients`;
    const [ rows ] = await pool.execute(sql);

    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});


// 2. list specific ingredient
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
                 FROM nobsc_ingredients
                 WHERE ingredient_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

/*
// 3. submit new ingredient
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
});
*/

// 6. list all ingredient types
router.get('/types', async (req, res) => {
  try {
    const sql = `SELECT ingredient_type_id, ingredient_type_name
                 FROM nobsc_ingredient_types`;
    const [ rows ] = await pool.execute(sql);
    console.log(rows);
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


//8. list all ingredients of specified type(s)     (this is the most important one)
//     >>>>>     here, either make the route '/ingredients-by-type/:id' or read query
//     >>>>>     add logic for determining and querying any give number types simultaeneously
router.get('/by-type/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
                 FROM nobsc_ingredients
                 WHERE ingredient_type_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
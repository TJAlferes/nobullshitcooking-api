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


// 1. list all equipment
router.post('/', async (req, res) => {
  try {
    const types = (req.body.types) ? req.body.types : [];
    const starting = (req.body.start) ? req.body.start : 0;
    const display = 25;

    // query all equipment of checked equipment types (multiple filters checked on frontend UI)
    if (types.length > 1) {
      let ids = [];
      for (i = 0; i < types.length; i++) {
        ids.push(types[i]);
      };
      const placeholders = '?, '.repeat(types.length - 1) + '?';
      let queryEquipment = `
        SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
        FROM nobsc_equipment
        WHERE equipment_type_id IN (${placeholders})
        ORDER BY equipment_name ASC
        LIMIT ${starting}, ${display}
      `;
      const [ rows ] = await pool.execute(queryEquipment, ids);
      let countEquipment = `SELECT COUNT(*) AS total FROM nobsc_equipment WHERE equipment_type_id IN (${placeholders})`;
      const [ rowCount ] = await pool.execute(countEquipment, ids);
      // pagination (up to 25 equipments per page)
      let total = rowCount[0].total;
      let pages = (total > display) ? Math.ceil(total / display) : 1;
      let resObj = {rows, pages, starting};
      res.send(resObj);
    }
  
    // query all equipments of checked equipment type (one filter checked on frontend UI)
    if (types.length == 1) {
      let id = `${types}`;  // convert array element to string for SQL query
      let queryEquipment = `
        SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
        FROM nobsc_equipment
        WHERE equipment_type_id = ?
        ORDER BY equipment_name ASC
        LIMIT ${starting}, ${display}
      `;
      const [ rows ] = await pool.execute(queryEquipment, [id]);
      let countEquipment = 'SELECT COUNT(*) AS total FROM nobsc_equipment WHERE equipment_type_id = ?';
      const [ rowCount ] = await pool.execute(countEquipment, [id]);
      // pagination (up to 25 equipments per page)
      let total = rowCount[0].total;
      let pages = (total > display) ? Math.ceil(total / display) : 1;
      let resObj = {rows, pages, starting};
      res.send(resObj);
    }
  
    // query all equipments (no filtration on frontend UI)
    if (types.length == 0) {
      let queryEquipment = `
        SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
        FROM nobsc_equipment
        ORDER BY equipment_name ASC
        LIMIT ${starting}, ${display}
      `;
      const [ rows ] = await pool.execute(queryEquipment);
      let countEquipment = "SELECT COUNT(*) AS total FROM nobsc_equipment";
      const [ rowCount ] = await pool.execute(countEquipment);
      // pagination (up to 25 equipments per page)
      let total = rowCount[0].total;
      let pages = (total > display) ? Math.ceil(total / display) : 1;
      let resObj = {rows, pages, starting};
      res.send(resObj);
    }
    /*const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
    `;
    const [ rows ] = await pool.execute(sql);
    res.send(rows);*/
  } catch(err) {
    console.log(err);
  }
});


// 2. list specific equipment
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_name AS equipment_name,
        e.equipment_type_id AS equipment_type_id,
        e.equipment_image AS equipment_image,
        t.equipment_type_name AS equipment_type_name
      FROM nobsc_equipment_types t
      LEFT JOIN nobsc_equipment e ON e.equipment_type_id = t.equipment_type_id
      WHERE equipment_id = ?
    `;
    const [ rows ] = await pool.execute(sql, [id]);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});


/*// 3. submit new equipment
router.post('/', async (req, res) => {
  try {
    const { id, name, typeId, image } = req.params;  // sanitize and validate
    const sql = `INSERT INTO nobsc_equipment
                 (equipment_id, equipment_name, equipment_type_id, equipment_image)
                 VALUES
                 (?, ?, ?, ?)`;
    const [ rows ] = await pool.execute(sql, [id, name, typeId, image]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});


// 4. edit specific equipment
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `UPDATE equipment_id, equipment_name
                 FROM nobsc_equipment
                 WHERE equipment_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);

    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});


// 5. delete specific equipment
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `DELETE equipment_id, equipment_name
                 FROM nobsc_equipment
                 WHERE equipment_id = ?
                 LIMIT 1`;
    const [ rows ] = await pool.execute(sql, [id]);

    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});*/


// 6. list all equipment types
router.get('/types/all', async (req, res) => {
  try {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
    `;
    const [ rows ] = await pool.execute(sql);
    res.send(rows);
  } catch(err) {
    console.log(err);
  }
});


// 7. list specific equipment type     (is this one needed?)
router.get('/types/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `SELECT equipment_type_id, equipment_type_name
                 FROM nobsc_equipment_types
                 WHERE equipment_type_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});


//8. list all equipment of specified type(s)     (this is the most important one)
//     >>>>>     here, either make the route '/equipment-by-type/:id' or read query
//     >>>>>     add logic for determining and querying any give number types simultaeneously
router.get('/by-type/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
                 FROM nobsc_equipment
                 WHERE equipment_type_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
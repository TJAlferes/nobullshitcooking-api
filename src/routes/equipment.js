const express = require('express');
const router = express.Router();

// 1. list all equipment
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
                 FROM nobsc_equipment`;
    const [ rows ] = await pool.execute(sql);

    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});


// 2. list specific equipment
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;  // sanitize and validate
    const sql = `SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
                 FROM nobsc_equipment
                 WHERE equipment_id = ?`;
    const [ rows ] = await pool.execute(sql, [id]);
  
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

/*
// 3. submit new equipment
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
});
*/

// 6. list all equipment types
router.get('/types', async (req, res) => {
  try {
    const sql = `SELECT equipment_type_id, equipment_type_name
                 FROM nobsc_equipment_types`;
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
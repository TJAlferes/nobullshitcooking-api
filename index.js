// move this file into one folder down?
//import express from 'express';
//import mysql from 'mysql2/promise';
//require('babel-polyfill');

//require('dotenv').config();

const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
//const hpp = require('hpp');

const express = require('express');
const mysql = require('mysql2/promise');


const app = express();

const pool = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  port: process.env.RDS_PORT
});


app.use(compression());
app.use(cors());
app.use(helmet());
//app.use(hpp());





/*
// >>>>>>>>>>>>>>>>>>>> start pagination logic
// set number of ingredients to list per page
let display = 25;



if (!checkedTypes) {
	const checkedTypes = [];
	const sql = 'SELECT ingredient_type_id FROM nobsc_ingredient_types';
  const [ rows ] = await pool.execute(sql);
  
  rows.map(row => {
    if (req.params.itid + row) {
      checkedTypes.push(row);
    }
  });
}

const checkedTypesList = checkedTypes.join(', ');



// determine how many total pages of ingredients there are without and with filters
if (req.param.p && typeof req.param.p === 'number') {
	const pages = req.param.p;
} else {
	// count ingredients, by selected type(s) if any
	if (checkedTypes.length > 1) {
    const included = '?, '.repeat(checkedTypes.length) + '?';
    const sql = 'SELECT COUNT(*) FROM nobsc_ingredients WHERE ingredient_type_id IN (' . included . ')';
    const [ rows ] = await pool.execute(sql, [included]);

		$stmt = $conn->prepare($sql);
		$stmt->execute($checkedTypes);
		$records = $stmt->fetchColumn();
		
	} else if (checkedTypes.length == 1) {
    const sql = 'SELECT COUNT(*) FROM nobsc_ingredients WHERE ingredient_type_id = ?';
    const [ rows ] = await pool.execute(sql, [checkedTypes]);

		$stmt = $conn->prepare($sql);
		$stmt->execute($checkedTypes);
		$records = $stmt->fetchColumn();
		
	} else if (checkedTypes.length == 0) {
		const sql = "SELECT COUNT(*) FROM nobsc_ingredients";
    const [ rows ] = await pool.execute(sql);
    
		$records = $stmt->fetchColumn();
	}
  
  let pages;
	if (rows > display) {
		pages = Math.ceil(rows / display);
	} else {
		pages = 1;
	}
}



let start;
if (req.param.s && typeof req.param.s === 'number') {
	start = req.param.s;
} else {
	start = 0;
}
// >>>>>>>>>>>>>>>>>>>> end pagination logic
*/




/*
// 0. main
app.get('/', (req, res) => {
  try {
    const message = "No Bullshit Cooking Backend API";
  
    res.send(message);

  } catch(err) {
    console.log(err);
  }
});
*/

// 1. list all ingredients
app.get('/', async (req, res) => {
  try {
    const sql = `SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
                 FROM nobsc_ingredients`;
    await pool.connect();
    const [ rows ] = await pool.execute(sql);
    await pool.end();
    res.send(rows);

  } catch(err) {
    console.log(err);
  }
});

/*
// 2. list specific ingredient
app.get('/ingredients/:id', async (req, res) => {
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


// 3. submit new ingredient
app.post('/ingredients/', async (req, res) => {
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
app.put('/ingredients/:id', async (req, res) => {
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
app.delete('/ingredients/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log('Listening on port ' + PORT));
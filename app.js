// move this file into one folder down?
//import express from 'express';
//import mysql from 'mysql2/promise';
require('babel-polyfill');

require('dotenv').config();

const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
//const hpp = require('hpp');

const express = require('express');
const mysql = require('mysql2/promise');


const app = express();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
});


app.use(compression());
app.use(cors());
app.use(helmet());
//app.use(hpp());


// 0. main
app.get('/', async (req, res) => {
  try {
    const message = "No Bullshit Cooking Backend API";
  
    res.send(message);

  } catch(err) {
    console.log(err);
  }
});


// 1. list all ingredients
app.get('/ingredients', async (req, res) => {
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

/*
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

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// move this file into one folder down?
//import express from 'express';
//import mysql from 'mysql2/promise';
require('babel-polyfill');

require('dotenv').config();

var compression = require('compression');
var cors = require('cors');
var helmet = require('helmet');
//const hpp = require('hpp');

var express = require('express');
var mysql = require('mysql2/promise');

var app = express();

var pool = mysql.createPool({
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

// 0. main
app.get('/', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var message;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              message = "No Bullshit Cooking Backend API";


              res.send(message);
            } catch (err) {
              console.log(err);
            }

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// 1. list all ingredients
app.get('/ingredients', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var sql, _ref3, _ref4, rows;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            sql = 'SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\n                 FROM nobsc_ingredients';
            _context2.next = 4;
            return pool.execute(sql);

          case 4:
            _ref3 = _context2.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            rows = _ref4[0];


            res.send(rows);

            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 10]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// 2. list specific ingredient
app.get('/ingredients/:id', function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var id, sql, _ref6, _ref7, rows;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = req.params.id; // sanitize and validate

            sql = 'SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\n                 FROM nobsc_ingredients\n                 WHERE ingredient_id = ?';
            _context3.next = 5;
            return pool.execute(sql, [id]);

          case 5:
            _ref6 = _context3.sent;
            _ref7 = _slicedToArray(_ref6, 1);
            rows = _ref7[0];


            res.send(rows);

            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 11]]);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}());

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

var PORT = process.env.PORT || 3003;

app.listen(PORT, function () {
  return console.log('Listening on port ' + PORT);
});

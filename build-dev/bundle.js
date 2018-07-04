/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n//require('babel-polyfill');  // pollutes globals?\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar express = __webpack_require__(/*! express */ \"express\");\nvar mysql = __webpack_require__(/*! mysql2/promise */ \"mysql2/promise\");\n\nvar compression = __webpack_require__(/*! compression */ \"compression\");\nvar cors = __webpack_require__(/*! cors */ \"cors\");\nvar helmet = __webpack_require__(/*! helmet */ \"helmet\");\n//const hpp = require('hpp');\n//const morgan = require('morgan');\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nvar equipment = __webpack_require__(/*! ./routes/equipment */ \"./src/routes/equipment.js\");\nvar ingredients = __webpack_require__(/*! ./routes/ingredients */ \"./src/routes/ingredients.js\");\nvar recipes = __webpack_require__(/*! ./routes/recipes */ \"./src/routes/recipes.js\");\n\nvar app = express();\n\nvar pool =  false ? undefined : mysql.createPool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_DATABASE,\n  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,\n  connectionLimit: process.env.DB_CONNECTION_LIMIT,\n  queueLimit: process.env.DB_QUEUE_LIMIT\n});\n\n// First, set up third-party middleware\napp.use(compression());\napp.use(cors());\napp.use(helmet());\n//app.use(hpp());\n//app.use(morgan());\napp.use(bodyParser.urlencoded({ extended: false }));\napp.use(bodyParser.json()); // or new built-in middleware: app.use(express.json())\n// or\n//const urlencodedParser = bodyParser.urlencoded({extended: false});\n//const jsonParser = bodyParser.json();\n// and manually apply them as second argument to route methods\n\n// Then, define all our routes\n// 0. main\napp.get('/', function (req, res) {\n  try {\n    var message = \"No Bullshit Cooking Backend API\";\n\n    res.send(message);\n  } catch (err) {\n    console.log(err);\n  }\n});\n\napp.use('/equipment', equipment);\napp.use('/ingredients', ingredients);\napp.use('/recipes', recipes);\n/*\r\nif (process.env.NODE_ENV === 'production') {\r\n\r\n}\r\n*/\n\n// Lastly, handle errors\napp.use(function (req, res, next) {\n  var error = new Error('Not found');\n  error.status = 404;\n  next(error);\n});\n\napp.use(function (error, req, res, next) {\n  res.status(error.status || 500);\n  res.json({\n    error: {\n      message: error.message\n    }\n  });\n});\n\nvar PORT = process.env.PORT || 3003;\n\napp.listen(PORT, function () {\n  return console.log('Listening on port ' + PORT);\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/routes/equipment.js":
/*!*********************************!*\
  !*** ./src/routes/equipment.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ \"babel-runtime/regenerator\");\n\nvar _regenerator2 = _interopRequireDefault(_regenerator);\n\nvar _slicedToArray2 = __webpack_require__(/*! babel-runtime/helpers/slicedToArray */ \"babel-runtime/helpers/slicedToArray\");\n\nvar _slicedToArray3 = _interopRequireDefault(_slicedToArray2);\n\nvar _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ \"babel-runtime/helpers/asyncToGenerator\");\n\nvar _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar express = __webpack_require__(/*! express */ \"express\");\nvar router = express.Router();\n\n// 1. list all equipment\nrouter.get('/', function () {\n  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {\n    var sql, _ref2, _ref3, rows;\n\n    return _regenerator2.default.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.prev = 0;\n            sql = 'SELECT equipment_id, equipment_name, equipment_type_id, equipment_image\\n                 FROM nobsc_equipment';\n            _context.next = 4;\n            return pool.execute(sql);\n\n          case 4:\n            _ref2 = _context.sent;\n            _ref3 = (0, _slicedToArray3.default)(_ref2, 1);\n            rows = _ref3[0];\n\n\n            res.send(rows);\n\n            _context.next = 13;\n            break;\n\n          case 10:\n            _context.prev = 10;\n            _context.t0 = _context['catch'](0);\n\n            console.log(_context.t0);\n\n          case 13:\n          case 'end':\n            return _context.stop();\n        }\n      }\n    }, _callee, undefined, [[0, 10]]);\n  }));\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}());\n\n// 2. list specific equipment\nrouter.get('/:id', function () {\n  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {\n    var id, sql, _ref5, _ref6, rows;\n\n    return _regenerator2.default.wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _context2.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT equipment_id, equipment_name, equipment_type_id, equipment_image\\n                 FROM nobsc_equipment\\n                 WHERE equipment_id = ?';\n            _context2.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref5 = _context2.sent;\n            _ref6 = (0, _slicedToArray3.default)(_ref5, 1);\n            rows = _ref6[0];\n\n\n            res.send(rows);\n\n            _context2.next = 14;\n            break;\n\n          case 11:\n            _context2.prev = 11;\n            _context2.t0 = _context2['catch'](0);\n\n            console.log(_context2.t0);\n\n          case 14:\n          case 'end':\n            return _context2.stop();\n        }\n      }\n    }, _callee2, undefined, [[0, 11]]);\n  }));\n\n  return function (_x3, _x4) {\n    return _ref4.apply(this, arguments);\n  };\n}());\n\n/*\r\n// 3. submit new equipment\r\nrouter.post('/', async (req, res) => {\r\n  try {\r\n    const { id, name, typeId, image } = req.params;  // sanitize and validate\r\n    const sql = `INSERT INTO nobsc_equipment\r\n                 (equipment_id, equipment_name, equipment_type_id, equipment_image)\r\n                 VALUES\r\n                 (?, ?, ?, ?)`;\r\n    const [ rows ] = await pool.execute(sql, [id, name, typeId, image]);\r\n  \r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n\r\n\r\n// 4. edit specific equipment\r\nrouter.put('/:id', async (req, res) => {\r\n  try {\r\n    const id = req.params.id;  // sanitize and validate\r\n    const sql = `UPDATE equipment_id, equipment_name\r\n                 FROM nobsc_equipment\r\n                 WHERE equipment_id = ?`;\r\n    const [ rows ] = await pool.execute(sql, [id]);\r\n\r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n\r\n\r\n// 5. delete specific equipment\r\nrouter.delete('/:id', async (req, res) => {\r\n  try {\r\n    const id = req.params.id;  // sanitize and validate\r\n    const sql = `DELETE equipment_id, equipment_name\r\n                 FROM nobsc_equipment\r\n                 WHERE equipment_id = ?\r\n                 LIMIT 1`;\r\n    const [ rows ] = await pool.execute(sql, [id]);\r\n\r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n*/\n\n// 6. list all equipment types\nrouter.get('/types', function () {\n  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {\n    var sql, _ref8, _ref9, rows;\n\n    return _regenerator2.default.wrap(function _callee3$(_context3) {\n      while (1) {\n        switch (_context3.prev = _context3.next) {\n          case 0:\n            _context3.prev = 0;\n            sql = 'SELECT equipment_type_id, equipment_type_name\\n                 FROM nobsc_equipment_types';\n            _context3.next = 4;\n            return pool.execute(sql);\n\n          case 4:\n            _ref8 = _context3.sent;\n            _ref9 = (0, _slicedToArray3.default)(_ref8, 1);\n            rows = _ref9[0];\n\n\n            res.send(rows);\n\n            _context3.next = 13;\n            break;\n\n          case 10:\n            _context3.prev = 10;\n            _context3.t0 = _context3['catch'](0);\n\n            console.log(_context3.t0);\n\n          case 13:\n          case 'end':\n            return _context3.stop();\n        }\n      }\n    }, _callee3, undefined, [[0, 10]]);\n  }));\n\n  return function (_x5, _x6) {\n    return _ref7.apply(this, arguments);\n  };\n}());\n\n// 7. list specific equipment type     (is this one needed?)\nrouter.get('/types/:id', function () {\n  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {\n    var id, sql, _ref11, _ref12, rows;\n\n    return _regenerator2.default.wrap(function _callee4$(_context4) {\n      while (1) {\n        switch (_context4.prev = _context4.next) {\n          case 0:\n            _context4.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT equipment_type_id, equipment_type_name\\n                 FROM nobsc_equipment_types\\n                 WHERE equipment_type_id = ?';\n            _context4.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref11 = _context4.sent;\n            _ref12 = (0, _slicedToArray3.default)(_ref11, 1);\n            rows = _ref12[0];\n\n\n            res.send(rows);\n\n            _context4.next = 14;\n            break;\n\n          case 11:\n            _context4.prev = 11;\n            _context4.t0 = _context4['catch'](0);\n\n            console.log(_context4.t0);\n\n          case 14:\n          case 'end':\n            return _context4.stop();\n        }\n      }\n    }, _callee4, undefined, [[0, 11]]);\n  }));\n\n  return function (_x7, _x8) {\n    return _ref10.apply(this, arguments);\n  };\n}());\n\n//8. list all equipment of specified type(s)     (this is the most important one)\n//     >>>>>     here, either make the route '/equipment-by-type/:id' or read query\n//     >>>>>     add logic for determining and querying any give number types simultaeneously\nrouter.get('/by-type/:id', function () {\n  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {\n    var id, sql, _ref14, _ref15, rows;\n\n    return _regenerator2.default.wrap(function _callee5$(_context5) {\n      while (1) {\n        switch (_context5.prev = _context5.next) {\n          case 0:\n            _context5.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT equipment_id, equipment_name, equipment_type_id, equipment_image\\n                 FROM nobsc_equipment\\n                 WHERE equipment_type_id = ?';\n            _context5.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref14 = _context5.sent;\n            _ref15 = (0, _slicedToArray3.default)(_ref14, 1);\n            rows = _ref15[0];\n\n\n            res.send(rows);\n\n            _context5.next = 14;\n            break;\n\n          case 11:\n            _context5.prev = 11;\n            _context5.t0 = _context5['catch'](0);\n\n            console.log(_context5.t0);\n\n          case 14:\n          case 'end':\n            return _context5.stop();\n        }\n      }\n    }, _callee5, undefined, [[0, 11]]);\n  }));\n\n  return function (_x9, _x10) {\n    return _ref13.apply(this, arguments);\n  };\n}());\n\nmodule.exports = router;\n\n//# sourceURL=webpack:///./src/routes/equipment.js?");

/***/ }),

/***/ "./src/routes/ingredients.js":
/*!***********************************!*\
  !*** ./src/routes/ingredients.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ \"babel-runtime/regenerator\");\n\nvar _regenerator2 = _interopRequireDefault(_regenerator);\n\nvar _slicedToArray2 = __webpack_require__(/*! babel-runtime/helpers/slicedToArray */ \"babel-runtime/helpers/slicedToArray\");\n\nvar _slicedToArray3 = _interopRequireDefault(_slicedToArray2);\n\nvar _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ \"babel-runtime/helpers/asyncToGenerator\");\n\nvar _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar express = __webpack_require__(/*! express */ \"express\");\nvar mysql = __webpack_require__(/*! mysql2/promise */ \"mysql2/promise\");\n\nvar router = express.Router();\n\nvar pool =  false ? undefined : mysql.createPool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_DATABASE,\n  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,\n  connectionLimit: process.env.DB_CONNECTION_LIMIT,\n  queueLimit: process.env.DB_QUEUE_LIMIT\n});\n\n// 1. list all ingredients\nrouter.get('/', function () {\n  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {\n    var sql, _ref2, _ref3, rows;\n\n    return _regenerator2.default.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.prev = 0;\n            sql = 'SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\\n                 FROM nobsc_ingredients';\n            _context.next = 4;\n            return pool.execute(sql);\n\n          case 4:\n            _ref2 = _context.sent;\n            _ref3 = (0, _slicedToArray3.default)(_ref2, 1);\n            rows = _ref3[0];\n\n\n            res.send(rows);\n\n            _context.next = 13;\n            break;\n\n          case 10:\n            _context.prev = 10;\n            _context.t0 = _context['catch'](0);\n\n            console.log(_context.t0);\n\n          case 13:\n          case 'end':\n            return _context.stop();\n        }\n      }\n    }, _callee, undefined, [[0, 10]]);\n  }));\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}());\n\n// 2. list specific ingredient\nrouter.get('/:id', function () {\n  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {\n    var id, sql, _ref5, _ref6, rows;\n\n    return _regenerator2.default.wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _context2.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\\n                 FROM nobsc_ingredients\\n                 WHERE ingredient_id = ?';\n            _context2.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref5 = _context2.sent;\n            _ref6 = (0, _slicedToArray3.default)(_ref5, 1);\n            rows = _ref6[0];\n\n\n            res.send(rows);\n\n            _context2.next = 14;\n            break;\n\n          case 11:\n            _context2.prev = 11;\n            _context2.t0 = _context2['catch'](0);\n\n            console.log(_context2.t0);\n\n          case 14:\n          case 'end':\n            return _context2.stop();\n        }\n      }\n    }, _callee2, undefined, [[0, 11]]);\n  }));\n\n  return function (_x3, _x4) {\n    return _ref4.apply(this, arguments);\n  };\n}());\n\n/*\r\n// 3. submit new ingredient\r\nrouter.post('/', async (req, res) => {\r\n  try {\r\n    const { id, name, typeId, image } = req.params;  // sanitize and validate\r\n    const sql = `INSERT INTO nobsc_ingredients\r\n                 (ingredient_id, ingredient_name, ingredient_type_id, ingredient_image)\r\n                 VALUES\r\n                 (?, ?, ?, ?)`;\r\n    const [ rows ] = await pool.execute(sql, [id, name, typeId, image]);\r\n  \r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n\r\n\r\n// 4. edit specific ingredient\r\nrouter.put('/:id', async (req, res) => {\r\n  try {\r\n    const id = req.params.id;  // sanitize and validate\r\n    const sql = `UPDATE ingredient_id, ingredient_name\r\n                 FROM nobsc_ingredients\r\n                 WHERE ingredient_id = ?`;\r\n    const [ rows ] = await pool.execute(sql, [id]);\r\n\r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n\r\n\r\n// 5. delete specific ingredient\r\nrouter.delete('/:id', async (req, res) => {\r\n  try {\r\n    const id = req.params.id;  // sanitize and validate\r\n    const sql = `DELETE ingredient_id, ingredient_name\r\n                 FROM nobsc_ingredients\r\n                 WHERE ingredient_id = ?\r\n                 LIMIT 1`;\r\n    const [ rows ] = await pool.execute(sql, [id]);\r\n\r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n*/\n\n// 6. list all ingredient types\nrouter.get('/types/all', function () {\n  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {\n    var sql, _ref8, _ref9, rows;\n\n    return _regenerator2.default.wrap(function _callee3$(_context3) {\n      while (1) {\n        switch (_context3.prev = _context3.next) {\n          case 0:\n            _context3.prev = 0;\n            sql = 'SELECT ingredient_type_id, ingredient_type_name\\n                 FROM nobsc_ingredient_types';\n            _context3.next = 4;\n            return pool.execute(sql);\n\n          case 4:\n            _ref8 = _context3.sent;\n            _ref9 = (0, _slicedToArray3.default)(_ref8, 1);\n            rows = _ref9[0];\n\n\n            res.send(rows);\n\n            _context3.next = 13;\n            break;\n\n          case 10:\n            _context3.prev = 10;\n            _context3.t0 = _context3['catch'](0);\n\n            console.log(_context3.t0);\n\n          case 13:\n          case 'end':\n            return _context3.stop();\n        }\n      }\n    }, _callee3, undefined, [[0, 10]]);\n  }));\n\n  return function (_x5, _x6) {\n    return _ref7.apply(this, arguments);\n  };\n}());\n\n// 7. list specific ingredient type     (is this one needed?)\nrouter.get('/types/:id', function () {\n  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {\n    var id, sql, _ref11, _ref12, rows;\n\n    return _regenerator2.default.wrap(function _callee4$(_context4) {\n      while (1) {\n        switch (_context4.prev = _context4.next) {\n          case 0:\n            _context4.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT ingredient_type_id, ingredient_type_name\\n                 FROM nobsc_ingredient_types\\n                 WHERE ingredient_type_id = ?';\n            _context4.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref11 = _context4.sent;\n            _ref12 = (0, _slicedToArray3.default)(_ref11, 1);\n            rows = _ref12[0];\n\n\n            res.send(rows);\n\n            _context4.next = 14;\n            break;\n\n          case 11:\n            _context4.prev = 11;\n            _context4.t0 = _context4['catch'](0);\n\n            console.log(_context4.t0);\n\n          case 14:\n          case 'end':\n            return _context4.stop();\n        }\n      }\n    }, _callee4, undefined, [[0, 11]]);\n  }));\n\n  return function (_x7, _x8) {\n    return _ref10.apply(this, arguments);\n  };\n}());\n\n// 8. list all ingredients of specified type (user checks ONE type)\nrouter.get('/by-type/:id', function () {\n  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {\n    var id, sql, _ref14, _ref15, rows;\n\n    return _regenerator2.default.wrap(function _callee5$(_context5) {\n      while (1) {\n        switch (_context5.prev = _context5.next) {\n          case 0:\n            _context5.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\\n                 FROM nobsc_ingredients\\n                 WHERE ingredient_type_id = ?';\n            _context5.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref14 = _context5.sent;\n            _ref15 = (0, _slicedToArray3.default)(_ref14, 1);\n            rows = _ref15[0];\n\n\n            res.send(rows);\n\n            _context5.next = 14;\n            break;\n\n          case 11:\n            _context5.prev = 11;\n            _context5.t0 = _context5['catch'](0);\n\n            console.log(_context5.t0);\n\n          case 14:\n          case 'end':\n            return _context5.stop();\n        }\n      }\n    }, _callee5, undefined, [[0, 11]]);\n  }));\n\n  return function (_x9, _x10) {\n    return _ref13.apply(this, arguments);\n  };\n}());\n\n// 9. list all ingredients of specified types (user checks multiple types)\nrouter.post('/of-types', function () {\n  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {\n    var types, placeholders;\n    return _regenerator2.default.wrap(function _callee6$(_context6) {\n      while (1) {\n        switch (_context6.prev = _context6.next) {\n          case 0:\n            try {\n              types = req.body; // sanitize and validate\n\n              console.log('Types: ' + types);\n              //let ids = types.join(', ');\n              placeholders = '';\n              /*\r\n              types.forEach(type => {\r\n                placeholders += '?,'\r\n              });\r\n              placeholders.slice(0, -1);  // remove the comma at the end\r\n              console.log('Placeholders: ' + placeholders);\r\n              */\n\n              /*const sql = `SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\r\n                           FROM nobsc_ingredients\r\n                           WHERE ingredient_type_id = ${placeholders}`;\r\n              const [ rows ] = await pool.execute(sql, [types]);\r\n                  res.send(rows);\r\n              console.log(rows);*/\n            } catch (err) {\n              console.log(err);\n            }\n\n          case 1:\n          case 'end':\n            return _context6.stop();\n        }\n      }\n    }, _callee6, undefined);\n  }));\n\n  return function (_x11, _x12) {\n    return _ref16.apply(this, arguments);\n  };\n}());\n\nmodule.exports = router;\n\n//# sourceURL=webpack:///./src/routes/ingredients.js?");

/***/ }),

/***/ "./src/routes/recipes.js":
/*!*******************************!*\
  !*** ./src/routes/recipes.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ \"babel-runtime/regenerator\");\n\nvar _regenerator2 = _interopRequireDefault(_regenerator);\n\nvar _slicedToArray2 = __webpack_require__(/*! babel-runtime/helpers/slicedToArray */ \"babel-runtime/helpers/slicedToArray\");\n\nvar _slicedToArray3 = _interopRequireDefault(_slicedToArray2);\n\nvar _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ \"babel-runtime/helpers/asyncToGenerator\");\n\nvar _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar express = __webpack_require__(/*! express */ \"express\");\nvar router = express.Router();\n\n// 1. list all recipes\nrouter.get('/', function () {\n  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {\n    var sql, _ref2, _ref3, rows;\n\n    return _regenerator2.default.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.prev = 0;\n            sql = 'SELECT recipe_id, recipe_name, recipe_type_id, recipe_image\\n                 FROM nobsc_recipes';\n            _context.next = 4;\n            return pool.execute(sql);\n\n          case 4:\n            _ref2 = _context.sent;\n            _ref3 = (0, _slicedToArray3.default)(_ref2, 1);\n            rows = _ref3[0];\n\n\n            res.send(rows);\n\n            _context.next = 13;\n            break;\n\n          case 10:\n            _context.prev = 10;\n            _context.t0 = _context['catch'](0);\n\n            console.log(_context.t0);\n\n          case 13:\n          case 'end':\n            return _context.stop();\n        }\n      }\n    }, _callee, undefined, [[0, 10]]);\n  }));\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}());\n\n// 2. list specific recipe\nrouter.get('/:id', function () {\n  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {\n    var id, sql, _ref5, _ref6, rows;\n\n    return _regenerator2.default.wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _context2.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT recipe_id, recipe_name, recipe_type_id, recipe_image\\n                 FROM nobsc_recipes\\n                 WHERE recipe_id = ?';\n            _context2.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref5 = _context2.sent;\n            _ref6 = (0, _slicedToArray3.default)(_ref5, 1);\n            rows = _ref6[0];\n\n\n            res.send(rows);\n\n            _context2.next = 14;\n            break;\n\n          case 11:\n            _context2.prev = 11;\n            _context2.t0 = _context2['catch'](0);\n\n            console.log(_context2.t0);\n\n          case 14:\n          case 'end':\n            return _context2.stop();\n        }\n      }\n    }, _callee2, undefined, [[0, 11]]);\n  }));\n\n  return function (_x3, _x4) {\n    return _ref4.apply(this, arguments);\n  };\n}());\n\n// 3. submit new recipe\nrouter.post('/', function () {\n  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {\n    var _req$body, id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage, sql;\n\n    return _regenerator2.default.wrap(function _callee3$(_context3) {\n      while (1) {\n        switch (_context3.prev = _context3.next) {\n          case 0:\n            _context3.prev = 0;\n            _req$body = req.body, id = _req$body.id, name = _req$body.name, typeId = _req$body.typeId, image = _req$body.image, equipmentImage = _req$body.equipmentImage, ingredientsImage = _req$body.ingredientsImage, cookingImage = _req$body.cookingImage; // sanitize and validate\n\n            sql = 'INSERT INTO nobsc_recipes\\n                 (recipe_id, recipe_name, recipe_type_id, recipe_image, equipment_image, ingredients_image, cooking_image)\\n                 VALUES\\n                 (?, ?, ?, ?)';\n            _context3.next = 5;\n            return pool.execute(sql, [id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage]);\n\n          case 5:\n\n            res.status(201).json({ message: 'Recipe submitted', id: id, name: name, typeId: typeId, image: image, equipmentImage: equipmentImage, ingredientsImage: ingredientsImage, cookingImage: cookingImage });\n\n            _context3.next = 11;\n            break;\n\n          case 8:\n            _context3.prev = 8;\n            _context3.t0 = _context3['catch'](0);\n\n            console.log(_context3.t0);\n\n          case 11:\n          case 'end':\n            return _context3.stop();\n        }\n      }\n    }, _callee3, undefined, [[0, 8]]);\n  }));\n\n  return function (_x5, _x6) {\n    return _ref7.apply(this, arguments);\n  };\n}());\n\n/*\r\n// 4. edit specific recipe\r\nrouter.put('/:id', async (req, res) => {\r\n  try {\r\n    const id = req.params.id;  // sanitize and validate\r\n    const sql = `UPDATE recipe_id, recipe_name\r\n                 FROM nobsc_recipes\r\n                 WHERE recipe_id = ?`;\r\n    const [ rows ] = await pool.execute(sql, [id]);\r\n\r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n\r\n\r\n// 5. delete specific recipe\r\nrouter.delete('/:id', async (req, res) => {\r\n  try {\r\n    const id = req.params.id;  // sanitize and validate\r\n    const sql = `DELETE recipe_id, recipe_name\r\n                 FROM nobsc_recipes\r\n                 WHERE recipe_id = ?\r\n                 LIMIT 1`;\r\n    const [ rows ] = await pool.execute(sql, [id]);\r\n\r\n    res.send(rows);\r\n\r\n  } catch(err) {\r\n    console.log(err);\r\n  }\r\n});\r\n*/\n\n// 6. list all recipe types\nrouter.get('/types', function () {\n  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {\n    var sql, _ref9, _ref10, rows;\n\n    return _regenerator2.default.wrap(function _callee4$(_context4) {\n      while (1) {\n        switch (_context4.prev = _context4.next) {\n          case 0:\n            _context4.prev = 0;\n            sql = 'SELECT recipe_type_id, recipe_type_name\\n                 FROM nobsc_recipe_types';\n            _context4.next = 4;\n            return pool.execute(sql);\n\n          case 4:\n            _ref9 = _context4.sent;\n            _ref10 = (0, _slicedToArray3.default)(_ref9, 1);\n            rows = _ref10[0];\n\n\n            res.send(rows);\n\n            _context4.next = 13;\n            break;\n\n          case 10:\n            _context4.prev = 10;\n            _context4.t0 = _context4['catch'](0);\n\n            console.log(_context4.t0);\n\n          case 13:\n          case 'end':\n            return _context4.stop();\n        }\n      }\n    }, _callee4, undefined, [[0, 10]]);\n  }));\n\n  return function (_x7, _x8) {\n    return _ref8.apply(this, arguments);\n  };\n}());\n\n// 7. list specific recipe type     (is this one needed?)\nrouter.get('/types/:id', function () {\n  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {\n    var id, sql, _ref12, _ref13, rows;\n\n    return _regenerator2.default.wrap(function _callee5$(_context5) {\n      while (1) {\n        switch (_context5.prev = _context5.next) {\n          case 0:\n            _context5.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT recipe_type_id, recipe_type_name\\n                 FROM nobsc_recipe_types\\n                 WHERE recipe_type_id = ?';\n            _context5.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref12 = _context5.sent;\n            _ref13 = (0, _slicedToArray3.default)(_ref12, 1);\n            rows = _ref13[0];\n\n\n            res.send(rows);\n\n            _context5.next = 14;\n            break;\n\n          case 11:\n            _context5.prev = 11;\n            _context5.t0 = _context5['catch'](0);\n\n            console.log(_context5.t0);\n\n          case 14:\n          case 'end':\n            return _context5.stop();\n        }\n      }\n    }, _callee5, undefined, [[0, 11]]);\n  }));\n\n  return function (_x9, _x10) {\n    return _ref11.apply(this, arguments);\n  };\n}());\n\n//8. list all recipes of specified type(s)     (this is the most important one)\n//     >>>>>     here, either make the route '/recipes-by-type/:id' or read query\n//     >>>>>     add logic for determining and querying any give number types simultaeneously\nrouter.get('/by-type/:id', function () {\n  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {\n    var id, sql, _ref15, _ref16, rows;\n\n    return _regenerator2.default.wrap(function _callee6$(_context6) {\n      while (1) {\n        switch (_context6.prev = _context6.next) {\n          case 0:\n            _context6.prev = 0;\n            id = req.params.id; // sanitize and validate\n\n            sql = 'SELECT recipe_id, recipe_name, recipe_type_id, recipe_image\\n                 FROM nobsc_recipes\\n                 WHERE recipe_type_id = ?';\n            _context6.next = 5;\n            return pool.execute(sql, [id]);\n\n          case 5:\n            _ref15 = _context6.sent;\n            _ref16 = (0, _slicedToArray3.default)(_ref15, 1);\n            rows = _ref16[0];\n\n\n            res.send(rows);\n\n            _context6.next = 14;\n            break;\n\n          case 11:\n            _context6.prev = 11;\n            _context6.t0 = _context6['catch'](0);\n\n            console.log(_context6.t0);\n\n          case 14:\n          case 'end':\n            return _context6.stop();\n        }\n      }\n    }, _callee6, undefined, [[0, 11]]);\n  }));\n\n  return function (_x11, _x12) {\n    return _ref14.apply(this, arguments);\n  };\n}());\n\nmodule.exports = router;\n\n//# sourceURL=webpack:///./src/routes/recipes.js?");

/***/ }),

/***/ "babel-runtime/helpers/asyncToGenerator":
/*!*********************************************************!*\
  !*** external "babel-runtime/helpers/asyncToGenerator" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-runtime/helpers/asyncToGenerator\");\n\n//# sourceURL=webpack:///external_%22babel-runtime/helpers/asyncToGenerator%22?");

/***/ }),

/***/ "babel-runtime/helpers/slicedToArray":
/*!******************************************************!*\
  !*** external "babel-runtime/helpers/slicedToArray" ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-runtime/helpers/slicedToArray\");\n\n//# sourceURL=webpack:///external_%22babel-runtime/helpers/slicedToArray%22?");

/***/ }),

/***/ "babel-runtime/regenerator":
/*!********************************************!*\
  !*** external "babel-runtime/regenerator" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-runtime/regenerator\");\n\n//# sourceURL=webpack:///external_%22babel-runtime/regenerator%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"compression\");\n\n//# sourceURL=webpack:///external_%22compression%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"helmet\");\n\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ }),

/***/ "mysql2/promise":
/*!*********************************!*\
  !*** external "mysql2/promise" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mysql2/promise\");\n\n//# sourceURL=webpack:///external_%22mysql2/promise%22?");

/***/ })

/******/ });
// >>>>>>>>>>>>>>>>>>>> start pagination logic

// make all this a function and module.exports it then require and use it in ingredients.js
// incorporate 1 type and 0 types
// move pagination logic out of filter logic (move into ingredients-pagination.js for example)

let display = 25;  // set number of ingredients to list per page



if (!checkedTypes) {
	const checkedTypes = [];
	const sql = 'SELECT ingredient_type_id FROM nobsc_ingredient_types';
  const [ rows ] = await pool.execute(sql);
  
  rows.map(row => {  // is this even needed now?
    if (req.params.itid + row) {     // CHANGE itid to an actual word...
      checkedTypes.push(row);
    }
  });
}

const checkedTypesList = checkedTypes.join(', ');




// CHANGE P to an actual word...
if (req.param.p && typeof req.param.p === 'number') {  // determine how many total pages of ingredients there are without and with filters
	const pages = req.param.p;
} else {
	// count ingredients, by selected type(s) if any
	if (types.length > 1) {
    const included = '?, '.repeat(checkedTypes.length) + '?';
    const sql = 'SELECT COUNT(*) FROM nobsc_ingredients WHERE ingredient_type_id IN (' + included + ')';
    const [ rows ] = await pool.execute(sql, [included]);
		//$records = $stmt->fetchColumn();
		
  }
  
  if (types.length == 1) {
    const sql = 'SELECT COUNT(*) FROM nobsc_ingredients WHERE ingredient_type_id = ?';
    const [ rows ] = await pool.execute(sql, [checkedTypes]);
		//$records = $stmt->fetchColumn();
		
  }
  
  if (types.length == 0) {
		const sql = "SELECT COUNT(*) FROM nobsc_ingredients";
    const [ rows ] = await pool.execute(sql);
		//$records = $stmt->fetchColumn();
	}
  
  let pages = (rows > display)
    ? Math.ceil(rows / display)
    : 1;
}


// CHANGE S to an actual word...
let start = ((req.param.s) && (typeof req.param.s === 'number'))
	? req.param.s
  : 0;
// >>>>>>>>>>>>>>>>>>>> end pagination logic
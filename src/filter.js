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
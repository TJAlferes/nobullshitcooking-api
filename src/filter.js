// >>>>>>>>>>>>>>>>>>>> start pagination logic
let display = 25;  // set number of ingredients to list per page



if (!checkedTypes) {
	const checkedTypes = [];
	const sql = 'SELECT ingredient_type_id FROM nobsc_ingredient_types';
  const [ rows ] = await pool.execute(sql);
  
  rows.map(row => {
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
	if (checkedTypes.length > 1) {
    const included = '?, '.repeat(checkedTypes.length) + '?';
    const sql = 'SELECT COUNT(*) FROM nobsc_ingredients WHERE ingredient_type_id IN (' + included + ')';
    const [ rows ] = await pool.execute(sql, [included]);
		//$records = $stmt->fetchColumn();
		
  }
  
  if (checkedTypes.length == 1) {
    const sql = 'SELECT COUNT(*) FROM nobsc_ingredients WHERE ingredient_type_id = ?';
    const [ rows ] = await pool.execute(sql, [checkedTypes]);
		//$records = $stmt->fetchColumn();
		
  }
  
  if (checkedTypes.length == 0) {
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




// >>>>>>>>>>>>>>>>>>>> start filter logic
if (checkedTypes.length > 1) {  // return multiple checked ingredient types (filter)
  let inNamed = "";
  let parameters = [];
  //checkedTypes
  /*
  foreach (checkedTypes as j => chTy) {
    let key = ":id" + j;
    inNamed .= "key, ";
    parameters[key] = chTy;
  }
  */
  //let inNamedSet = rtrim(inNamed, ", ");
  let inNamedSet = inNamed.slice(0, -2);
  const sql = `
    SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
    FROM nobsc_ingredients
    WHERE ingredient_type_id IN (${inNamedSet})
    ORDER BY ingredient_name ASC
    LIMIT :start, :display
  `;  // named in mysql2?
  const [ rows ] = await pool.execute(sql, [included, start, display]);
  /*
  foreach (parameters as k => chType) {
    $stmt->bindValue(k, chType);
  }
  $stmt->bindValue(':start', start, PDO::PARAM_INT);
  $stmt->bindValue(':display', display, PDO::PARAM_INT);
  $stmt->execute();
  */
}

if (checkedTypes.length == 1) {  // return single checked ingredient type (filter)
  let ingredientTypeID = checkedTypesList;
  const sql = `
    SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
    FROM nobsc_ingredients
    WHERE ingredient_type_id = :ingredientTypeID
    ORDER BY ingredient_name ASC
    LIMIT :start, :display
  `;
  //$stmt->execute([':ingredientTypeID' => $ingredientTypeID, ':start' => $start, ':display' => $display]);
}

if (checkedTypes.length == 0) {  // return all ingredient types (no filter)
  const sql = `
    SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
    FROM nobsc_ingredients
    ORDER BY ingredient_name ASC
    LIMIT :start, :display
  `;
  //$stmt = $conn->prepare($sql);
  //$stmt->execute([':start' => $start, ':display' => $display]);
}

// >>>>>>>>>>>>>>>>>>>> end filter logic
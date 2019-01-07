/*
function ingredientsFilter() {

  const types = req.body.types;  // sanitize and validate



  if (types.length > 1) {
    let ids = types.join(', ');  // convert array elements to string for SQL query
    //console.log(ids);
    let placeholders = '';
    types.forEach(type => {  // generate appropriate number of placeholders for SQL query
      placeholders += '?,';
    });
    const placeholderString = placeholders.slice(0, -1);  // this just removes the comma at the end
    //console.log(placeholderString);
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id = ${placeholderString}
      ORDER BY ingredient_name ASC
      LIMIT ${start}, ${display}
    `;  // you may need to use IN instead of = in the WHERE clause
    const [ rows ] = await pool.execute(sql, [ids]);
    return rows;
  }



  if (types.length == 1) {
    let id = `${types}`;  // convert array element to string for SQL query
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id = ?
      ORDER BY ingredient_name ASC
      LIMIT ${start}, ${display}
    `;
    const [ rows ] = await pool.execute(sql, [id]);
    return rows;
  }



  if (types.length == 0) {
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      ORDER BY ingredient_name ASC
      LIMIT ${start}, ${display}
    `;
    const [ rows ] = await pool.execute(sql);
    return rows;
  }







  if (types.length > 1) {  // query all ingredients of checked ingredient types (multiple filters checked on frontend UI)
    let inNamed = "";
    let parameters = [];

    //checkedTypes
    foreach (checkedTypes as j => chTy) {
      let key = ":id" + j;
      inNamed .= "key, ";
      parameters[key] = chTy;
    }
    
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
    
    foreach (parameters as k => chType) {
      $stmt->bindValue(k, chType);
    }
    //$stmt->bindValue(':start', start, PDO::PARAM_INT);
    //$stmt->bindValue(':display', display, PDO::PARAM_INT);
    //return;
  }


  if (types.length == 1) {  // query all ingredients of checked ingredient type (one filter checked on frontend UI)
    let ingredientTypeID = checkedTypesList;
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id = :ingredientTypeID
      ORDER BY ingredient_name ASC
      LIMIT :start, :display
    `;
    //$stmt->execute([':ingredientTypeID' => $ingredientTypeID, ':start' => $start, ':display' => $display]);
    //return;
  }


  if (types.length == 0) {  // query all ingredients (no filtration on frontend UI)
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      ORDER BY ingredient_name ASC
      LIMIT :start, :display
    `;
    //$stmt->execute([':start' => $start, ':display' => $display]);
    //return;
  }

}

module.exports = ingredientsFilter;
*/
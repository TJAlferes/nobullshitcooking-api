import request from 'supertest';

const { server } = require('./app');

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

//beforeEach(async () => {});

/*describe('GET /', () => {
  it('returns data correctly', async (done) => {
    const { text } = await request(server).get('/');
    expect(text).toEqual('No Bullshit Cooking Backend API.');
    done();
  });
});*/

/*describe('GET /content/links/:contentTypeName', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content/links/exercises');
    expect(body).toEqual([
      {
        content_id: 1,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Bike"
      },
      {
        content_id: 2,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Pullup"
      },
      {
        content_id: 3,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Pushup"
      },
      {
        content_id: 4,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Run"
      },
      {
        content_id: 5,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Squat"
      },
      {
        content_id: 6,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Walk"
      },
    ]);
    done();
  });
});

describe('GET /content/:contentId', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content/1');
    expect(body).toEqual({content_type_id: 8, content_items: "[]"});  // ?
    done();
  });
});

describe('GET /content-type/:contentTypeId', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content-type/1');
    expect(body).toEqual({
      content_type_id: 1,
      parent_id: 0,
      content_type_name: "Page",
      content_type_path: "/page"
    });
    done();
  });
});

describe('GET /cuisine/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine/1');
    expect(body).toEqual({
      cuisine_id: 1,
      cuisine_name: "Afghan",
      cuisine_nation: "Afghanistan"
    });
    done();
  });
});

describe('GET /cuisine-equipment/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine-equipment/1');
    expect(body).toEqual({
      equipment_id: 3,
      equipment_name: "Cutting Board"
    });
    done();
  });
});

describe('GET /cuisine-ingredient/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine-ingredient/1');
    expect(body).toEqual({
      ingredient_id: 10,
      ingredient_name: "Chuck Seven Bone Roast"
    });
    done();
  });
});*/

/*describe('GET /cuisine-supplier/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine-supplier/1');
    expect(body).toEqual({supplier_name: "Blah"});
    done();
  });
});*/

/*describe('GET /equipment/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/equipment/1');
    expect(body).toEqual({
      equipment_id: 3,
      equipment_name: "Cutting Board"
    });
    done();
  });
});*/

/*describe('GET /equipment-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/equipment-type/1');
    expect(body).toEqual({
      equipment_type_id: 1,
      equipment_type_name: "Cleaning"
    });
    done();
  });
});

// favorite-recipe

describe('GET /ingredient/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/ingredient/1');
    expect(body).toEqual({
      ingredient_id: 1,
      ingredient_type_name: "Fish",
      ingredient_brand: null,
      ingredient_variety: null,
      ingredient_name: "Tuna",
      ingredient_description: "Tasty.",
      ingredient_image: "nobsc-tuna"
    });
    done();
  });
});

describe('GET /ingredient-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/ingredient-type/1');
    expect(body).toEqual({ingredient_type_id: 1, ingredient_type_name: "Fish"});
    done();
  });
});

describe('GET /measurement/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/measurement/1');
    expect(body).toEqual({measurement_id: 1, measurement_name: "teaspoon"});
    done();
  });
});

describe('GET /method/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/method/1');
    expect(body).toEqual({method_id: 1, method_name: "No-Cook"});
    done();
  });
});*/

/*describe('GET /profile/nobody', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/profile/nobody');
    expect(body).toEqual({message: 'User does not exist.'});
    done();
  });
});

describe('GET /profile/testman', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/profile/testman');
    expect(body).toEqual({
      message: 'Success.',
      avatar: 'nobsc-user-default',
      publicRecipes: [],
      favoriteRecipes: []
    });
    done();
  });
});*/

describe('GET /recipe/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/recipe/1');
    expect(body).toEqual({
      recipe_id: 1,
      author: "NOBSC",
      author_avatar: "nobsc-user-default",
      recipe_type_name: "Drink",
      cuisine_name: "Afghan",
      title: "Borscht",
      description: "Excellent",
      active_time: "0:30:00",
      total_time: "4:00:00",
      directions: "Chop beets and onions...",
      recipe_image: "nobsc-recipe-default",
      equipment_image: "nobsc-recipe-equipment-default",
      ingredients_image: "nobsc-recipe-ingredients-default",
      cooking_image: "nobsc-recipe-cooking-default",
      required_methods: "[{\"method_name\": \"Steam\"}]",
      required_equipment: "[{\"amount\": 1, \"equipment_name\": \"Ceramic Stone\"}]",
      required_ingredients: "[{\"amount\": 4.00, \"ingredient_name\": \"Chicken Breasts\", \"measurement_name\": \"teaspoon\"}]",
      required_subrecipes: null
    });
    done();
  });
});

describe('GET /recipe-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/recipe-type/1');
    expect(body).toEqual({recipe_type_id: 1, recipe_type_name: "Drink"});
    done();
  });
});

// ===========================================================================
// USER ROUTES
// ===========================================================================

/*describe('POST /user/auth/register', () => {
  it('registers new user', async () => {
    await request(server)
    .post('/user/auth/register')
    .send({email: "newuser@site.com", password: "secret", username: "newuser"})
    .expect(201);
  });

  it('does not register already registered user', async () => {
    await request(server)
    .post('/user/auth/register');
  });
});

describe('POST /user/auth/login', () => {
  it('logs in existing user', async () => {
    await request(server)
    .post('/user/auth/login')
    .send({email: "user@site.com", password: "secret"})
    .expect(201);
  });

  it('does not log in already logged in user', async () => {
    await request(server)
    .post('/user/auth/login')
    .send({email: "loggedinuser@site.com", password: "secret"})
  });

  it('does not log in non-existing user', async () => {
    await request(server)
    .post('/user/auth/login')
    .send({email: "nonuser@site.com", password: "secret"})
    .expect(201);
  });
});

describe('POST /user/auth/logout', () => {
  it('logs out existing user', async () => {
    await request(server)
    .post('/user/auth/logout');
  });

  it('does not log out non-existing user', async () => {
    await request(server)
    .post('/user/auth/logout');
  });
});*/

// ===========================================================================
// STAFF ROUTES
// ===========================================================================


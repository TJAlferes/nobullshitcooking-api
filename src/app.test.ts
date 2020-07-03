import request from 'supertest';

const { server } = require('./app');

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

//beforeEach(async () => {});

describe('GET /', () => {
  it('returns data correctly', async (done) => {
    const { text } = await request(server).get('/');
    expect(text).toEqual('No Bullshit Cooking Backend API.');
    done();
  });
});

describe('GET /content/links/:contentTypeName', () => {
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
    expect(body).toEqual({content_type_id: 8,content_items: "[]"});  // ?
    done();
  });
});

describe('GET /content-type', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content-type');
    expect(body).toEqual([
      {content_type_id: 1,  parent_id: 0, content_type_name: "Page",        content_type_path: "/page"},
      {content_type_id: 2,  parent_id: 0, content_type_name: "Post",        content_type_path: "/post"},
      {content_type_id: 3,  parent_id: 1, content_type_name: "Guide",       content_type_path: "/page/guide"},
      {content_type_id: 4,  parent_id: 1, content_type_name: "Promo",       content_type_path: "/page/promo"},
      {content_type_id: 5,  parent_id: 1, content_type_name: "Site",        content_type_path: "/page/site"},
      {content_type_id: 6,  parent_id: 3, content_type_name: "Fitness",     content_type_path: "/page/guide/fitness"},
      {content_type_id: 7,  parent_id: 3, content_type_name: "Food",        content_type_path: "/page/guide/food"},
      {content_type_id: 8,  parent_id: 6, content_type_name: "Exercises",   content_type_path: "/page/guide/fitness/exercises"},
      {content_type_id: 9,  parent_id: 6, content_type_name: "Principles",  content_type_path: "/page/guide/fitness/principles"},
      {content_type_id: 10, parent_id: 7, content_type_name: "Recipes",     content_type_path: "/page/guide/food/recipes"},
      {content_type_id: 11, parent_id: 7, content_type_name: "Cuisines",    content_type_path: "/page/guide/food/cuisines"},
      {content_type_id: 12, parent_id: 7, content_type_name: "Ingredients", content_type_path: "/page/guide/food/ingredients"},
      {content_type_id: 13, parent_id: 7, content_type_name: "Nutrition",   content_type_path: "/page/guide/food/nutrition"},
      {content_type_id: 14, parent_id: 7, content_type_name: "Equipment",   content_type_path: "/page/guide/food/equipment"},
      {content_type_id: 15, parent_id: 7, content_type_name: "Methods",     content_type_path: "/page/guide/food/methods"}
    ]);
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

describe('GET /equipment/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/equipment/1');
    expect(body).toEqual({
      equipment_id: 1,
      equipment_name: "Pan"
    });
    done();
  });
});

describe('GET /equipment-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/equipment-type/1');
    expect(body).toEqual({equipment_type_id: 1, equipment_type_name: "Pan"});
    done();
  });
});

describe('GET /ingredient/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/ingredient/1');
    expect(body).toEqual({
      ingredient_id: 1,
      ingredient_name: "Fish"
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

// ===========================================================================
// USER ROUTES
// ===========================================================================

describe('POST /user/auth/register', () => {
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
});

// ===========================================================================
// STAFF ROUTES
// ===========================================================================


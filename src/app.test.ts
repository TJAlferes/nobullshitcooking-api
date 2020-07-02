import request from 'supertest';

const { server } = require('./app');

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

/*beforeEach(async () => {
  
});*/

// just make everything res.json instead of res.send? *** yeah probably

describe('GET /', () => {
  it('returns data correctly', async (done) => {
    const { text } = await request(server).get('/');
    expect(text).toEqual('No Bullshit Cooking Backend API.');
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

/*describe('GET /content/links/:contentTypeName', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content/links/recipe')
    .expect();
  });
});

describe('GET /content/:contentId', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content/9')
    .expect();
  });
});

describe('GET /content-type', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content-type')
    .expect();
  });
});

describe('GET /content-type/:contentTypeId', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content-type/9')
    .expect();
  });
});

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
});*/
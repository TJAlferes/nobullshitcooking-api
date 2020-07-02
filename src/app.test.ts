import request from 'supertest';

const { server } = require('./app');

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

beforeEach(async () => {
  
});

describe('/content/links/:contentTypeName GET endpoint', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content/links/recipe')
    .expect();
  });
});

describe('/content/:contentId GET endpoint', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content/9')
    .expect();
  });
});

describe('/content-type GET endpoint', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content-type')
    .expect();
  });
});

describe('/content-type/:contentTypeId GET endpoint', () => {
  it('returns data correctly', async () => {
    await request(server).get('/content-type/9')
    .expect();
  });
});

describe('/user/auth/register POST endpoint', () => {
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

describe('/user/auth/login POST endpoint', () => {
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

describe('/user/auth/logout POST endpoint', () => {
  it('logs out existing user', async () => {
    await request(server)
    .post('/user/auth/logout');
  });

  it('does not log out non-existing user', async () => {
    await request(server)
    .post('/user/auth/logout');
  });
});
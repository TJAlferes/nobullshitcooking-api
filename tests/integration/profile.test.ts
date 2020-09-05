import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /profile/nobody', () => {
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
});
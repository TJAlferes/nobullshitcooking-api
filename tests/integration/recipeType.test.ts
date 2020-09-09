import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /recipe-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/recipe-type/1');
    expect(body).toEqual({id: 1, name: "Drink"});
    done();
  });
});
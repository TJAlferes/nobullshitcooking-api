import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /ingredient-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/ingredient-type/1');
    expect(body).toEqual({ingredient_type_id: 1, ingredient_type_name: "Fish"});
    done();
  });
});
import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

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
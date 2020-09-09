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
      id: 1,
      ingredient_type_name: "Fish",
      brand: null,
      variety: null,
      name: "Tuna",
      description: "Tasty.",
      image: "nobsc-tuna"
    });
    done();
  });
});
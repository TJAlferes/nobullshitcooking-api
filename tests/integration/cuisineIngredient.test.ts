import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /cuisine-ingredient/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine-ingredient/1');
    expect(body).toEqual({
      ingredient_id: 10,
      ingredient_name: "Chuck Seven Bone Roast"
    });
    done();
  });
});
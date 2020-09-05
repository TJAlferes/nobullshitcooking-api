import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /cuisine-equipment/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine-equipment/1');
    expect(body).toEqual({equipment_id: 3, equipment_name: "Cutting Board"});
    done();
  });
});
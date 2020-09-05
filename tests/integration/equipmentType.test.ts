import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /equipment-type/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/equipment-type/1');
    expect(body).toEqual({
      equipment_type_id: 1,
      equipment_type_name: "Cleaning"
    });
    done();
  });
});
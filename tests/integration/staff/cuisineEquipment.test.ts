import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/cuisine-equipment/create', () => {
  it('creates cuisineEquipment', async (done) => {
    const { body } = await request(server)
      .post('/staff/cuisine-equipment/create')
      .send({cuisineId: 4, equipmentId: 4});
    expect(body).toEqual();
    done(); 
  });
});

describe('DELETE /staff/cuisine-equipment/delete', () => {
  it('deletes cuisineEquipment', async (done) => {
    const { body } = await request(server)
      .delete('/staff/cuisine-equipment/delete')
      .send({cuisineId: 4, equipmentId: 4});
    expect(body).toEqual();
    done(); 
  });
});
import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/cuisine-supplier/create', () => {
  it('creates cuisineSupplier', async (done) => {
    const { body } = await request(server)
      .post('/staff/cuisine-supplier/create')
      .send({cuisineId: 4, supplierId: 4});
    expect(body).toEqual({message: 'Cuisine supplier created.'});
    done(); 
  });
});

describe('DELETE /staff/cuisine-supplier/delete', () => {
  it('deletes cuisineSupplier', async (done) => {
    const { body } = await request(server)
      .delete('/staff/cuisine-supplier/delete')
      .send({cuisineId: 4, supplierId: 4});
    expect(body).toEqual({message: 'Cuisine supplier deleted.'});
    done(); 
  });
});
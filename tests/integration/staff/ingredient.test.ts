import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/ingredient/create', () => {
  it('creates ingredient', async (done) => {
    const { body } = await request(server).post('/staff/ingredient/create')
      .send({
        ingredientTypeId: 4,
        brand: "Brand",
        variety: "Variety",
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual();
    done(); 
  });
});

describe('PUT /staff/ingredient/update', () => {
  it('updates ingredient', async (done) => {
    const { body } = await request(server).put('/staff/ingredient/update')
      .send({
        id: 88,
        ingredientTypeId: 4,
        brand: "Brand",
        variety: "Variety",
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual();
    done(); 
  });
});

describe('DELETE /staff/ingredient/delete', () => {
  it('deletes ingredient', async (done) => {
    const { body } = await request(server).delete('/staff/ingredient/delete')
      .send({id: 88});
    expect(body).toEqual();
    done(); 
  });
});
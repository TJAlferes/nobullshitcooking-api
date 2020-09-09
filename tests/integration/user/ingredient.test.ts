import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/ingredient/create', () => {
  it('creates ingredient', async (done) => {
    const { body } = await request(server).post('/user/ingredient/create')
      .send({
        ingredientTypeId: 4,
        brand: "Brand",
        variety: "Variety",
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual({message: 'Ingredient created.'});
    done(); 
  });
});

describe('PUT /user/ingredient/update', () => {
  it('updates ingredient', async (done) => {
    const { body } = await request(server).put('/user/ingredient/update')
      .send({
        id: 88,
        ingredientTypeId: 4,
        brand: "Brand",
        variety: "Variety",
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual({message: 'Ingredient updated.'});
    done(); 
  });
});

describe('DELETE /user/ingredient/delete', () => {
  it('deletes ingredient', async (done) => {
    const { body } = await request(server).delete('/user/ingredient/delete')
      .send({id: 88});
    expect(body).toEqual({message: 'Ingredient deleted.'});
    done(); 
  });
});
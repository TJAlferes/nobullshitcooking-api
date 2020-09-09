import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/cuisine-ingredient/create', () => {
  it('creates cuisineIngredient', async (done) => {
    const { body } = await request(server)
      .post('/staff/cuisine-ingredient/create')
      .send({cuisineId: 4, ingredientId: 4});
    expect(body).toEqual({message: 'Cuisine ingredient created.'});
    done(); 
  });
});

describe('DELETE /staff/cuisine-ingredient/delete', () => {
  it('deletes cuisineIngredient', async (done) => {
    const { body } = await request(server)
      .delete('/staff/cuisine-ingredient/delete')
      .send({cuisineId: 4, ingredientId: 4});
    expect(body).toEqual({message: 'Cuisine ingredient deleted.'});
    done(); 
  });
});
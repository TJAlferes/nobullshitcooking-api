import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/favorite-recipe/create', () => {
  it('creates plan', async (done) => {
    const { body } = await request(server).post('/user/favorite-recipe/create')
      .send({id: 1});
    expect(body).toEqual({message: 'Favorited.'});
    done(); 
  });
});

describe('DELETE /user/favorite-recipe/delete', () => {
  it('deletes plan', async (done) => {
    const { body } = await request(server)
      .delete('/user/favorite-recipe/delete')
      .send({id: 1});
    expect(body).toEqual({message: 'Unfavorited.'});
    done(); 
  });
});
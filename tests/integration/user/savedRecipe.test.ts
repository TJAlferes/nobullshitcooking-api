import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/saved-recipe/create', () => {
  it('creates plan', async (done) => {
    const { body } = await request(server).post('/user/saved-recipe/create')
      .send({id: 1});
    expect(body).toEqual({message: 'Saved.'});
    done(); 
  });
});

describe('DELETE /user/saved-recipe/delete', () => {
  it('deletes plan', async (done) => {
    const { body } = await request(server)
      .delete('/user/saved-recipe/delete')
      .send({id: 1});
    expect(body).toEqual({message: 'Unsaved.'});
    done(); 
  });
});
import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/plan/create', () => {
  it('creates plan', async (done) => {
    const { body } = await request(server).post('/user/plan/create')
      .send({name: "Name", data: {}});
    expect(body).toEqual({message: 'Plan created.'});
    done(); 
  });
});

describe('PUT /user/plan/update', () => {
  it('updates plan', async (done) => {
    const { body } = await request(server).put('/user/plan/update')
    .send({id: 1, name: "Name", data: {}});
    expect(body).toEqual({message: 'Plan updated.'});
    done(); 
  });
});

describe('DELETE /user/plan/delete', () => {
  it('deletes plan', async (done) => {
    const { body } = await request(server).delete('/user/plan/delete')
      .send({id: 1});
    expect(body).toEqual({message: 'Plan deleted.'});
    done(); 
  });
});
import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/supplier/create', () => {
  it('creates supplier', async (done) => {
    const { body } = await request(server).post('/staff/supplier/create')
      .send({name: "Name"});
    expect(body).toEqual({message: 'Supplier created.'});
    done(); 
  });
});

describe('PUT /staff/supplier/update', () => {
  it('updates supplier', async (done) => {
    const { body } = await request(server).put('/staff/supplier/update')
      .send({id: 88, name: "Name"});
    expect(body).toEqual({message: 'Supplier updated.'});
    done(); 
  });
});

describe('DELETE /staff/supplier/delete', () => {
  it('deletes supplier', async (done) => {
    const { body } = await request(server).delete('/staff/supplier/delete')
      .send({id: 88});
    expect(body).toEqual({message: 'Supplier deleted.'});
    done(); 
  });
});
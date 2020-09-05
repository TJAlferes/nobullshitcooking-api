import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/equipment/create', () => {
  it('creates equipment', async (done) => {
    const { body } = await request(server).post('/staff/equipment/create')
      .send({
        equipmentTypeId: 4,
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual();
    done(); 
  });
});

describe('PUT /staff/equipment/update', () => {
  it('updates equipment', async (done) => {
    const { body } = await request(server).put('/staff/equipment/update')
      .send({
        id: 88,
        equipmentTypeId: 4,
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual();
    done(); 
  });
});

describe('DELETE /staff/equipment/delete', () => {
  it('deletes equipment', async (done) => {
    const { body } = await request(server).delete('/staff/equipment/delete')
      .send({id: 88});
    expect(body).toEqual();
    done(); 
  });
});
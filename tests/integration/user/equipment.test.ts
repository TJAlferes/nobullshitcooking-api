import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/equipment/create', () => {
  it('creates equipment', async (done) => {
    const { body } = await request(server).post('/user/equipment/create')
      .send({
        equipmentTypeId: 4,
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual({message: 'Equipment created.'});
    done(); 
  });
});

describe('PUT /user/equipment/update', () => {
  it('updates equipment', async (done) => {
    const { body } = await request(server).put('/user/equipment/update')
      .send({
        id: 88,
        equipmentTypeId: 4,
        name: "Name",
        description: "Description.",
        image: "image"
      });
    expect(body).toEqual({message: 'Equipment updated.'});
    done(); 
  });
});

describe('DELETE /user/equipment/delete', () => {
  it('deletes equipment', async (done) => {
    const { body } = await request(server).delete('/user/equipment/delete')
      .send({id: 88});
    expect(body).toEqual({message: 'Equipment deleted.'});
    done(); 
  });
});
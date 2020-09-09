import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/content/create', () => {
  it('creates content', async (done) => {
    const { body } = await request(server).post('/staff/content/create')
      .send({contentTypeId: 4, published: null, title: "Title", items: []});
    expect(body).toEqual({message: 'Content created.'});
    done(); 
  });
});

describe('PUT /staff/content/update', () => {
  it('updates content', async (done) => {
    const { body } = await request(server).put('/staff/content/update')
      .send({
        id: 88,
        contentTypeId: 4,
        published: null,
        title: "Title",
        items: []
      });
    expect(body).toEqual({message: 'Content updated.'});
    done(); 
  });
});

describe('DELETE /staff/content/delete', () => {
  it('deletes content', async (done) => {
    const { body } = await request(server).delete('/staff/content/delete')
      .send({id: 88});
    expect(body).toEqual({message: 'Content deleted.'});
    done(); 
  });
});
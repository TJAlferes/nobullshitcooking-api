import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/content/create', () => {
  it('creates content', async (done) => {
    const { body } = await request(server).post('/user/content/create')
      .send({contentTypeId: 4, published: null, title: "Title", items: []});
    expect(body).toEqual({message: 'Content created.'});
    done(); 
  });
});

describe('PUT /user/content/update', () => {
  it('updates content', async (done) => {
    const { body } = await request(server).put('/user/content/update')
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

describe('DELETE /user/content/delete', () => {
  it('deletes content', async (done) => {
    const { body } = await request(server).delete('/user/content/delete')
      .send({id: 88});
    expect(body).toEqual({message: 'Content deleted.'});
    done(); 
  });
});
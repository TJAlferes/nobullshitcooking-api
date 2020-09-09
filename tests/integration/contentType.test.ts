import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /content-type/:contentTypeId', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content-type/1');
    expect(body).toEqual({id: 1, parent_id: 0, name: "Page", path: "/page"});
    done();
  });
});
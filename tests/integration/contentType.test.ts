import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /content-type/:contentTypeId', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content-type/1');
    expect(body).toEqual({
      content_type_id: 1,
      parent_id: 0,
      content_type_name: "Page",
      content_type_path: "/page"
    });
    done();
  });
});
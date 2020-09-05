import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /method/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/method/1');
    expect(body).toEqual({method_id: 1, method_name: "No-Cook"});
    done();
  });
});
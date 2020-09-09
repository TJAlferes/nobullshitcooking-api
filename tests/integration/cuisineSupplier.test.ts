import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /cuisine-supplier/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine-supplier/1');
    expect(body).toEqual({name: "Blah"});
    done();
  });
});
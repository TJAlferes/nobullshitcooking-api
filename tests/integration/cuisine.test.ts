import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /cuisine/1', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/cuisine/1').end();
    expect(body).toEqual({id: 1, name: "Afghan", nation: "Afghanistan"});
    done();
  });
});
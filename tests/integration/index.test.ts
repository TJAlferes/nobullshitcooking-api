import request from 'supertest';

let { server } = require('../../src/app');

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

beforeEach(async () => {
  // clean the tes db
});

afterAll(() => {
  //server = null;  // sufficient?
  // you need a way to close all connections to dbs
  // separate out dbs?
});

describe('GET /', () => {
  it('returns data correctly', async (done) => {
    const { text } = await request(server).get('/');
    expect(text).toEqual(`
      No Bullshit Cooking Backend API.
      Documentation at https://github.com/tjalferes/nobullshitcooking-api
    `);
    done();
  });
});
import request from 'supertest';

const { server } = require('../../src/app');

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

beforeEach(async () => {
  // clean the tes db
});

describe('GET /', () => {
  it('returns data correctly', async (done) => {
    const { text } = await request(server).get('/');
    expect(text).toEqual('No Bullshit Cooking Backend API.');
    done();
  });
});
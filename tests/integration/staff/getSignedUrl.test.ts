import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe ('POST /staff/get-signed-url/content', () => {
  it ('gets signature(s)', async (done) => {
    const { body } = await request(server).post('/staff/get-signed-url/content')
      .send({fileType: 'png'});
    expect(body).toEqual();
    done();
  });
});
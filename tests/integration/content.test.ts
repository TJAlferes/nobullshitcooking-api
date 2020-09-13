import request from 'supertest';

const { server } = require('../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('GET /content/links/:contentTypeName', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server)
      .get('/content/links/exercises')
      .end();
    expect(body).toEqual([
      {
        id: 1,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Bike"
      },
      {
        id: 2,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Pullup"
      },
      {
        id: 3,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Pushup"
      },
      {
        id: 4,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Run"
      },
      {
        id: 5,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Squat"
      },
      {
        id: 6,
        content_type_id: 8,
        content_type_name: "Exercises",
        published: "2020-04-14",
        title: "Walk"
      },
    ]);
    done();
  });
});

describe('GET /content/:contentId', () => {
  it('returns data correctly', async (done) => {
    const { body } = await request(server).get('/content/1').end();
    expect(body).toEqual({content_type_id: 8, items: "[]"});  // ?
    done();
  });
});
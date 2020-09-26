import request from 'supertest';

import { server } from './index.test';

export function contentTests() {
  describe('GET /content/links/:contentTypeName', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/content/links/exercises');
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
    });
  });

  describe('GET /content/:contentId', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/content/1');
      expect(body).toEqual({content_type_id: 8, items: []});
    });
  });
}
import request from 'supertest';

import { server } from './index.test';

export function contentTests() {
  describe('GET /content/links/:type', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/content/links/Exercises');
      expect(body).toEqual([
        {
          id: "NOBSC Bike",
          type: "Exercises",
          published: "2020-04-14",
          title: "Bike"
        },
        {
          id: "NOBSC Pullup",
          type: "Exercises",
          published: "2020-04-14",
          title: "Pullup"
        },
        {
          id: "NOBSC Pushup",
          type: "Exercises",
          published: "2020-04-14",
          title: "Pushup"
        },
        {
          id: "NOBSC Run",
          type: "Exercises",
          published: "2020-04-14",
          title: "Run"
        },
        {
          id: "NOBSC Squat",
          type: "Exercises",
          published: "2020-04-14",
          title: "Squat"
        },
        {
          id: "NOBSC Walk",
          type: "Exercises",
          published: "2020-04-14",
          title: "Walk"
        },
      ]);
    });
  });

  describe('GET /content/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/content/NOBSC%20Walk');
      expect(body).toEqual({items: []});
    });
  });
}
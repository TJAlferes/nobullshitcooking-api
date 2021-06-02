import request from 'supertest';

import { server } from '../index.test';

// TO DO: log in first? (and for others)
export function staffContentTests() {
  describe('POST /staff/content/create', () => {
    it('creates content', async () => {
      const { body } = await request(server).post('/staff/content/create')
        .send({contentTypeId: 4, published: null, title: "Title", items: []});
      expect(body).toEqual({message: 'Content created.'});
    });
  });

  describe('PUT /staff/content/update', () => {
    it('updates content', async () => {
      const { body } = await request(server).put('/staff/content/update')
        .send({
          id: 88,
          contentTypeId: 4,
          published: null,
          title: "Title",
          items: []
        });
      expect(body).toEqual({message: 'Content updated.'});
    });
  });

  describe('DELETE /staff/content/delete', () => {
    it('deletes content', async () => {
      const { body } = await request(server).delete('/staff/content/delete')
        .send({id: 88});
      expect(body).toEqual({message: 'Content deleted.'});
    });
  });
}
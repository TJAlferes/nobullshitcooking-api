import request from 'supertest';

import { server } from '../index.test';

export function staffContentTests() {
  describe('POST /staff/content/create', () => {
    it('creates content', async () => {
      const { body } = await request(server).post('/staff/content/create')
        .send({type: "Type", published: null, title: "Title", items: []});
      expect(body).toEqual({message: 'Content created.'});
    });
  });

  describe('PUT /staff/content/update', () => {
    it('updates content', async () => {
      const { body } = await request(server).put('/staff/content/update')
        .send({
          id: "NOBSC Title",
          type: "Type",
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
        .send({id: "NOBSC Title"});
      expect(body).toEqual({message: 'Content deleted.'});
    });
  });
}
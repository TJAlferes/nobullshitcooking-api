import request from 'supertest';

import { server } from '../index.test';

export function userContentTests() {
  describe('POST /user/content/create', () => {
    it('creates content', async () => {
      const { body } = await request(server).post('/user/content/create')
        .send({contentTypeId: 4, published: null, title: "Title", items: []});
      expect(body).toEqual({message: 'Content created.'}); 
    });
  });

  describe('PUT /user/content/update', () => {
    it('updates content', async () => {
      const { body } = await request(server).put('/user/content/update')
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

  describe('DELETE /user/content/delete', () => {
    it('deletes content', async () => {
      const { body } = await request(server).delete('/user/content/delete')
        .send({id: 88});
      expect(body).toEqual({message: 'Content deleted.'}); 
    });
  });
}
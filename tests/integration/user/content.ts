import request from 'supertest';

import { server } from '../index.test';

export function userContentTests() {
  describe('POST /user/content/create', () => {
    it('creates content', async () => {
      const { body } = await request(server).post('/user/content/create')
        .send({type: "Type", published: null, title: "Title", items: []});
      expect(body).toEqual({message: 'Content created.'}); 
    });
  });

  describe('PUT /user/content/update', () => {
    it('updates content', async () => {
      const { body } = await request(server).put('/user/content/update')
        .send({
          id: "Username Title",
          type: "Type",
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
        .send({id: "Username Title"});
      expect(body).toEqual({message: 'Content deleted.'}); 
    });
  });
}
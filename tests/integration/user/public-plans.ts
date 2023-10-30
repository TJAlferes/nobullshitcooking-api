import request from 'supertest';

import { server } from '../index.test.js';

export function publicPlansTests() {
  describe('POST /user/plan/create', () => {
    it('creates plan', async () => {
      const { body } = await request(server).post('/user/plan/create').send({name: "Name", data: {}});
      expect(body).toEqual({message: 'Plan created.'});
    });
  });

  describe('PUT /user/plan/update', () => {
    it('updates plan', async () => {
      const { body } = await request(server).put('/user/plan/update').send({id: 1, name: "Name", data: {}});
      expect(body).toEqual({message: 'Plan updated.'});
    });
  });

  describe('DELETE /user/plan/delete', () => {
    it('deletes plan', async () => {
      const { body } = await request(server).delete('/user/plan/delete').send({id: 1});
      expect(body).toEqual({message: 'Plan deleted.'});
    });
  });
}
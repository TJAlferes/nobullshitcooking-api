import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test.js';

export function privateEquipmentTests() {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    agent = request.agent(server);

    await agent
      .post('/v1/login')
      .send({
        email: 'fakeuser1@gmail.com',
        password: 'fakepassword'
      });
  });

  afterEach(async () => {
    await agent.post('/v1/logout');
  });

  describe('POST /users/FakeUser1/private-equipment', () => {
    it('creates equipment', async () => {
      const res = await agent
        .post('/users/FakeUser1/private-equipment')
        .send({
          equipment_type_id: 4,
          equipment_name: "Equipment Name",
          notes: "Notes...",
          image_id: ""
        });

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /users/FakeUser1/private-equipment', () => {
    it('updates equipment', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-equipment')
        .send({
          id: 88,
          equipment_type_id: 4,
          equipment_name: "Equipment Name",
          notes: "Notes...",
          image_id: ""
        });

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /users/FakeUser1/private-equipment/:equipment_id', () => {
    it('deletes equipment', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-equipment/');

      expect(res.status).toBe(204); 
    });
  });
}

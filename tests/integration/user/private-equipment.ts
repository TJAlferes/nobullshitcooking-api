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
    it('handles success', async () => {
      const res = await agent
        .post('/users/FakeUser1/private-equipment')
        .send({
          equipment_type_id: 4,
          equipment_name: "Name",
          notes: "Notes...",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /users/FakeUser1/private-equipment', () => {
    it('handles not found', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-equipment')
        .send({
          equipment_id: "018b5ade-5449-7d0z-b42z-f262d9f0b6fz",
          equipment_type_id: 3,
          equipment_name: "Nonexisting Ladle",
          notes: "Good soups...",
          image_id: "018b5ade-5437-7ea1-a351-299b6a84f784",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-equipment')
        .send({
          equipment_id: "018b5ade-5440-7d0e-b42d-f262d9f0b6fd",
          equipment_type_id: 3,
          equipment_name: "Stolen Spatula",
          notes: "Good times...",
          image_id: "018b5ade-5438-7ea2-a352-299b6a84f785",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-equipment')
        .send({
          equipment_id: "018b5ade-5439-7d0d-b42c-f262d9f0b6fc",
          equipment_type_id: 3,
          equipment_name: "Mom's Ladle",
          notes: "Good soups...",
          image_id: "018b5ade-5437-7ea1-a351-299b6a84f784",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /users/FakeUser1/private-equipment/:equipment_id', () => {
    it('handles not found', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-equipment/018b5ade-5449-7d0z-b42z-f262d9f0b6fz');

      expect(res.status).toBe(404); 
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-equipment/018b5ade-5440-7d0e-b42d-f262d9f0b6fd');

      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-equipment/018b5ade-5439-7d0d-b42c-f262d9f0b6fc');

      expect(res.status).toBe(204); 
    });
  });
}

import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test.js';

export function privateIngredientsTests() {
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

  describe('POST /users/FakeUser1/private-ingredients', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/users/FakeUser1/private-ingredients')
        .send({
          ingredient_type_id: 4,
          ingredient_brand: "Brand",
          ingredient_variety: "Variety",
          ingredient_name: "Name",
          alt_names: [],
          notes: "Notes...",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /users/FakeUser1/private-ingredients', () => {
    it('handles not found', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-ingredients')
        .send({
          ingredient_id: "018b5ade-dc59-7dc9-92dz-3ff30123668z",
          ingredient_type_id: 4,
          ingredient_brand: "Brand",
          ingredient_variety: "Variety",
          ingredient_name: "Name",
          alt_names: [],
          notes: "Notes...",
          image_id: "018b5ade-dc54-7db1-870g-00733ee1bedf",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-ingredients')
        .send({
          ingredient_id: "018b5ade-dc56-7dc1-92de-3ff30123668c",
          ingredient_type_id: 4,
          ingredient_brand: "Brand",
          ingredient_variety: "Variety",
          ingredient_name: "Name",
          alt_names: [],
          notes: "Notes...",
          image_id: "018b5ade-dc55-7db2-870h-00733ee1bedg",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/users/FakeUser1/private-ingredients')
        .send({
          ingredient_id: "018b5ade-dc55-7dc0-92dd-3ff30123668b",
          ingredient_type_id: 4,
          ingredient_brand: "Brand",
          ingredient_variety: "Variety",
          ingredient_name: "Name",
          alt_names: [],
          notes: "Notes...",
          image_id: "018b5ade-dc54-7db1-870g-00733ee1bedf",
          image_filename: "default",
          caption: ""
        });

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /users/FakeUser1/private-ingredients', () => {
    it('handles not found', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-ingredients/018b5ade-dc59-7dc9-92dz-3ff30123668z');

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-ingredients/018b5ade-dc56-7dc1-92de-3ff30123668c');

      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/users/FakeUser1/private-ingredients/018b5ade-dc55-7dc0-92dd-3ff30123668b');

      expect(res.status).toBe(204);
    });
  });
}

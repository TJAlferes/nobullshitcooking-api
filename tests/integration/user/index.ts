import request from 'supertest';

import { server } from '../index.test.js';

export { userAuthTests }           from './auth.js';
export { userEquipmentTests }      from './equipment.js';
export { userFavoriteRecipeTests } from './favoriteRecipe.js';
//export { userFriendshipTests }     from './friendship.js';
export { userIngredientTests }     from './ingredient.js';
export { userPlanTests }           from './plan.js';
export { userRecipeTests }         from './recipe.js';
export { userSavedRecipeTests }    from './savedRecipe.js';

export function userTests() {
  describe('POST /v1/users', () => {
    it('handles email already in use', async () => {
      const res = await request(server).post('/v1/users').send({
        email:    "newuser@site.com",
        password: "secret",
        username: "newuser"
      });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({message: 'Email already in use.'});
    });

    it('handles username already in use', async () => {
      const res = await request(server).post('/v1/users').send({
        email:    "newuser@site.com",
        password: "secret",
        username: "newuser"
      });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({message: 'Username already in use.'});
    });
    
    it('handles success', async () => {
      const res = await request(server).post('/v1/users').send({
        email:    "newuser@site.com",
        password: "secret",
        username: "newuser"
      });

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/RainbowDash/email', () => {
    it('handles non-existing user', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowCrash/email')
        .send({new_email: 'superrainbowcrash@nobullshitcooking.com'});

      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: 'User does not exist.'});
    });

    it('handles new_email already in use', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowDash/email')
        .send({new_email: 'rainbowdash@nobullshitcooking.com'});

      expect(res.status).toBe(409);
      expect(res.body).toEqual({message: 'Email already in use.'});
    });

    it('handles success', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowDash/email')
        .send({new_email: 'superrainbowdash@nobullshitcooking.com'});

      expect(res.status).toBe(204);
    });
  });

  describe('PATCH /v1/users/RainbowDash/password', () => {
    it('handles non-existing user', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowCrash/password')
        .send({new_password: 'FasterThanFast'});

      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: 'User does not exist.'});
    });

    it('handles success', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowDash/password')
        .send({new_password: 'FasterThanFast'});

      expect(res.status).toBe(204);
    });
  });

  describe('PATCH /v1/users/RainbowDash/username', () => {
    it('handles non-existing user', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowCrash/username')
        .send({new_username: 'SuperRainbowCrash'});

      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: 'User does not exist.'});
    });

    it('handles new_username already in use', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent
        .patch('/v1/users/RainbowDash/username')
        .send({new_username: 'RainbowDash'});

      expect(res.status).toBe(409);
      expect(res.body).toEqual({message: 'Username already in use.'});
    });

    it('handles success', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });
        
      const res = await agent
        .patch('/v1/users/RainbowDash/username')
        .send({new_username: 'SuperRainbowDash'});

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/RainbowDash', () => {
    it('handles success', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'rainbowdash@nobullshitcooking.com',
          password: 'FasterThanYou'
        });

      const res = await agent.delete('/v1/users/RainbowDash');

      expect(res.status).toBe(204);
    });
  });
}

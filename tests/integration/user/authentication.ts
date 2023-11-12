import request from 'supertest';

import { server } from '../index.test.js';

export function authenticationTests() {
  describe('POST /v1/resend-confirmation-code', () => {
    it('handles non-existing user', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });
    
    it('handles already confirmed user', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Already confirmed.');
    });

    it('handles incorrect password', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'incorrect'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles success', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/users')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser'
        });
      
      const res = await agent
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(204);
    });
  });

  describe('POST /v1/confirm', () => {
    it('handles incorrect confirmation_code', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: '01010101-0101-0101-0101-010incorrect'});

      expect(res.status).toBe(404);
      expect(res.body.message)
        .toBe('An issue occurred, please double check your info and try again.');
    });

    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: '01010101-0101-0101-0101-010101010101'});

      expect(res.status).toBe(204);
    });
  });

  describe('POST /v1/login', () => {
    it('handles already logged in user', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });
      
      const res = await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });

      //status???
      expect(res.body.message).toBe('Already logged in.');
    });

    it('handles non-existing user', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles unconfirmed user', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: 'fakeunconfirmeduser1@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Please check your email for your confirmation code.');
    });

    it('handles incorrect password', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'incorrect'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toContain({auth_email: 'fakeuser1@gmail.com'});
    });
  });

  describe('POST /v1/forgot-password', () => {
    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/forgot-password')
        .send({email: 'fakeuser2@gmail.com'});

      expect(res.status).toBe(201);
    });

    it('handles not found', async () => {
      const res = await request(server)
        .post('/v1/forgot-password')
        .send({email: 'nonexistinguser@gmail.com'});

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /v1/reset-password', () => {
    it('handles success', async () => {
      const res = await request(server)
        .patch('/v1/reset-password')
        .send({
          email: 'fakeuser1@gmail.com',
          temporary_password: '01010101-0101-0101-0101-010101010101',  // in DB: "$2b$10$mHF4dvye9VGKPn16fDNnN..z/Ay4xH5Z5iUFcwgL.I/6c0qPRlqsO"
          new_password: "newpassword"
        });
      
      expect(res.status).toBe(204);
    });

    it('handles success', async () => {
      const res = await request(server)
        .patch('/v1/reset-password')
        .send({
          email: 'nonexistinguser@gmail.com',
          temporary_password: '01010101-0101-0101-0101-010101010101',  // in DB: "$2b$10$mHF4dvye9VGKPn16fDNnN..z/Ay4xH5Z5iUFcwgL.I/6c0qPRlqsO"
          new_password: "newpassword"
        });
      
      expect(res.status).toBe(404);
    });
  });
}

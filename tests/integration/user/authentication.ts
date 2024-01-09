import type { Express } from 'express';

import { TestAgent } from '../utils/TestAgent';

export function authenticationTests(app: Express) {
  let agent: TestAgent;

  beforeAll(async () => {
    agent = new TestAgent(app);
    await agent.setCsrfToken();
  });

  describe('POST /v1/resend-confirmation-code', () => {
    it('handles success', async () => {
      await agent
        .post('/v1/users', {
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser'
        });
      
      const res = await agent
        .post('/v1/resend-confirmation-code', {
          email: 'fakeuser@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(204);
    });

    it('handles non-existing user', async () => {
      const res = await agent
        .post('/v1/resend-confirmation-code', {
          email: 'nonexistinguser@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles incorrect password', async () => {
      const res = await agent
        .post('/v1/resend-confirmation-code', {
          email: 'fakeuser1@gmail.com',
          password: 'incorrect'
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });
    
    it('handles already confirmed user', async () => {
      const res = await agent
        .post('/v1/resend-confirmation-code', {
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Already confirmed.');
    });
  });

  describe('POST /v1/confirm', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/confirm', {confirmation_code: '01010101-0101-0101-0101-010101010101'});
      expect(res.status).toBe(204);
    });

    it('handles incorrect confirmation_code', async () => {
      const res = await agent
        .post('/v1/confirm', {confirmation_code: '01010101-0101-0101-0101-01010101010f'});
      expect(res.status).toBe(404);
      expect(res.body.message)
        .toBe('An issue occurred, please double check your info and try again.');
    });
  });

  describe('POST /v1/login', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/login', {
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(201);
      expect(res.body.auth_id).toBe('33333333-3333-3333-3333-333333333333');
      expect(res.body.auth_email).toBe('fakeuser1@gmail.com');
      expect(res.body.authname).toBe('FakeUser1');
      expect(res.body.auth_avatar).toBe('default');
    });
    
    it('handles already logged in user', async () => {
      await agent
        .post('/v1/login', {
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });
      const res = await agent
        .post('/v1/login', {
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Already logged in.');
    });

    it('handles non-existing user', async () => {
      const res = await agent
        .post('/v1/login', {
          email: 'nonexistinguser@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles unconfirmed user', async () => {
      const res = await agent
        .post('/v1/login', {
          email: 'fakeunconfirmeduser1@gmail.com',
          password: 'fakepassword'
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Please check your email for your confirmation code.');
    });

    it('handles incorrect password', async () => {
      const res = await agent
        .post('/v1/login', {
          email: 'fakeuser1@gmail.com',
          password: 'incorrect'
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });
  });

  describe('POST /v1/forgot-password', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/forgot-password', {email: 'fakeuser2@gmail.com'});
      expect(res.status).toBe(201);
    });

    it('handles not found', async () => {
      const res = await agent
        .post('/v1/forgot-password', {email: 'nonexistinguser@gmail.com'});
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /v1/reset-password', () => {
    it('handles success', async () => {
      const res = await agent
        .patch('/v1/reset-password', {
          email: 'fakeuser1@gmail.com',
          temporary_password: '01010101-0101-0101-0101-010101010101',  // in DB: "$2b$10$mHF4dvye9VGKPn16fDNnN..z/Ay4xH5Z5iUFcwgL.I/6c0qPRlqsO"
          new_password: 'newpassword'
        });
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/reset-password', {
          email: 'nonexistinguser@gmail.com',
          temporary_password: '01010101-0101-0101-0101-010101010101',  // in DB: "$2b$10$mHF4dvye9VGKPn16fDNnN..z/Ay4xH5Z5iUFcwgL.I/6c0qPRlqsO"
          new_password: 'newpassword'
        });
      expect(res.status).toBe(404);
    });
  });
}

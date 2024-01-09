import type { Express } from 'express';
import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

export function authenticationTests(app: Express) {
  let agent: SuperAgentTest;
  let csrfToken = '';

  beforeAll(async () => {
    agent = request.agent(app);
    const res = await agent.get('/v1/csrf-token');
    csrfToken = res.body.csrfToken;
  });

  describe('POST /v1/resend-confirmation-code', () => {
    it('handles success', async () => {
      await agent
        .post('/v1/users')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);
      
      const res = await agent
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(204);
    });

    it('handles non-existing user', async () => {
      const res = await agent
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles incorrect password', async () => {
      const res = await agent
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'incorrect'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });
    
    it('handles already confirmed user', async () => {
      const res = await agent
        .post('/v1/resend-confirmation-code')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Already confirmed.');
    });
  });

  describe('POST /v1/confirm', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/confirm')
        .send({confirmation_code: '01010101-0101-0101-0101-010101010101'})
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(204);
    });

    it('handles incorrect confirmation_code', async () => {
      const res = await agent
        .post('/v1/confirm')
        .send({confirmation_code: '01010101-0101-0101-0101-01010101010f'})
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(404);
      expect(res.body.message)
        .toBe('An issue occurred, please double check your info and try again.');
    });
  });

  describe('POST /v1/login', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(201);
      expect(res.body.auth_id).toBe('33333333-3333-3333-3333-333333333333');
      expect(res.body.auth_email).toBe('fakeuser1@gmail.com');
      expect(res.body.authname).toBe('FakeUser1');
      expect(res.body.auth_avatar).toBe('default');
    });
    
    it('handles already logged in user', async () => {
      await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);
      
      const res = await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Already logged in.');
    });

    it('handles non-existing user', async () => {
      const res = await agent
        .post('/v1/login')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });

    it('handles unconfirmed user', async () => {
      const res = await agent
        .post('/v1/login')
        .send({
          email: 'fakeunconfirmeduser1@gmail.com',
          password: 'fakepassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Please check your email for your confirmation code.');
    });

    it('handles incorrect password', async () => {
      const res = await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'incorrect'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password.');
    });
  });

  describe('POST /v1/forgot-password', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/forgot-password')
        .send({email: 'fakeuser2@gmail.com'})
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(201);
    });

    it('handles not found', async () => {
      const res = await agent
        .post('/v1/forgot-password')
        .send({email: 'nonexistinguser@gmail.com'})
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /v1/reset-password', () => {
    it('handles success', async () => {
      const res = await agent
        .patch('/v1/reset-password')
        .send({
          email: 'fakeuser1@gmail.com',
          temporary_password: '01010101-0101-0101-0101-010101010101',  // in DB: "$2b$10$mHF4dvye9VGKPn16fDNnN..z/Ay4xH5Z5iUFcwgL.I/6c0qPRlqsO"
          new_password: 'newpassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);
      
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/reset-password')
        .send({
          email: 'nonexistinguser@gmail.com',
          temporary_password: '01010101-0101-0101-0101-010101010101',  // in DB: "$2b$10$mHF4dvye9VGKPn16fDNnN..z/Ay4xH5Z5iUFcwgL.I/6c0qPRlqsO"
          new_password: 'newpassword'
        })
        .set('X-CSRF-Token', csrfToken)
        .withCredentials(true);
      
      expect(res.status).toBe(404);
    });
  });
}

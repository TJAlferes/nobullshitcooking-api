import request from 'supertest';

import { server } from '../index.test.js';

export function userAuthTests() {
  describe('POST /v1/resend-confirmation-code', () => {
    it('handles non-existing user', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: "nonuser@site.com",
          password: "secret"
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({message: "Incorrect email or password."});
    });
    
    it('handles already confirmed user', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: "newuser@site.com",
          password: "secret"
        });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({message: "Already confirmed."});
    });

    it('handles incorrect password', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: "newuser@site.com",
          password: "incorrect"
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({message: "Already confirmed."});
    });

    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/resend-confirmation-code')
        .send({
          email: "newuser@site.com",
          password: "secret"
        });

      expect(res.status).toBe(204);
    });
  });



  describe('POST /v1/confirm', () => {
    it('handles non-existing user', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: "01010101-0101-0101-0101-010101010101"});

      expect(res.status).toBe(404);
      expect(res.body)
        .toEqual({message: "An issue occurred, please double check your info and try again."});
    });

    it('handles already confirmed user', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: "01010101-0101-0101-0101-010101010101"});

      expect(res.status).toBe(409);
      expect(res.body).toEqual({message: "Already confirmed."});
    });

    it('handles incorrect confirmation_code', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: "01010101-0101-0101-0101-010incorrect"});

      expect(res.status).toBe(404);
      expect(res.body)
        .toEqual({message: "An issue occurred, please double check your info and try again."});
    });

    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: "01010101-0101-0101-0101-010101010101"});

      expect(res.status).toBe(204);
    });
  });

  

  describe('POST /login', () => {
    it('handles already logged in user', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: "loggedinuser@site.com",
          password: "secret"
        });

      expect(res.body).toEqual({message: 'Already logged in.'});
    });

    it('handles non-existing user', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: "nonuser@site.com",
          password: "secret"
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({message: "Incorrect email or password."});
    });

    it('handles unconfirmed user', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: "unconfirmeduser@site.com",
          password: "secret"
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({message: "Please check your email for your confirmation code."});
    });

    it('handles incorrect password', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: "unconfirmeduser@site.com",
          password: "incorrect"
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({message: "Incorrect email or password."});
    });

    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/login')
        .send({
          email: "user@site.com",
          password: "secret"
        });

      expect(res.status).toBe(201);
      expect(res.body).toContain({auth_email: "user@site.com"});
    });
  });
}

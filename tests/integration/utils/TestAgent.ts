import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import type { Express } from 'express';

export class TestAgent {
  agent: SuperAgentTest;
  csrfToken = '';

  constructor(app: Express) {
    this.agent = request.agent(app);
  }

  async getToken() {
    const res = await this.agent.get('/v1/csrf-token');
    this.csrfToken = res.body.csrfToken;
  }

  async post(url: string, body: any) {
    const res = await this.agent
      .post(url)
      .send(body)
      .set('X-CSRF-Token', this.csrfToken)
      .withCredentials(true);
    return res;
  }

  async patch(url: string, body: any) {
    const res = await this.agent
      .patch(url)
      .send(body)
      .set('X-CSRF-Token', this.csrfToken)
      .withCredentials(true);
    return res;
  }

  async delete(url: string) {
    const res = await this.agent
      .delete(url)
      .set('X-CSRF-Token', this.csrfToken)
      .withCredentials(true);
    return res;
  }
}

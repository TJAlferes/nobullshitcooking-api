import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import type { AwsClientStub } from 'aws-sdk-client-mock';
import type { Express } from 'express';

import { AwsS3PublicUploadsClient } from '../../../src/modules/aws-s3/public-uploads/client';
import { TestAgent } from '../utils/TestAgent';

const S3ClientMock: AwsClientStub<S3Client> = mockClient(AwsS3PublicUploadsClient);
//AwsS3ClientMock.onAnyCommand().resolves();

// TO DO: test required_*

export function publicRecipesTests(app: Express) {
  const recipe_upload = {
    recipe_type_id: 4,
    cuisine_id: 4,
    title: 'Title',
    description: 'Description.',
    active_time: '00:04',
    total_time: '04:00',
    directions: 'Directions.',
    required_methods: [],
    required_equipment: [],
    required_ingredients: [],
    required_subrecipes: [],
    recipe_image: {
      image_id: '',
      image_filename: 'recipe_image',
      caption: 'caption',
      type: 1
    },
    equipment_image: {
      image_id: '',
      image_filename: 'equipment_image',
      caption: 'caption',
      type: 2
    },
    ingredients_image: {
      image_id: '',
      image_filename: 'ingredients_image',
      caption: 'caption',
      type: 3
    },
    cooking_image: {
      image_id: '',
      image_filename: 'cooking_image',
      caption: 'caption',
      type: 4
    }
  };
  const recipe_update_upload = {
    recipe_type_id: 8,
    cuisine_id: 8,
    title: 'Updated Title',
    description: 'Updated description.',
    active_time: '00:04',
    total_time: '04:00',
    directions: 'Updated directions.',
    required_methods: [],
    required_equipment: [],
    required_ingredients: [],
    required_subrecipes: [],
    recipe_image: {
      image_id: '11116942-6b2d-7b8d-90bf-ff43c22c0ed9',
      image_filename: 'recipe_image',
      caption: 'caption',
      type: 1
    },
    equipment_image: {
      image_id: '11116942-6b2d-7943-8ab6-34fea11517ff',
      image_filename: 'equipment_image',
      caption: 'caption',
      type: 2
    },
    ingredients_image: {
      image_id: '11116942-6b2d-7943-8ab6-34ff0ddce785',
      image_filename: 'ingredients_image',
      caption: 'caption',
      type: 3
    },
    cooking_image: {
      image_id: '11116942-6b2d-7943-8ab6-35007644576d',
      image_filename: 'cooking_image',
      caption: 'caption',
      type: 4
    }
  };

  let agent: TestAgent;

  beforeAll(async () => {
    agent = new TestAgent(app);
    await agent.setCsrfToken();
  });

  beforeEach(async () => {
    S3ClientMock.reset();

    await agent.post('/v1/login', {
      email: 'fakeuser1@gmail.com',
      password: 'fakepassword'
    });
  });

  afterEach(async () => {
    await agent.post('/v1/logout');
  });

  afterAll(() => {
    S3ClientMock.restore();
  });

  describe('GET /v1/users/:username/public-recipes/:recipe_id/edit', () => {
    it('handles success', async () => {
      const res = await agent
        .get('/v1/users/FakeUser1/public-recipes/11116942-6b2f-7943-8ab6-3509084cf00e/edit');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /v1/users/:username/public-recipes/:title', () => {
    it('handles success', async () => {
      const res = await agent
        .get('/v1/users/FakeUser1/public-recipes/Public%20Grilled%20Chicken');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /v1/users/:username/public-recipes', () => {
    it('handles success', async () => {
      const res = await agent.post('/v1/users/FakeUser1/public-recipes', recipe_upload);
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/:username/public-recipes', () => {
    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-recipes', {
          recipe_id: '11116942-6b2f-7943-8ab6-3509084cf00e',
          ...recipe_update_upload
        });
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-recipes', {
          recipe_id: '11116942-6b2f-7943-8ab6-3509084c0000',
          ...recipe_update_upload
        });
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-recipes', {
          recipe_id: '018b6942-6b3f-7944-8ab7-3509084cf00f',
          ...recipe_update_upload
        });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/public-recipes/:recipe_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-recipes/11116942-6b2f-7943-8ab6-3509084cf00e');
      expect(res.status).toBe(204);
    });
    
    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-recipes/11116942-6b2f-7943-8ab6-3509084c0000');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-recipes/018b6942-6b3f-7944-8ab7-3509084cf00f');
      expect(res.status).toBe(403);
    });
  });
}

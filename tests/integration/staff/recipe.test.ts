import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /staff/recipe/create', () => {
  it('creates recipe', async (done) => {
    const { body } = await request(server).post('/staff/recipe/create')
      .send({
        recipeTypeId: 4,
        cuisineId: 4,
        title: "Title",
        description: "Description.",
        activeTime: "00:00:04",
        totalTime: "00:04:00",
        directions: "Directions.",
        recipeImage: "recipeImage",
        equipmentImage: "equipmentImage",
        ingredientsImage: "ingredientsImage",
        cookingImage: "cookingImage",
        ownership: "public"
      });
    expect(body).toEqual();
    done(); 
  });
});

describe('PUT /staff/recipe/update', () => {
  it('updates recipe', async (done) => {
    const { body } = await request(server).put('/staff/recipe/update')
      .send({
        id: 88,
        recipeTypeId: 4,
        cuisineId: 4,
        title: "Title",
        description: "Description.",
        activeTime: "00:00:04",
        totalTime: "00:04:00",
        directions: "Directions.",
        recipeImage: "recipeImage",
        equipmentImage: "equipmentImage",
        ingredientsImage: "ingredientsImage",
        cookingImage: "cookingImage"
      });
    expect(body).toEqual();
    done(); 
  });
});

describe('DELETE /staff/recipe/delete', () => {
  it('deletes recipe', async (done) => {
    const { body } = await request(server).delete('/staff/recipe/delete')
      .send({id: 88});
    expect(body).toEqual();
    done(); 
  });
});
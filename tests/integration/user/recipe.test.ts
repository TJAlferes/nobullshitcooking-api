import request from 'supertest';

const { server } = require('../../../src/app');

beforeEach(async () => {
  // clean the test db
});

//afterEach() ?

describe('POST /user/recipe/create', () => {
  it('creates recipe', async (done) => {
    const { body } = await request(server).post('/user/recipe/create')
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
    expect(body).toEqual({message: 'Recipe created.'});
    done(); 
  });
});

describe('PUT /user/recipe/update', () => {
  it('updates recipe', async (done) => {
    const { body } = await request(server).put('/user/recipe/update')
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
    expect(body).toEqual({message: 'Recipe updated.'});
    done(); 
  });
});

describe('DELETE /user/recipe/delete', () => {
  it('deletes recipe', async (done) => {
    const { body } = await request(server).delete('/user/recipe/delete')
      .send({id: 88});
    expect(body).toEqual({message: 'Recipe deleted.'});
    done(); 
  });
});
import { uuidv7 } from 'uuidv7';
import * as fs from 'fs';

const recipe_data = [
  {
    recipe_type_id: 3,
    cuisine_id: 3,
    title: "Grilled Chicken",
    description: "A classic",
    active_time: "01:00:00",
    total_time: "09:00:00",
    directions: "Marinate chicken..."
  },
  {
    recipe_type_id: 6,
    cuisine_id: 6,
    title: "Fish and Potato Soup",
    description: "Warms you up",
    active_time: "00:15:00",
    total_time: "01:00:00",
    directions: "Saute onion..."
  },
  {
    recipe_type_id: 8,
    cuisine_id: 8,
    title: "Guinness Beef Stew",
    description: "Satisfying",
    active_time: "00:30:00",
    total_time: "04:00:00",
    directions: "Sear beef..."
  }
];

const image_data = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];

const recipe_image_data = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];

const recipe_ingredient_data = [
  [1, 3],
  [1, 6],
  [3, 7],
  [1, 8],
  [10, 1]
];

const recipe_method_data = [13, 7, 4, 3, 12];

const NOBSC_USER_ID = "11111111-1111-1111-1111-111111111111";

const image_records = [];
const recipe_records = [];
const recipe_image_records = [];
const recipe_equipment_records = [];   // (recipe_id, amount, equipment_id)
const recipe_ingredient_records = [];  // (recipe_id, amount, unit_id, ingredient_id)
const recipe_method_records = [];      // (recipe_id, method_id)
const recipe_subrecipe_records = [];   // (recipe_id, amount, unit_id, subrecipe_id)

for (let i = 0; i < recipe_data.length; i++) {
  const recipe_id = uuidv7();

  recipe_records.push({
    recipe_id,
    author_id: NOBSC_USER_ID,
    owner_id: NOBSC_USER_ID,
    ...recipe_data[i]
  });

  // 4 times
  const image_id = uuidv7();
  image_records.push({
    image_id,
    image_filename,
    caption: ``,
    author_id: NOBSC_USER_ID,
    owner_id: NOBSC_USER_ID
  });
  recipe_image_records.push({
    recipe_id,
    image_id,
    type: 1  // TO DO: finish
  });

  recipe_equipment_records.push({
    recipe_id,
    amount: 1,
    equipment_id: "018b5ade-5438-7d0c-b42b-f2641487f7cc"
  });

  recipe_ingredient_records.push({
    recipe_id,
    amount:        recipe_ingredient_data[i][0],
    unit_id:       recipe_ingredient_data[i][1],
    ingredient_id: recipe_ingredient_data[i][2]
  });

  recipe_method_records.push({
    recipe_id,
    method_id: recipe_method_data[i]
  });

  recipe_subrecipe_records.push({
    recipe_id,
    amount:       recipe_subrecipe_data[i][0],
    unit_id:      recipe_subrecipe_data[i][1],
    subrecipe_id: recipe_subrecipe_data[i][2]
  });
}

fs.writeFileSync(
  'generated-recipes.json',
  JSON.stringify(recipe_records, null, 2),
  'utf-8'
);
console.log('recipes generated');

fs.writeFileSync(
  'generated-images.json',
  JSON.stringify(image_records, null, 2),
  'utf-8'
);
console.log('images generated');

fs.writeFileSync(
  'generated-recipe-images.json',
  JSON.stringify(recipe_image_records, null, 2),
  'utf-8'
);
console.log('recipe images generated');

fs.writeFileSync(
  'generated-recipe-equipments.json',
  JSON.stringify(recipe_equipment_records, null, 2),
  'utf-8'
);
console.log('recipe equipment generated');

fs.writeFileSync(
  'generated-recipe-ingredients.json',
  JSON.stringify(recipe_ingredient_records, null, 2),
  'utf-8'
);
console.log('recipe ingredients generated');

fs.writeFileSync(
  'generated-recipe-methods.json',
  JSON.stringify(recipe_method_records, null, 2),
  'utf-8'
);
console.log('recipe methods generated');

fs.writeFileSync(
  'generated-recipe-subrecipes.json',
  JSON.stringify(recipe_subrecipe_records, null, 2),
  'utf-8'
);
console.log('recipe subrecipes generated');

/*import { uuidv7 } from 'uuidv7';
import * as fs from 'fs';

const recipe_data = [
  {
    recipe_type_id: 3,
    cuisine_id: 1,
    title: "Grilled Chicken",
    description: "A classic",
    active_time: "01:00:00",
    total_time: "09:00:00",
    directions: "Marinate chicken..."
  },
  {
    recipe_type_id: 6,
    cuisine_id: 1,
    title: "Fish Soup",
    description: "Warms you up",
    active_time: "00:15:00",
    total_time: "01:00:00",
    directions: "Saute onion..."
  },
  {
    recipe_type_id: 8,
    cuisine_id: 1,
    title: "Beef Stew",
    description: "Satisfying",
    active_time: "00:30:00",
    total_time: "04:00:00",
    directions: "Sear beef..."
  }
];

const image_data = [
  "grilled-chicken-recipe",
  "grilled-chicken-equipment",
  "grilled-chicken-ingredients",
  "grilled-chicken-cooking",
  "fish-soup-recipe",
  "fish-soup-equipment",
  "fish-soup-ingredients",
  "fish-soup-cooking",
  "beef-stew-recipe",
  "beef-stew-equipment",
  "beef-stew-ingredients",
  "beef-stew-cooking"
];

const NOBSC_USER_ID = "11111111-1111-1111-1111-111111111111";

const image_records = [];
const recipe_records = [];
const recipe_image_records = [];
const recipe_equipment_records = [];
const recipe_ingredient_records = [];
const recipe_method_records = [];

// make the 12 images
for (let i = 0; i < image_data.length; i++) {
  image_records.push({
    image_id: uuidv7(),
    image_filename: image_data[i],
    caption: ``,
    author_id: NOBSC_USER_ID,
    owner_id: NOBSC_USER_ID
  });
}

// make the 3 recipes
for (let i = 0; i < recipe_data.length; i++) {
  const recipe_id = uuidv7();

  recipe_records.push({
    recipe_id,
    author_id: NOBSC_USER_ID,
    owner_id: NOBSC_USER_ID,
    ...recipe_data[i]
  });

  // make the 4 images associated with this recipe
  let k = 0
  if (i === 1) k = 4;
  if (i === 2) k = 8;
  for (let j = 1; j < 5; j++, k++) {
    recipe_image_records.push({
      recipe_id,
      image_id: image_records[k].image_id,
      type: j
    });
  }

  recipe_equipment_records.push({
    recipe_id,
    amount: 1,
    equipment_id: "018b5ade-5438-7d0c-b42b-f2641487f7cc"
  });

  recipe_ingredient_records.push({
    recipe_id,
    amount: 1,
    unit_id: 1,
    ingredient_id: "018b5ade-dc57-70d7-8dda-8edfdfe273da"
  });

  recipe_method_records.push({
    recipe_id,
    method_id: 1
  });
}

fs.writeFileSync(
  'generated-images.json',
  JSON.stringify(image_records, null, 2),
  'utf-8'
);
console.log('images generated');

fs.writeFileSync(
  'generated-recipes.json',
  JSON.stringify(recipe_records, null, 2),
  'utf-8'
);
console.log('recipes generated');

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
*/
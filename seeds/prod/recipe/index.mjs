import { uuidv7 } from 'uuidv7';
import * as fs from 'fs';

const data = [
  ["11111111-1111-1111-1111-111111111111", 3,  3,  "Grilled Chicken and Seasoned Rice", "Yum",       "01:00:00", "02:00:00", "Marinate chicken in a..."],
  ["21111111-1111-1111-1111-111111111111", 6,  6,  "Fish and Potato Soup",              "Nice",      "00:45:00", "01:00:00", "Heat stock..."],
  ["31111111-1111-1111-1111-111111111111", 7,  7,  "Greek Salad",                       "Who Knows", "00:08:00", "00:08:00", "Mix olive oil and red wine vinegar in bowl..."],
  ["41111111-1111-1111-1111-111111111111", 8,  8,  "Irish Guinness Beef Stew",          "Calming",   "00:45:00", "04:00:00", "Sear well just one side of the beef pieces..."],
  ["51111111-1111-1111-1111-111111111111", 11, 11, "Carrot Ginger Dressing",            "Tasty",     "00:20:00", "00:20:00", "Blend carrots and..."],
];

const NOBSC_USER_ID = "11111111-1111-1111-1111-111111111111";

const image_records = [];
const recipe_records = [];
const recipe_image_records = [];
const recipe_equipment_records = [];
const recipe_ingredient_records = [];
const recipe_method_records = [];
const recipe_subrecipe_records = [];

data.map(([
  recipe_type_id,
  cuisine_id,
  title,
  description,
  active_time,
  total_time,
  directions
]) => {
  const image_id = uuidv7();

  image_records.push({
    image_id,
    image_filename,
    caption: ``,
    author_id: NOBSC_USER_ID,
    owner_id: NOBSC_USER_ID
  });

  recipe_records.push({
    recipe_id: uuidv7(),
    recipe_type_id,
    cuisine_id,
    author_id: NOBSC_USER_ID,
    owner_id: NOBSC_USER_ID,
    title,
    description,
    active_time,
    total_time,
    directions
  });
});

fs.writeFileSync(
  'generated-images.json',
  JSON.stringify(image_records, null, 2),
  'utf-8'
);
console.log('images generated');

fs.writeFileSync(
  'generated-recipes.json',
  JSON.stringify(ingredient_records, null, 2),
  'utf-8'
);
console.log('recipes generated');

//fs.writeFileSync();
//console.log('recipe images generated');

//fs.writeFileSync();
//console.log('recipe equipment generated');

//fs.writeFileSync();
//console.log('recipe ingredients generated');

//fs.writeFileSync();
//console.log('recipe methods generated');

//fs.writeFileSync();
//console.log('recipe subrecipes generated');

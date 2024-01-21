/*import { uuidv7 } from 'uuidv7';
import * as fs from 'fs';

const data = [
  [2, "Ceramic Stone",                    "ceramic-stone"],
  [2, "Chef\'s Knife",                    "chefs-knife"],
  [2, "Cutting Board",                    "cutting-board"],
  [2, "Y Peeler",                         "y-peeler"],
  [3, "Wooden Spoon",                     "wooden-spoon"],
  [2, "Serated Knife",                    "serated-knife"],
  [2, "Rubber Spatula",                   "rubber-spatula"],
  [2, "Whisk",                            "whisk"],
  [2, "Pepper Mill",                      "pepper-mill"],
  [2, "Can Opener",                       "can-opener"],
  [2, "Side Peeler",                      "side-peeler"],
  [2, "Box Grater",                       "box-grater"],
  [2, "Small Mixing Bowl",                "small-mixing-bowl"],
  [2, "Medium Mixing Bowl",               "medium-mixing-bowl"],
  [2, "Large Mixing Bowl",                "large-mixing-bowl"],
  [2, "Salad Spinner",                    "salad-spinner"],
  [2, "Dry Measuring Cups",               "dry-measuring-cups"],
  [2, "Liquid Measuring Cups",            "liquid-measuring-cups"],
  [2, "Measuring Spoons",                 "measuring-spoons"],
  [2, "Measuring Pitcher",                "measuring-pitcher"],
  [2, "Digital Scale",                    "digital-scale"],
  [2, "Handheld Mixer",                   "handheld-mixer"],
  [2, "Blender",                          "blender"],
  [2, "Immersion Blender",                "immersion-blender"],
  [2, "Parchment Paper",                  "parchment-paper"],
  [2, "Plastic Wrap",                     "plastic-wrap"],
  [2, "Aluminum Foil",                    "aluminum-foil"],
  [2, "Cheesecloth",                      "cheesecloth"],
  
  [3, "Coffee Maker",                     "coffee-maker"],
  [3, "Tea Pot",                          "tea-pot"],
  [3, "Microwave",                        "ladle"],
  [3, "Toaster Oven",                     "ladle"],
  [3, "Small Sauce Pan",                  "small-sauce-pan"],
  [3, "Medium Sauce Pan",                 "medium-sauce-pan"],
  [3, "Medium Stock Pot",                 "medium-stock-pot"],
  [3, "Large Stock Pot",                  "large-stock-pot"],
  [3, "Stainless Steel Lidded Saute Pan", "stainless-steel-lidded-saute-pan"],
  [3, "Small Stainless Steel Skillet",    "small-stainless-steel-skillet"],
  [3, "Large Stainless Steel Skillet",    "large-stainless-steel-skillet"],
  [3, "Small Cast-Iron Skillet",          "small-cast-iron-skillet"],
  [3, "Large Cast-Iron Skillet",          "large-cast-iron-skillet"],
  [3, "Glass Baking Dish",                "glass-baking-dish"],
  [3, "Sturdy Baking Sheet",              "sturdy-baking-dish"],
  [3, "Small Gratin Dish",                "small-gratin-dish"],
  [3, "Large Gratin Dish",                "large-gratin-dish"],
  [3, "Dutch Oven",                       "dutch-oven"],
  [3, "Oven Mitts",                       "oven-mitts"],
  [3, "Splatter Screen",                  "splatter-screen"],
  [3, "Colander",                         "colander"],
  [3, "Mesh Strainer",                    "mesh-strainer"],
  [3, "Tongs",                            "tongs"],
  [3, "Slotted Spoon",                    "slotted-spoon"],
  [3, "Serving Spoon",                    "serving-spoon"],
  [3, "Spider",                           "spider"],
  [3, "Sturdy Spatula",                   "sturdy-spatula"],
  [3, "Fish Spatula",                     "fish-spatula"],
  [3, "Ladle",                            "ladle"]
];

const NOBSC_USER_ID = "11111111-1111-1111-1111-111111111111";

const image_records = [];
const equipment_records = [];

data.map(([
  equipment_type_id,
  equipment_name,
  image_filename
]) => {
  const image_id = uuidv7();
  const equipment_id = uuidv7();

  image_records.push([
    image_id,
    image_filename,
    '',
    NOBSC_USER_ID,
    NOBSC_USER_ID
  ]);

  equipment_records.push([
    equipment_id,
    equipment_type_id,
    NOBSC_USER_ID,
    equipment_name,
    '',
    image_id
  ]);
});

fs.writeFileSync(
  'generated-images.json',
  JSON.stringify(image_records, null, 2),
  'utf-8'
);

console.log('equipment images generated');

fs.writeFileSync(
  'generated-equipment.json',
  JSON.stringify(equipment_records, null, 2),
  'utf-8'
);

console.log('equipment generated');
*/
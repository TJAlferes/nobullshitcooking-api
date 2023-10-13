import type { PoolConnection } from 'mysql2/promise';
import { uuidv7 } from 'uuidv7';

const data = [
  [2, 1, "Ceramic Stone",                    "ceramic-stone"],
  [2, 1, "Chef\'s Knife",                    "chefs-knife"],
  [2, 1, "Cutting Board",                    "cutting-board"],
  [2, 1, "Y Peeler",                         "y-peeler"],
  [3, 1, "Wooden Spoon",                     "wooden-spoon"],
  [2, 1, "Serated Knife",                    "serated-knife"],
  [2, 1, "Rubber Spatula",                   "rubber-spatula"],
  [2, 1, "Whisk",                            "whisk"],
  [2, 1, "Pepper Mill",                      "pepper-mill"],
  [2, 1, "Can Opener",                       "can-opener"],
  [2, 1, "Side Peeler",                      "side-peeler"],
  [2, 1, "Box Grater",                       "box-grater"],
  [2, 1, "Small Mixing Bowl",                "small-mixing-bowl"],
  [2, 1, "Medium Mixing Bowl",               "medium-mixing-bowl"],
  [2, 1, "Large Mixing Bowl",                "large-mixing-bowl"],
  [2, 1, "Salad Spinner",                    "salad-spinner"],
  [2, 1, "Dry Measuring Cups",               "dry-measuring-cups"],
  [2, 1, "Liquid Measuring Cups",            "liquid-measuring-cups"],
  [2, 1, "Measuring Spoons",                 "measuring-spoons"],
  [2, 1, "Measuring Pitcher",                "measuring-pitcher"],
  [2, 1, "Digital Scale",                    "digital-scale"],
  [2, 1, "Handheld Mixer",                   "handheld-mixer"],
  [2, 1, "Blender",                          "blender"],
  [2, 1, "Immersion Blender",                "immersion-blender"],
  [2, 1, "Parchment Paper",                  "parchment-paper"],
  [2, 1, "Plastic Wrap",                     "plastic-wrap"],
  [2, 1, "Aluminum Foil",                    "aluminum-foil"],
  [2, 1, "Cheesecloth",                      "cheesecloth"],
  [3, 1, "Coffee Maker",                     "coffee-maker"],
  [3, 1, "Tea Pot",                          "tea-pot"],
  [3, 1, "Microwave",                        "ladle"],
  [3, 1, "Toaster Oven",                     "ladle"],
  [3, 1, "Small Sauce Pan",                  "small-sauce-pan"],
  [3, 1, "Medium Sauce Pan",                 "medium-sauce-pan"],
  [3, 1, "Medium Stock Pot",                 "medium-stock-pot"],
  [3, 1, "Large Stock Pot",                  "large-stock-pot"],
  [3, 1, "Stainless Steel Lidded Saute Pan", "stainless-steel-lidded-saute-pan"],
  [3, 1, "Small Stainless Steel Skillet",    "small-stainless-steel-skillet"],
  [3, 1, "Large Stainless Steel Skillet",    "large-stainless-steel-skillet"],
  [3, 1, "Small Cast-Iron Skillet",          "small-cast-iron-skillet"],
  [3, 1, "Large Cast-Iron Skillet",          "large-cast-iron-skillet"],
  [3, 1, "Glass Baking Dish",                "glass-baking-dish"],
  [3, 1, "Sturdy Baking Sheet",              "sturdy-baking-dish"],
  [3, 1, "Small Gratin Dish",                "small-gratin-dish"],
  [3, 1, "Large Gratin Dish",                "large-gratin-dish"],
  [3, 1, "Dutch Oven",                       "dutch-oven"],
  [3, 1, "Oven Mitts",                       "oven-mitts"],
  [3, 1, "Splatter Screen",                  "splatter-screen"],
  [3, 1, "Colander",                         "colander"],
  [3, 1, "Mesh Strainer",                    "mesh-strainer"],
  [3, 1, "Tongs",                            "tongs"],
  [3, 1, "Slotted Spoon",                    "slotted-spoon"],
  [3, 1, "Serving Spoon",                    "serving-spoon"],
  [3, 1, "Spider",                           "spider"],
  [3, 1, "Sturdy Spatula",                   "sturdy-spatula"],
  [3, 1, "Fish Spatula",                     "fish-spatula"],
  [3, 1, "Ladle",                            "ladle"]
];

export const equipment = data.map(([
  equipment_type_id,
  owner_id,
  equipment_name,
  image_id
]) => ({
  equipment_id: uuidv7(),
  equipment_type_id: equipment_type_id as number,
  owner_id:          owner_id as string,
  equipment_name:    equipment_name as string,
  image_id:          image_id as string
}));

export async function seedEquipment(conn: PoolConnection) {
  const placeholders = '(?, ?, ?, ?, ?),'.repeat(equipment.length).slice(0, -1);

  const sql = `
    INSERT INTO equipment (equipment_id, equipment_type_id, owner_id, equipment_name, image_id)
    VALUES ${placeholders}
  `;

  await conn.query(sql, equipment);
}

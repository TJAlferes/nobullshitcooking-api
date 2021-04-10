\W

DROP DATABASE nobsc;

CREATE DATABASE nobsc;

USE nobsc;

-- just wait to see what happens
-- https://github.com/uuid6/uuid6-ietf-draft/blob/master/draft-peabody-dispatch-new-uuid-format-01.txt

DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `uuidv1atov6b`(u1 BINARY(36))
RETURNS BINARY(16) DETERMINISTIC
RETURN UNHEX(CONCAT(
  SUBSTR(u1, 16, 3),
  SUBSTR(u1, 10, 4),
  SUBSTR(u1, 1, 5),
  '6',
  SUBSTR(u1, 6, 3),
  SUBSTR(u1, 20, 4),
  SUBSTR(u1, 25)
  ));
//
DELIMITER ;

DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `uuidbtoa`(u BINARY(16))
RETURNS BINARY(36) DETERMINISTIC
RETURN CONCAT(
  HEX(SUBSTR(u, 1, 4)),
  "-",
  HEX(SUBSTR(u, 5, 2)),
  "-",
  HEX(SUBSTR(u, 7, 2)),
  '-',
  HEX(SUBSTR(u, 9, 2)),
  "-",
  HEX(SUBSTR(u, 11, 6))
  );
//
DELIMITER ;

-- for use as primary key:
select uuidv1atov6b(uuid());

-- to display:
select uuidbtoa(uuidv1atov6b(uuid()));

/*

Create parent tables

*/

CREATE TABLE `content_types` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `name` varchar(60) UNIQUE NOT NULL,
  `parent` varchar(60),
  `path` varchar(255) UNIQUE NOT NULL,
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cuisines` (
  `name` varchar(40) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customers` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `email` varchar(60) UNIQUE NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipment_types` (
  `name` varchar(25) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ingredient_types` (
  `name` varchar(25) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `measurements` (
  `name` varchar(25) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `methods` (
  `name` varchar(25) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_categories` (
  `name` varchar(50) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_types` (
  `name` varchar(50) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_types` (
  `name` varchar(25) UNIQUE NOT NULL PRIMARY KEY
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
  `id` varbinary(16) NOT NULL PRIMARY KEY
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `staffname` varchar(20) NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `suppliers` (
  `id` varbinary(16) NOT NULL PRIMARY KEY
  `name` varchar(60) UNIQUE NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` varbinary(16) NOT NULL PRIMARY KEY
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `username` varchar(20) NOT NULL,
  `confirmation_code` varchar(255) DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*

Create child tables

*/

CREATE TABLE `content` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `type` varchar(60) NOT NULL,
  `authorId` varbinary(16) NOT NULL,
  `ownerId` varbinary(16) NOT NULL,
  `created` char(10) NOT NULL,
  `published` char(10),
  `title` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-content-default',
  `items` json DEFAULT NULL,
  FOREIGN KEY (`type`) REFERENCES `content_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`authorId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipment` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `type` varchar(25) NOT NULL,
  `authorId` varbinary(16) NOT NULL,
  `ownerId` varbinary(16) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-equipment-default',
  FOREIGN KEY (`type`) REFERENCES `equipment_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`authorId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grocers` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `ownerId` varbinary(16) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `notes` text NOT NULL,
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ingredients` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `type` varchar(25) NOT NULL,
  `authorId` varbinary(16) NOT NULL,
  `ownerId` varbinary(16) NOT NULL,
  `brand` varchar(50) NOT NULL DEFAULT '',
  `variety` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL,
  `fullname` varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)),
  `alt_names` json DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-ingredient-default',
  FOREIGN KEY (`type`) REFERENCES `ingredient_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`authorId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `orders` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `customerId` varchar(60) NOT NULL,
  `staffId` varbinary(16) NOT NULL,
  `created` char(10) NOT NULL,
  FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`),
  FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `products` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `category` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `variety` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `fullname` varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)) STORED,
  `alt_names` json DEFAULT NULL,
  `description` text NOT NULL,
  `specs` json DEFAULT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-product-default',
  FOREIGN KEY (`category`) REFERENCES `product_categories` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`type`) REFERENCES `product_types` (`name`) ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `order_products` (
  `orderId` varbinary(16) NOT NULL,
  `productId` varbinary(16) NOT NULL,
  FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `plans` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `authorId` varbinary(16) NOT NULL,
  `ownerId` varbinary(16) NOT NULL,
  `name` varchar(100) NOT NULL,
  `data` json DEFAULT NULL,
  FOREIGN KEY (`authorId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_suppliers` (
  `productId` varbinary(16) NOT NULL,
  `supplierId` varbinary(16) NOT NULL,
  FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipes` (
  `id` varbinary(16) NOT NULL PRIMARY KEY,
  `type` varchar(25) NOT NULL,
  `cuisine` varchar(40) NOT NULL,
  `authorId` varbinary(16) NOT NULL,
  `ownerId` varbinary(16) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(150) NOT NULL DEFAULT '',
  `active_time` time NOT NULL,
  `total_time` time NOT NULL,
  `directions` text NOT NULL,
  `recipe_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-default',
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-equipment-default',
  `ingredients_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-ingredients-default',
  `cooking_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-cooking-default',
  `video` varchar(100) NOT NULL DEFAULT '',
  FOREIGN KEY (`type`) REFERENCES `recipe_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`cuisine`) REFERENCES `cuisines` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`authorId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_equipment` (
  `recipeId` varbinary(16) NOT NULL,
  `equipmentId` varbinary(16) NOT NULL,
  `amount` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`equipmentId`) REFERENCES `equipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_ingredients` (
  `recipeId` varbinary(16) NOT NULL,
  `ingredientId` varbinary(16) NOT NULL,
  `amount` decimal(5,2) NOT NULL,
  `measurement` varchar(25) NOT NULL,
  FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`measurement`) REFERENCES `measurements` (`name`) ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_methods` (
  `recipeId` varbinary(16) NOT NULL,
  `method` varchar(25) NOT NULL,
  FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`method`) REFERENCES `methods` (`name`) ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_subrecipes` (
  `recipeId` varbinary(16) NOT NULL,
  `subrecipeId` varbinary(16) NOT NULL,
  `amount` decimal(5,2) NOT NULL,
  `measurement` varchar(25) NOT NULL,
  FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`subrecipeId`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement`) REFERENCES `measurements` (`name`) ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `favorite_recipes` (
  `userId` varbinary(16) NOT NULL,
  `recipeId` varbinary(16) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `saved_recipes` (
  `userId` varbinary(16) NOT NULL,
  `recipeId` varbinary(16) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `friendships` (
  `userId` varbinary(16) NOT NULL,
  `friendId` varbinary(16) NOT NULL,
  `status` varchar(20) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`friendId`) REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*

NOTE: we have decided to use UUIDv6 now.

Triggers

We created these triggers for two reasons:

1.
MySQL doesn't allow us
to add foreign key constraints (such as ON UPDATE CASCADE)
to columns that are used in generated columns.

As an alternative to AUTO_INCREMENT ids,
we are using natural keys, some of which are generated columns.

This adds a little complexity,
but it is a tradeoff cost we are willing to pay
for us not using AUTO_INCREMENT ids,
as AUTO_INCREMENT can have safety and scalability issues.

(Another alternative to AUTO_INCREMENT ids and natural keys is UUIDs,
but we have decided to just use natural keys.)

2.
MySQL says
to not place duplicate constraints on the same foreign key in the same table.

- In recipe_subrecipes, we would have needed duplicates on recipe.id

- In friendships, we would have needed duplicates on users.username

*/

/* customers table triggers */

DELIMITER $$
CREATE TRIGGER `customers_email_on_delete`
AFTER DELETE ON `customers` FOR EACH ROW
BEGIN
  DELETE FROM orders WHERE customer = OLD.email;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `customers_email_on_update`
AFTER UPDATE ON `customers` FOR EACH ROW
BEGIN
  UPDATE orders SET customer = NEW.email WHERE customer = OLD.email;
END; $$
DELIMITER ;

/* staff table triggers */

DELIMITER $$
CREATE TRIGGER `staff_staffname_on_delete`
AFTER DELETE ON `staff` FOR EACH ROW
BEGIN
  DELETE FROM orders WHERE staff = OLD.staffname;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `staff_staffname_on_update`
AFTER UPDATE ON `staff` FOR EACH ROW
BEGIN
  UPDATE orders SET staff = NEW.staffname WHERE staff = OLD.staffname;
END; $$
DELIMITER ;

/* users table triggers */

DELIMITER $$
CREATE TRIGGER `users_username_on_delete`
AFTER DELETE ON `users` FOR EACH ROW
BEGIN
  DELETE FROM content WHERE author = OLD.username;
  DELETE FROM equipment WHERE author = OLD.username;
  DELETE FROM grocers WHERE owner = OLD.username;
  DELETE FROM ingredient WHERE author = OLD.username;
  DELETE FROM notifications WHERE sender = OLD.username;
  DELETE FROM notifications WHERE receiver = OLD.username;
  DELETE FROM plans WHERE author = OLD.username;
  DELETE FROM recipes WHERE author = OLD.username;
  DELETE FROM friendships WHERE user = OLD.username;
  DELETE FROM friendships WHERE friend = OLD.username;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `users_username_on_update`
AFTER UPDATE ON `users` FOR EACH ROW
BEGIN
  UPDATE content SET author = NEW.username WHERE author = OLD.username;
  UPDATE equipment SET author = NEW.username WHERE author = OLD.username;
  UPDATE grocers SET owner = NEW.username WHERE owner = OLD.username;
  UPDATE ingredient SET author = NEW.username WHERE author = OLD.username;
  UPDATE notifications SET sender = NEW.username WHERE sender = OLD.username;
  UPDATE notifications SET receiver = NEW.username WHERE receiver = OLD.username;
  UPDATE plans SET author = NEW.username WHERE author = OLD.username;
  UPDATE recipes SET author = NEW.username WHERE author = OLD.username;
  UPDATE friendships SET user = NEW.username WHERE user = OLD.username;
  UPDATE friendships SET friend = NEW.username WHERE friend = OLD.username;
END; $$
DELIMITER ;

/* recipes table triggers */

DELIMITER $$
CREATE TRIGGER `recipes_id_on_delete`
AFTER DELETE ON `recipes` FOR EACH ROW
BEGIN
  DELETE FROM recipe_subrecipes WHERE recipe = OLD.id;
  DELETE FROM recipe_subrecipes WHERE subrecipe = OLD.id;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `recipes_id_on_update`
AFTER UPDATE ON `recipes` FOR EACH ROW
BEGIN
  UPDATE recipe_subrecipes SET recipe = NEW.id WHERE recipe = OLD.id;
  UPDATE recipe_subrecipes SET subrecipe = NEW.id WHERE subrecipe = OLD.id;
END; $$
DELIMITER ;

/*

Inserts

*/

INSERT INTO staff (id, email, pass, staffname) VALUES
(
  (UUID_TO_BIN("puttheuuidv6stringhere"),
  "tjalferes@tjalferes.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "T. J. Alferes"
);

INSERT INTO users (email, pass, username) VALUES
(
  (UUID_TO_BIN("puttheuuidv6stringhere"),
  "tjalferes@tjalferes.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "NOBSC"
),
(
  (UUID_TO_BIN("puttheuuidv6stringhere"),
  "tjalferes@gmail.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "Unknown"
),
(
  (UUID_TO_BIN("puttheuuidv6stringhere"),
  "testman@testman.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "Testman"
);

INSERT INTO content_types
(id,                 name,          parent,    path)
VALUES
(UUID_TO_BIN("puttheuuidv6stringhere"), "Page",        NULL,      "/page"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Post",        NULL,      "/post"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Guide",       "Page",    "/page/guide"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Promo",       "Page",    "/page/promo"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Site",        "Page",    "/page/site"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Fitness",     "Guide",   "/page/guide/fitness"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Food",        "Guide",   "/page/guide/food"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Exercises",   "Fitness", "/page/guide/fitness/exercises"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Principles",  "Fitness", "/page/guide/fitness/principles"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Recipes",     "Food",    "/page/guide/food/recipes"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Cuisines",    "Food",    "/page/guide/food/cuisines"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Ingredients", "Food",    "/page/guide/food/ingredients"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Nutrition",   "Food",    "/page/guide/food/nutrition"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Equipment",   "Food",    "/page/guide/food/equipment"),
(UUID_TO_BIN("puttheuuidv6stringhere"), "Methods",     "Food",    "/page/guide/food/methods");

INSERT INTO content
(type,          author,  owner,   created,      published,    title,                                items)
VALUES
("Exercises",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Bike",                               "[]"),
("Exercises",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Pullup",                             "[]"),
("Exercises",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Pushup",                             "[]"),
("Exercises",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Run",                                "[]"),
("Exercises",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Squat",                              "[]"),
("Exercises",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Walk",                               "[]"),

("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Agility",                            "[]"),
("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Balance",                            "[]"),
("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Composition",                        "[]"),
("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Endurance",                          "[]"),
("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Flexibility",                        "[]"),
("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Speed",                              "[]"),
("Principles",  "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Strength",                           "[]"),

("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Appetizers",                         "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Casseroles",                         "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Condiments",                         "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Desserts",                           "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Dressings",                          "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Drinks",                             "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Mains",                              "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Salads",                             "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Sauces",                             "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Sides",                              "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Soups",                              "[]"),
("Recipes",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Stews",                              "[]"),

("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Acids Herbs and Spices",             "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Beans and Vegetables",               "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Eggs and Dairy",                     "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Fats and Oils",                      "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Fish and Shellfish",                 "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Fruit",                              "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Meat and Poultry",                   "[]"),
("Ingredients", "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Seeds and Grains",                   "[]"),

("Nutrition",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Calories",                           "[]"),
("Nutrition",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Macronutrients",                     "[]"),
("Nutrition",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Micronutrients",                     "[]"),
("Nutrition",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Supplements",                        "[]"),

("Equipment",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Cleaning",                           "[]"),
("Equipment",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Cooking",                            "[]"),
("Equipment",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Dining",                             "[]"),
("Equipment",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Preparing",                          "[]"),
("Equipment",   "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Storage",                            "[]"),

("Methods",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Bake Roast Toast and Broil",         "[]"),
("Methods",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "BBQ Grill and Smoke",                "[]"),
("Methods",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Chill and Freeze",                   "[]"),
("Methods",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Saute Fry and Glaze",                "[]"),
("Methods",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Steam Poach Simmer Boil and Blanch", "[]"),
("Methods",     "NOBSC", "NOBSC", "2020-04-14", "2020-04-14", "Stew and Braise",                    "[]");

INSERT INTO cuisines (name) VALUES
("Afghan"),
("Albanian"),
("Algerian"),
("Catalan"),
("Angolan"),
("Antigua and Barbuda"),
("Argentine"),
("Armenian"),
("Australian"),
("Austrian"),
("Azerbaijani"),

("Bahamian"),
("Bahraini"),
("Bangladeshi"),
("Bajan"),
("Belarusian"),
("Belgian"),
("Belizean"),
("Benin"),
("Bhutanese"),
("Bolivian"),
("Bosnia and Herzegovina"),
("Botswana"),
("Brazilian"),
("Bruneian"),
("Bulgarian"),
("Burkinabe"),
("Burundian"),

("Ivorian"),
("Cape Verdean"),
("Cambodian"),
("Cameroonian"),
("Canadian"),
("Central African Republic"),
("Chadian"),
("Chilean"),
("Chinese"),
("Colombian"),
("Comoros"),
("Congolese, Democratic"),
("Congolese"),
("Costa Rican"),
("Croatian"),
("Cuban"),
("Cypriot"),
("Czech"),

("Danish"),
("Djiboutian"),
("Dominica"),
("Dominican Republic"),

("Ecuadorian"),
("Egyptian"),
("Salvadoran"),
("Equatorial Guinea"),
("Eritrean"),
("Estonian"),
("Eswatini"),
("Ethiopian"),

("Fijian"),
("Finnish"),
("French"),

("Gabonese"),
("Gambian"),
("Georgian"),
("German"),
("Ghanaian"),
("Greek"),
("Grenada"),
("Guatemalan"),
("Guinea"),
("Guinea-Bissauan"),
("Guyanese"),

("Haitian"),
("Honduran"),
("Hungarian"),

("Icelandic"),
("Indian"),
("Indonesian"),
("Iranian"),
("Iraqi"),
("Irish"),
("Israeli"),
("Italian"),

("Jamaican"),
("Japanese"),
("Jordanian"),

("Kazakh"),
("Kenyan"),
("Kiribati"),
("Kosovan"),
("Kuwaiti"),
("Kyrgyz"),

("Lao"),
("Latvian"),
("Lebanese"),
("Basotho"),
("Liberian"),
("Libyan"),
("Liechtensteiner"),
("Lithuanian"),
("Luxembourg"),

("Malagasy"),
("Malawian"),
("Malaysian"),
("Maldivian"),
("Malian"),
("Maltese"),
("Marshall Islands"),
("Mauritanian"),
("Mauritius"),
("Mexican"),
("Micronesian"),
("Moldovan"),
("Monégasque"),
("Mongolian"),
("Montenegrin"),
("Moroccan"),
("Mozambique"),
("Burmese"),

("Namibian"),
("Nauru"),
("Nepalese"),
("Dutch"),
("New Zealand"),
("Nicaraguan"),
("Niger"),
("Nigerian"),
("North Korean"),
("Macedonian"),
("Norwegian"),

("Omani"),

("Pakistani"),
("Palauan"),
("Palestinian"),
("Panamanian"),
("Papua New Guinean"),
("Paraguayan"),
("Peruvian"),
("Filipino"),
("Polish"),
("Portuguese"),

("Qatari"),

("Romanian"),
("Russian"),
("Rwandan"),

("Saint Kitts and Nevis"),
("Saint Lucian"),
("Grenadine"),
("Samoan"),
("Sammarinese"),
("Sao Tome and Principe"),
("Saudi Arabian"),
("Senegalese"),
("Serbian"),
("Seychellois"),
("Sierra Leonean"),
("Singaporean"),
("Slovak"),
("Slovenian"),
("Solomon Islands"),
("Somali"),
("South African"),
("South Korean"),
("South Sudan"),
("Spanish"),
("Sri Lankan"),
("Sudanese"),
("Surinamese"),
("Swedish"),
("Swiss"),
("Syrian"),

("Taiwanese"),
("Tajik"),
("Tanzanian"),
("Thai"),
("Timorese"),
("Togolese"),
("Tongan"),
("Trinidad and Tobago"),
("Tunisian"),
("Turkish"),
("Turkmen"),
("Tuvaluan"),

("Ugandan"),
("Ukrainian"),
("Emirati"),
("British"),
("American"),
("Uruguayan"),
("Uzbek"),

("Vanuatuan"),
("Venezuelan"),
("Vietnamese"),

("Yemeni"),

("Zambian"),
("Zimbabwean");

INSERT INTO equipment_types (name) VALUES
("Cleaning"),
("Preparing"),
("Cooking"),
("Dining"),
("Storage");

INSERT INTO equipment
(type,        author,  owner,   name,                               description, image)
VALUES
("Preparing", "NOBSC", "NOBSC", "Ceramic Stone",                    "It works.", "ceramic-stone"),
("Preparing", "NOBSC", "NOBSC", "Chef\'s Knife",                    "It works.", "chefs-knife"),
("Preparing", "NOBSC", "NOBSC", "Cutting Board",                    "It works.", "cutting-board"),
("Preparing", "NOBSC", "NOBSC", "Y Peeler",                         "It works.", "y-peeler"),
("Preparing", "NOBSC", "NOBSC", "Wooden Spoon",                     "It works.", "wooden-spoon"),
("Preparing", "NOBSC", "NOBSC", "Serated Knife",                    "It works.", "serated-knife"),
("Preparing", "NOBSC", "NOBSC", "Rubber Spatula",                   "It works.", "rubber-spatula"),
("Preparing", "NOBSC", "NOBSC", "Whisk",                            "It works.", "whisk"),
("Preparing", "NOBSC", "NOBSC", "Pepper Mill",                      "It works.", "pepper-mill"),
("Preparing", "NOBSC", "NOBSC", "Can Opener",                       "It works.", "can-opener"),
("Preparing", "NOBSC", "NOBSC", "Side Peeler",                      "It works.", "side-peeler"),
("Preparing", "NOBSC", "NOBSC", "Box Grater",                       "It works.", "box-grater"),
("Preparing", "NOBSC", "NOBSC", "Small Mixing Bowl",                "It works.", "small-mixing-bowl"),
("Preparing", "NOBSC", "NOBSC", "Medium Mixing Bowl",               "It works.", "medium-mixing-bowl"),
("Preparing", "NOBSC", "NOBSC", "Large Mixing Bowl",                "It works.", "large-mixing-bowl"),
("Preparing", "NOBSC", "NOBSC", "Salad Spinner",                    "It works.", "salad-spinner"),
("Preparing", "NOBSC", "NOBSC", "Dry Measuring Cups",               "It works.", "dry-measuring-cups"),
("Preparing", "NOBSC", "NOBSC", "Liquid Measuring Cups",            "It works.", "liquid-measuring-cups"),
("Preparing", "NOBSC", "NOBSC", "Measuring Spoons",                 "It works.", "measuring-spoons"),
("Preparing", "NOBSC", "NOBSC", "Measuring Pitcher",                "It works.", "measuring-pitcher"),
("Preparing", "NOBSC", "NOBSC", "Digital Scale",                    "It works.", "digital-scale"),
("Preparing", "NOBSC", "NOBSC", "Handheld Mixer",                   "It works.", "handheld-mixer"),
("Preparing", "NOBSC", "NOBSC", "Blender",                          "It works.", "blender"),
("Preparing", "NOBSC", "NOBSC", "Immersion Blender",                "It works.", "immersion-blender"),
("Preparing", "NOBSC", "NOBSC", "Parchment Paper",                  "It works.", "parchment-paper"),
("Preparing", "NOBSC", "NOBSC", "Plastic Wrap",                     "It works.", "plastic-wrap"),
("Preparing", "NOBSC", "NOBSC", "Aluminum Foil",                    "It works.", "aluminum-foil"),
("Preparing", "NOBSC", "NOBSC", "Cheesecloth",                      "It works.", "cheesecloth"),

("Cooking",   "NOBSC", "NOBSC", "Coffee Maker",                     "It works.", "coffee-maker"),
("Cooking",   "NOBSC", "NOBSC", "Tea Pot",                          "It works.", "tea-pot"),
("Cooking",   "NOBSC", "NOBSC", "Microwave",                        "It works.", "ladle"),
("Cooking",   "NOBSC", "NOBSC", "Toaster Oven",                     "It works.", "ladle"),
("Cooking",   "NOBSC", "NOBSC", "Small Sauce Pan",                  "It works.", "small-sauce-pan"),
("Cooking",   "NOBSC", "NOBSC", "Medium Sauce Pan",                 "It works.", "medium-sauce-pan"),
("Cooking",   "NOBSC", "NOBSC", "Medium Stock Pot",                 "It works.", "medium-stock-pot"),
("Cooking",   "NOBSC", "NOBSC", "Large Stock Pot",                  "It works.", "large-stock-pot"),
("Cooking",   "NOBSC", "NOBSC", "Stainless Steel Lidded Saute Pan", "It works.", "stainless-steel-lidded-saute-pan"),
("Cooking",   "NOBSC", "NOBSC", "Small Stainless Steel Skillet",    "It works.", "small-stainless-steel-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Large Stainless Steel Skillet",    "It works.", "large-stainless-steel-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Small Cast-Iron Skillet",          "It works.", "small-cast-iron-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Large Cast-Iron Skillet",          "It works.", "large-cast-iron-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Glass Baking Dish",                "It works.", "glass-baking-dish"),
("Cooking",   "NOBSC", "NOBSC", "Sturdy Baking Sheet",              "It works.", "sturdy-baking-dish"),
("Cooking",   "NOBSC", "NOBSC", "Small Gratin Dish",                "It works.", "small-gratin-dish"),
("Cooking",   "NOBSC", "NOBSC", "Large Gratin Dish",                "It works.", "large-gratin-dish"),
("Cooking",   "NOBSC", "NOBSC", "Dutch Oven",                       "It works.", "dutch-oven"),
("Cooking",   "NOBSC", "NOBSC", "Oven Mitts",                       "It works.", "oven-mitts"),
("Cooking",   "NOBSC", "NOBSC", "Splatter Screen",                  "It works.", "splatter-screen"),
("Cooking",   "NOBSC", "NOBSC", "Colander",                         "It works.", "colander"),
("Cooking",   "NOBSC", "NOBSC", "Mesh Strainer",                    "It works.", "mesh-strainer"),
("Cooking",   "NOBSC", "NOBSC", "Tongs",                            "It works.", "tongs"),
("Cooking",   "NOBSC", "NOBSC", "Slotted Spoon",                    "It works.", "slotted-spoon"),
("Cooking",   "NOBSC", "NOBSC", "Serving Spoon",                    "It works.", "serving-spoon"),
("Cooking",   "NOBSC", "NOBSC", "Spider",                           "It works.", "spider"),
("Cooking",   "NOBSC", "NOBSC", "Sturdy Spatula",                   "It works.", "sturdy-spatula"),
("Cooking",   "NOBSC", "NOBSC", "Fish Spatula",                     "It works.", "fish-spatula"),
("Cooking",   "NOBSC", "NOBSC", "Ladle",                            "It works.", "ladle");

INSERT INTO ingredient_types (name) VALUES
("Fish"),
("Shellfish"),
("Beef"),
("Pork"),
("Poultry"),
("Egg"),
("Dairy"),
("Oil"),
("Grain"),
("Bean"),
("Vegetable"),
("Fruit"),
("Nut"),
("Seed"),
("Spice"),
("Herb"),
("Acid"),
("Product");

INSERT INTO ingredients
(type,        author,  owner,   variety,              name,                                       description, image)
VALUES
("Fish",      "NOBSC", "NOBSC", "",                   "Tuna",                                     "Tasty.", "tuna"),
("Fish",      "NOBSC", "NOBSC", "",                   "Salmon",                                   "Tasty.", "salmon"),
("Fish",      "NOBSC", "NOBSC", "",                   "Tilapia",                                  "Tasty.", "tilapia"),
("Fish",      "NOBSC", "NOBSC", "",                   "Pollock",                                  "Tasty.", "pollock"),
("Fish",      "NOBSC", "NOBSC", "",                   "Catfish",                                  "Tasty.", "catfish"),
("Fish",      "NOBSC", "NOBSC", "",                   "Cod",                                      "Tasty.", "cod"),

("Shellfish", "NOBSC", "NOBSC", "",                   "Clams",                                    "Tasty.", "clams"),
("Shellfish", "NOBSC", "NOBSC", "",                   "Crab",                                     "Tasty.", "crab"),
("Shellfish", "NOBSC", "NOBSC", "",                   "Shrimp",                                   "Tasty.", "shrimp"),

("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Seven Bone Roast",                   "Tasty.", "chuck-7-bone-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Seven Bone Steak",                   "Tasty.", "chuck-7-bone-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Arm Roast",                          "Tasty.", "chuck-arm-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Arm Roast",                          "Tasty.", "chuck-arm-rost-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Arm Steak",                          "Tasty.", "chuck-arm-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Arm Steak",                          "Tasty.", "chuck-arm-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Blade Roast",                        "Tasty.", "chuck-blade-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Blade Steak",                        "Tasty.", "chuck-blade-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Blade Steak",                        "Tasty.", "chuck-blade-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Chuck Blade Steak",                        "Tasty.", "chuck-blade-steak-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Cross Rib Roast",                    "Tasty.", "chuck-cross-rib-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Cross Rib Roast",                    "Tasty.", "chuck-cross-rib-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Eye Edge Roast",                     "Tasty.", "chuck-eye-edge-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Eye Roast",                          "Tasty.", "chuck-eye-roast-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Eye Steak",                          "Tasty.", "chuck-eye-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Flanken Style Ribs",                 "Tasty.", "chuck-flanken-style-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Flanken Style Ribs",                 "Tasty.", "chuck-flanken-style-ribs-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Flat Ribs",                          "Tasty.", "chuck-flat-ribs"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Mock Tender Roast",                  "Tasty.", "chuck-mock-tender-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Mock Tender Steak",                  "Tasty.", "chuck-mock-tender-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Neck Roast",                         "Tasty.", "chuck-neck-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Neck Roast",                         "Tasty.", "chuck-neck-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Roast",                              "Tasty.", "chuck-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Short Ribs",                         "Tasty.", "chuck-short-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Short Ribs",                         "Tasty.", "chuck-short-ribs-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Center Steak Ranch Steak",  "Tasty.", "chuck-shoulder-center-steak-ranch-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Roast",                     "Tasty.", "chuck-shoulder-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Roast",                     "Tasty.", "chuck-shoulder-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Steak",                     "Tasty.", "chuck-shoulder-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Tender",                    "Tasty.", "chuck-shoulder-tender"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Tender Medallions",         "Tasty.", "chuck-shoulder-tender-medallions"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Top Blade Roast",           "Tasty.", "chuck-shoulder-top-blade-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Top Blade Steak",           "Tasty.", "chuck-shoulder-top-blade-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Top Blade Steak Flat Iron", "Tasty.", "chuck-shoulder-top-blade-steak-flat-iron"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Top Blade Roast",                    "Tasty.", "chuck-top-blade-roast"),
("Beef",      "NOBSC", "NOBSC", "Bone In",            "Chuck Top Blade Steak",                    "Tasty.", "chuck-top-blade-steak-bone-in"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Under Blade Roast",                  "Tasty.", "chuck-under-blade-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Under Blade Roast",                  "Tasty.", "chuck-under-blade-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Under Blade Steak",                  "Tasty.", "chuck-under-blade-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Under Blade Steak",                  "Tasty.", "chuck-under-blade-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Roast",                 "Tasty.", "round-bottom-round-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Roast Triangle Roast",  "Tasty.", "round-bottom-round-roast-triangle-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Rump Roast",            "Tasty.", "round-bottom-round-rump-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Steak",                 "Tasty.", "round-bottom-round-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Steak Western Griller", "Tasty.", "round-bottom-round-steak-western-griller"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Eye Round Roast",                    "Tasty.", "round-eye-round-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Eye Round Steak",                    "Tasty.", "round-eye-round-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Heel of Round",                      "Tasty.", "round-heel-of-round"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Sirloin Tip Center Roast",           "Tasty.", "round-sirloin-tip-center-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Sirloin Tip Center Steak",           "Tasty.", "round-sirloin-tip-center-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Sirloin Tip Side Steak",             "Tasty.", "round-sirloin-tip-side-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Steak",                              "Tasty.", "round-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Round Steak",                              "Tasty.", "round-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Tip Roast",                          "Tasty.", "round-tip-roast"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Round Tip Roast",                          "Tasty.", "round-tip-roast-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Tip Steak",                          "Tasty.", "round-tip-steak"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Round Tip Steak",                          "Tasty.", "round-tip-steak-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Roast",                    "Tasty.", "round-top-round-roast"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Round Top Round Roast",                    "Tasty.", "round-top-round-roast-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Steak",                    "Tasty.", "round-top-round-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Steak Butterflied",        "Tasty.", "round-top-round-steak-butterflied"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Steak First Cut",          "Tasty.", "round-top-round-steak-first-cut"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Ball Tip Roast",                      "Tasty.", "loin-ball-tip-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Ball Tip Steak",                      "Tasty.", "loin-ball-tip-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Flap Meat Steak",                     "Tasty.", "loin-flap-meat-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Porterhouse Steak",                   "Tasty.", "loin-porterhouse-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Shell Sirloin Steak",                 "Tasty.", "loin-shell-sirloin-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Sirloin Steak",                       "Tasty.", "loin-sirloin-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin T Bone Steak",                        "Tasty.", "loin-t-bone-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tenderloin Roast",                    "Tasty.", "loin-tenderloin-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tenderloin Steak",                    "Tasty.", "loin-tenderloin-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Top Loin Roast",                      "Tasty.", "loin-top-loin-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Loin Roast",                      "Tasty.", "loin-top-loin-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Top Loin Steak",                      "Tasty.", "loin-top-loin-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Loin Steak",                      "Tasty.", "loin-top-loin-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Sirloin Roast",                   "Tasty.", "loin-top-sirloin-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless Cap Off",   "Loin Top Sirloin Roast",                   "Tasty.", "loin-top-sirloin-roast-boneless-cap-off"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Sirloin Steak",                   "Tasty.", "loin-top-sirloin-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless Cap Off",   "Loin Top Sirloin Steak",                   "Tasty.", "loin-top-sirloin-steak-boneless-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tri Tip Roast",                       "Tasty.", "loin-tri-tip-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tri Tip Steak",                       "Tasty.", "loin-tri-tip-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Shank Cross Cut",                          "Tasty.", "shank-cross-cut"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Shank Cross Cut",                          "Tasty.", "shank-cross-cut-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Plate Skirt Steak",                        "Tasty.", "plate-skirt-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Flank Steak",                              "Tasty.", "flank-flank-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Ground Beef",                              "Tasty.", "ground-beef"),
("Beef",      "NOBSC", "NOBSC", "",                   "Back Ribs",                                "Tasty.", "back-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Cap Meat",                             "Tasty.", "rib-cap-meat-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Extra Trim Roast Large End",           "Tasty.", "rib-extra-trim-roast-large-end"),
("Beef",      "NOBSC", "NOBSC", "",                   "Ribeye Roast",                             "Tasty.", "ribeye-roast"),
("Beef",      "NOBSC", "NOBSC", "Lip On Bone In",     "Ribeye Roast",                             "Tasty.", "ribeye-roast-lip-on-bone-in"),
("Beef",      "NOBSC", "NOBSC", "Lip On Boneless",    "Ribeye Roast",                             "Tasty.", "ribeye-roast-lip-on-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Ribeye Steak",                             "Tasty.", "ribeye-steak"),
("Beef",      "NOBSC", "NOBSC", "Lip On Bone In",     "Ribeye Steak",                             "Tasty.", "ribeye-steak-lip-on-bone-in"),
("Beef",      "NOBSC", "NOBSC", "Lip On Boneless",    "Ribeye Steak",                             "Tasty.", "ribeye-steak-lip-on-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Roast Large End",                      "Tasty.", "rib-roast-large-end"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Roast Large End",                      "Tasty.", "rib-roast-large-end-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Roast Small End",                      "Tasty.", "rib-roast-small-end"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Roast Small End",                      "Tasty.", "rib-roast-small-end-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Rolled Cap Pot Roast",                 "Tasty.", "rib-rolled-cap-pot-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Short Ribs",                           "Tasty.", "rib-short-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Short Ribs",                           "Tasty.", "rib-short-ribs-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Steak Large End",                      "Tasty.", "rib-steak-large-end"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Steak Small End",                      "Tasty.", "rib-steak-small-end"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Steak Small End",                      "Tasty.", "rib-steak-small-end-boneless"),

("Pork",      "NOBSC", "NOBSC", "",                   "Bacon",                                    "Tasty.", "bacon"),

("Poultry",   "NOBSC", "NOBSC", "Bone In",            "Chicken Breasts",                          "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "Boneless",           "Chicken Breasts",                          "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Breasts",                          "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Tenderloins",                      "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "Bone In",            "Chicken Thighs",                           "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "Boneless",           "Chicken Thighs",                           "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Thighs",                           "Tasty.", "raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Wings",                            "Tasty.", "raw-chicken-wings"),

("Egg",       "NOBSC", "NOBSC", "",                   "Extra Large Eggs",                         "Tasty.", "eggs"),
("Egg",       "NOBSC", "NOBSC", "",                   "Large Eggs",                               "Tasty.", "eggs"),
("Egg",       "NOBSC", "NOBSC", "",                   "Medium Eggs",                              "Tasty.", "eggs"),

("Dairy",     "NOBSC", "NOBSC", "Salted",             "Butter",                                   "Tasty.", "butter"),
("Dairy",     "NOBSC", "NOBSC", "Unsalted",           "Butter",                                   "Tasty.", "butter"),
("Dairy",     "NOBSC", "NOBSC", "",                   "Cream",                                    "Tasty.", "cream"),
      
("Oil",       "NOBSC", "NOBSC", "",                   "Coconut",                                  "Tasty.", "coconut"),

("Grain",     "NOBSC", "NOBSC", "Corn",               "Starch",                                   "Tasty.", "eggs"),
("Grain",     "NOBSC", "NOBSC", "Potato",             "Starch",                                   "Tasty.", "eggs"),
("Grain",     "NOBSC", "NOBSC", "All-Purpose",        "Flour",                                    "Tasty.", "eggs"),

("Bean",      "NOBSC", "NOBSC", "Black Turtle",       "Beans",                                    "Tasty.", "black-turtle-beans"),
("Bean",      "NOBSC", "NOBSC", "Garbanzo",           "Beans",                                    "Tasty.", "garbanzo-beans-chickpeas"),
("Bean",      "NOBSC", "NOBSC", "Great Northern",     "Beans",                                    "Tasty.", "great-northern-beans"),
("Bean",      "NOBSC", "NOBSC", "Pinto",              "Beans",                                    "Tasty.", "pinto-beans"),
("Bean",      "NOBSC", "NOBSC", "Red Kidney",         "Beans",                                    "Tasty.", "red-kidney-beans"),
("Bean",      "NOBSC", "NOBSC", "",                   "Split Peas",                               "Tasty.", "split-peas"),

("Vegetable", "NOBSC", "NOBSC", "All Blue",           "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Austrian Crescent",  "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "French Fingerling",  "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Kennebec",           "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "LaRette",            "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Norland Red",        "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Purple Majesty",     "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Red Gold",           "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Red Thumb",          "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Ranger",      "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Burbank",     "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Norkotah",    "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Umatilla",    "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russian Banana",     "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Yukon Gold",         "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Potatoes",                                 "Tasty.", "potatoes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Broccoli",                                 "Tasty.", "broccoli"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Brussels Sprouts",                         "Tasty.", "brussels-sprouts"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Bok Choy",                                 "Tasty.", "bok-choy"),
("Vegetable", "NOBSC", "NOBSC", "Green",              "Cabbage",                                  "Tasty.", "green-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "Red",                "Cabbage",                                  "Tasty.", "red-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "Napa",               "Cabbage",                                  "Tasty.", "napa-cabbage-chinese-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "Savoy",              "Cabbage",                                  "Tasty.", "savoy-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Cauliflower",                              "Tasty.", "cauliflower"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Kohlrabi",                                 "Tasty.", "kohlrabi"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Collard Greens",                           "Tasty.", "collard-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Turnip Greens",                            "Tasty.", "turnip-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Pak Choy Baby Bok Choy",                   "Tasty.", "pak-choy-baby-bok-choy"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Zucchini",                                 "Tasty.", "zucchini"),
("Vegetable", "NOBSC", "NOBSC", "Standard Slicing",   "Cucumber",                                 "Tasty.", "standard-slicing-cucumber"),
("Vegetable", "NOBSC", "NOBSC", "Purple",             "Eggplant",                                 "Tasty.", "purple-eggplant"),
("Vegetable", "NOBSC", "NOBSC", "White",              "Eggplant",                                 "Tasty.", "white-eggplant"),
("Vegetable", "NOBSC", "NOBSC", "Japanese",           "Eggplant",                                 "Tasty.", "japanese-eggplant"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Pumpkin",                                  "Tasty.", "pumpkin"),
("Vegetable", "NOBSC", "NOBSC", "Acorn",              "Squash",                                   "Tasty.", "acorn-squash"),
("Vegetable", "NOBSC", "NOBSC", "Butternut",          "Squash",                                   "Tasty.", "butternut-squash"),
("Vegetable", "NOBSC", "NOBSC", "Hubbard",            "Squash",                                   "Tasty.", "hubbard-squash"),
("Vegetable", "NOBSC", "NOBSC", "Spaghetti",          "Squash",                                   "Tasty.", "spaghetti-squash"),
("Vegetable", "NOBSC", "NOBSC", "Delicata",           "Squash",                                   "Tasty.", "delicata-squash"),
("Vegetable", "NOBSC", "NOBSC", "Boston",             "Lettuce",                                  "Tasty.", "boston-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Bibb",               "Lettuce",                                  "Tasty.", "bibb-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Iceberg",            "Lettuce",                                  "Tasty.", "iceberg-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Romaine",            "Lettuce",                                  "Tasty.", "romaine-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Green Leaf",         "Lettuce",                                  "Tasty.", "green-leaf-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Oak Leaf",           "Lettuce",                                  "Tasty.", "oak-leaf-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Red Leaf",           "Lettuce",                                  "Tasty.", "red-leaf-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Arugula Rocket",                           "Tasty.", "arugula-rocket"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Belgian Endive",                           "Tasty.", "belgian-endive"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Frisee",                                   "Tasty.", "frisee"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Escarole",                                 "Tasty.", "escarole"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Mache Lambs Lettuce",                      "Tasty.", "mache-lambs-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Radicchio",                                "Tasty.", "radicchio"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Watercress",                               "Tasty.", "watercress"),
("Vegetable", "NOBSC", "NOBSC", "Baby",               "Spinach",                                  "Tasty.", "baby-spinach"),
("Vegetable", "NOBSC", "NOBSC", "Frozen",             "Spinach",                                  "Tasty.", "spinach"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Spinach",                                  "Tasty.", "spinach"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Swiss Chard",                              "Tasty.", "swiss-chard"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Beet Greens",                              "Tasty.", "beet-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Dandelion Greens",                         "Tasty.", "dandelion-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Mustard Greens",                           "Tasty.", "mustard-greens"),
("Vegetable", "NOBSC", "NOBSC", "Shiitake",           "Mushrooms",                                "Tasty.", "shiitake-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "Cremini",            "Mushrooms",                                "Tasty.", "cremini-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "Portobello",         "Mushrooms",                                "Tasty.", "portobello-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Mushrooms",                                "Tasty.", "mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "Globe",              "Onion",                                    "Tasty.", "globe-onion"),
("Vegetable", "NOBSC", "NOBSC", "Green",              "Onion",                                    "Tasty.", "scallion-green-onion"),
("Vegetable", "NOBSC", "NOBSC", "Spanish",            "Onion",                                    "Tasty.", "spanish-onion"),
("Vegetable", "NOBSC", "NOBSC", "Sweet",              "Onion",                                    "Tasty.", "sweet-onion"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Onion",                                    "Tasty.", "onion"),
("Vegetable", "NOBSC", "NOBSC", "Pearl",              "Onions",                                   "Tasty.", "pearl-onions"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Leek",                                     "Tasty.", "leek"),
("Vegetable", "NOBSC", "NOBSC", "Bell",               "Pepper",                                   "Tasty.", "bell-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Poblano",            "Pepper",                                   "Tasty.", "poblano-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Jalapeno",           "Pepper",                                   "Tasty.", "jalapeno-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Serrano",            "Pepper",                                   "Tasty.", "serrano-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Thai",               "Pepper",                                   "Tasty.", "thai-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Habanero",           "Pepper",                                   "Tasty.", "habanero-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Winterbor",          "Kale",                                     "Tasty.", "winterbor-kale-curly-kale"),
("Vegetable", "NOBSC", "NOBSC", "Red Russian",        "Kale",                                     "Tasty.", "red-russian-kale"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Kale",                                     "Tasty.", "kale"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Green Beans",                              "Tasty.", "green-beans"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Celery",                                   "Tasty.", "celery"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Asparagus",                                "Tasty.", "asparagus"),
("Vegetable", "NOBSC", "NOBSC", "Green",              "Peas",                                     "Tasty.", "green-peas"),
("Vegetable", "NOBSC", "NOBSC", "Snow",               "Peas",                                     "Tasty.", "snowpeas"),
("Vegetable", "NOBSC", "NOBSC", "Sugar Snap",         "Peas",                                     "Tasty.", "sugar-snap-peas"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Carrots",                                  "Tasty.", "carrots"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Parsnips",                                 "Tasty.", "parsnips"),
("Vegetable", "NOBSC", "NOBSC", "White",              "Turnips",                                  "Tasty.", "white-turnips"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Turnips",                                  "Tasty.", "turnips"),
("Vegetable", "NOBSC", "NOBSC", "French",             "Radishes",                                 "Tasty.", "french-radishes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Radishes",                                 "Tasty.", "radishes"),
("Vegetable", "NOBSC", "NOBSC", "Baby Gold",          "Beets",                                    "Tasty.", "baby-gold-beets"),
("Vegetable", "NOBSC", "NOBSC", "Red",                "Beets",                                    "Tasty.", "red-beets"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Beets",                                    "Tasty.", "beets"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Daikon",                                   "Tasty.", "daikon"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Horseradish",                              "Tasty.", "horseradish"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Rutabaga",                                 "Tasty.", "rutabaga"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Sunchoke Jerusalem Artichoke",             "Tasty.", "sunchoke-jerusalem-artichoke"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Fennel",                                   "Tasty.", "fennel"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Tomatillo",                                "Tasty.", "tomatillo"),
("Vegetable", "NOBSC", "NOBSC", "Standard Beefsteak", "Tomatoes",                                 "Tasty.", "standard-beefsteak-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Plum Roma",          "Tomatoes",                                 "Tasty.", "plum-roma-san-marzano-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Plum San Marzano",   "Tomatoes",                                 "Tasty.", "plum-roma-san-marzano-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Sungold",            "Tomatoes",                                 "Tasty.", "cherry-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Cherry",             "Tomatoes",                                 "Tasty.", "cherry-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Grape",              "Tomatoes",                                 "Tasty.", "grape-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Tomatoes",                                 "Tasty.", "cherry-tomatoes"),

("Fruit",     "NOBSC", "NOBSC", "Ambrosia",           "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Baldwin",            "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Braeburn",           "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Cameo",              "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Cortland",           "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Cosmic Crisp",       "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Empire",             "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Enterprise",         "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Fuji",               "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Gala",               "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Golden Delicious",   "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Granny Smith",       "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Honeycrisp",         "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Idared",             "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Jazz",               "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Jonagold",           "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Jonathan",           "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Liberty",            "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Macoun",             "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "McIntosh Red",       "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Melrose",            "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Opal",               "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Ozark Gold",         "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Pinata",             "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Pink Lady",          "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Pristine",           "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Red Delicious",      "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Rome",               "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Spartan",            "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Stayman",            "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "SweeTango",          "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "Winesap",            "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Apple",                                    "Tasty.", "apple"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Apricot",                                  "Tasty.", "apricot"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Banana",                                   "Tasty.", "banana"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Blackberries",                             "Tasty.", "blackberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Blueberries",                              "Tasty.", "blueberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Cherries",                                 "Tasty.", "cherries"),
("Fruit",     "NOBSC", "NOBSC", "Dried",              "Cranberries",                              "Tasty.", "cranberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Cranberries",                              "Tasty.", "cranberries"),
("Fruit",     "NOBSC", "NOBSC", "Concord",            "Grapes",                                   "Tasty.", "grapes"),
("Fruit",     "NOBSC", "NOBSC", "Flame",              "Grapes",                                   "Tasty.", "grapes"),
("Fruit",     "NOBSC", "NOBSC", "Moon Drop",          "Grapes",                                   "Tasty.", "grapes"),
("Fruit",     "NOBSC", "NOBSC", "Ruby",               "Grapes",                                   "Tasty.", "grapes"),
("Fruit",     "NOBSC", "NOBSC", "Thompson",           "Grapes",                                   "Tasty.", "grapes"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Grapes",                                   "Tasty.", "grapes"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Guava",                                    "Tasty.", "guava"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Kiwi",                                     "Tasty.", "kiwi"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Mango",                                    "Tasty.", "mango"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Watermelon",                               "Tasty.", "watermelon"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Nectarine",                                "Tasty.", "nectarine"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Papaya",                                   "Tasty.", "papaya"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Peach",                                    "Tasty.", "peach"),
("Fruit",     "NOBSC", "NOBSC", "Anjou Green",        "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Anjou Red",          "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Asian",              "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Bartlett",           "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Bosc",               "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Comice",             "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Concord",            "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Forelle",            "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "French Butter",      "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Seckel",             "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "Taylor\'s Gold",     "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pear",                                     "Tasty.", "pear"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pineapple",                                "Tasty.", "pineapple"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Orange",                                   "Tasty.", "orange"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Raspberries",                              "Tasty.", "raspberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Strawberries",                             "Tasty.", "strawberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Tangerine",                                "Tasty.", "tangerine"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Tangelo",                                  "Tasty.", "tangelo"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Blood Orange",                             "Tasty.", "blood-orange"),
("Fruit",     "NOBSC", "NOBSC", "",                   "White Grapefruit",                         "Tasty.", "white-grapefruit"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pink Grapefruit",                          "Tasty.", "pink-grapefruit"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Honeydew",                                 "Tasty.", "honeydew"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Cantaloupe",                               "Tasty.", "cantaloupe"),
("Fruit",     "NOBSC", "NOBSC", "Italian",            "Plum",                                     "Tasty.", "italian-plum"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Plum",                                     "Tasty.", "plum"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pomegranate",                              "Tasty.", "pomegranate"),

("Nut",       "NOBSC", "NOBSC", "",                   "Almonds",                                  "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Brazil Nuts",                              "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Cashews",                                  "Tasty.", "cashews"),
("Nut",       "NOBSC", "NOBSC", "",                   "Hazelnuts",                                "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Macadamia Nuts",                           "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Peacans",                                  "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Peanuts",                                  "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Pine Nuts",                                "Tasty.", "almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Pistachios",                               "Tasty.", "pistachios"),
("Nut",       "NOBSC", "NOBSC", "",                   "Walnuts",                                  "Tasty.", "almonds"),

("Seed",      "NOBSC", "NOBSC", "",                   "Chia Seeds",                               "Tasty.", "sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Hemp Seeds",                               "Tasty.", "sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Poppy Seeds",                              "Tasty.", "sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Pumpkin Seeds",                            "Tasty.", "pumpkin-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Sesame Seeds",                             "Tasty.", "sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Quinoa",                                   "Tasty.", "sesame-seeds"),

("Spice",     "NOBSC", "NOBSC", "Ancho",              "Pepper",                                   "Tasty.", "ancho-pepper"),
("Spice",     "NOBSC", "NOBSC", "Arbol",              "Pepper",                                   "Tasty.", "arbol-pepper"),
("Spice",     "NOBSC", "NOBSC", "Cascabel",           "Pepper",                                   "Tasty.", "cascabel-pepper"),
("Spice",     "NOBSC", "NOBSC", "Guajillo",           "Pepper",                                   "Tasty.", "guajillo-pepper"),
("Spice",     "NOBSC", "NOBSC", "Morita",             "Pepper",                                   "Tasty.", "morita-pepper"),
("Spice",     "NOBSC", "NOBSC", "Mulato",             "Pepper",                                   "Tasty.", "mulato-pepper"),
("Spice",     "NOBSC", "NOBSC", "Pasilla",            "Pepper",                                   "Tasty.", "pasilla-pepper"),
("Spice",     "NOBSC", "NOBSC", "Pulla",              "Pepper",                                   "Tasty.", "pulla-pepper"),
("Spice",     "NOBSC", "NOBSC", "",                   "Celery Seeds",                             "Tasty.", "celery-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cinnamon",                                 "Tasty.", "cinnamon"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ground Cinnamon",                          "Tasty.", "ground-cinnamon"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cloves",                                   "Tasty.", "cloves"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ground Cloves",                            "Tasty.", "ground-cloves"),
("Spice",     "NOBSC", "NOBSC", "",                   "Caraway Seeds",                            "Tasty.", "cumin-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cumin Seeds",                              "Tasty.", "cumin-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cumin Powder",                             "Tasty.", "cumin-powder"),
("Spice",     "NOBSC", "NOBSC", "",                   "Fennel Seeds",                             "Tasty.", "fennel-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Garlic",                                   "Tasty.", "garlic"),
("Spice",     "NOBSC", "NOBSC", "",                   "Garlic Powder",                            "Tasty.", "garlic-powder"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ginger",                                   "Tasty.", "ginger"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ginger Powder",                            "Tasty.", "ginger-powder"),
("Spice",     "NOBSC", "NOBSC", "",                   "Shallots",                                 "Tasty.", "shallots"),
("Spice",     "NOBSC", "NOBSC", "",                   "Turmeric",                                 "Tasty.", "turmeric"),
("Spice",     "NOBSC", "NOBSC", "",                   "Turmeric Powder",                          "Tasty.", "turmeric-powder"),

("Herb",      "NOBSC", "NOBSC", "",                   "Basil",                                    "Tasty.", "basil"),
("Herb",      "NOBSC", "NOBSC", "",                   "Cilantro",                                 "Tasty.", "cilantro"),
("Herb",      "NOBSC", "NOBSC", "",                   "Fenugreek",                                "Tasty.", "fenugreek"),
("Herb",      "NOBSC", "NOBSC", "",                   "Parsley",                                  "Tasty.", "parsley"),
("Herb",      "NOBSC", "NOBSC", "",                   "Rosemary",                                 "Tasty.", "rosemary"),
("Herb",      "NOBSC", "NOBSC", "",                   "Sage",                                     "Tasty.", "sage"),
("Herb",      "NOBSC", "NOBSC", "",                   "Thyme",                                    "Tasty.", "thyme"),

("Acid",      "NOBSC", "NOBSC", "Apple Cider",        "Vinegar",                                  "Tasty.", "balsamic-vinegar"),
("Acid",      "NOBSC", "NOBSC", "Balsamic",           "Vinegar",                                  "Tasty.", "balsamic-vinegar"),
("Acid",      "NOBSC", "NOBSC", "Rice",               "Vinegar",                                  "Tasty.", "balsamic-vinegar"),

("Product",   "NOBSC", "NOBSC", "",                   "Fish Sauce",                               "Tasty.", "tobasco-sauce"),
("Product",   "NOBSC", "NOBSC", "Dark",               "Soy Sauce",                                "Tasty.", "tobasco-sauce"),
("Product",   "NOBSC", "NOBSC", "Light",              "Soy Sauce",                                "Tasty.", "tobasco-sauce");

INSERT INTO ingredients
(type,      author,  owner,   brand,                name,                                       description, image)
VALUES
("Product", "NOBSC", "NOBSC", "Tobasco",            "Hot Sauce",                                "Tasty.", "tobasco-sauce");

INSERT INTO measurements (name) VALUES
("teaspoon"),
("Tablespoon"),
("cup"),
("ounce"),
("pound"),
("milliliter"),
("liter"),
("gram"),
("kilogram"),
("NA");

INSERT INTO methods (name) VALUES
("No-Cook"),
("Chill"),
("Freeze"),
("Microwave"),
("Toast"),
("Steam"),
("Poach"),
("Simmer"),
("Boil"),
("Blanch"),
("Stew"),
("Braise"),
("Bake"),
("Roast"),
("Broil"),
("Saute"),
("Pan-Fry"),
("Shallow-Fry"),
("Deep-Fry"),
("Stir-Fry"),
("Glaze"),
("BBQ"),
("Grill"),
("Smoke");

INSERT INTO recipe_types (name) VALUES
("Drink"),
("Appetizer"),
("Main"),
("Side"),
("Dessert"),
("Soup"),
("Salad"),
("Stew"),
("Casserole"),
("Sauce"),
("Dressing"),
("Condiment");

INSERT INTO recipes
(type,        cuisine,       author,  owner,   title,                                description,        active_time, total_time, directions)
VALUES
("Drink",     "Afghan",      "NOBSC", "NOBSC", "Borscht",                            "Excellent",        "00:30:00",  "04:00:00", "Chop beets and onions..."),
("Appetizer", "Albanian",    "NOBSC", "NOBSC", "Soft Buttery Pretzle",               "Melting goodness", "00:20:00",  "01:20:00", "Set oven to 400 F. Mix dough..."),
("Main",      "Algerian",    "NOBSC", "NOBSC", "Grilled Chicken and Seasoned Rice",  "Yum",              "01:00:00",  "02:00:00", "Marinate chicken in a..."),
("Side",      "Catalan",     "NOBSC", "NOBSC", "Mixed Root Vegetables",              "Satisfying",       "00:15:00",  "01:00:00", "Chop vegetables into about 2 inch by 2 inch pieces..."),
("Dessert",   "Angolan",     "NOBSC", "NOBSC", "Coffee Vanilla Icecream Cake",       "Special",          "00:30:00",  "01:00:00", "Set oven to 275 F. Mix dough..."),
("Soup",      "Bajan",       "NOBSC", "NOBSC", "Fish Carrot and Potato Soup",        "Nice.",            "00:45:00",  "01:00:00", "Heat stock..."),
("Salad",     "Argentine",   "NOBSC", "NOBSC", "Possibly Greek Salad",               "Who Knows",        "00:08:00",  "00:08:00", "Mix olive oil and red wine vinegar in bowl..."),
("Stew",      "Armenian",    "NOBSC", "NOBSC", "Irish Guinness Beef Stew",           "Calming",          "00:45:00",  "04:00:00", "Sear well just one side of the beef pieces..."),
("Casserole", "Australian",  "NOBSC", "NOBSC", "Northern Chinese Seafood Casserole", "Excellent",        "00:45:00",  "01:30:00", "Heat stock..."),
("Sauce",     "Austrian",    "NOBSC", "NOBSC", "Sweet Coconut Lime Sauce",           "Interesting",      "00:20:00",  "00:20:00", "Mix..."),
("Dressing",  "Azerbaijani", "NOBSC", "NOBSC", "Carrot Ginger Dressing",             "Tasty",            "00:20:00",  "00:20:00", "Blend carrots and..."),
("Condiment", "Bahamian",    "NOBSC", "NOBSC", "Some Kind Of Chutney",               "Not Bad",          "00:30:00",  "01:00:00", "Mix...");

INSERT INTO recipe_equipment
(recipe,                                     equipment,       amount)
VALUES
("NOBSC Borscht",                            "NOBSC Tea Pot", 1),
("NOBSC Soft Buttery Pretzle",               "NOBSC Tea Pot", 1),
("NOBSC Grilled Chicken and Seasoned Rice",  "NOBSC Tea Pot", 1),
("NOBSC Mixed Root Vegetables",              "NOBSC Tea Pot", 1),
("NOBSC Coffee Vanilla Icecream Cake",       "NOBSC Tea Pot", 1),
("NOBSC Fish Carrot and Potato Soup",        "NOBSC Tea Pot", 1),
("NOBSC Possibly Greek Salad",               "NOBSC Tea Pot", 1),
("NOBSC Irish Guinness Beef Stew",           "NOBSC Tea Pot", 1),
("NOBSC Northern Chinese Seafood Casserole", "NOBSC Tea Pot", 1),
("NOBSC Sweet Coconut Lime Sauce",           "NOBSC Tea Pot", 1),
("NOBSC Carrot Ginger Dressing",             "NOBSC Tea Pot", 1),
("NOBSC Some Kind of Chutney",               "NOBSC Tea Pot", 1);

INSERT INTO recipe_ingredients
(recipe,                                     ingredient,     amount, measurement)
VALUES
("NOBSC Borscht",                            "NOBSC   Garlic", 4,      "teaspoon"),
("NOBSC Soft Buttery Pretzle",               "NOBSC   Garlic", 2,      "Tablespoon"),
("NOBSC Grilled Chicken and Seasoned Rice",  "NOBSC   Garlic", 1,      "cup"),
("NOBSC Mixed Root Vegetables",              "NOBSC   Garlic", 1,      "ounce"),
("NOBSC Coffee Vanilla Icecream Cake",       "NOBSC   Garlic", 7,      "pound"),
("NOBSC Fish Carrot and Potato Soup",        "NOBSC   Garlic", 1,      "milliliter"),
("NOBSC Possibly Greek Salad",               "NOBSC   Garlic", 3,      "liter"),
("NOBSC Irish Guinness Beef Stew",           "NOBSC   Garlic", 1,      "gram"),
("NOBSC Northern Chinese Seafood Casserole", "NOBSC   Garlic", 9,      "kilogram"),
("NOBSC Sweet Coconut Lime Sauce",           "NOBSC   Garlic", 20,     "NA"),
("NOBSC Carrot Ginger Dressing",             "NOBSC   Garlic", 10,     "teaspoon"),
("NOBSC Some Kind of Chutney",               "NOBSC   Garlic", 13,     "Tablespoon");

INSERT INTO recipe_methods
(recipe,                                     method)
VALUES
("NOBSC Borscht",                            "Microwave"),
("NOBSC Soft Buttery Pretzle",               "Toast"),
("NOBSC Grilled Chicken and Seasoned Rice",  "Steam"),
("NOBSC Mixed Root Vegetables",              "Poach"),
("NOBSC Coffee Vanilla Icecream Cake",       "Simmer"),
("NOBSC Fish Carrot and Potato Soup",        "Boil"),
("NOBSC Possibly Greek Salad",               "Blanch"),
("NOBSC Irish Guinness Beef Stew",           "Stew"),
("NOBSC Northern Chinese Seafood Casserole", "Braise"),
("NOBSC Sweet Coconut Lime Sauce",           "Bake"),
("NOBSC Carrot Ginger Dressing",             "Roast"),
("NOBSC Some Kind of Chutney",               "Broil");

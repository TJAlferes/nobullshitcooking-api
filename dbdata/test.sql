\W

DROP DATABASE nobsc;

CREATE DATABASE nobsc;

USE nobsc;

/*

Create parent tables

*/

CREATE TABLE `content_types` (
  `name` varchar(60) UNIQUE NOT NULL,
  `parent` varchar(60),
  `path` varchar(255) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisines` (
  `name` varchar(40) UNIQUE NOT NULL,
  `nation` varchar(40) UNIQUE NOT NULL,
  `wiki` varchar(60) NOT NULL DEFAULT '',
  `intro` text NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `customers` (
  `email` varchar(60) UNIQUE NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `equipment_types` (
  `name` varchar(25) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ingredient_types` (
  `name` varchar(25) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `measurements` (
  `name` varchar(25) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `methods` (
  `name` varchar(25) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product_categories` (
  `name` varchar(50) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product_types` (
  `name` varchar(50) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_types` (
  `name` varchar(25) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff` (
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `staffname` varchar(20) NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-staff-default',
  `role` varchar(20) NOT NULL DEFAULT 'staff',
  PRIMARY KEY (`staffname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `suppliers` (
  `name` varchar(60) UNIQUE NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `username` varchar(20) NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-user-default',
  `confirmation_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*

Create child tables

*/

CREATE TABLE `content` (
  `type` varchar(60) NOT NULL,
  `author` varchar(20) NOT NULL,
  `owner` varchar(20) NOT NULL,
  `created` char(10) NOT NULL,
  `published` char(10),
  `title` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-content-default',
  `items` json DEFAULT NULL,
  FOREIGN KEY (`type`) REFERENCES `content_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`author`) REFERENCES `users` (`username`),
  FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  `id` varchar(121) GENERATED ALWAYS AS (CONCAT(author, ' ', title)) STORED,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `equipment` (
  `type` varchar(25) NOT NULL,
  `author` varchar(20) NOT NULL,
  `owner` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-equipment-default',
  `id` varchar(121) GENERATED ALWAYS AS (CONCAT(author, ' ', name)) STORED,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`type`) REFERENCES `equipment_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`author`) REFERENCES `users` (`username`),
  FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `grocers` (
  `owner` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `notes` text NOT NULL,
  `id` varchar(121) GENERATED ALWAYS AS (CONCAT(owner, ' ', name)) STORED,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`owner`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ingredients` (
  `type` varchar(25) NOT NULL,
  `author` varchar(20) NOT NULL,
  `owner` varchar(20) NOT NULL,
  `brand` varchar(50) NOT NULL DEFAULT '',
  `variety` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL,
  `fullname` varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)),
  `alt_names` json DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-ingredient-default',
  `id` varchar(173) GENERATED ALWAYS AS (CONCAT(author, ' ', fullname)) STORED,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`type`) REFERENCES `ingredient_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`author`) REFERENCES `users` (`username`),
  FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisine_equipment` (
  `cuisine` varchar(40),
  `equipment` varchar(121),
  FOREIGN KEY (`cuisine`) REFERENCES `cuisines` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`equipment`) REFERENCES `equipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisine_ingredients` (
  `cuisine` varchar(40) NOT NULL,
  `ingredient` varchar(173) NOT NULL,
  FOREIGN KEY (`cuisine`) REFERENCES `cuisines` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`ingredient`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisine_suppliers` (
  `cuisine` varchar(40) NOT NULL,
  `supplier` varchar(60) NOT NULL,
  FOREIGN KEY (`cuisine`) REFERENCES `cuisines` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`supplier`) REFERENCES `suppliers` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notifications` (
  `sender` varchar(20) NOT NULL,
  `receiver` varchar(20) NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `type` varchar(45) NOT NULL,
  `note` varchar(255) NOT NULL,
  `created` char(10) NOT NULL,
  `id` varchar(52) GENERATED ALWAYS AS (CONCAT(sender, ' ', receiver, ' ', created)) STORED UNIQUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender`) REFERENCES `users` (`username`),
  FOREIGN KEY (`receiver`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `orders` (
  `customer` varchar(60) NOT NULL,
  `staff` varchar(20) NOT NULL,
  `created` char(10) NOT NULL,
  `id` varchar(92) GENERATED ALWAYS AS (CONCAT(customer, ' ', staff, ' ', created)) STORED UNIQUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`customer`) REFERENCES `customers` (`email`),
  FOREIGN KEY (`staff`) REFERENCES `staff` (`staffname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `products` (
  `category` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `variety` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `fullname` varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)) STORED UNIQUE,
  `alt_names` json DEFAULT NULL,
  `description` text NOT NULL,
  `specs` json DEFAULT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-product-default',
  PRIMARY KEY (`fullname`),
  FOREIGN KEY (`category`) REFERENCES `product_categories` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`type`) REFERENCES `product_types` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_products` (
  `order` varchar(92) NOT NULL,
  `product` varchar(152) NOT NULL,
  FOREIGN KEY (`order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`product`) REFERENCES `products` (`fullname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `plans` (
  `author` varchar(20) NOT NULL,
  `owner` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `data` json DEFAULT NULL,
  `id` varchar(120) GENERATED ALWAYS AS (CONCAT(author, name)) STORED UNIQUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`author`) REFERENCES `users` (`username`),
  FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product_suppliers` (
  `product` varchar(152) NOT NULL,
  `supplier` varchar(60) NOT NULL,
  FOREIGN KEY (`product`) REFERENCES `products` (`fullname`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`supplier`) REFERENCES `suppliers` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipes` (
  `type` varchar(25) NOT NULL,
  `cuisine` varchar(40),
  `author` varchar(20) NOT NULL,
  `owner` varchar(20) NOT NULL,
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
  `id` varchar(121) GENERATED ALWAYS AS (CONCAT(author, ' ', title)) STORED UNIQUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`type`) REFERENCES `recipe_types` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`cuisine`) REFERENCES `cuisines` (`name`) ON UPDATE CASCADE,
  FOREIGN KEY (`author`) REFERENCES `users` (`username`),
  FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_equipment` (
  `recipe` varchar(121) NOT NULL,
  `equipment` varchar(121) NOT NULL,
  `amount` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`equipment`) REFERENCES `equipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_ingredients` (
  `recipe` varchar(121) NOT NULL,
  `ingredient` varchar(173) NOT NULL DEFAULT '0',
  `amount` decimal(5,2) NOT NULL,
  `measurement` varchar(25) NOT NULL,
  FOREIGN KEY (`recipe`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`ingredient`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`measurement`) REFERENCES `measurements` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_methods` (
  `recipe` varchar(121) NOT NULL,
  `method` varchar(25) NOT NULL,
  FOREIGN KEY (`recipe`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`method`) REFERENCES `methods` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_subrecipes` (
  `recipe` varchar(121) NOT NULL,
  `subrecipe` varchar(121) NOT NULL,
  `amount` decimal(5,2) NOT NULL,
  `measurement` varchar(25) NOT NULL,
  FOREIGN KEY (`recipe`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`subrecipe`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement`) REFERENCES `measurements` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `favorite_recipes` (
  `user` varchar(20) NOT NULL,
  `recipe` varchar(121) NOT NULL,
  FOREIGN KEY (`user`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`recipe`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `saved_recipes` (
  `user` varchar(20) NOT NULL,
  `recipe` varchar(121) NOT NULL,
  FOREIGN KEY (`user`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`recipe`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `friendships` (
  `user` varchar(20) NOT NULL,
  `friend` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  FOREIGN KEY (`user`) REFERENCES `users` (`username`),
  FOREIGN KEY (`friend`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*

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

/* customer table triggers */

DELIMITER $$
CRATE TRIGGER customer_email_on_delete
AFTER DELETE ON `customer` FOR EACH ROW
BEGIN
  DELETE FROM orders WHERE customer = OLD.email;
END; $$
DELIMITER ;

DELIMITER $$
CRATE TRIGGER customer_email_on_update
AFTER UPDATE ON `customer` FOR EACH ROW
BEGIN
  UPDATE orders SET customer = NEW.email WHERE customer = OLD.email;
END; $$
DELIMITER ;

/* staff table triggers */

DELIMITER $$
CRATE TRIGGER staff_staffname_on_delete
AFTER DELETE ON `staff` FOR EACH ROW
BEGIN
  DELETE FROM orders WHERE staff = OLD.staffname;
END; $$
DELIMITER ;

DELIMITER $$
CRATE TRIGGER staff_staffname_on_update
AFTER UPDATE ON `staff` FOR EACH ROW
BEGIN
  UPDATE orders SET staff = NEW.staffname WHERE staff = OLD.staffname;
END; $$
DELIMITER ;

/* users table triggers */

DELIMITER $$
CREATE TRIGGER users_username_on_delete
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
CREATE TRIGGER users_username_on_update
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
CREATE TRIGGER recipes_id_on_delete
AFTER DELETE ON `recipes` FOR EACH ROW
BEGIN
  DELETE FROM recipe_subrecipes WHERE recipe = OLD.id;
  DELETE FROM recipe_subrecipes WHERE subrecipe = OLD.id;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER recipes_id_on_update
AFTER UPDATE ON `recipes` FOR EACH ROW
BEGIN
  UPDATE recipe_subrecipes SET recipe = NEW.id WHERE recipe = OLD.id;
  UPDATE recipe_subrecipes SET subrecipe = NEW.id WHERE subrecipe = OLD.id;
END; $$
DELIMITER ;

/*

Inserts

*/

INSERT INTO staff (email, pass, staffname) VALUES (
  "tjalferes@tjalferes.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "T. J. Alferes"
);

INSERT INTO users (email, pass, username) VALUES (
  "tjalferes@tjalferes.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "NOBSC"
), (
  "tjalferes@gmail.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "Unknown"
), (
  "testman@testman.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "Testman"
);

INSERT INTO content_types (name, parent, path) VALUES
("Page",        NULL,      "/page"),
("Post",        NULL,      "/post"),
("Guide",       "Page",    "/page/guide"),
("Promo",       "Page",    "/page/promo"),
("Site",        "Page",    "/page/site"),
("Fitness",     "Guide",   "/page/guide/fitness"),
("Food",        "Guide",   "/page/guide/food"),
("Exercises",   "Fitness", "/page/guide/fitness/exercises"),
("Principles",  "Fitness", "/page/guide/fitness/principles"),
("Recipes",     "Food",    "/page/guide/food/recipes"),
("Cuisines",    "Food",    "/page/guide/food/cuisines"),
("Ingredients", "Food",    "/page/guide/food/ingredients"),
("Nutrition",   "Food",    "/page/guide/food/nutrition"),
("Equipment",   "Food",    "/page/guide/food/equipment"),
("Methods",     "Food",    "/page/guide/food/methods");

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

INSERT INTO cuisines
(name,                       nation,                              wiki, intro)
VALUES
("Afghan",                   "Afghanistan",                       "Afghan_cuisine", ""),
("Albanian",                 "Albania",                           "Albanian_cuisine", ""),
("Algerian",                 "Algeria",                           "Algerian_cuisine", ""),
("Catalan",                  "Andorra",                           "Catalan_cuisine", ""),
("Angolan",                  "Angola",                            "Angolan_cuisine", ""),
("Antigua and Barbuda",      "Antigua and Barbuda",               "Antigua_and_Barbuda_cuisine", ""),
("Argentine",                "Argentina",                         "Argentine_cuisine", ""),
("Armenian",                 "Armenia",                           "Armenian_cuisine", ""),
("Australian",               "Australia",                         "Australian_cuisine", ""),
("Austrian",                 "Austria",                           "Austrian_cuisine", ""),
("Azerbaijani",              "Azerbaijan",                        "Azerbaijani_cuisine", ""),

("Bahamian",                 "Bahamas",                           "Bahamian_cuisine", ""),
("Bahraini",                 "Bahrain",                           "Bahraini_cuisine", ""),
("Bangladeshi",              "Bangladesh",                        "Bangladeshi_cuisine", ""),
("Bajan",                    "Barbados",                          "Barbadian_cuisine", ""),
("Belarusian",               "Belarus",                           "Belarusian_cuisine", ""),
("Belgian",                  "Belgium",                           "Belgian_cuisine", ""),
("Belizean",                 "Belize",                            "Belizean_cuisine", ""),
("Benin",                    "Benin",                             "Benin_cuisine", ""),
("Bhutanese",                "Bhutan",                            "Bhutanese_cuisine", ""),
("Bolivian",                 "Bolivia",                           "Bolivian_cuisine", ""),
("Bosnia and Herzegovina",   "Bosnia and Herzegovina",            "Bosnia_and_Herzegovina_cuisine", ""),
("Botswana",                 "Botswana",                          "Botswana_cuisine", ""),
("Brazilian",                "Brazil",                            "Brazilian_cuisine", ""),
("Bruneian",                 "Brunei",                            "Bruneian_cuisine", ""),
("Bulgarian",                "Bulgaria",                          "Bulgarian_cuisine", ""),
("Burkinabe",                "Burkina Faso",                      "Burkinabe_cuisine", ""),
("Burundian",                "Burundi",                           "Burundian_cuisine", ""),

("Ivorian",                  "Côte d'Ivoire",                     "Ivorian_cuisine", ""),
("Cape Verdean",             "Cabo Verde",                        "Cape_Verdean_cuisine", ""),
("Cambodian",                "Cambodia",                          "Cambodian_cuisine", ""),
("Cameroonian",              "Cameroon",                          "Cameroonian_cuisine", ""),
("Canadian",                 "Canada",                            "Canadian_cuisine", ""),
("Central African Republic", "Central African Republic",          "Cuisine_of_the_Central_African_Republic", ""),
("Chadian",                  "Chad",                              "Chadian_cuisine", ""),
("Chilean",                  "Chile",                             "Chilean_cuisine", ""),
("Chinese",                  "China",                             "Chinese_cuisine", ""),
("Colombian",                "Colombia",                          "Colombian_cuisine", ""),
("Comoros",                  "Comoros",                           "NA", ""),
("Congolese, Democratic",    "Congo, Democratic Republic of the", "Congolese_cuisine", ""),
("Congolese",                "Congo, Republic of the",            "Congolese_cuisine", ""),
("Costa Rican",              "Costa Rica",                        "Costa_Rican_cuisine", ""),
("Croatian",                 "Croatia",                           "Croatian_cuisine", ""),
("Cuban",                    "Cuba",                              "Cuban_cuisine", ""),
("Cypriot",                  "Cyprus",                            "Cypriot_cuisine", ""),
("Czech",                    "Czechia",                           "Czech_cuisine", ""),

("Danish",                   "Denmark",                           "Danish_cuisine", ""),
("Djiboutian",               "Djibouti",                          "Djiboutian_cuisine", ""),
("Dominica",                 "Dominica",                          "Dominica_cuisine", ""),
("Dominican Republic",       "Dominican Republic",                "Dominican_Republic_cuisine", ""),

("Ecuadorian",               "Ecuador",                           "Ecuadorian_cuisine", ""),
("Egyptian",                 "Egypt",                             "Egyptian_cuisine", ""),
("Salvadoran",               "El Salvador",                       "Salvadoran_cuisine", ""),
("Equatorial Guinea",        "Equatorial Guinea",                 "Cuisine_of_Equatorial_Guinea", ""),
("Eritrean",                 "Eritrea",                           "Eritrean_cuisine", ""),
("Estonian",                 "Estonia",                           "Estonian_cuisine", ""),
("Eswatini",                 "Eswatini",                          "Cuisine_of_Eswatini", ""),
("Ethiopian",                "Ethiopia",                          "Ethiopian_cuisine", ""),

("Fijian",                   "Fiji",                              "Fijian_cuisine", ""),
("Finnish",                  "Finland",                           "Finnish_cuisine", ""),
("French",                   "France",                            "French_cuisine", ""),

("Gabonese",                 "Gabon",                             "Gabonese_cuisine", ""),
("Gambian",                  "Gambia",                            "Gambian_cuisine", ""),
("Georgian",                 "Georgia",                           "Georgian_cuisine", ""),
("German",                   "Germany",                           "German_cuisine", ""),
("Ghanaian",                 "Ghana",                             "Ghanaian_cuisine", ""),
("Greek",                    "Greece",                            "Greek_cuisine", ""),
("Grenada",                  "Grenada",                           "Grenada", ""),
("Guatemalan",               "Guatemala",                         "Guatemalan_cuisine", ""),
("Guinea",                   "Guinea",                            "Cuisine_of_Guinea", ""),
("Guinea-Bissauan",          "Guinea-Bissau",                     "Guinea-Bissauan_cuisine", ""),
("Guyanese",                 "Guyana",                            "Culture_of_Guyana#Cuisine", ""),

("Haitian",                  "Haiti",                             "Haitian_cuisine", ""),
("Honduran",                 "Honduras",                          "Honduran_cuisine", ""),
("Hungarian",                "Hungary",                           "Hungarian_cuisine", ""),

("Icelandic",                "Iceland",                           "Icelandic_cuisine", ""),
("Indian",                   "India",                             "Indian_cuisine", ""),
("Indonesian",               "Indonesia",                         "Indonesian_cuisine", ""),
("Iranian",                  "Iran",                              "Iranian_cuisine", ""),
("Iraqi",                    "Iraq",                              "Iraqi_cuisine", ""),
("Irish",                    "Ireland",                           "Irish_cuisine", ""),
("Israeli",                  "Israel",                            "Israeli_cuisine", ""),
("Italian",                  "Italy",                             "Italian_cuisine", ""),

("Jamaican",                 "Jamaica",                           "Jamaican_cuisine", ""),
("Japanese",                 "Japan",                             "Japanese_cuisine", ""),
("Jordanian",                "Jordan",                            "Jordanian_cuisine", ""),

("Kazakh",                   "Kazakhstan",                        "Kazakh_cuisine", ""),
("Kenyan",                   "Kenya",                             "Culture_of_Kenya#Cuisine", ""),
("Kiribati",                 "Kiribati",                          "Kiribati", ""),
("Kosovan",                  "Kosovo",                            "Kosovan_cuisine", ""),
("Kuwaiti",                  "Kuwait",                            "Kuwaiti_cuisine", ""),
("Kyrgyz",                   "Kyrgyzstan",                        "Kyrgyz_cuisine", ""),

("Lao",                      "Laos",                              "Lao_cuisine", ""),
("Latvian",                  "Latvia",                            "Latvian_cuisine", ""),
("Lebanese",                 "Lebanon",                           "Lebanese_cuisine", ""),
("Basotho",                  "Lesotho",                           "Cuisine_of_Lesotho", ""),
("Liberian",                 "Liberia",                           "Liberian_cuisine", ""),
("Libyan",                   "Libya",                             "Libyan_cuisine", ""),
("Liechtensteiner",          "Liechtenstein",                     "Liechtenstein_cuisine", ""),
("Lithuanian",               "Lithuania",                         "Lithuanian_cuisine", ""),
("Luxembourg",               "Luxembourg",                        "Luxembourg%27s_cuisine", ""),

("Malagasy",                 "Madagascar",                        "Malagasy_cuisine", ""),
("Malawian",                 "Malawi",                            "Malawian_cuisine", ""),
("Malaysian",                "Malaysia",                          "Malaysian_cuisine", ""),
("Maldivian",                "Maldives",                          "Maldivian_cuisine", ""),
("Malian",                   "Mali",                              "Malian_cuisine", ""),
("Maltese",                  "Malta",                             "Maltese_cuisine", ""),
("Marshall Islands",         "Marshall Islands",                  "NA", ""),
("Mauritanian",              "Mauritania",                        "Mauritanian_cuisine", ""),
("Mauritius",                "Mauritius",                         "Cuisine_of_Mauritius", ""),
("Mexican",                  "Mexico",                            "Mexican_cuisine", ""),
("Micronesian",              "Micronesia",                        "NA", ""),
("Moldovan",                 "Moldova",                           "Moldovan_cuisine", ""),
("Monégasque",               "Monaco",                            "Monégasque_cuisine", ""),
("Mongolian",                "Mongolia",                          "Mongolian_cuisine", ""),
("Montenegrin",              "Montenegro",                        "Montenegrin_cuisine", ""),
("Moroccan",                 "Morocco",                           "Moroccan_cuisine", ""),
("Mozambique",               "Mozambique",                        "Cuisine_of_Mozambique", ""),
("Burmese",                  "Myanmar",                           "Burmese_cuisine", ""),

("Namibian",                 "Namibia",                           "Namibian_cuisine", ""),
("Nauru",                    "Nauru",                             "NA", ""),
("Nepalese",                 "Nepal",                             "Nepalese_cuisine", ""),
("Dutch",                    "Netherlands",                       "Dutch_cuisine", ""),
("New Zealand",              "New Zealand",                       "New_Zealand_cuisine", ""),
("Nicaraguan",               "Nicaragua",                         "Nicaraguan_cuisine", ""),
("Niger",                    "Niger",                             "Cuisine_of_Niger", ""),
("Nigerian",                 "Nigeria",                           "Nigerian_cuisine", ""),
("North Korean",             "North Korea",                       "North_Korean_cuisine", ""),
("Macedonian",               "North Macedonia",                   "Macedonian_cuisine", ""),
("Norwegian",                "Norway",                            "Norwegian_cuisine", ""),

("Omani",                    "Oman",                              "Omani_cuisine", ""),

("Pakistani",                "Pakistan",                          "Pakistani_cuisine", ""),
("Palauan",                  "Palau",                             "Palau#Cuisine", ""),
("Palestinian",              "Palestine",                         "Palestinian_cuisine", ""),
("Panamanian",               "Panama",                            "Panamanian_cuisine", ""),
("Papua New Guinean",        "Papua New Guinea",                  "Papua_New_Guinean_cuisine", ""),
("Paraguayan",               "Paraguay",                          "Paraguayan_cuisine", ""),
("Peruvian",                 "Peru",                              "Peruvian_cuisine", ""),
("Filipino",                 "Philippines",                       "Filipino_cuisine", ""),
("Polish",                   "Poland",                            "Polish_cuisine", ""),
("Portuguese",               "Portugal",                          "Portuguese_cuisine", ""),

("Qatari",                   "Qatar",                             "Qatari_cuisine", ""),

("Romanian",                 "Romania",                           "Romanian_cuisine", ""),
("Russian",                  "Russia",                            "Russian_cuisine", ""),
("Rwandan",                  "Rwanda",                            "Rwandan_cuisine", ""),

("Saint Kitts and Nevis",    "Saint Kitts and Nevis",             "NA", ""),
("Saint Lucian",             "Saint Lucia",                       "Saint_Lucian_cuisine", ""),
("Grenadine",                "Saint Vincent and the Grenadines",  "NA", ""),
("Samoan",                   "Samoa",                             "NA", ""),
("Sammarinese",              "San Marino",                        "Sammarinese_cuisine", ""),
("Sao Tome and Principe",    "Sao Tome and Principe",             "Cuisine_of_São_Tomé_and_Príncipe", ""),
("Saudi Arabian",            "Saudi Arabia",                      "Saudi_Arabian_cuisine", ""),
("Senegalese",               "Senegal",                           "Senegalese_cuisine", ""),
("Serbian",                  "Serbia",                            "Serbian_cuisine", ""),
("Seychellois",              "Seychelles",                        "Seychellois_cuisine", ""),
("Sierra Leonean",           "Sierra Leone",                      "Sierra_Leonean_cuisine", ""),
("Singaporean",              "Singapore",                         "Singaporean_cuisine", ""),
("Slovak",                   "Slovakia",                          "Slovak_cuisine", ""),
("Slovenian",                "Slovenia",                          "Slovenian_cuisine", ""),
("Solomon Islands",          "Solomon Islands",                   "NA", ""),
("Somali",                   "Somalia",                           "Somali_cuisine", ""),
("South African",            "South Africa",                      "South_African_cuisine", ""),
("South Korean",             "South Korea",                       "Korean_cuisine", ""),
("South Sudan",              "South Sudan",                       "South_African_cuisine", ""),
("Spanish",                  "Spain",                             "Spanish_cuisine", ""),
("Sri Lankan",               "Sri Lanka",                         "Sri_Lankan_cuisine", ""),
("Sudanese",                 "Sudan",                             "Sudanese_cuisine", ""),
("Surinamese",               "Suriname",                          "Culture_of_Suriname#Cuisine", ""),
("Swedish",                  "Sweden",                            "Swedish_cuisine", ""),
("Swiss",                    "Switzerland",                       "Swiss_cuisine", ""),
("Syrian",                   "Syria",                             "Syrian_cuisine", ""),

("Taiwanese",                "Taiwan",                            "Taiwanese_cuisine", ""),
("Tajik",                    "Tajikistan",                        "Tajik_cuisine", ""),
("Tanzanian",                "Tanzania",                          "Culture_of_Tanzania#Cuisine", ""),
("Thai",                     "Thailand",                          "Thai_cuisine", ""),
("Timorese",                 "Timor-Leste",                       "East_Timor", ""),
("Togolese",                 "Togo",                              "Togolese_cuisine", ""),
("Tongan",                   "Tonga",                             "Culture_of_Tonga#Cuisine", ""),
("Trinidad and Tobago",      "Trinidad and Tobago",               "Trinidad_and_Tobago_cuisine", ""),
("Tunisian",                 "Tunisia",                           "Tunisian_cuisine", ""),
("Turkish",                  "Turkey",                            "Turkish_cuisine", ""),
("Turkmen",                  "Turkmenistan",                      "Turkmen_cuisine", ""),
("Tuvaluan",                 "Tuvalu",                            "Cuisine_of_Tuvalu", ""),

("Ugandan",                  "Uganda",                            "Ugandan_cuisine", ""),
("Ukrainian",                "Ukraine",                           "Ukrainian_cuisine", ""),
("Emirati",                  "United Arab Emirates",              "Emirati_cuisine", ""),
("British",                  "United Kingdom",                    "British_cuisine", ""),
("American",                 "United States of America",          "American_cuisine", ""),
("Uruguayan",                "Uruguay",                           "Uruguayan_cuisine", ""),
("Uzbek",                    "Uzbekistan",                        "Uzbek_cuisine", ""),

("Vanuatuan",                "Vanuatu",                           "Vanuatuan_cuisine", ""),
("Venezuelan",               "Venezuala",                         "Venezuelan_cuisine", ""),
("Vietnamese",               "Vietnam",                           "Vietnamese_cuisine", ""),

("Yemeni",                   "Yemen",                             "Yemeni_cuisine", ""),

("Zambian",                  "Zambia",                            "Zambian_cuisine", ""),
("Zimbabwean",               "Zimbabwe",                          "Zimbabwe#Cuisine", "");

INSERT INTO equipment_types (name) VALUES
("Cleaning"),
("Preparing"),
("Cooking"),
("Dining"),
("Storage");

INSERT INTO equipment
(type,        author,  owner,   name,                               description, image)
VALUES
("Preparing", "NOBSC", "NOBSC", "Ceramic Stone",                    "It works.", "nobsc-ceramic-stone"),
("Preparing", "NOBSC", "NOBSC", "Chef\'s Knife",                    "It works.", "nobsc-chefs-knife"),
("Preparing", "NOBSC", "NOBSC", "Cutting Board",                    "It works.", "nobsc-cutting-board"),
("Preparing", "NOBSC", "NOBSC", "Y Peeler",                         "It works.", "nobsc-y-peeler"),
("Preparing", "NOBSC", "NOBSC", "Wooden Spoon",                     "It works.", "nobsc-wooden-spoon"),
("Preparing", "NOBSC", "NOBSC", "Serated Knife",                    "It works.", "nobsc-serated-knife"),
("Preparing", "NOBSC", "NOBSC", "Rubber Spatula",                   "It works.", "nobsc-rubber-spatula"),
("Preparing", "NOBSC", "NOBSC", "Whisk",                            "It works.", "nobsc-whisk"),
("Preparing", "NOBSC", "NOBSC", "Pepper Mill",                      "It works.", "nobsc-pepper-mill"),
("Preparing", "NOBSC", "NOBSC", "Can Opener",                       "It works.", "nobsc-can-opener"),
("Preparing", "NOBSC", "NOBSC", "Side Peeler",                      "It works.", "nobsc-side-peeler"),
("Preparing", "NOBSC", "NOBSC", "Box Grater",                       "It works.", "nobsc-box-grater"),
("Preparing", "NOBSC", "NOBSC", "Small Mixing Bowl",                "It works.", "nobsc-small-mixing-bowl"),
("Preparing", "NOBSC", "NOBSC", "Medium Mixing Bowl",               "It works.", "nobsc-medium-mixing-bowl"),
("Preparing", "NOBSC", "NOBSC", "Large Mixing Bowl",                "It works.", "nobsc-large-mixing-bowl"),
("Preparing", "NOBSC", "NOBSC", "Salad Spinner",                    "It works.", "nobsc-salad-spinner"),
("Preparing", "NOBSC", "NOBSC", "Dry Measuring Cups",               "It works.", "nobsc-dry-measuring-cups"),
("Preparing", "NOBSC", "NOBSC", "Liquid Measuring Cups",            "It works.", "nobsc-liquid-measuring-cups"),
("Preparing", "NOBSC", "NOBSC", "Measuring Spoons",                 "It works.", "nobsc-measuring-spoons"),
("Preparing", "NOBSC", "NOBSC", "Measuring Pitcher",                "It works.", "nobsc-measuring-pitcher"),
("Preparing", "NOBSC", "NOBSC", "Digital Scale",                    "It works.", "nobsc-digital-scale"),
("Preparing", "NOBSC", "NOBSC", "Handheld Mixer",                   "It works.", "nobsc-handheld-mixer"),
("Preparing", "NOBSC", "NOBSC", "Blender",                          "It works.", "nobsc-blender"),
("Preparing", "NOBSC", "NOBSC", "Immersion Blender",                "It works.", "nobsc-immersion-blender"),
("Preparing", "NOBSC", "NOBSC", "Parchment Paper",                  "It works.", "nobsc-parchment-paper"),
("Preparing", "NOBSC", "NOBSC", "Plastic Wrap",                     "It works.", "nobsc-plastic-wrap"),
("Preparing", "NOBSC", "NOBSC", "Aluminum Foil",                    "It works.", "nobsc-aluminum-foil"),
("Preparing", "NOBSC", "NOBSC", "Cheesecloth",                      "It works.", "nobsc-cheesecloth"),

("Cooking",   "NOBSC", "NOBSC", "Coffee Maker",                     "It works.", "nobsc-coffee-maker"),
("Cooking",   "NOBSC", "NOBSC", "Tea Pot",                          "It works.", "nobsc-tea-pot"),
("Cooking",   "NOBSC", "NOBSC", "Microwave",                        "It works.", "nobsc-ladle"),
("Cooking",   "NOBSC", "NOBSC", "Toaster Oven",                     "It works.", "nobsc-ladle"),
("Cooking",   "NOBSC", "NOBSC", "Small Sauce Pan",                  "It works.", "nobsc-small-sauce-pan"),
("Cooking",   "NOBSC", "NOBSC", "Medium Sauce Pan",                 "It works.", "nobsc-medium-sauce-pan"),
("Cooking",   "NOBSC", "NOBSC", "Medium Stock Pot",                 "It works.", "nobsc-medium-stock-pot"),
("Cooking",   "NOBSC", "NOBSC", "Large Stock Pot",                  "It works.", "nobsc-large-stock-pot"),
("Cooking",   "NOBSC", "NOBSC", "Stainless Steel Lidded Saute Pan", "It works.", "nobsc-stainless-steel-lidded-saute-pan"),
("Cooking",   "NOBSC", "NOBSC", "Small Stainless Steel Skillet",    "It works.", "nobsc-small-stainless-steel-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Large Stainless Steel Skillet",    "It works.", "nobsc-large-stainless-steel-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Small Cast-Iron Skillet",          "It works.", "nobsc-small-cast-iron-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Large Cast-Iron Skillet",          "It works.", "nobsc-large-cast-iron-skillet"),
("Cooking",   "NOBSC", "NOBSC", "Glass Baking Dish",                "It works.", "nobsc-glass-baking-dish"),
("Cooking",   "NOBSC", "NOBSC", "Sturdy Baking Sheet",              "It works.", "nobsc-sturdy-baking-dish"),
("Cooking",   "NOBSC", "NOBSC", "Small Gratin Dish",                "It works.", "nobsc-small-gratin-dish"),
("Cooking",   "NOBSC", "NOBSC", "Large Gratin Dish",                "It works.", "nobsc-large-gratin-dish"),
("Cooking",   "NOBSC", "NOBSC", "Dutch Oven",                       "It works.", "nobsc-dutch-oven"),
("Cooking",   "NOBSC", "NOBSC", "Oven Mitts",                       "It works.", "nobsc-oven-mitts"),
("Cooking",   "NOBSC", "NOBSC", "Splatter Screen",                  "It works.", "nobsc-splatter-screen"),
("Cooking",   "NOBSC", "NOBSC", "Colander",                         "It works.", "nobsc-colander"),
("Cooking",   "NOBSC", "NOBSC", "Mesh Strainer",                    "It works.", "nobsc-mesh-strainer"),
("Cooking",   "NOBSC", "NOBSC", "Tongs",                            "It works.", "nobsc-tongs"),
("Cooking",   "NOBSC", "NOBSC", "Slotted Spoon",                    "It works.", "nobsc-slotted-spoon"),
("Cooking",   "NOBSC", "NOBSC", "Serving Spoon",                    "It works.", "nobsc-serving-spoon"),
("Cooking",   "NOBSC", "NOBSC", "Spider",                           "It works.", "nobsc-spider"),
("Cooking",   "NOBSC", "NOBSC", "Sturdy Spatula",                   "It works.", "nobsc-sturdy-spatula"),
("Cooking",   "NOBSC", "NOBSC", "Fish Spatula",                     "It works.", "nobsc-fish-spatula"),
("Cooking",   "NOBSC", "NOBSC", "Ladle",                            "It works.", "nobsc-ladle");

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
("Fish",      "NOBSC", "NOBSC", "",                   "Tuna",                                     "Tasty.", "nobsc-tuna"),
("Fish",      "NOBSC", "NOBSC", "",                   "Salmon",                                   "Tasty.", "nobsc-salmon"),
("Fish",      "NOBSC", "NOBSC", "",                   "Tilapia",                                  "Tasty.", "nobsc-tilapia"),
("Fish",      "NOBSC", "NOBSC", "",                   "Pollock",                                  "Tasty.", "nobsc-pollock"),
("Fish",      "NOBSC", "NOBSC", "",                   "Catfish",                                  "Tasty.", "nobsc-catfish"),
("Fish",      "NOBSC", "NOBSC", "",                   "Cod",                                      "Tasty.", "nobsc-cod"),

("Shellfish", "NOBSC", "NOBSC", "",                   "Clams",                                    "Tasty.", "nobsc-clams"),
("Shellfish", "NOBSC", "NOBSC", "",                   "Crab",                                     "Tasty.", "nobsc-crab"),
("Shellfish", "NOBSC", "NOBSC", "",                   "Shrimp",                                   "Tasty.", "nobsc-shrimp"),

("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Seven Bone Roast",                   "Tasty.", "nobsc-chuck-7-bone-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Seven Bone Steak",                   "Tasty.", "nobsc-chuck-7-bone-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Arm Roast",                          "Tasty.", "nobsc-chuck-arm-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Arm Roast",                          "Tasty.", "nobsc-chuck-arm-rost-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Arm Steak",                          "Tasty.", "nobsc-chuck-arm-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Arm Steak",                          "Tasty.", "nobsc-chuck-arm-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Blade Roast",                        "Tasty.", "nobsc-chuck-blade-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Blade Steak",                        "Tasty.", "nobsc-chuck-blade-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Blade Steak",                        "Tasty.", "nobsc-chuck-blade-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Chuck Blade Steak",                        "Tasty.", "nobsc-chuck-blade-steak-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Cross Rib Roast",                    "Tasty.", "nobsc-chuck-cross-rib-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Cross Rib Roast",                    "Tasty.", "nobsc-chuck-cross-rib-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Eye Edge Roast",                     "Tasty.", "nobsc-chuck-eye-edge-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Eye Roast",                          "Tasty.", "nobsc-chuck-eye-roast-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Eye Steak",                          "Tasty.", "nobsc-chuck-eye-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Flanken Style Ribs",                 "Tasty.", "nobsc-chuck-flanken-style-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Flanken Style Ribs",                 "Tasty.", "nobsc-chuck-flanken-style-ribs-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Flat Ribs",                          "Tasty.", "nobsc-chuck-flat-ribs"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Mock Tender Roast",                  "Tasty.", "nobsc-chuck-mock-tender-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Mock Tender Steak",                  "Tasty.", "nobsc-chuck-mock-tender-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Neck Roast",                         "Tasty.", "nobsc-chuck-neck-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Neck Roast",                         "Tasty.", "nobsc-chuck-neck-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Roast",                              "Tasty.", "nobsc-chuck-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Short Ribs",                         "Tasty.", "nobsc-chuck-short-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Short Ribs",                         "Tasty.", "nobsc-chuck-short-ribs-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Center Steak Ranch Steak",  "Tasty.", "nobsc-chuck-shoulder-center-steak-ranch-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Roast",                     "Tasty.", "nobsc-chuck-shoulder-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Roast",                     "Tasty.", "nobsc-chuck-shoulder-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Steak",                     "Tasty.", "nobsc-chuck-shoulder-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Tender",                    "Tasty.", "nobsc-chuck-shoulder-tender"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Tender Medallions",         "Tasty.", "nobsc-chuck-shoulder-tender-medallions"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Top Blade Roast",           "Tasty.", "nobsc-chuck-shoulder-top-blade-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Shoulder Top Blade Steak",           "Tasty.", "nobsc-chuck-shoulder-top-blade-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Shoulder Top Blade Steak Flat Iron", "Tasty.", "nobsc-chuck-shoulder-top-blade-steak-flat-iron"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Top Blade Roast",                    "Tasty.", "nobsc-chuck-top-blade-roast"),
("Beef",      "NOBSC", "NOBSC", "Bone In",            "Chuck Top Blade Steak",                    "Tasty.", "nobsc-chuck-top-blade-steak-bone-in"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Under Blade Roast",                  "Tasty.", "nobsc-chuck-under-blade-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Under Blade Roast",                  "Tasty.", "nobsc-chuck-under-blade-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Chuck Under Blade Steak",                  "Tasty.", "nobsc-chuck-under-blade-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Chuck Under Blade Steak",                  "Tasty.", "nobsc-chuck-under-blade-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Roast",                 "Tasty.", "nobsc-round-bottom-round-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Roast Triangle Roast",  "Tasty.", "nobsc-round-bottom-round-roast-triangle-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Rump Roast",            "Tasty.", "nobsc-round-bottom-round-rump-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Steak",                 "Tasty.", "nobsc-round-bottom-round-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Bottom Round Steak Western Griller", "Tasty.", "nobsc-round-bottom-round-steak-western-griller"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Eye Round Roast",                    "Tasty.", "nobsc-round-eye-round-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Eye Round Steak",                    "Tasty.", "nobsc-round-eye-round-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Heel of Round",                      "Tasty.", "nobsc-round-heel-of-round"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Sirloin Tip Center Roast",           "Tasty.", "nobsc-round-sirloin-tip-center-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Sirloin Tip Center Steak",           "Tasty.", "nobsc-round-sirloin-tip-center-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Sirloin Tip Side Steak",             "Tasty.", "nobsc-round-sirloin-tip-side-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Steak",                              "Tasty.", "nobsc-round-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Round Steak",                              "Tasty.", "nobsc-round-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Tip Roast",                          "Tasty.", "nobsc-round-tip-roast"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Round Tip Roast",                          "Tasty.", "nobsc-round-tip-roast-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Tip Steak",                          "Tasty.", "nobsc-round-tip-steak"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Round Tip Steak",                          "Tasty.", "nobsc-round-tip-steak-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Roast",                    "Tasty.", "nobsc-round-top-round-roast"),
("Beef",      "NOBSC", "NOBSC", "Cap Off",            "Round Top Round Roast",                    "Tasty.", "nobsc-round-top-round-roast-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Steak",                    "Tasty.", "nobsc-round-top-round-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Steak Butterflied",        "Tasty.", "nobsc-round-top-round-steak-butterflied"),
("Beef",      "NOBSC", "NOBSC", "",                   "Round Top Round Steak First Cut",          "Tasty.", "nobsc-round-top-round-steak-first-cut"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Ball Tip Roast",                      "Tasty.", "nobsc-loin-ball-tip-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Ball Tip Steak",                      "Tasty.", "nobsc-loin-ball-tip-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Flap Meat Steak",                     "Tasty.", "nobsc-loin-flap-meat-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Porterhouse Steak",                   "Tasty.", "nobsc-loin-porterhouse-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Shell Sirloin Steak",                 "Tasty.", "nobsc-loin-shell-sirloin-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Sirloin Steak",                       "Tasty.", "nobsc-loin-sirloin-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin T Bone Steak",                        "Tasty.", "nobsc-loin-t-bone-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tenderloin Roast",                    "Tasty.", "nobsc-loin-tenderloin-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tenderloin Steak",                    "Tasty.", "nobsc-loin-tenderloin-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Top Loin Roast",                      "Tasty.", "nobsc-loin-top-loin-roast"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Loin Roast",                      "Tasty.", "nobsc-loin-top-loin-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Top Loin Steak",                      "Tasty.", "nobsc-loin-top-loin-steak"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Loin Steak",                      "Tasty.", "nobsc-loin-top-loin-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Sirloin Roast",                   "Tasty.", "nobsc-loin-top-sirloin-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless Cap Off",   "Loin Top Sirloin Roast",                   "Tasty.", "nobsc-loin-top-sirloin-roast-boneless-cap-off"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Loin Top Sirloin Steak",                   "Tasty.", "nobsc-loin-top-sirloin-steak-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless Cap Off",   "Loin Top Sirloin Steak",                   "Tasty.", "nobsc-loin-top-sirloin-steak-boneless-cap-off"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tri Tip Roast",                       "Tasty.", "nobsc-loin-tri-tip-roast"),
("Beef",      "NOBSC", "NOBSC", "",                   "Loin Tri Tip Steak",                       "Tasty.", "nobsc-loin-tri-tip-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Shank Cross Cut",                          "Tasty.", "nobsc-shank-cross-cut"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Shank Cross Cut",                          "Tasty.", "nobsc-shank-cross-cut-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Plate Skirt Steak",                        "Tasty.", "nobsc-plate-skirt-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Flank Steak",                              "Tasty.", "nobsc-flank-flank-steak"),
("Beef",      "NOBSC", "NOBSC", "",                   "Ground Beef",                              "Tasty.", "nobsc-ground-beef"),
("Beef",      "NOBSC", "NOBSC", "",                   "Back Ribs",                                "Tasty.", "nobsc-back-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Cap Meat",                             "Tasty.", "nobsc-rib-cap-meat-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Extra Trim Roast Large End",           "Tasty.", "nobsc-rib-extra-trim-roast-large-end"),
("Beef",      "NOBSC", "NOBSC", "",                   "Ribeye Roast",                             "Tasty.", "nobsc-ribeye-roast"),
("Beef",      "NOBSC", "NOBSC", "Lip On Bone In",     "Ribeye Roast",                             "Tasty.", "nobsc-ribeye-roast-lip-on-bone-in"),
("Beef",      "NOBSC", "NOBSC", "Lip On Boneless",    "Ribeye Roast",                             "Tasty.", "nobsc-ribeye-roast-lip-on-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Ribeye Steak",                             "Tasty.", "nobsc-ribeye-steak"),
("Beef",      "NOBSC", "NOBSC", "Lip On Bone In",     "Ribeye Steak",                             "Tasty.", "nobsc-ribeye-steak-lip-on-bone-in"),
("Beef",      "NOBSC", "NOBSC", "Lip On Boneless",    "Ribeye Steak",                             "Tasty.", "nobsc-ribeye-steak-lip-on-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Roast Large End",                      "Tasty.", "nobsc-rib-roast-large-end"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Roast Large End",                      "Tasty.", "nobsc-rib-roast-large-end-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Roast Small End",                      "Tasty.", "nobsc-rib-roast-small-end"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Roast Small End",                      "Tasty.", "nobsc-rib-roast-small-end-boneless"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Rolled Cap Pot Roast",                 "Tasty.", "nobsc-rib-rolled-cap-pot-roast-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Short Ribs",                           "Tasty.", "nobsc-rib-short-ribs"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Short Ribs",                           "Tasty.", "nobsc-rib-short-ribs-boneless"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Steak Large End",                      "Tasty.", "nobsc-rib-steak-large-end"),
("Beef",      "NOBSC", "NOBSC", "",                   "Rib Steak Small End",                      "Tasty.", "nobsc-rib-steak-small-end"),
("Beef",      "NOBSC", "NOBSC", "Boneless",           "Rib Steak Small End",                      "Tasty.", "nobsc-rib-steak-small-end-boneless"),

("Pork",      "NOBSC", "NOBSC", "",                   "Bacon",                                    "Tasty.", "nobsc-bacon"),

("Poultry",   "NOBSC", "NOBSC", "Bone In",            "Chicken Breasts",                          "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "Boneless",           "Chicken Breasts",                          "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Breasts",                          "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Tenderloins",                      "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "Bone In",            "Chicken Thighs",                           "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "Boneless",           "Chicken Thighs",                           "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Thighs",                           "Tasty.", "nobsc-raw-chicken-wings"),
("Poultry",   "NOBSC", "NOBSC", "",                   "Chicken Wings",                            "Tasty.", "nobsc-raw-chicken-wings"),

("Egg",       "NOBSC", "NOBSC", "",                   "Extra Large Eggs",                         "Tasty.", "nobsc-eggs"),
("Egg",       "NOBSC", "NOBSC", "",                   "Large Eggs",                               "Tasty.", "nobsc-eggs"),
("Egg",       "NOBSC", "NOBSC", "",                   "Medium Eggs",                              "Tasty.", "nobsc-eggs"),

("Dairy",     "NOBSC", "NOBSC", "Salted",             "Butter",                                   "Tasty.", "nobsc-butter"),
("Dairy",     "NOBSC", "NOBSC", "Unsalted",           "Butter",                                   "Tasty.", "nobsc-butter"),
("Dairy",     "NOBSC", "NOBSC", "",                   "Cream",                                    "Tasty.", "nobsc-cream"),
      
("Oil",       "NOBSC", "NOBSC", "",                   "Coconut",                                  "Tasty.", "nobsc-coconut"),

("Grain",     "NOBSC", "NOBSC", "Corn",               "Starch",                                   "Tasty.", "nobsc-eggs"),
("Grain",     "NOBSC", "NOBSC", "Potato",             "Starch",                                   "Tasty.", "nobsc-eggs"),
("Grain",     "NOBSC", "NOBSC", "All-Purpose",        "Flour",                                    "Tasty.", "nobsc-eggs"),

("Bean",      "NOBSC", "NOBSC", "Black Turtle",       "Beans",                                    "Tasty.", "nobsc-black-turtle-beans"),
("Bean",      "NOBSC", "NOBSC", "Garbanzo",           "Beans",                                    "Tasty.", "nobsc-garbanzo-beans-chickpeas"),
("Bean",      "NOBSC", "NOBSC", "Great Northern",     "Beans",                                    "Tasty.", "nobsc-great-northern-beans"),
("Bean",      "NOBSC", "NOBSC", "Pinto",              "Beans",                                    "Tasty.", "nobsc-pinto-beans"),
("Bean",      "NOBSC", "NOBSC", "Red Kidney",         "Beans",                                    "Tasty.", "nobsc-red-kidney-beans"),
("Bean",      "NOBSC", "NOBSC", "",                   "Split Peas",                               "Tasty.", "nobsc-split-peas"),

("Vegetable", "NOBSC", "NOBSC", "All Blue",           "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Austrian Crescent",  "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "French Fingerling",  "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Kennebec",           "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "LaRette",            "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Norland Red",        "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Purple Majesty",     "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Red Gold",           "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Red Thumb",          "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Ranger",      "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Burbank",     "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Norkotah",    "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russet Umatilla",    "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Russian Banana",     "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "Yukon Gold",         "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Broccoli",                                 "Tasty.", "nobsc-broccoli"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Brussels Sprouts",                         "Tasty.", "nobsc-brussels-sprouts"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Bok Choy",                                 "Tasty.", "nobsc-bok-choy"),
("Vegetable", "NOBSC", "NOBSC", "Green",              "Cabbage",                                  "Tasty.", "nobsc-green-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "Red",                "Cabbage",                                  "Tasty.", "nobsc-red-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "Napa",               "Cabbage",                                  "Tasty.", "nobsc-napa-cabbage-chinese-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "Savoy",              "Cabbage",                                  "Tasty.", "nobsc-savoy-cabbage"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Cauliflower",                              "Tasty.", "nobsc-cauliflower"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Kohlrabi",                                 "Tasty.", "nobsc-kohlrabi"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Collard Greens",                           "Tasty.", "nobsc-collard-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Turnip Greens",                            "Tasty.", "nobsc-turnip-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Pak Choy Baby Bok Choy",                   "Tasty.", "nobsc-pak-choy-baby-bok-choy"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Zucchini",                                 "Tasty.", "nobsc-zucchini"),
("Vegetable", "NOBSC", "NOBSC", "Standard Slicing",   "Cucumber",                                 "Tasty.", "nobsc-standard-slicing-cucumber"),
("Vegetable", "NOBSC", "NOBSC", "Purple",             "Eggplant",                                 "Tasty.", "nobsc-purple-eggplant"),
("Vegetable", "NOBSC", "NOBSC", "White",              "Eggplant",                                 "Tasty.", "nobsc-white-eggplant"),
("Vegetable", "NOBSC", "NOBSC", "Japanese",           "Eggplant",                                 "Tasty.", "nobsc-japanese-eggplant"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Pumpkin",                                  "Tasty.", "nobsc-pumpkin"),
("Vegetable", "NOBSC", "NOBSC", "Acorn",              "Squash",                                   "Tasty.", "nobsc-acorn-squash"),
("Vegetable", "NOBSC", "NOBSC", "Butternut",          "Squash",                                   "Tasty.", "nobsc-butternut-squash"),
("Vegetable", "NOBSC", "NOBSC", "Hubbard",            "Squash",                                   "Tasty.", "nobsc-hubbard-squash"),
("Vegetable", "NOBSC", "NOBSC", "Spaghetti",          "Squash",                                   "Tasty.", "nobsc-spaghetti-squash"),
("Vegetable", "NOBSC", "NOBSC", "Delicata",           "Squash",                                   "Tasty.", "nobsc-delicata-squash"),
("Vegetable", "NOBSC", "NOBSC", "Boston",             "Lettuce",                                  "Tasty.", "nobsc-boston-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Bibb",               "Lettuce",                                  "Tasty.", "nobsc-bibb-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Iceberg",            "Lettuce",                                  "Tasty.", "nobsc-iceberg-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Romaine",            "Lettuce",                                  "Tasty.", "nobsc-romaine-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Green Leaf",         "Lettuce",                                  "Tasty.", "nobsc-green-leaf-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Oak Leaf",           "Lettuce",                                  "Tasty.", "nobsc-oak-leaf-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "Red Leaf",           "Lettuce",                                  "Tasty.", "nobsc-red-leaf-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Arugula Rocket",                           "Tasty.", "nobsc-arugula-rocket"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Belgian Endive",                           "Tasty.", "nobsc-belgian-endive"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Frisee",                                   "Tasty.", "nobsc-frisee"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Escarole",                                 "Tasty.", "nobsc-escarole"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Mache Lambs Lettuce",                      "Tasty.", "nobsc-mache-lambs-lettuce"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Radicchio",                                "Tasty.", "nobsc-radicchio"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Watercress",                               "Tasty.", "nobsc-watercress"),
("Vegetable", "NOBSC", "NOBSC", "Baby",               "Spinach",                                  "Tasty.", "nobsc-baby-spinach"),
("Vegetable", "NOBSC", "NOBSC", "Frozen",             "Spinach",                                  "Tasty.", "nobsc-spinach"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Spinach",                                  "Tasty.", "nobsc-spinach"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Swiss Chard",                              "Tasty.", "nobsc-swiss-chard"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Beet Greens",                              "Tasty.", "nobsc-beet-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Dandelion Greens",                         "Tasty.", "nobsc-dandelion-greens"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Mustard Greens",                           "Tasty.", "nobsc-mustard-greens"),
("Vegetable", "NOBSC", "NOBSC", "Shiitake",           "Mushrooms",                                "Tasty.", "nobsc-shiitake-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "Cremini",            "Mushrooms",                                "Tasty.", "nobsc-cremini-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "Portobello",         "Mushrooms",                                "Tasty.", "nobsc-portobello-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Mushrooms",                                "Tasty.", "nobsc-mushrooms"),
("Vegetable", "NOBSC", "NOBSC", "Globe",              "Onion",                                    "Tasty.", "nobsc-globe-onion"),
("Vegetable", "NOBSC", "NOBSC", "Green",              "Onion",                                    "Tasty.", "nobsc-scallion-green-onion"),
("Vegetable", "NOBSC", "NOBSC", "Spanish",            "Onion",                                    "Tasty.", "nobsc-spanish-onion"),
("Vegetable", "NOBSC", "NOBSC", "Sweet",              "Onion",                                    "Tasty.", "nobsc-sweet-onion"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Onion",                                    "Tasty.", "nobsc-onion"),
("Vegetable", "NOBSC", "NOBSC", "Pearl",              "Onions",                                   "Tasty.", "nobsc-pearl-onions"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Leek",                                     "Tasty.", "nobsc-leek"),
("Vegetable", "NOBSC", "NOBSC", "Bell",               "Pepper",                                   "Tasty.", "nobsc-bell-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Poblano",            "Pepper",                                   "Tasty.", "nobsc-poblano-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Jalapeno",           "Pepper",                                   "Tasty.", "nobsc-jalapeno-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Serrano",            "Pepper",                                   "Tasty.", "nobsc-serrano-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Thai",               "Pepper",                                   "Tasty.", "nobsc-thai-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Habanero",           "Pepper",                                   "Tasty.", "nobsc-habanero-pepper"),
("Vegetable", "NOBSC", "NOBSC", "Winterbor",          "Kale",                                     "Tasty.", "nobsc-winterbor-kale-curly-kale"),
("Vegetable", "NOBSC", "NOBSC", "Red Russian",        "Kale",                                     "Tasty.", "nobsc-red-russian-kale"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Kale",                                     "Tasty.", "nobsc-kale"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Green Beans",                              "Tasty.", "nobsc-green-beans"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Celery",                                   "Tasty.", "nobsc-celery"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Asparagus",                                "Tasty.", "nobsc-asparagus"),
("Vegetable", "NOBSC", "NOBSC", "Green",              "Peas",                                     "Tasty.", "nobsc-green-peas"),
("Vegetable", "NOBSC", "NOBSC", "Snow",               "Peas",                                     "Tasty.", "nobsc-snowpeas"),
("Vegetable", "NOBSC", "NOBSC", "Sugar Snap",         "Peas",                                     "Tasty.", "nobsc-sugar-snap-peas"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Carrots",                                  "Tasty.", "nobsc-carrots"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Parsnips",                                 "Tasty.", "nobsc-parsnips"),
("Vegetable", "NOBSC", "NOBSC", "White",              "Turnips",                                  "Tasty.", "nobsc-white-turnips"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Turnips",                                  "Tasty.", "nobsc-turnips"),
("Vegetable", "NOBSC", "NOBSC", "French",             "Radishes",                                 "Tasty.", "nobsc-french-radishes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Radishes",                                 "Tasty.", "nobsc-radishes"),
("Vegetable", "NOBSC", "NOBSC", "Baby Gold",          "Beets",                                    "Tasty.", "nobsc-baby-gold-beets"),
("Vegetable", "NOBSC", "NOBSC", "Red",                "Beets",                                    "Tasty.", "nobsc-red-beets"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Beets",                                    "Tasty.", "nobsc-beets"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Daikon",                                   "Tasty.", "nobsc-daikon"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Horseradish",                              "Tasty.", "nobsc-horseradish"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Rutabaga",                                 "Tasty.", "nobsc-rutabaga"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Sunchoke Jerusalem Artichoke",             "Tasty.", "nobsc-sunchoke-jerusalem-artichoke"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Fennel",                                   "Tasty.", "nobsc-fennel"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Tomatillo",                                "Tasty.", "nobsc-tomatillo"),
("Vegetable", "NOBSC", "NOBSC", "Standard Beefsteak", "Tomatoes",                                 "Tasty.", "nobsc-standard-beefsteak-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Plum Roma",          "Tomatoes",                                 "Tasty.", "nobsc-plum-roma-san-marzano-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Plum San Marzano",   "Tomatoes",                                 "Tasty.", "nobsc-plum-roma-san-marzano-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Sungold",            "Tomatoes",                                 "Tasty.", "nobsc-cherry-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Cherry",             "Tomatoes",                                 "Tasty.", "nobsc-cherry-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "Grape",              "Tomatoes",                                 "Tasty.", "nobsc-grape-tomatoes"),
("Vegetable", "NOBSC", "NOBSC", "",                   "Tomatoes",                                 "Tasty.", "nobsc-cherry-tomatoes"),

("Fruit",     "NOBSC", "NOBSC", "Ambrosia",           "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Baldwin",            "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Braeburn",           "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Cameo",              "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Cortland",           "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Cosmic Crisp",       "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Empire",             "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Enterprise",         "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Fuji",               "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Gala",               "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Golden Delicious",   "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Granny Smith",       "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Honeycrisp",         "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Idared",             "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Jazz",               "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Jonagold",           "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Jonathan",           "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Liberty",            "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Macoun",             "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "McIntosh Red",       "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Melrose",            "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Opal",               "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Ozark Gold",         "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Pinata",             "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Pink Lady",          "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Pristine",           "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Red Delicious",      "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Rome",               "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Spartan",            "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Stayman",            "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "SweeTango",          "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "Winesap",            "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Apple",                                    "Tasty.", "nobsc-apple"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Apricot",                                  "Tasty.", "nobsc-apricot"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Banana",                                   "Tasty.", "nobsc-banana"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Blackberries",                             "Tasty.", "nobsc-blackberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Blueberries",                              "Tasty.", "nobsc-blueberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Cherries",                                 "Tasty.", "nobsc-cherries"),
("Fruit",     "NOBSC", "NOBSC", "Dried",              "Cranberries",                              "Tasty.", "nobsc-cranberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Cranberries",                              "Tasty.", "nobsc-cranberries"),
("Fruit",     "NOBSC", "NOBSC", "Concord",            "Grapes",                                   "Tasty.", "nobsc-grapes"),
("Fruit",     "NOBSC", "NOBSC", "Flame",              "Grapes",                                   "Tasty.", "nobsc-grapes"),
("Fruit",     "NOBSC", "NOBSC", "Moon Drop",          "Grapes",                                   "Tasty.", "nobsc-grapes"),
("Fruit",     "NOBSC", "NOBSC", "Ruby",               "Grapes",                                   "Tasty.", "nobsc-grapes"),
("Fruit",     "NOBSC", "NOBSC", "Thompson",           "Grapes",                                   "Tasty.", "nobsc-grapes"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Grapes",                                   "Tasty.", "nobsc-grapes"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Guava",                                    "Tasty.", "nobsc-guava"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Kiwi",                                     "Tasty.", "nobsc-kiwi"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Mango",                                    "Tasty.", "nobsc-mango"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Watermelon",                               "Tasty.", "nobsc-watermelon"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Nectarine",                                "Tasty.", "nobsc-nectarine"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Papaya",                                   "Tasty.", "nobsc-papaya"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Peach",                                    "Tasty.", "nobsc-peach"),
("Fruit",     "NOBSC", "NOBSC", "Anjou Green",        "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Anjou Red",          "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Asian",              "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Bartlett",           "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Bosc",               "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Comice",             "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Concord",            "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Forelle",            "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "French Butter",      "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Seckel",             "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "Taylor\'s Gold",     "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pear",                                     "Tasty.", "nobsc-pear"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pineapple",                                "Tasty.", "nobsc-pineapple"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Orange",                                   "Tasty.", "nobsc-orange"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Raspberries",                              "Tasty.", "nobsc-raspberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Strawberries",                             "Tasty.", "nobsc-strawberries"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Tangerine",                                "Tasty.", "nobsc-tangerine"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Tangelo",                                  "Tasty.", "nobsc-tangelo"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Blood Orange",                             "Tasty.", "nobsc-blood-orange"),
("Fruit",     "NOBSC", "NOBSC", "",                   "White Grapefruit",                         "Tasty.", "nobsc-white-grapefruit"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pink Grapefruit",                          "Tasty.", "nobsc-pink-grapefruit"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Honeydew",                                 "Tasty.", "nobsc-honeydew"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Cantaloupe",                               "Tasty.", "nobsc-cantaloupe"),
("Fruit",     "NOBSC", "NOBSC", "Italian",            "Plum",                                     "Tasty.", "nobsc-italian-plum"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Plum",                                     "Tasty.", "nobsc-plum"),
("Fruit",     "NOBSC", "NOBSC", "",                   "Pomegranate",                              "Tasty.", "nobsc-pomegranate"),

("Nut",       "NOBSC", "NOBSC", "",                   "Almonds",                                  "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Brazil Nuts",                              "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Cashews",                                  "Tasty.", "nobsc-cashews"),
("Nut",       "NOBSC", "NOBSC", "",                   "Hazelnuts",                                "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Macadamia Nuts",                           "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Peacans",                                  "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Peanuts",                                  "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Pine Nuts",                                "Tasty.", "nobsc-almonds"),
("Nut",       "NOBSC", "NOBSC", "",                   "Pistachios",                               "Tasty.", "nobsc-pistachios"),
("Nut",       "NOBSC", "NOBSC", "",                   "Walnuts",                                  "Tasty.", "nobsc-almonds"),

("Seed",      "NOBSC", "NOBSC", "",                   "Chia Seeds",                               "Tasty.", "nobsc-sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Hemp Seeds",                               "Tasty.", "nobsc-sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Poppy Seeds",                              "Tasty.", "nobsc-sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Pumpkin Seeds",                            "Tasty.", "nobsc-pumpkin-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Sesame Seeds",                             "Tasty.", "nobsc-sesame-seeds"),
("Seed",      "NOBSC", "NOBSC", "",                   "Quinoa",                                   "Tasty.", "nobsc-sesame-seeds"),

("Spice",     "NOBSC", "NOBSC", "Ancho",              "Pepper",                                   "Tasty.", "nobsc-ancho-pepper"),
("Spice",     "NOBSC", "NOBSC", "Arbol",              "Pepper",                                   "Tasty.", "nobsc-arbol-pepper"),
("Spice",     "NOBSC", "NOBSC", "Cascabel",           "Pepper",                                   "Tasty.", "nobsc-cascabel-pepper"),
("Spice",     "NOBSC", "NOBSC", "Guajillo",           "Pepper",                                   "Tasty.", "nobsc-guajillo-pepper"),
("Spice",     "NOBSC", "NOBSC", "Morita",             "Pepper",                                   "Tasty.", "nobsc-morita-pepper"),
("Spice",     "NOBSC", "NOBSC", "Mulato",             "Pepper",                                   "Tasty.", "nobsc-mulato-pepper"),
("Spice",     "NOBSC", "NOBSC", "Pasilla",            "Pepper",                                   "Tasty.", "nobsc-pasilla-pepper"),
("Spice",     "NOBSC", "NOBSC", "Pulla",              "Pepper",                                   "Tasty.", "nobsc-pulla-pepper"),
("Spice",     "NOBSC", "NOBSC", "",                   "Celery Seeds",                             "Tasty.", "nobsc-celery-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cinnamon",                                 "Tasty.", "nobsc-cinnamon"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ground Cinnamon",                          "Tasty.", "nobsc-ground-cinnamon"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cloves",                                   "Tasty.", "nobsc-cloves"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ground Cloves",                            "Tasty.", "nobsc-ground-cloves"),
("Spice",     "NOBSC", "NOBSC", "",                   "Caraway Seeds",                            "Tasty.", "nobsc-cumin-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cumin Seeds",                              "Tasty.", "nobsc-cumin-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Cumin Powder",                             "Tasty.", "nobsc-cumin-powder"),
("Spice",     "NOBSC", "NOBSC", "",                   "Fennel Seeds",                             "Tasty.", "nobsc-fennel-seeds"),
("Spice",     "NOBSC", "NOBSC", "",                   "Garlic",                                   "Tasty.", "nobsc-garlic"),
("Spice",     "NOBSC", "NOBSC", "",                   "Garlic Powder",                            "Tasty.", "nobsc-garlic-powder"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ginger",                                   "Tasty.", "nobsc-ginger"),
("Spice",     "NOBSC", "NOBSC", "",                   "Ginger Powder",                            "Tasty.", "nobsc-ginger-powder"),
("Spice",     "NOBSC", "NOBSC", "",                   "Shallots",                                 "Tasty.", "nobsc-shallots"),
("Spice",     "NOBSC", "NOBSC", "",                   "Turmeric",                                 "Tasty.", "nobsc-turmeric"),
("Spice",     "NOBSC", "NOBSC", "",                   "Turmeric Powder",                          "Tasty.", "nobsc-turmeric-powder"),

("Herb",      "NOBSC", "NOBSC", "",                   "Basil",                                    "Tasty.", "nobsc-basil"),
("Herb",      "NOBSC", "NOBSC", "",                   "Cilantro",                                 "Tasty.", "nobsc-cilantro"),
("Herb",      "NOBSC", "NOBSC", "",                   "Fenugreek",                                "Tasty.", "nobsc-fenugreek"),
("Herb",      "NOBSC", "NOBSC", "",                   "Parsley",                                  "Tasty.", "nobsc-parsley"),
("Herb",      "NOBSC", "NOBSC", "",                   "Rosemary",                                 "Tasty.", "nobsc-rosemary"),
("Herb",      "NOBSC", "NOBSC", "",                   "Sage",                                     "Tasty.", "nobsc-sage"),
("Herb",      "NOBSC", "NOBSC", "",                   "Thyme",                                    "Tasty.", "nobsc-thyme"),

("Acid",      "NOBSC", "NOBSC", "Apple Cider",        "Vinegar",                                  "Tasty.", "nobsc-balsamic-vinegar"),
("Acid",      "NOBSC", "NOBSC", "Balsamic",           "Vinegar",                                  "Tasty.", "nobsc-balsamic-vinegar"),
("Acid",      "NOBSC", "NOBSC", "Rice",               "Vinegar",                                  "Tasty.", "nobsc-balsamic-vinegar"),

("Product",   "NOBSC", "NOBSC", "",                   "Fish Sauce",                               "Tasty.", "nobsc-tobasco-sauce"),
("Product",   "NOBSC", "NOBSC", "Dark",               "Soy Sauce",                                "Tasty.", "nobsc-tobasco-sauce"),
("Product",   "NOBSC", "NOBSC", "Light",              "Soy Sauce",                                "Tasty.", "nobsc-tobasco-sauce");

INSERT INTO ingredients
(type,      author,  owner,   brand,                name,                                       description, image)
VALUES
("Product", "NOBSC", "NOBSC", "Tobasco",            "Hot Sauce",                                "Tasty.", "nobsc-tobasco-sauce");

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
("Drink",     "Afgan",       "NOBSC", "NOBSC", "Borscht",                            "Excellent",        "00:30:00",  "04:00:00", "Chop beets and onions..."),
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
("NOBSC Borscht",                            "NOBSC Garlic", 4,      "teaspoon"),
("NOBSC Soft Buttery Pretzle",               "NOBSC Garlic", 2,      "Tablespoon"),
("NOBSC Grilled Chicken and Seasoned Rice",  "NOBSC Garlic", 1,      "cup"),
("NOBSC Mixed Root Vegetables",              "NOBSC Garlic", 1,      "ounce"),
("NOBSC Coffee Vanilla Icecream Cake",       "NOBSC Garlic", 7,      "pound"),
("NOBSC Fish Carrot and Potato Soup",        "NOBSC Garlic", 1,      "milliliter"),
("NOBSC Possibly Greek Salad",               "NOBSC Garlic", 3,      "liter"),
("NOBSC Irish Guinness Beef Stew",           "NOBSC Garlic", 1,      "gram"),
("NOBSC Northern Chinese Seafood Casserole", "NOBSC Garlic", 9,      "kilogram"),
("NOBSC Sweet Coconut Lime Sauce",           "NOBSC Garlic", 20,     "NA"),
("NOBSC Carrot Ginger Dressing",             "NOBSC Garlic", 10,     "teaspoon"),
("NOBSC Some Kind of Chutney",               "NOBSC Garlic", 13,     "Tablespoon");

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

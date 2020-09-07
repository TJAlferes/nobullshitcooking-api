\W

USE nobsc;

CREATE TABLE `content_types` (
  `id` smallint unsigned NOT NULL DEFAULT '0',
  `parent_id` smallint unsigned NOT NULL DEFAULT '0',
  `name` varchar(60) UNIQUE NOT NULL,
  `path` varchar(255) UNIQUE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisines` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(40) NOT NULL DEFAULT '',
  `nation` varchar(40) UNIQUE NOT NULL,
  `wiki` varchar(60) NOT NULL DEFAULT '',
  `intro` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `equipment_types` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ingredient_types` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `measurements` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `methods` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product_categories` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product_types` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_types` (
  `id` tinyint unsigned NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `staffname` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-staff-default',
  `role` varchar(20) NOT NULL DEFAULT 'staff',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `suppliers` (
  `id` smallint unsigned NOT NULL DEFAULT '0',
  `name` varchar(60) UNIQUE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `username` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-user-default',
  `confirmation_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content_type_id` smallint unsigned NOT NULL,
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `created` char(10) NOT NULL,
  `published` char(10),
  `title` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-content-default',
  `items` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`content_type_id`) REFERENCES `content_types` (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `equipment` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `equipment_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-equipment-default',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_types` (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ingredients` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `ingredient_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `brand` varchar(100),
  `variety` varchar(100),
  `name` varchar(100) NOT NULL,
  `alt_names` json DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-ingredient-default',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `ingredient_types` (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisine_equipment` (
  `cuisine_id` tinyint unsigned NOT NULL,
  `equipment_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisine_ingredients` (
  `cuisine_id` tinyint unsigned NOT NULL,
  `ingredient_id` smallint unsigned NOT NULL DEFAULT '0',
  FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cuisine_suppliers` (
  `cuisine_id` tinyint unsigned NOT NULL,
  `supplier_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`id`),
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int unsigned NOT NULL,
  `receiver_id` int unsigned NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `type` varchar(45) NOT NULL,
  `note` varchar(255) NOT NULL,
  `created` char(10) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `staff_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `products` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `product_category_id` tinyint unsigned NOT NULL DEFAULT '0',
  `product_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `brand` varchar(100),
  `variety` varchar(100),
  `name` varchar(100) NOT NULL,
  `alt_names` json DEFAULT NULL,
  `description` text NOT NULL,
  `specs` json DEFAULT NULL,
  `image` varchar(100) NOT NULL DEFAULT 'nobsc-product-default',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`),
  FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_products` (
  `order_id` int unsigned NOT NULL,
  `product_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `plans` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `data` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product_suppliers` (
  `product_id` smallint unsigned NOT NULL,
  `supplier_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `recipe_type_id` tinyint unsigned NOT NULL,
  `cuisine_id` tinyint unsigned NOT NULL,
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(150) NOT NULL DEFAULT '',
  `active_time` time NOT NULL,
  `total_time` time NOT NULL,
  `directions` text NOT NULL,
  `recipe_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-default',
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-equipment-default',
  `ingredients_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-ingredients-default',
  `cooking_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-cooking-default',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`recipe_type_id`) REFERENCES `recipe_types` (`id`),
  FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_equipment` (
  `recipe_id` int unsigned NOT NULL,
  `equipment_id` smallint unsigned NOT NULL,
  `amount` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_ingredients` (
  `recipe_id` int unsigned NOT NULL DEFAULT '0',
  `ingredient_id` smallint unsigned NOT NULL DEFAULT '0',
  `amount` decimal(5,2) NOT NULL,
  `measurement_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_methods` (
  `recipe_id` int unsigned NOT NULL,
  `method_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`method_id`) REFERENCES `methods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recipe_subrecipes` (
  `recipe_id` int unsigned NOT NULL,
  `subrecipe_id` int unsigned NOT NULL,
  `amount` decimal(5,2) NOT NULL,
  `measurement_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`subrecipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `favorite_recipes` (
  `user_id` int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `saved_recipes` (
  `user_id` int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `friendships` (
  `user_id` int unsigned NOT NULL,
  `friend_id` int unsigned NOT NULL,
  `status` varchar(20) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



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

INSERT INTO content_types
(id, parent_id, name, path)
VALUES
(1,  0, "Page",        "/page"),
(2,  0, "Post",        "/post"),
(3,  1, "Guide",       "/page/guide"),
(4,  1, "Promo",       "/page/promo"),
(5,  1, "Site",        "/page/site"),
(6,  3, "Fitness",     "/page/guide/fitness"),
(7,  3, "Food",        "/page/guide/food"),
(8,  6, "Exercises",   "/page/guide/fitness/exercises"),
(9,  6, "Principles",  "/page/guide/fitness/principles"),
(10, 7, "Recipes",     "/page/guide/food/recipes"),
(11, 7, "Cuisines",    "/page/guide/food/cuisines"),
(12, 7, "Ingredients", "/page/guide/food/ingredients"),
(13, 7, "Nutrition",   "/page/guide/food/nutrition"),
(14, 7, "Equipment",   "/page/guide/food/equipment"),
(15, 7, "Methods",     "/page/guide/food/methods");

INSERT INTO content
(id, author_id, owner_id, created, published, title, items)
VALUES
(8,  1, 1, "2020-04-14", "2020-04-14", "Bike",                               "[]"),
(8,  1, 1, "2020-04-14", "2020-04-14", "Pullup",                             "[]"),
(8,  1, 1, "2020-04-14", "2020-04-14", "Pushup",                             "[]"),
(8,  1, 1, "2020-04-14", "2020-04-14", "Run",                                "[]"),
(8,  1, 1, "2020-04-14", "2020-04-14", "Squat",                              "[]"),
(8,  1, 1, "2020-04-14", "2020-04-14", "Walk",                               "[]"),

(9,  1, 1, "2020-04-14", "2020-04-14", "Agility",                            "[]"),
(9,  1, 1, "2020-04-14", "2020-04-14", "Balance",                            "[]"),
(9,  1, 1, "2020-04-14", "2020-04-14", "Composition",                        "[]"),
(9,  1, 1, "2020-04-14", "2020-04-14", "Endurance",                          "[]"),
(9,  1, 1, "2020-04-14", "2020-04-14", "Flexibility",                        "[]"),
(9,  1, 1, "2020-04-14", "2020-04-14", "Speed",                              "[]"),
(9,  1, 1, "2020-04-14", "2020-04-14", "Strength",                           "[]"),

(10, 1, 1, "2020-04-14", "2020-04-14", "Appetizers",                         "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Casseroles",                         "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Condiments",                         "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Desserts",                           "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Dressings",                          "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Drinks",                             "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Mains",                              "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Salads",                             "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Sauces",                             "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Sides",                              "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Soups",                              "[]"),
(10, 1, 1, "2020-04-14", "2020-04-14", "Stews",                              "[]"),

(12, 1, 1, "2020-04-14", "2020-04-14", "Acids Herbs and Spices",             "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Beans and Vegetables",               "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Eggs and Dairy",                     "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Fats and Oils",                      "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Fish and Shellfish",                 "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Fruit",                              "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Meat and Poultry",                   "[]"),
(12, 1, 1, "2020-04-14", "2020-04-14", "Seeds and Grains",                   "[]"),

(13, 1, 1, "2020-04-14", "2020-04-14", "Calories",                           "[]"),
(13, 1, 1, "2020-04-14", "2020-04-14", "Macronutrients",                     "[]"),
(13, 1, 1, "2020-04-14", "2020-04-14", "Micronutrients",                     "[]"),
(13, 1, 1, "2020-04-14", "2020-04-14", "Supplements",                        "[]"),

(14, 1, 1, "2020-04-14", "2020-04-14", "Cleaning",                           "[]"),
(14, 1, 1, "2020-04-14", "2020-04-14", "Cooking",                            "[]"),
(14, 1, 1, "2020-04-14", "2020-04-14", "Dining",                             "[]"),
(14, 1, 1, "2020-04-14", "2020-04-14", "Preparing",                          "[]"),
(14, 1, 1, "2020-04-14", "2020-04-14", "Storage",                            "[]"),

(15, 1, 1, "2020-04-14", "2020-04-14", "Bake Roast Toast and Broil",         "[]"),
(15, 1, 1, "2020-04-14", "2020-04-14", "BBQ Grill and Smoke",                "[]"),
(15, 1, 1, "2020-04-14", "2020-04-14", "Chill and Freeze",                   "[]"),
(15, 1, 1, "2020-04-14", "2020-04-14", "Saute Fry and Glaze",                "[]"),
(15, 1, 1, "2020-04-14", "2020-04-14", "Steam Poach Simmer Boil and Blanch", "[]"),
(15, 1, 1, "2020-04-14", "2020-04-14", "Stew and Braise",                    "[]");

INSERT INTO cuisines
(id, name, nation, wiki, intro)
VALUES
(1,  "Afghan",                   "Afghanistan",                       "Afghan_cuisine", ""),
(2,  "Albanian",                 "Albania",                           "Albanian_cuisine", ""),
(3,  "Algerian",                 "Algeria",                           "Algerian_cuisine", ""),
(4,  "Catalan",                  "Andorra",                           "Catalan_cuisine", ""),
(5,  "Angolan",                  "Angola",                            "Angolan_cuisine", ""),
(6,  "Antigua and Barbuda",      "Antigua and Barbuda",               "Antigua_and_Barbuda_cuisine", ""),
(7,  "Argentine",                "Argentina",                         "Argentine_cuisine", ""),
(8,  "Armenian",                 "Armenia",                           "Armenian_cuisine", ""),
(9,  "Australian",               "Australia",                         "Australian_cuisine", ""),
(10, "Austrian",                 "Austria",                           "Austrian_cuisine", ""),
(11, "Azerbaijani",              "Azerbaijan",                        "Azerbaijani_cuisine", ""),

(12, "Bahamian",                 "Bahamas",                           "Bahamian_cuisine", ""),
(13, "Bahraini",                 "Bahrain",                           "Bahraini_cuisine", ""),
(14, "Bangladeshi",              "Bangladesh",                        "Bangladeshi_cuisine", ""),
(15, "Bajan",                    "Barbados",                          "Barbadian_cuisine", ""),
(16, "Belarusian",               "Belarus",                           "Belarusian_cuisine", ""),
(17, "Belgian",                  "Belgium",                           "Belgian_cuisine", ""),
(18, "Belizean",                 "Belize",                            "Belizean_cuisine", ""),
(19, "Benin",                    "Benin",                             "Benin_cuisine", ""),
(20, "Bhutanese",                "Bhutan",                            "Bhutanese_cuisine", ""),
(21, "Bolivian",                 "Bolivia",                           "Bolivian_cuisine", ""),
(22, "Bosnia and Herzegovina",   "Bosnia and Herzegovina",            "Bosnia_and_Herzegovina_cuisine", ""),
(23, "Botswana",                 "Botswana",                          "Botswana_cuisine", ""),
(24, "Brazilian",                "Brazil",                            "Brazilian_cuisine", ""),
(25, "Bruneian",                 "Brunei",                            "Bruneian_cuisine", ""),
(26, "Bulgarian",                "Bulgaria",                          "Bulgarian_cuisine", ""),
(27, "Burkinabe",                "Burkina Faso",                      "Burkinabe_cuisine", ""),
(28, "Burundian",                "Burundi",                           "Burundian_cuisine", ""),

(29, "Ivorian",                  "Côte d'Ivoire",                     "Ivorian_cuisine", ""),
(30, "Cape Verdean",             "Cabo Verde",                        "Cape_Verdean_cuisine", ""),
(31, "Cambodian",                "Cambodia",                          "Cambodian_cuisine", ""),
(32, "Cameroonian",              "Cameroon",                          "Cameroonian_cuisine", ""),
(33, "Canadian",                 "Canada",                            "Canadian_cuisine", ""),
(34, "Central African Republic", "Central African Republic",          "Cuisine_of_the_Central_African_Republic", ""),
(35, "Chadian",                  "Chad",                              "Chadian_cuisine", ""),
(36, "Chilean",                  "Chile",                             "Chilean_cuisine", ""),
(37, "Chinese",                  "China",                             "Chinese_cuisine", ""),
(38, "Colombian",                "Colombia",                          "Colombian_cuisine", ""),
(39, "NA",                       "Comoros",                           "NA", ""),
(40, "Congolese",                "Congo, Democratic Republic of the", "Congolese_cuisine", ""),
(41, "Congolese",                "Congo, Republic of the",            "Congolese_cuisine", ""),
(42, "Costa Rican",              "Costa Rica",                        "Costa_Rican_cuisine", ""),
(43, "Croatian",                 "Croatia",                           "Croatian_cuisine", ""),
(44, "Cuban",                    "Cuba",                              "Cuban_cuisine", ""),
(45, "Cypriot",                  "Cyprus",                            "Cypriot_cuisine", ""),
(46, "Czech",                    "Czechia",                           "Czech_cuisine", ""),

(47, "Danish",                   "Denmark",                           "Danish_cuisine", ""),
(48, "Djiboutian",               "Djibouti",                          "Djiboutian_cuisine", ""),
(49, "Dominica",                 "Dominica",                          "Dominica_cuisine", ""),
(50, "Dominican Republic",       "Dominican Republic",                "Dominican_Republic_cuisine", ""),

(51, "Ecuadorian",               "Ecuador",                           "Ecuadorian_cuisine", ""),
(52, "Egyptian",                 "Egypt",                             "Egyptian_cuisine", ""),
(53, "Salvadoran",               "El Salvador",                       "Salvadoran_cuisine", ""),
(54, "Equatorial Guinea",        "Equatorial Guinea",                 "Cuisine_of_Equatorial_Guinea", ""),
(55, "Eritrean",                 "Eritrea",                           "Eritrean_cuisine", ""),
(56, "Estonian",                 "Estonia",                           "Estonian_cuisine", ""),
(57, "Eswatini",                 "Eswatini",                          "Cuisine_of_Eswatini", ""),
(58, "Ethiopian",                "Ethiopia",                          "Ethiopian_cuisine", ""),

(59, "Fijian",                   "Fiji",                              "Fijian_cuisine", ""),
(60, "Finnish",                  "Finland",                           "Finnish_cuisine", ""),
(61, "French",                   "France",                            "French_cuisine", ""),

(62, "Gabonese",                 "Gabon",                             "Gabonese_cuisine", ""),
(63, "Gambian",                  "Gambia",                            "Gambian_cuisine", ""),
(64, "Georgian",                 "Georgia",                           "Georgian_cuisine", ""),
(65, "German",                   "Germany",                           "German_cuisine", ""),
(66, "Ghanaian",                 "Ghana",                             "Ghanaian_cuisine", ""),
(67, "Greek",                    "Greece",                            "Greek_cuisine", ""),
(68, "Grenada",                  "Grenada",                           "Grenada", ""),
(69, "Guatemalan",               "Guatemala",                         "Guatemalan_cuisine", ""),
(70, "Guinea",                   "Guinea",                            "Cuisine_of_Guinea", ""),
(71, "Guinea-Bissauan",          "Guinea-Bissau",                     "Guinea-Bissauan_cuisine", ""),
(72, "Guyanese",                 "Guyana",                            "Culture_of_Guyana#Cuisine", ""),

(73, "Haitian",                  "Haiti",                             "Haitian_cuisine", ""),
(74, "Honduran",                 "Honduras",                          "Honduran_cuisine", ""),
(75, "Hungarian",                "Hungary",                           "Hungarian_cuisine", ""),

(76, "Icelandic",                "Iceland",                           "Icelandic_cuisine", ""),
(77, "Indian",                   "India",                             "Indian_cuisine", ""),
(78, "Indonesian",               "Indonesia",                         "Indonesian_cuisine", ""),
(79, "Iranian",                  "Iran",                              "Iranian_cuisine", ""),
(80, "Iraqi",                    "Iraq",                              "Iraqi_cuisine", ""),
(81, "Irish",                    "Ireland",                           "Irish_cuisine", ""),
(82, "Israeli",                  "Israel",                            "Israeli_cuisine", ""),
(83, "Italian",                  "Italy",                             "Italian_cuisine", ""),

(84, "Jamaican",                 "Jamaica",                           "Jamaican_cuisine", ""),
(85, "Japanese",                 "Japan",                             "Japanese_cuisine", ""),
(86, "Jordanian",                "Jordan",                            "Jordanian_cuisine", ""),

(87, "Kazakh",                   "Kazakhstan",                        "Kazakh_cuisine", ""),
(88, "Kenyan",                   "Kenya",                             "Culture_of_Kenya#Cuisine", ""),
(89, "Kiribati",                 "Kiribati",                          "Kiribati", ""),
(90, "Kosovan",                  "Kosovo",                            "Kosovan_cuisine", ""),
(91, "Kuwaiti",                  "Kuwait",                            "Kuwaiti_cuisine", ""),
(92, "Kyrgyz",                   "Kyrgyzstan",                        "Kyrgyz_cuisine", ""),

(93, "Lao",                      "Laos",                              "Lao_cuisine", ""),
(94, "Latvian",                  "Latvia",                            "Latvian_cuisine", ""),
(95, "Lebanese",                 "Lebanon",                           "Lebanese_cuisine", ""),
(96, "Basotho",                  "Lesotho",                           "Cuisine_of_Lesotho", ""),
(97, "Liberian",                 "Liberia",                           "Liberian_cuisine", ""),
(98, "Libyan",                   "Libya",                             "Libyan_cuisine", ""),
(99, "Liechtensteiner",          "Liechtenstein",                     "Liechtenstein_cuisine", ""),
(100, "Lithuanian",              "Lithuania",                         "Lithuanian_cuisine", ""),
(101, "Luxembourg",              "Luxembourg",                        "Luxembourg%27s_cuisine", ""),

(102, "Malagasy",                "Madagascar",                        "Malagasy_cuisine", ""),
(103, "Malawian",                "Malawi",                            "Malawian_cuisine", ""),
(104, "Malaysian",               "Malaysia",                          "Malaysian_cuisine", ""),
(105, "Maldivian",               "Maldives",                          "Maldivian_cuisine", ""),
(106, "Malian",                  "Mali",                              "Malian_cuisine", ""),
(107, "Maltese",                 "Malta",                             "Maltese_cuisine", ""),
(108, "NA",                      "Marshall Islands",                  "NA", ""),
(109, "Mauritanian",             "Mauritania",                        "Mauritanian_cuisine", ""),
(110, "Mauritius",               "Mauritius",                         "Cuisine_of_Mauritius", ""),
(111, "Mexican",                 "Mexico",                            "Mexican_cuisine", ""),
(112, "NA",                      "Micronesia",                        "NA", ""),
(113, "Moldovan",                "Moldova",                           "Moldovan_cuisine", ""),
(114, "Monégasque",              "Monaco",                            "Monégasque_cuisine", ""),
(115, "Mongolian",               "Mongolia",                          "Mongolian_cuisine", ""),
(116, "Montenegrin",             "Montenegro",                        "Montenegrin_cuisine", ""),
(117, "Moroccan",                "Morocco",                           "Moroccan_cuisine", ""),
(118, "Mozambique",              "Mozambique",                        "Cuisine_of_Mozambique", ""),
(119, "Burmese",                 "Myanmar",                           "Burmese_cuisine", ""),

(120, "Namibian",                "Namibia",                           "Namibian_cuisine", ""),
(121, "NA",                      "Nauru",                             "NA", ""),
(122, "Nepalese",                "Nepal",                             "Nepalese_cuisine", ""),
(123, "Dutch",                   "Netherlands",                       "Dutch_cuisine", ""),
(124, "New Zealand",             "New Zealand",                       "New_Zealand_cuisine", ""),
(125, "Nicaraguan",              "Nicaragua",                         "Nicaraguan_cuisine", ""),
(126, "Niger",                   "Niger",                             "Cuisine_of_Niger", ""),
(127, "Nigerian",                "Nigeria",                           "Nigerian_cuisine", ""),
(128, "North Korean",            "North Korea",                       "North_Korean_cuisine", ""),
(129, "Macedonian",              "North Macedonia",                   "Macedonian_cuisine", ""),
(130, "Norwegian",               "Norway",                            "Norwegian_cuisine", ""),

(131, "Omani",                   "Oman",                              "Omani_cuisine", ""),

(132, "Pakistani",               "Pakistan",                          "Pakistani_cuisine", ""),
(133, "Palauan",                 "Palau",                             "Palau#Cuisine", ""),
(134, "Palestinian",             "Palestine",                         "Palestinian_cuisine", ""),
(135, "Panamanian",              "Panama",                            "Panamanian_cuisine", ""),
(136, "Papua New Guinean",       "Papua New Guinea",                  "Papua_New_Guinean_cuisine", ""),
(137, "Paraguayan",              "Paraguay",                          "Paraguayan_cuisine", ""),
(138, "Peruvian",                "Peru",                              "Peruvian_cuisine", ""),
(139, "Filipino",                "Philippines",                       "Filipino_cuisine", ""),
(140, "Polish",                  "Poland",                            "Polish_cuisine", ""),
(141, "Portuguese",              "Portugal",                          "Portuguese_cuisine", ""),

(142, "Qatari",                  "Qatar",                             "Qatari_cuisine", ""),

(143, "Romanian",                "Romania",                           "Romanian_cuisine", ""),
(144, "Russian",                 "Russia",                            "Russian_cuisine", ""),
(145, "Rwandan",                 "Rwanda",                            "Rwandan_cuisine", ""),

(146, "NA",                      "Saint Kitts and Nevis",             "NA", ""),
(147, "Saint Lucian",            "Saint Lucia",                       "Saint_Lucian_cuisine", ""),
(148, "NA",                      "Saint Vincent and the Grenadines",  "NA", ""),
(149, "Samoan",                  "Samoa",                             "NA", ""),
(150, "Sammarinese",             "San Marino",                        "Sammarinese_cuisine", ""),
(151, "Sao Tome and Principe",   "Sao Tome and Principe",             "Cuisine_of_São_Tomé_and_Príncipe", ""),
(152, "Saudi Arabian",           "Saudi Arabia",                      "Saudi_Arabian_cuisine", ""),
(153, "Senegalese",              "Senegal",                           "Senegalese_cuisine", ""),
(154, "Serbian",                 "Serbia",                            "Serbian_cuisine", ""),
(155, "Seychellois",             "Seychelles",                        "Seychellois_cuisine", ""),
(156, "Sierra Leonean",          "Sierra Leone",                      "Sierra_Leonean_cuisine", ""),
(157, "Singaporean",             "Singapore",                         "Singaporean_cuisine", ""),
(158, "Slovak",                  "Slovakia",                          "Slovak_cuisine", ""),
(159, "Slovenian",               "Slovenia",                          "Slovenian_cuisine", ""),
(160, "NA",                      "Solomon Islands",                   "NA", ""),
(161, "Somali",                  "Somalia",                           "Somali_cuisine", ""),
(162, "South African",           "South Africa",                      "South_African_cuisine", ""),
(163, "South Korean",            "South Korea",                       "Korean_cuisine", ""),
(164, "South African",           "South Sudan",                       "South_African_cuisine", ""),
(165, "Spanish",                 "Spain",                             "Spanish_cuisine", ""),
(166, "Sri Lankan",              "Sri Lanka",                         "Sri_Lankan_cuisine", ""),
(167, "Sudanese",                "Sudan",                             "Sudanese_cuisine", ""),
(168, "Surinamese",              "Suriname",                          "Culture_of_Suriname#Cuisine", ""),
(169, "Swedish",                 "Sweden",                            "Swedish_cuisine", ""),
(170, "Swiss",                   "Switzerland",                       "Swiss_cuisine", ""),
(171, "Syrian",                  "Syria",                             "Syrian_cuisine", ""),

(172, "Taiwanese",               "Taiwan",                            "Taiwanese_cuisine", ""),
(173, "Tajik",                   "Tajikistan",                        "Tajik_cuisine", ""),
(174, "Tanzanian",               "Tanzania",                          "Culture_of_Tanzania#Cuisine", ""),
(175, "Thai",                    "Thailand",                          "Thai_cuisine", ""),
(176, "Timorese",                "Timor-Leste",                       "East_Timor", ""),
(177, "Togolese",                "Togo",                              "Togolese_cuisine", ""),
(178, "Tongan",                  "Tonga",                             "Culture_of_Tonga#Cuisine", ""),
(179, "Trinidad and Tobago",     "Trinidad and Tobago",               "Trinidad_and_Tobago_cuisine", ""),
(180, "Tunisian",                "Tunisia",                           "Tunisian_cuisine", ""),
(181, "Turkish",                 "Turkey",                            "Turkish_cuisine", ""),
(182, "Turkmen",                 "Turkmenistan",                      "Turkmen_cuisine", ""),
(183, "Tuvaluan",                "Tuvalu",                            "Cuisine_of_Tuvalu", ""),

(184, "Ugandan",                 "Uganda",                            "Ugandan_cuisine", ""),
(185, "Ukrainian",               "Ukraine",                           "Ukrainian_cuisine", ""),
(186, "Emirati",                 "United Arab Emirates",              "Emirati_cuisine", ""),
(187, "British",                 "United Kingdom",                    "British_cuisine", ""),
(188, "American",                "United States of America",          "American_cuisine", ""),
(189, "Uruguayan",               "Uruguay",                           "Uruguayan_cuisine", ""),
(190, "Uzbek",                   "Uzbekistan",                        "Uzbek_cuisine", ""),

(191, "Vanuatuan",               "Vanuatu",                           "Vanuatuan_cuisine", ""),
(192, "Venezuelan",              "Venezuala",                         "Venezuelan_cuisine", ""),
(193, "Vietnamese",              "Vietnam",                           "Vietnamese_cuisine", ""),

(194, "Yemeni",                  "Yemen",                             "Yemeni_cuisine", ""),

(195, "Zambian",                 "Zambia",                            "Zambian_cuisine", ""),
(196, "Zimbabwean",              "Zimbabwe",                          "Zimbabwe#Cuisine", "");

INSERT INTO equipment_types
(id, name)
VALUES
(1, "Cleaning"),
(2, "Preparing"),
(3, "Cooking"),
(4, "Dining"),
(5, "Storage");

INSERT INTO equipment
(id, author_id, owner_id, name, description, image)
VALUES
(2, 1, 1, "Ceramic Stone",                    "It works.", "nobsc-ceramic-stone"),
(2, 1, 1, "Chef\'s Knife",                    "It works.", "nobsc-chefs-knife"),
(2, 1, 1, "Cutting Board",                    "It works.", "nobsc-cutting-board"),
(2, 1, 1, "Y Peeler",                         "It works.", "nobsc-y-peeler"),
(3, 1, 1, "Wooden Spoon",                     "It works.", "nobsc-wooden-spoon"),
(2, 1, 1, "Serated Knife",                    "It works.", "nobsc-serated-knife"),
(2, 1, 1, "Rubber Spatula",                   "It works.", "nobsc-rubber-spatula"),
(2, 1, 1, "Whisk",                            "It works.", "nobsc-whisk"),
(2, 1, 1, "Pepper Mill",                      "It works.", "nobsc-pepper-mill"),
(2, 1, 1, "Can Opener",                       "It works.", "nobsc-can-opener"),
(2, 1, 1, "Side Peeler",                      "It works.", "nobsc-side-peeler"),
(2, 1, 1, "Box Grater",                       "It works.", "nobsc-box-grater"),
(2, 1, 1, "Small Mixing Bowl",                "It works.", "nobsc-small-mixing-bowl"),
(2, 1, 1, "Medium Mixing Bowl",               "It works.", "nobsc-medium-mixing-bowl"),
(2, 1, 1, "Large Mixing Bowl",                "It works.", "nobsc-large-mixing-bowl"),
(2, 1, 1, "Salad Spinner",                    "It works.", "nobsc-salad-spinner"),
(2, 1, 1, "Dry Measuring Cups",               "It works.", "nobsc-dry-measuring-cups"),
(2, 1, 1, "Liquid Measuring Cups",            "It works.", "nobsc-liquid-measuring-cups"),
(2, 1, 1, "Measuring Spoons",                 "It works.", "nobsc-measuring-spoons"),
(2, 1, 1, "Measuring Pitcher",                "It works.", "nobsc-measuring-pitcher"),
(2, 1, 1, "Digital Scale",                    "It works.", "nobsc-digital-scale"),
(2, 1, 1, "Handheld Mixer",                   "It works.", "nobsc-handheld-mixer"),
(2, 1, 1, "Blender",                          "It works.", "nobsc-blender"),
(2, 1, 1, "Immersion Blender",                "It works.", "nobsc-immersion-blender"),
(2, 1, 1, "Parchment Paper",                  "It works.", "nobsc-parchment-paper"),
(2, 1, 1, "Plastic Wrap",                     "It works.", "nobsc-plastic-wrap"),
(2, 1, 1, "Aluminum Foil",                    "It works.", "nobsc-aluminum-foil"),
(2, 1, 1, "Cheesecloth",                      "It works.", "nobsc-cheesecloth"),

(3, 1, 1, "Coffee Maker",                     "It works.", "nobsc-coffee-maker"),
(3, 1, 1, "Tea Pot",                          "It works.", "nobsc-tea-pot"),
(3, 1, 1, "Microwave",                        "It works.", "nobsc-ladle"),
(3, 1, 1, "Toaster Oven",                     "It works.", "nobsc-ladle"),
(3, 1, 1, "Small Sauce Pan",                  "It works.", "nobsc-small-sauce-pan"),
(3, 1, 1, "Medium Sauce Pan",                 "It works.", "nobsc-medium-sauce-pan"),
(3, 1, 1, "Medium Stock Pot",                 "It works.", "nobsc-medium-stock-pot"),
(3, 1, 1, "Large Stock Pot",                  "It works.", "nobsc-large-stock-pot"),
(3, 1, 1, "Stainless Steel Lidded Saute Pan", "It works.", "nobsc-stainless-steel-lidded-saute-pan"),
(3, 1, 1, "Small Stainless Steel Skillet",    "It works.", "nobsc-small-stainless-steel-skillet"),
(3, 1, 1, "Large Stainless Steel Skillet",    "It works.", "nobsc-large-stainless-steel-skillet"),
(3, 1, 1, "Small Cast-Iron Skillet",          "It works.", "nobsc-small-cast-iron-skillet"),
(3, 1, 1, "Large Cast-Iron Skillet",          "It works.", "nobsc-large-cast-iron-skillet"),
(3, 1, 1, "Glass Baking Dish",                "It works.", "nobsc-glass-baking-dish"),
(3, 1, 1, "Sturdy Baking Sheet",              "It works.", "nobsc-sturdy-baking-dish"),
(3, 1, 1, "Small Gratin Dish",                "It works.", "nobsc-small-gratin-dish"),
(3, 1, 1, "Large Gratin Dish",                "It works.", "nobsc-large-gratin-dish"),
(3, 1, 1, "Dutch Oven",                       "It works.", "nobsc-dutch-oven"),
(3, 1, 1, "Oven Mitts",                       "It works.", "nobsc-oven-mitts"),
(3, 1, 1, "Splatter Screen",                  "It works.", "nobsc-splatter-screen"),
(3, 1, 1, "Colander",                         "It works.", "nobsc-colander"),
(3, 1, 1, "Mesh Strainer",                    "It works.", "nobsc-mesh-strainer"),
(3, 1, 1, "Tongs",                            "It works.", "nobsc-tongs"),
(3, 1, 1, "Slotted Spoon",                    "It works.", "nobsc-slotted-spoon"),
(3, 1, 1, "Serving Spoon",                    "It works.", "nobsc-serving-spoon"),
(3, 1, 1, "Spider",                           "It works.", "nobsc-spider"),
(3, 1, 1, "Sturdy Spatula",                   "It works.", "nobsc-sturdy-spatula"),
(3, 1, 1, "Fish Spatula",                     "It works.", "nobsc-fish-spatula"),
(3, 1, 1, "Ladle",                            "It works.", "nobsc-ladle");

INSERT INTO ingredient_types
(id, name)
VALUES
(1, "Fish"),
(2, "Shellfish"),
(3, "Beef"),
(4, "Pork"),
(5, "Poultry"),
(6, "Egg"),
(7, "Dairy"),
(8, "Oil"),
(9, "Grain"),
(10, "Bean"),
(11, "Vegetable"),
(12, "Fruit"),
(13, "Nut"),
(14, "Seed"),
(15, "Spice"),
(16, "Herb"),
(17, "Acid"),
(18, "Product");

INSERT INTO ingredients
(id, author_id, owner_id, variety, name, description, image)
VALUES
(1, 1, 1, NULL,                  "Tuna",                                     "Tasty.", "nobsc-tuna"),
(1, 1, 1, NULL,                  "Salmon",                                   "Tasty.", "nobsc-salmon"),
(1, 1, 1, NULL,                  "Tilapia",                                  "Tasty.", "nobsc-tilapia"),
(1, 1, 1, NULL,                  "Pollock",                                  "Tasty.", "nobsc-pollock"),
(1, 1, 1, NULL,                  "Catfish",                                  "Tasty.", "nobsc-catfish"),
(1, 1, 1, NULL,                  "Cod",                                      "Tasty.", "nobsc-cod"),

(2, 1, 1, NULL,                  "Clams",                                    "Tasty.", "nobsc-clams"),
(2, 1, 1, NULL,                  "Crab",                                     "Tasty.", "nobsc-crab"),
(2, 1, 1, NULL,                  "Shrimp",                                   "Tasty.", "nobsc-shrimp"),

(3, 1, 1, NULL,                  "Chuck Seven Bone Roast",                   "Tasty.", "nobsc-chuck-7-bone-roast"),
(3, 1, 1, NULL,                  "Chuck Seven Bone Steak",                   "Tasty.", "nobsc-chuck-7-bone-steak"),
(3, 1, 1, NULL,                  "Chuck Arm Roast",                          "Tasty.", "nobsc-chuck-arm-roast"),
(3, 1, 1, "Boneless",            "Chuck Arm Roast",                          "Tasty.", "nobsc-chuck-arm-rost-boneless"),
(3, 1, 1, NULL,                  "Chuck Arm Steak",                          "Tasty.", "nobsc-chuck-arm-steak"),
(3, 1, 1, "Boneless",            "Chuck Arm Steak",                          "Tasty.", "nobsc-chuck-arm-steak-boneless"),
(3, 1, 1, NULL,                  "Chuck Blade Roast",                        "Tasty.", "nobsc-chuck-blade-roast"),
(3, 1, 1, NULL,                  "Chuck Blade Steak",                        "Tasty.", "nobsc-chuck-blade-steak"),
(3, 1, 1, "Boneless",            "Chuck Blade Steak",                        "Tasty.", "nobsc-chuck-blade-steak-boneless"),
(3, 1, 1, "Cap Off",             "Chuck Blade Steak",                        "Tasty.", "nobsc-chuck-blade-steak-cap-off"),
(3, 1, 1, NULL,                  "Chuck Cross Rib Roast",                    "Tasty.", "nobsc-chuck-cross-rib-roast"),
(3, 1, 1, "Boneless",            "Chuck Cross Rib Roast",                    "Tasty.", "nobsc-chuck-cross-rib-roast-boneless"),
(3, 1, 1, NULL,                  "Chuck Eye Edge Roast",                     "Tasty.", "nobsc-chuck-eye-edge-roast"),
(3, 1, 1, "Boneless",            "Chuck Eye Roast",                          "Tasty.", "nobsc-chuck-eye-roast-steak"),
(3, 1, 1, "Boneless",            "Chuck Eye Steak",                          "Tasty.", "nobsc-chuck-eye-steak-boneless"),
(3, 1, 1, NULL,                  "Chuck Flanken Style Ribs",                 "Tasty.", "nobsc-chuck-flanken-style-ribs"),
(3, 1, 1, "Boneless",            "Chuck Flanken Style Ribs",                 "Tasty.", "nobsc-chuck-flanken-style-ribs-boneless"),
(3, 1, 1, NULL,                  "Chuck Flat Ribs",                          "Tasty.", "nobsc-chuck-flat-ribs"),
(3, 1, 1, NULL,                  "Chuck Mock Tender Roast",                  "Tasty.", "nobsc-chuck-mock-tender-roast"),
(3, 1, 1, NULL,                  "Chuck Mock Tender Steak",                  "Tasty.", "nobsc-chuck-mock-tender-steak"),
(3, 1, 1, NULL,                  "Chuck Neck Roast",                         "Tasty.", "nobsc-chuck-neck-roast"),
(3, 1, 1, "Boneless",            "Chuck Neck Roast",                         "Tasty.", "nobsc-chuck-neck-roast-boneless"),
(3, 1, 1, "Boneless",            "Chuck Roast",                              "Tasty.", "nobsc-chuck-roast-boneless"),
(3, 1, 1, NULL,                  "Chuck Short Ribs",                         "Tasty.", "nobsc-chuck-short-ribs"),
(3, 1, 1, "Boneless",            "Chuck Short Ribs",                         "Tasty.", "nobsc-chuck-short-ribs-boneless"),
(3, 1, 1, NULL,                  "Chuck Shoulder Center Steak Ranch Steak",  "Tasty.", "nobsc-chuck-shoulder-center-steak-ranch-steak"),
(3, 1, 1, NULL,                  "Chuck Shoulder Roast",                     "Tasty.", "nobsc-chuck-shoulder-roast"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Roast",                     "Tasty.", "nobsc-chuck-shoulder-roast-boneless"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Steak",                     "Tasty.", "nobsc-chuck-shoulder-steak-boneless"),
(3, 1, 1, NULL,                  "Chuck Shoulder Tender",                    "Tasty.", "nobsc-chuck-shoulder-tender"),
(3, 1, 1, NULL,                  "Chuck Shoulder Tender Medallions",         "Tasty.", "nobsc-chuck-shoulder-tender-medallions"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Top Blade Roast",           "Tasty.", "nobsc-chuck-shoulder-top-blade-roast-boneless"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Top Blade Steak",           "Tasty.", "nobsc-chuck-shoulder-top-blade-steak-boneless"),
(3, 1, 1, NULL,                  "Chuck Shoulder Top Blade Steak Flat Iron", "Tasty.", "nobsc-chuck-shoulder-top-blade-steak-flat-iron"),
(3, 1, 1, NULL,                  "Chuck Top Blade Roast",                    "Tasty.", "nobsc-chuck-top-blade-roast"),
(3, 1, 1, "Bone In",             "Chuck Top Blade Steak",                    "Tasty.", "nobsc-chuck-top-blade-steak-bone-in"),
(3, 1, 1, NULL,                  "Chuck Under Blade Roast",                  "Tasty.", "nobsc-chuck-under-blade-roast"),
(3, 1, 1, "Boneless",            "Chuck Under Blade Roast",                  "Tasty.", "nobsc-chuck-under-blade-roast-boneless"),
(3, 1, 1, NULL,                  "Chuck Under Blade Steak",                  "Tasty.", "nobsc-chuck-under-blade-steak"),
(3, 1, 1, "Boneless",            "Chuck Under Blade Steak",                  "Tasty.", "nobsc-chuck-under-blade-steak-boneless"),
(3, 1, 1, NULL,                  "Round Bottom Round Roast",                 "Tasty.", "nobsc-round-bottom-round-roast"),
(3, 1, 1, NULL,                  "Round Bottom Round Roast Triangle Roast",  "Tasty.", "nobsc-round-bottom-round-roast-triangle-roast"),
(3, 1, 1, NULL,                  "Round Bottom Round Rump Roast",            "Tasty.", "nobsc-round-bottom-round-rump-roast"),
(3, 1, 1, NULL,                  "Round Bottom Round Steak",                 "Tasty.", "nobsc-round-bottom-round-steak"),
(3, 1, 1, NULL,                  "Round Bottom Round Steak Western Griller", "Tasty.", "nobsc-round-bottom-round-steak-western-griller"),
(3, 1, 1, NULL,                  "Round Eye Round Roast",                    "Tasty.", "nobsc-round-eye-round-roast"),
(3, 1, 1, NULL,                  "Round Eye Round Steak",                    "Tasty.", "nobsc-round-eye-round-steak"),
(3, 1, 1, NULL,                  "Round Heel of Round",                      "Tasty.", "nobsc-round-heel-of-round"),
(3, 1, 1, NULL,                  "Round Sirloin Tip Center Roast",           "Tasty.", "nobsc-round-sirloin-tip-center-roast"),
(3, 1, 1, NULL,                  "Round Sirloin Tip Center Steak",           "Tasty.", "nobsc-round-sirloin-tip-center-steak"),
(3, 1, 1, NULL,                  "Round Sirloin Tip Side Steak",             "Tasty.", "nobsc-round-sirloin-tip-side-steak"),
(3, 1, 1, NULL,                  "Round Steak",                              "Tasty.", "nobsc-round-steak"),
(3, 1, 1, "Boneless",            "Round Steak",                              "Tasty.", "nobsc-round-steak-boneless"),
(3, 1, 1, NULL,                  "Round Tip Roast",                          "Tasty.", "nobsc-round-tip-roast"),
(3, 1, 1, "Cap Off",             "Round Tip Roast",                          "Tasty.", "nobsc-round-tip-roast-cap-off"),
(3, 1, 1, NULL,                  "Round Tip Steak",                          "Tasty.", "nobsc-round-tip-steak"),
(3, 1, 1, "Cap Off",             "Round Tip Steak",                          "Tasty.", "nobsc-round-tip-steak-cap-off"),
(3, 1, 1, NULL,                  "Round Top Round Roast",                    "Tasty.", "nobsc-round-top-round-roast"),
(3, 1, 1, "Cap Off",             "Round Top Round Roast",                    "Tasty.", "nobsc-round-top-round-roast-cap-off"),
(3, 1, 1, NULL,                  "Round Top Round Steak",                    "Tasty.", "nobsc-round-top-round-steak"),
(3, 1, 1, NULL,                  "Round Top Round Steak Butterflied",        "Tasty.", "nobsc-round-top-round-steak-butterflied"),
(3, 1, 1, NULL,                  "Round Top Round Steak First Cut",          "Tasty.", "nobsc-round-top-round-steak-first-cut"),
(3, 1, 1, NULL,                  "Loin Ball Tip Roast",                      "Tasty.", "nobsc-loin-ball-tip-roast"),
(3, 1, 1, NULL,                  "Loin Ball Tip Steak",                      "Tasty.", "nobsc-loin-ball-tip-steak"),
(3, 1, 1, NULL,                  "Loin Flap Meat Steak",                     "Tasty.", "nobsc-loin-flap-meat-steak"),
(3, 1, 1, NULL,                  "Loin Porterhouse Steak",                   "Tasty.", "nobsc-loin-porterhouse-steak"),
(3, 1, 1, NULL,                  "Loin Shell Sirloin Steak",                 "Tasty.", "nobsc-loin-shell-sirloin-steak"),
(3, 1, 1, NULL,                  "Loin Sirloin Steak",                       "Tasty.", "nobsc-loin-sirloin-steak"),
(3, 1, 1, NULL,                  "Loin T Bone Steak",                        "Tasty.", "nobsc-loin-t-bone-steak"),
(3, 1, 1, NULL,                  "Loin Tenderloin Roast",                    "Tasty.", "nobsc-loin-tenderloin-roast"),
(3, 1, 1, NULL,                  "Loin Tenderloin Steak",                    "Tasty.", "nobsc-loin-tenderloin-steak"),
(3, 1, 1, NULL,                  "Loin Top Loin Roast",                      "Tasty.", "nobsc-loin-top-loin-roast"),
(3, 1, 1, "Boneless",            "Loin Top Loin Roast",                      "Tasty.", "nobsc-loin-top-loin-roast-boneless"),
(3, 1, 1, NULL,                  "Loin Top Loin Steak",                      "Tasty.", "nobsc-loin-top-loin-steak"),
(3, 1, 1, "Boneless",            "Loin Top Loin Steak",                      "Tasty.", "nobsc-loin-top-loin-steak-boneless"),
(3, 1, 1, "Boneless",            "Loin Top Sirloin Roast",                   "Tasty.", "nobsc-loin-top-sirloin-roast-boneless"),
(3, 1, 1, "Boneless Cap Off",    "Loin Top Sirloin Roast",                   "Tasty.", "nobsc-loin-top-sirloin-roast-boneless-cap-off"),
(3, 1, 1, "Boneless",            "Loin Top Sirloin Steak",                   "Tasty.", "nobsc-loin-top-sirloin-steak-boneless"),
(3, 1, 1, "Boneless Cap Off",    "Loin Top Sirloin Steak",                   "Tasty.", "nobsc-loin-top-sirloin-steak-boneless-cap-off"),
(3, 1, 1, NULL,                  "Loin Tri Tip Roast",                       "Tasty.", "nobsc-loin-tri-tip-roast"),
(3, 1, 1, NULL,                  "Loin Tri Tip Steak",                       "Tasty.", "nobsc-loin-tri-tip-steak"),
(3, 1, 1, NULL,                  "Shank Cross Cut",                          "Tasty.", "nobsc-shank-cross-cut"),
(3, 1, 1, "Boneless",            "Shank Cross Cut",                          "Tasty.", "nobsc-shank-cross-cut-boneless"),
(3, 1, 1, NULL,                  "Plate Skirt Steak",                        "Tasty.", "nobsc-plate-skirt-steak"),
(3, 1, 1, NULL,                  "Flank Steak",                              "Tasty.", "nobsc-flank-flank-steak"),
(3, 1, 1, NULL,                  "Ground Beef",                              "Tasty.", "nobsc-ground-beef"),
(3, 1, 1, NULL,                  "Back Ribs",                                "Tasty.", "nobsc-back-ribs"),
(3, 1, 1, "Boneless",            "Rib Cap Meat",                             "Tasty.", "nobsc-rib-cap-meat-boneless"),
(3, 1, 1, NULL,                  "Rib Extra Trim Roast Large End",           "Tasty.", "nobsc-rib-extra-trim-roast-large-end"),
(3, 1, 1, NULL,                  "Ribeye Roast",                             "Tasty.", "nobsc-ribeye-roast"),
(3, 1, 1, "Lip On Bone In",      "Ribeye Roast",                             "Tasty.", "nobsc-ribeye-roast-lip-on-bone-in"),
(3, 1, 1, "Lip On Boneless",     "Ribeye Roast",                             "Tasty.", "nobsc-ribeye-roast-lip-on-boneless"),
(3, 1, 1, NULL,                  "Ribeye Steak",                             "Tasty.", "nobsc-ribeye-steak"),
(3, 1, 1, "Lip On Bone In",      "Ribeye Steak",                             "Tasty.", "nobsc-ribeye-steak-lip-on-bone-in"),
(3, 1, 1, "Lip On Boneless",     "Ribeye Steak",                             "Tasty.", "nobsc-ribeye-steak-lip-on-boneless"),
(3, 1, 1, NULL,                  "Rib Roast Large End",                      "Tasty.", "nobsc-rib-roast-large-end"),
(3, 1, 1, "Boneless",            "Rib Roast Large End",                      "Tasty.", "nobsc-rib-roast-large-end-boneless"),
(3, 1, 1, NULL,                  "Rib Roast Small End",                      "Tasty.", "nobsc-rib-roast-small-end"),
(3, 1, 1, "Boneless",            "Rib Roast Small End",                      "Tasty.", "nobsc-rib-roast-small-end-boneless"),
(3, 1, 1, "Boneless",            "Rib Rolled Cap Pot Roast",                 "Tasty.", "nobsc-rib-rolled-cap-pot-roast-boneless"),
(3, 1, 1, NULL,                  "Rib Short Ribs",                           "Tasty.", "nobsc-rib-short-ribs"),
(3, 1, 1, "Boneless",            "Rib Short Ribs",                           "Tasty.", "nobsc-rib-short-ribs-boneless"),
(3, 1, 1, NULL,                  "Rib Steak Large End",                      "Tasty.", "nobsc-rib-steak-large-end"),
(3, 1, 1, NULL,                  "Rib Steak Small End",                      "Tasty.", "nobsc-rib-steak-small-end"),
(3, 1, 1, "Boneless",            "Rib Steak Small End",                      "Tasty.", "nobsc-rib-steak-small-end-boneless"),

(4, 1, 1, NULL,                  "Bacon",                                    "Tasty.", "nobsc-bacon"),

(5, 1, 1, "Bone In",             "Chicken Breasts",                          "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, "Boneless",            "Chicken Breasts",                          "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, NULL,                  "Chicken Breasts",                          "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, NULL,                  "Chicken Tenderloins",                      "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, "Bone In",             "Chicken Thighs",                           "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, "Boneless",            "Chicken Thighs",                           "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, NULL,                  "Chicken Thighs",                           "Tasty.", "nobsc-raw-chicken-wings"),
(5, 1, 1, NULL,                  "Chicken Wings",                            "Tasty.", "nobsc-raw-chicken-wings"),

(6, 1, 1, NULL,                  "Extra Large Eggs",                         "Tasty.", "nobsc-eggs"),
(6, 1, 1, NULL,                  "Large Eggs",                               "Tasty.", "nobsc-eggs"),
(6, 1, 1, NULL,                  "Medium Eggs",                              "Tasty.", "nobsc-eggs"),

(7, 1, 1, "Salted",              "Butter",                                   "Tasty.", "nobsc-butter"),
(7, 1, 1, "Unsalted",            "Butter",                                   "Tasty.", "nobsc-butter"),
(7, 1, 1, NULL,                  "Cream",                                    "Tasty.", "nobsc-cream"),

(8, 1, 1, NULL,                  "Coconut",                                  "Tasty.", "nobsc-coconut"),

(9, 1, 1, "Corn",                "Starch",                                   "Tasty.", "nobsc-eggs"),
(9, 1, 1, "Potato",              "Starch",                                   "Tasty.", "nobsc-eggs"),
(9, 1, 1, "All-Purpose",         "Flour",                                    "Tasty.", "nobsc-eggs"),

(10, 1, 1, "Black Turtle",       "Beans",                                    "Tasty.", "nobsc-black-turtle-beans"),
(10, 1, 1, "Garbanzo",           "Beans",                                    "Tasty.", "nobsc-garbanzo-beans-chickpeas"),
(10, 1, 1, "Great Northern",     "Beans",                                    "Tasty.", "nobsc-great-northern-beans"),
(10, 1, 1, "Pinto",              "Beans",                                    "Tasty.", "nobsc-pinto-beans"),
(10, 1, 1, "Red Kidney",         "Beans",                                    "Tasty.", "nobsc-red-kidney-beans"),
(10, 1, 1, NULL,                 "Split Peas",                               "Tasty.", "nobsc-split-peas"),

(11, 1, 1, "All Blue",           "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Austrian Crescent",  "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "French Fingerling",  "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Kennebec",           "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "LaRette",            "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Norland Red",        "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Purple Majesty",     "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Red Gold",           "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Red Thumb",          "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Russet Ranger",      "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Russet Burbank",     "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Russet Norkotah",    "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Russet Umatilla",    "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Russian Banana",     "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, "Yukon Gold",         "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, NULL,                 "Potatoes",                                 "Tasty.", "nobsc-potatoes"),
(11, 1, 1, NULL,                 "Broccoli",                                 "Tasty.", "nobsc-broccoli"),
(11, 1, 1, NULL,                 "Brussels Sprouts",                         "Tasty.", "nobsc-brussels-sprouts"),
(11, 1, 1, NULL,                 "Bok Choy",                                 "Tasty.", "nobsc-bok-choy"),
(11, 1, 1, "Green",              "Cabbage",                                  "Tasty.", "nobsc-green-cabbage"),
(11, 1, 1, "Red",                "Cabbage",                                  "Tasty.", "nobsc-red-cabbage"),
(11, 1, 1, "Napa",               "Cabbage",                                  "Tasty.", "nobsc-napa-cabbage-chinese-cabbage"),
(11, 1, 1, "Savoy",              "Cabbage",                                  "Tasty.", "nobsc-savoy-cabbage"),
(11, 1, 1, NULL,                 "Cauliflower",                              "Tasty.", "nobsc-cauliflower"),
(11, 1, 1, NULL,                 "Kohlrabi",                                 "Tasty.", "nobsc-kohlrabi"),
(11, 1, 1, NULL,                 "Collard Greens",                           "Tasty.", "nobsc-collard-greens"),
(11, 1, 1, NULL,                 "Turnip Greens",                            "Tasty.", "nobsc-turnip-greens"),
(11, 1, 1, NULL,                 "Pak Choy Baby Bok Choy",                   "Tasty.", "nobsc-pak-choy-baby-bok-choy"),
(11, 1, 1, NULL,                 "Zucchini",                                 "Tasty.", "nobsc-zucchini"),
(11, 1, 1, "Standard Slicing",   "Cucumber",                                 "Tasty.", "nobsc-standard-slicing-cucumber"),
(11, 1, 1, "Purple",             "Eggplant",                                 "Tasty.", "nobsc-purple-eggplant"),
(11, 1, 1, "White",              "Eggplant",                                 "Tasty.", "nobsc-white-eggplant"),
(11, 1, 1, "Japanese",           "Eggplant",                                 "Tasty.", "nobsc-japanese-eggplant"),
(11, 1, 1, NULL,                 "Pumpkin",                                  "Tasty.", "nobsc-pumpkin"),
(11, 1, 1, "Acorn",              "Squash",                                   "Tasty.", "nobsc-acorn-squash"),
(11, 1, 1, "Butternut",          "Squash",                                   "Tasty.", "nobsc-butternut-squash"),
(11, 1, 1, "Hubbard",            "Squash",                                   "Tasty.", "nobsc-hubbard-squash"),
(11, 1, 1, "Spaghetti",          "Squash",                                   "Tasty.", "nobsc-spaghetti-squash"),
(11, 1, 1, "Delicata",           "Squash",                                   "Tasty.", "nobsc-delicata-squash"),
(11, 1, 1, "Boston",             "Lettuce",                                  "Tasty.", "nobsc-boston-lettuce"),
(11, 1, 1, "Bibb",               "Lettuce",                                  "Tasty.", "nobsc-bibb-lettuce"),
(11, 1, 1, "Iceberg",            "Lettuce",                                  "Tasty.", "nobsc-iceberg-lettuce"),
(11, 1, 1, "Romaine",            "Lettuce",                                  "Tasty.", "nobsc-romaine-lettuce"),
(11, 1, 1, "Green Leaf",         "Lettuce",                                  "Tasty.", "nobsc-green-leaf-lettuce"),
(11, 1, 1, "Oak Leaf",           "Lettuce",                                  "Tasty.", "nobsc-oak-leaf-lettuce"),
(11, 1, 1, "Red Leaf",           "Lettuce",                                  "Tasty.", "nobsc-red-leaf-lettuce"),
(11, 1, 1, NULL,                 "Arugula Rocket",                           "Tasty.", "nobsc-arugula-rocket"),
(11, 1, 1, NULL,                 "Belgian Endive",                           "Tasty.", "nobsc-belgian-endive"),
(11, 1, 1, NULL,                 "Frisee",                                   "Tasty.", "nobsc-frisee"),
(11, 1, 1, NULL,                 "Escarole",                                 "Tasty.", "nobsc-escarole"),
(11, 1, 1, NULL,                 "Mache Lambs Lettuce",                      "Tasty.", "nobsc-mache-lambs-lettuce"),
(11, 1, 1, NULL,                 "Radicchio",                                "Tasty.", "nobsc-radicchio"),
(11, 1, 1, NULL,                 "Watercress",                               "Tasty.", "nobsc-watercress"),
(11, 1, 1, "Baby",               "Spinach",                                  "Tasty.", "nobsc-baby-spinach"),
(11, 1, 1, "Frozen",             "Spinach",                                  "Tasty.", "nobsc-spinach"),
(11, 1, 1, NULL,                 "Spinach",                                  "Tasty.", "nobsc-spinach"),
(11, 1, 1, NULL,                 "Swiss Chard",                              "Tasty.", "nobsc-swiss-chard"),
(11, 1, 1, NULL,                 "Beet Greens",                              "Tasty.", "nobsc-beet-greens"),
(11, 1, 1, NULL,                 "Dandelion Greens",                         "Tasty.", "nobsc-dandelion-greens"),
(11, 1, 1, NULL,                 "Mustard Greens",                           "Tasty.", "nobsc-mustard-greens"),
(11, 1, 1, "Shiitake",           "Mushrooms",                                "Tasty.", "nobsc-shiitake-mushrooms"),
(11, 1, 1, "Cremini",            "Mushrooms",                                "Tasty.", "nobsc-cremini-mushrooms"),
(11, 1, 1, "Portobello",         "Mushrooms",                                "Tasty.", "nobsc-portobello-mushrooms"),
(11, 1, 1, NULL,                 "Mushrooms",                                "Tasty.", "nobsc-mushrooms"),
(11, 1, 1, "Globe",              "Onion",                                    "Tasty.", "nobsc-globe-onion"),
(11, 1, 1, "Green",              "Onion",                                    "Tasty.", "nobsc-scallion-green-onion"),
(11, 1, 1, "Spanish",            "Onion",                                    "Tasty.", "nobsc-spanish-onion"),
(11, 1, 1, "Sweet",              "Onion",                                    "Tasty.", "nobsc-sweet-onion"),
(11, 1, 1, NULL,                 "Onion",                                    "Tasty.", "nobsc-onion"),
(11, 1, 1, "Pearl",              "Onions",                                   "Tasty.", "nobsc-pearl-onions"),
(11, 1, 1, NULL,                 "Garlic",                                   "Tasty.", "nobsc-garlic"),
(11, 1, 1, NULL,                 "Shallots",                                 "Tasty.", "nobsc-shallots"),
(11, 1, 1, NULL,                 "Leek",                                     "Tasty.", "nobsc-leek"),
(11, 1, 1, "Bell",               "Pepper",                                   "Tasty.", "nobsc-bell-pepper"),
(11, 1, 1, "Poblano",            "Pepper",                                   "Tasty.", "nobsc-poblano-pepper"),
(11, 1, 1, "Jalapeno",           "Pepper",                                   "Tasty.", "nobsc-jalapeno-pepper"),
(11, 1, 1, "Serrano",            "Pepper",                                   "Tasty.", "nobsc-serrano-pepper"),
(11, 1, 1, "Thai",               "Pepper",                                   "Tasty.", "nobsc-thai-pepper"),
(11, 1, 1, "Habanero",           "Pepper",                                   "Tasty.", "nobsc-habanero-pepper"),
(11, 1, 1, "Winterbor",          "Kale",                                     "Tasty.", "nobsc-winterbor-kale-curly-kale"),
(11, 1, 1, "Red Russian",        "Kale",                                     "Tasty.", "nobsc-red-russian-kale"),
(11, 1, 1, NULL,                 "Kale",                                     "Tasty.", "nobsc-kale"),
(11, 1, 1, NULL,                 "Green Beans",                              "Tasty.", "nobsc-green-beans"),
(11, 1, 1, NULL,                 "Celery",                                   "Tasty.", "nobsc-celery"),
(11, 1, 1, NULL,                 "Asparagus",                                "Tasty.", "nobsc-asparagus"),
(11, 1, 1, "Green",              "Peas",                                     "Tasty.", "nobsc-green-peas"),
(11, 1, 1, "Snow",               "Peas",                                     "Tasty.", "nobsc-snowpeas"),
(11, 1, 1, "Sugar Snap",         "Peas",                                     "Tasty.", "nobsc-sugar-snap-peas"),
(11, 1, 1, NULL,                 "Carrots",                                  "Tasty.", "nobsc-carrots"),
(11, 1, 1, NULL,                 "Parsnips",                                 "Tasty.", "nobsc-parsnips"),
(11, 1, 1, "White",              "Turnips",                                  "Tasty.", "nobsc-white-turnips"),
(11, 1, 1, NULL,                 "Turnips",                                  "Tasty.", "nobsc-turnips"),
(11, 1, 1, "French",             "Radishes",                                 "Tasty.", "nobsc-french-radishes"),
(11, 1, 1, NULL,                 "Radishes",                                 "Tasty.", "nobsc-radishes"),
(11, 1, 1, "Baby Gold",          "Beets",                                    "Tasty.", "nobsc-baby-gold-beets"),
(11, 1, 1, "Red",                "Beets",                                    "Tasty.", "nobsc-red-beets"),
(11, 1, 1, NULL,                 "Beets",                                    "Tasty.", "nobsc-beets"),
(11, 1, 1, NULL,                 "Daikon",                                   "Tasty.", "nobsc-daikon"),
(11, 1, 1, NULL,                 "Horseradish",                              "Tasty.", "nobsc-horseradish"),
(11, 1, 1, NULL,                 "Rutabaga",                                 "Tasty.", "nobsc-rutabaga"),
(11, 1, 1, NULL,                 "Ginger",                                   "Tasty.", "nobsc-ginger"),
(11, 1, 1, NULL,                 "Sunchoke Jerusalem Artichoke",             "Tasty.", "nobsc-sunchoke-jerusalem-artichoke"),
(11, 1, 1, NULL,                 "Fennel",                                   "Tasty.", "nobsc-fennel"),
(11, 1, 1, NULL,                 "Tomatillo",                                "Tasty.", "nobsc-tomatillo"),
(11, 1, 1, "Standard Beefsteak", "Tomatoes",                                 "Tasty.", "nobsc-standard-beefsteak-tomatoes"),
(11, 1, 1, "Plum Roma",          "Tomatoes",                                 "Tasty.", "nobsc-plum-roma-san-marzano-tomatoes"),
(11, 1, 1, "Plum San Marzano",   "Tomatoes",                                 "Tasty.", "nobsc-plum-roma-san-marzano-tomatoes"),
(11, 1, 1, "Sungold",            "Tomatoes",                                 "Tasty.", "nobsc-cherry-tomatoes"),
(11, 1, 1, "Cherry",             "Tomatoes",                                 "Tasty.", "nobsc-cherry-tomatoes"),
(11, 1, 1, "Grape",              "Tomatoes",                                 "Tasty.", "nobsc-grape-tomatoes"),
(11, 1, 1, NULL,                 "Tomatoes",                                 "Tasty.", "nobsc-cherry-tomatoes"),

(12, 1, 1, "Ambrosia",           "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Baldwin",            "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Braeburn",           "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Cameo",              "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Cortland",           "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Cosmic Crisp",       "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Empire",             "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Enterprise",         "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Fuji",               "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Gala",               "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Golden Delicious",   "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Granny Smith",       "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Honeycrisp",         "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Idared",             "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Jazz",               "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Jonagold",           "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Jonathan",           "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Liberty",            "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Macoun",             "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "McIntosh Red",       "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Melrose",            "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Opal",               "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Ozark Gold",         "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Pinata",             "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Pink Lady",          "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Pristine",           "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Red Delicious",      "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Rome",               "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Spartan",            "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Stayman",            "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "SweeTango",          "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, "Winesap",            "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, NULL,                 "Apple",                                    "Tasty.", "nobsc-apple"),
(12, 1, 1, NULL,                 "Apricot",                                  "Tasty.", "nobsc-apricot"),
(12, 1, 1, NULL,                 "Banana",                                   "Tasty.", "nobsc-banana"),
(12, 1, 1, NULL,                 "Blackberries",                             "Tasty.", "nobsc-blackberries"),
(12, 1, 1, NULL,                 "Blueberries",                              "Tasty.", "nobsc-blueberries"),
(12, 1, 1, NULL,                 "Cherries",                                 "Tasty.", "nobsc-cherries"),
(12, 1, 1, "Dried",              "Cranberries",                              "Tasty.", "nobsc-cranberries"),
(12, 1, 1, NULL,                 "Cranberries",                              "Tasty.", "nobsc-cranberries"),
(12, 1, 1, "Concord",            "Grapes",                                   "Tasty.", "nobsc-grapes"),
(12, 1, 1, "Flame",              "Grapes",                                   "Tasty.", "nobsc-grapes"),
(12, 1, 1, "Moon Drop",          "Grapes",                                   "Tasty.", "nobsc-grapes"),
(12, 1, 1, "Ruby",               "Grapes",                                   "Tasty.", "nobsc-grapes"),
(12, 1, 1, "Thompson",           "Grapes",                                   "Tasty.", "nobsc-grapes"),
(12, 1, 1, NULL,                 "Grapes",                                   "Tasty.", "nobsc-grapes"),
(12, 1, 1, NULL,                 "Guava",                                    "Tasty.", "nobsc-guava"),
(12, 1, 1, NULL,                 "Kiwi",                                     "Tasty.", "nobsc-kiwi"),
(12, 1, 1, NULL,                 "Mango",                                    "Tasty.", "nobsc-mango"),
(12, 1, 1, NULL,                 "Watermelon",                               "Tasty.", "nobsc-watermelon"),
(12, 1, 1, NULL,                 "Nectarine",                                "Tasty.", "nobsc-nectarine"),
(12, 1, 1, NULL,                 "Papaya",                                   "Tasty.", "nobsc-papaya"),
(12, 1, 1, NULL,                 "Peach",                                    "Tasty.", "nobsc-peach"),
(12, 1, 1, "Anjou Green",        "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Anjou Red",          "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Asian",              "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Bartlett",           "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Bosc",               "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Comice",             "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Concord",            "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Forelle",            "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "French Butter",      "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Seckel",             "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, "Taylor\'s Gold",     "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, NULL,                 "Pear",                                     "Tasty.", "nobsc-pear"),
(12, 1, 1, NULL,                 "Pineapple",                                "Tasty.", "nobsc-pineapple"),
(12, 1, 1, NULL,                 "Orange",                                   "Tasty.", "nobsc-orange"),
(12, 1, 1, NULL,                 "Raspberries",                              "Tasty.", "nobsc-raspberries"),
(12, 1, 1, NULL,                 "Strawberries",                             "Tasty.", "nobsc-strawberries"),
(12, 1, 1, NULL,                 "Tangerine",                                "Tasty.", "nobsc-tangerine"),
(12, 1, 1, NULL,                 "Tangelo",                                  "Tasty.", "nobsc-tangelo"),
(12, 1, 1, NULL,                 "Blood Orange",                             "Tasty.", "nobsc-blood-orange"),
(12, 1, 1, NULL,                 "White Grapefruit",                         "Tasty.", "nobsc-white-grapefruit"),
(12, 1, 1, NULL,                 "Pink Grapefruit",                          "Tasty.", "nobsc-pink-grapefruit"),
(12, 1, 1, NULL,                 "Honeydew",                                 "Tasty.", "nobsc-honeydew"),
(12, 1, 1, NULL,                 "Cantaloupe",                               "Tasty.", "nobsc-cantaloupe"),
(12, 1, 1, "Italian",            "Plum",                                     "Tasty.", "nobsc-italian-plum"),
(12, 1, 1, NULL,                 "Plum",                                     "Tasty.", "nobsc-plum"),
(12, 1, 1, NULL,                 "Pomegranate",                              "Tasty.", "nobsc-pomegranate"),

(13, 1, 1, NULL,                 "Almonds",                                  "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Brazil Nuts",                              "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Cashews",                                  "Tasty.", "nobsc-cashews"),
(13, 1, 1, NULL,                 "Hazelnuts",                                "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Macadamia Nuts",                           "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Peacans",                                  "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Peanuts",                                  "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Pine Nuts",                                "Tasty.", "nobsc-almonds"),
(13, 1, 1, NULL,                 "Pistachios",                               "Tasty.", "nobsc-pistachios"),
(13, 1, 1, NULL,                 "Walnuts",                                  "Tasty.", "nobsc-almonds"),

(14, 1, 1, NULL,                 "Chia Seeds",                               "Tasty.", "nobsc-sesame-seeds"),
(14, 1, 1, NULL,                 "Hemp Seeds",                               "Tasty.", "nobsc-sesame-seeds"),
(14, 1, 1, NULL,                 "Poppy Seeds",                              "Tasty.", "nobsc-sesame-seeds"),
(14, 1, 1, NULL,                 "Pumpkin Seeds",                            "Tasty.", "nobsc-pumpkin-seeds"),
(14, 1, 1, NULL,                 "Sesame Seeds",                             "Tasty.", "nobsc-sesame-seeds"),
(14, 1, 1, NULL,                 "Quinoa",                                   "Tasty.", "nobsc-sesame-seeds"),

(15, 1, 1, "Ancho",              "Pepper",                                   "Tasty.", "nobsc-ancho-pepper"),
(15, 1, 1, "Arbol",              "Pepper",                                   "Tasty.", "nobsc-arbol-pepper"),
(15, 1, 1, "Cascabel",           "Pepper",                                   "Tasty.", "nobsc-cascabel-pepper"),
(15, 1, 1, "Guajillo",           "Pepper",                                   "Tasty.", "nobsc-guajillo-pepper"),
(15, 1, 1, "Morita",             "Pepper",                                   "Tasty.", "nobsc-morita-pepper"),
(15, 1, 1, "Mulato",             "Pepper",                                   "Tasty.", "nobsc-mulato-pepper"),
(15, 1, 1, "Pasilla",            "Pepper",                                   "Tasty.", "nobsc-pasilla-pepper"),
(15, 1, 1, "Pulla",              "Pepper",                                   "Tasty.", "nobsc-pulla-pepper"),
(15, 1, 1, NULL,                 "Celery Seeds",                             "Tasty.", "nobsc-celery-seeds"),
(15, 1, 1, NULL,                 "Cinnamon",                                 "Tasty.", "nobsc-cinnamon"),
(15, 1, 1, NULL,                 "Ground Cinnamon",                          "Tasty.", "nobsc-ground-cinnamon"),
(15, 1, 1, NULL,                 "Cloves",                                   "Tasty.", "nobsc-cloves"),
(15, 1, 1, NULL,                 "Ground Cloves",                            "Tasty.", "nobsc-ground-cloves"),
(15, 1, 1, NULL,                 "Caraway Seeds",                            "Tasty.", "nobsc-cumin-seeds"),
(15, 1, 1, NULL,                 "Cumin Seeds",                              "Tasty.", "nobsc-cumin-seeds"),
(15, 1, 1, NULL,                 "Cumin Powder",                             "Tasty.", "nobsc-cumin-powder"),
(15, 1, 1, NULL,                 "Fennel Seeds",                             "Tasty.", "nobsc-fennel-seeds"),
(15, 1, 1, NULL,                 "Garlic",                                   "Tasty.", "nobsc-garlic"),
(15, 1, 1, NULL,                 "Garlic Powder",                            "Tasty.", "nobsc-garlic-powder"),
(15, 1, 1, NULL,                 "Ginger",                                   "Tasty.", "nobsc-ginger"),
(15, 1, 1, NULL,                 "Ginger Powder",                            "Tasty.", "nobsc-ginger-powder"),
(15, 1, 1, NULL,                 "Shallots",                                 "Tasty.", "nobsc-shallots"),
(15, 1, 1, NULL,                 "Turmeric",                                 "Tasty.", "nobsc-turmeric"),
(15, 1, 1, NULL,                 "Turmeric Powder",                          "Tasty.", "nobsc-turmeric-powder"),

(16, 1, 1, NULL,                 "Basil",                                    "Tasty.", "nobsc-basil"),
(16, 1, 1, NULL,                 "Cilantro",                                 "Tasty.", "nobsc-cilantro"),
(16, 1, 1, NULL,                 "Fenugreek",                                "Tasty.", "nobsc-fenugreek"),
(16, 1, 1, NULL,                 "Parsley",                                  "Tasty.", "nobsc-parsley"),
(16, 1, 1, NULL,                 "Rosemary",                                 "Tasty.", "nobsc-rosemary"),
(16, 1, 1, NULL,                 "Sage",                                     "Tasty.", "nobsc-sage"),
(16, 1, 1, NULL,                 "Thyme",                                    "Tasty.", "nobsc-thyme"),

(17, 1, 1, "Apple Cider",        "Vinegar",                                  "Tasty.", "nobsc-balsamic-vinegar"),
(17, 1, 1, "Balsamic",           "Vinegar",                                  "Tasty.", "nobsc-balsamic-vinegar"),
(17, 1, 1, "Rice",               "Vinegar",                                  "Tasty.", "nobsc-balsamic-vinegar"),

(18, 1, 1, NULL,                 "Fish Sauce",                               "Tasty.", "nobsc-tobasco-sauce"),
(18, 1, 1, "Dark",               "Soy Sauce",                                "Tasty.", "nobsc-tobasco-sauce"),
(18, 1, 1, "Light",              "Soy Sauce",                                "Tasty.", "nobsc-tobasco-sauce");

INSERT INTO ingredients
(id, author_id, owner_id, brand, name, description, image)
VALUES
(18, 1, 1, "Tobasco",            "Hot Sauce",                                "Tasty.", "nobsc-tobasco-sauce");

INSERT INTO measurements
(id, name)
VALUES
(1, "teaspoon"),
(2, "Tablespoon"),
(3, "cup"),
(4, "ounce"),
(5, "pound"),
(6, "milliliter"),
(7, "liter"),
(8, "gram"),
(9, "kilogram"),
(10, "NA");

INSERT INTO methods
(id, name)
VALUES
(1, "No-Cook"),
(2, "Chill"),
(3, "Freeze"),
(4, "Microwave"),
(5, "Toast"),
(6, "Steam"),
(7, "Poach"),
(8, "Simmer"),
(9, "Boil"),
(10, "Blanch"),
(11, "Stew"),
(12, "Braise"),
(13, "Bake"),
(14, "Roast"),
(15, "Broil"),
(16, "Saute"),
(17, "Pan-Fry"),
(18, "Shallow-Fry"),
(19, "Deep-Fry"),
(20, "Stir-Fry"),
(21, "Glaze"),
(22, "BBQ"),
(23, "Grill"),
(24, "Smoke");

INSERT INTO recipe_types
(id, name)
VALUES
(1, "Drink"),
(2, "Appetizer"),
(3, "Main"),
(4, "Side"),
(5, "Dessert"),
(6, "Soup"),
(7, "Salad"),
(8, "Stew"),
(9, "Casserole"),
(10, "Sauce"),
(11, "Dressing"),
(12, "Condiment");

INSERT INTO recipes
(id, cuisine_id, author_id, owner_id, title, description, active_time, total_time, directions)
VALUES
(1,  1,  1, 1, "Borscht",                            "Excellent",        "00:30:00", "04:00:00", "Chop beets and onions..."),
(2,  2,  1, 1, "Soft Buttery Pretzle",               "Melting goodness", "00:20:00", "01:20:00", "Set oven to 400 F. Mix dough..."),
(3,  3,  1, 1, "Grilled Chicken and Seasoned Rice",  "Yum",              "01:00:00", "02:00:00", "Marinate chicken in a..."),
(4,  4,  1, 1, "Mixed Root Vegetables",              "Satisfying",       "00:15:00", "01:00:00", "Chop vegetables into about 2 inch by 2 inch pieces..."),
(5,  5,  1, 1, "Coffee Vanilla Icecream Cake",       "Special",          "00:30:00", "01:00:00", "Set oven to 275 F. Mix dough..."),
(6,  6,  1, 1, "Fish Carrot and Potato Soup",        "Nice.",            "00:45:00", "01:00:00", "Heat stock..."),
(7,  7,  1, 1, "Possibly Greek Salad",               "Who Knows",        "00:08:00", "00:08:00", "Mix olive oil and red wine vinegar in bowl..."),
(8,  8,  1, 1, "Irish Guinness Beef Stew",           "Calming",          "00:45:00", "04:00:00", "Sear well just one side of the beef pieces..."),
(9,  9,  1, 1, "Northern Chinese Seafood Casserole", "Excellent",        "00:45:00", "01:30:00", "Heat stock..."),
(10, 10, 1, 1, "Sweet Coconut Lime Sauce",           "Interesting",      "00:20:00", "00:20:00", "Mix..."),
(11, 11, 1, 1, "Carrot Ginger Dressing",             "Tasty",            "00:20:00", "00:20:00", "Blend carrots and..."),
(12, 12, 1, 1, "Some Kind Of Chutney",               "Not Bad",          "00:30:00", "01:00:00", "Mix...");

INSERT INTO recipe_equipment
(recipe_id, equipment_id, amount)
VALUES
(1, 1, 1),
(2, 1, 1),
(3, 1, 1),
(4, 1, 1),
(5, 1, 1),
(6, 1, 1),
(7, 1, 1),
(8, 1, 1),
(9, 1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1);

INSERT INTO recipe_ingredients
(recipe_id, ingredient_id, amount, measurement_id)
VALUES
(1, 116, 4, 1),
(2, 209, 2, 2),
(3, 153, 1, 3),
(4, 159, 1, 4),
(5, 165, 7, 5),
(6, 176, 1, 6),
(7, 142, 3, 7),
(8, 230, 1, 8),
(9, 202, 9, 9),
(10, 100, 20, 10),
(11, 122, 10, 1),
(12, 138, 13, 2);

INSERT INTO recipe_methods
(recipe_id, method_id)
VALUES
(1, 6),
(2, 9),
(3, 13),
(4, 15),
(5, 16),
(6, 7),
(7, 4),
(8, 3),
(9, 2),
(10, 1),
(11, 12),
(12, 13);
USE nobsc;

CREATE TABLE `nobsc_staff` (
  `staff_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `staffname` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-staff-default',
  `role` varchar(20) NOT NULL DEFAULT 'staff',
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `username` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-user-default',
  `confirmation_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_types` (
  `recipe_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `recipe_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`recipe_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_ingredient_types` (
  `ingredient_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `ingredient_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ingredient_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_equipment_types` (
  `equipment_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `equipment_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`equipment_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_methods` (
  `method_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `method_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_cuisines` (
  `cuisine_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cuisine_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`cuisine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_measurements` (
  `measurement_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `measurement_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipes` (
  `recipe_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recipe_type_id` tinyint(3) unsigned NOT NULL,
  `cuisine_id` tinyint(3) unsigned NOT NULL,
  `author_id` int(10) unsigned NOT NULL,
  `owner_id` int(10) unsigned NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(150) NOT NULL DEFAULT '',
  `directions` text NOT NULL,
  `recipe_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-default',
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-equipment-default',
  `ingredients_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-ingredients-default',
  `cooking_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-cooking-default',
  PRIMARY KEY (`recipe_id`),
  FOREIGN KEY (`recipe_type_id`) REFERENCES `nobsc_recipe_types` (`recipe_type_id`),
  FOREIGN KEY (`cuisine_id`) REFERENCES `nobsc_cuisines` (`cuisine_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_ingredients` (
  `ingredient_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `ingredient_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `author_id` int(10) unsigned NOT NULL,
  `owner_id` int(10) unsigned NOT NULL,
  `ingredient_name` varchar(100) NOT NULL,
  `ingredient_description` text NOT NULL,
  `ingredient_image` varchar(100) NOT NULL DEFAULT 'nobsc-ingredient-default',
  PRIMARY KEY (`ingredient_id`),
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `nobsc_ingredient_types` (`ingredient_type_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_equipment` (
  `equipment_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `equipment_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `author_id` int(10) unsigned NOT NULL,
  `owner_id` int(10) unsigned NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `equipment_description` text NOT NULL,
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-equipment-default',
  PRIMARY KEY (`equipment_id`),
  FOREIGN KEY (`equipment_type_id`) REFERENCES `nobsc_equipment_types` (`equipment_type_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_subrecipes` (
  `recipe_id` int(10) unsigned NOT NULL,
  `subrecipe_id` int(10) unsigned NOT NULL,
  `amount` decimal(5,2) unsigned NOT NULL,
  `measurement_id` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`subrecipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `nobsc_measurements` (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_ingredients` (
  `recipe_id` int(10) unsigned NOT NULL DEFAULT '0',
  `ingredient_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `amount` decimal(5,2) unsigned NOT NULL,
  `measurement_id` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `nobsc_ingredients` (`ingredient_id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `nobsc_measurements` (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_equipment` (
  `recipe_id` int(10) unsigned NOT NULL,
  `equipment_id` smallint(5) unsigned NOT NULL,
  `amount` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `nobsc_equipment` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_methods` (
  `recipe_id` int(10) unsigned NOT NULL,
  `method_id` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`method_id`) REFERENCES `nobsc_methods` (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_friendships` (
  `user_id` int(10) unsigned NOT NULL,
  `friend_id` int(10) unsigned NOT NULL,
  `status` varchar(20) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`friend_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_plans` (
  `plan_id` int(10) unsigned NOT NULL,
  `author_id` int(10) unsigned NOT NULL,
  `owner_id` int(10) unsigned NOT NULL,
  `plan_name` varchar(100) NOT NULL DEFAULT '',
  `plan_data` json DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_favorite_recipes` (
  `user_id` int(10) unsigned NOT NULL,
  `recipe_id` int(10) unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_saved_recipes` (
  `user_id` int(10) unsigned NOT NULL,
  `recipe_id` int(10) unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_notifications` (
  `notification_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) unsigned NOT NULL,
  `receiver_id` int(10) unsigned NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `type` varchar(45) NOT NULL,
  `note` varchar(255) NOT NULL,
  `created_on` date NOT NULL,
  PRIMARY KEY (`notification_id`),
  FOREIGN KEY (`sender_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO nobsc_staff
(email, pass, staffname)
VALUES
("tjalferes@tjalferes.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "T. J. Alferes");

INSERT INTO nobsc_users
(email, pass, username)
VALUES
("tjalferes@tjalferes.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "NOBSC"),
("tjalferes@gmail.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "Unknown");

INSERT INTO nobsc_recipe_types
(recipe_type_id, recipe_type_name)
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

INSERT INTO nobsc_ingredient_types
(ingredient_type_id, ingredient_type_name)
VALUES
(1, "Fish"),
(2, "Shellfish"),
(3, "Beef"),
(4, "Pork"),
(5, "Poultry"),
(6, "Egg"),
(7, "Dairy"),
(8, "Oil"),
(9, "Starch"),
(10, "Bean"),
(11, "Vegetable"),
(12, "Fruit"),
(13, "Nut"),
(14, "Seed"),
(15, "Spice"),
(16, "Herb"),
(17, "Acid"),
(18, "Product");

INSERT INTO nobsc_equipment_types
(equipment_type_id, equipment_type_name)
VALUES
(1, "Cleaning"),
(2, "Preparing"),
(3, "Cooking"),
(4, "Dining"),
(5, "Storage");

INSERT INTO nobsc_methods
(method_id, method_name)
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

INSERT INTO nobsc_cuisines
(cuisine_id, cuisine_name)
VALUES
(1, "Russian"),
(2, "German"),
(3, "Turkish"),
(4, "French"),
(5, "Italian"),
(6, "Mexican"),
(7, "Greek"),
(8, "Irish"),
(9, "Chinese"),
(10, "Indian"),
(11, "Japanese"),
(12, "Iranian");

INSERT INTO nobsc_measurements
(measurement_id, measurement_name)
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



INSERT INTO nobsc_ingredients
(ingredient_type_id, author_id, owner_id, ingredient_name, ingredient_description, ingredient_image)
VALUES
(3, 1, 1, "Chuck Seven Bone Roast", "Tasty.", "nobsc-chuck-7-bone-roast"),
(3, 1, 1, "Chuck Seven Bone Steak", "Tasty.", "nobsc-chuck-7-bone-steak"),
(3, 1, 1, "Chuck Arm Roast", "Tasty.", "nobsc-chuck-arm-roast"),
(3, 1, 1, "Chuck Arm Roast Boneless", "Tasty.", "nobsc-chuck-arm-rost-boneless"),
(3, 1, 1, "Chuck Arm Steak", "Tasty.", "nobsc-chuck-arm-steak"),
(3, 1, 1, "Chuck Arm Steak Boneless", "Tasty.", "nobsc-chuck-arm-steak-boneless"),
(3, 1, 1, "Chuck Blade Roast", "Tasty.", "nobsc-chuck-blade-roast"),
(3, 1, 1, "Chuck Blade Steak", "Tasty.", "nobsc-chuck-blade-steak"),
(3, 1, 1, "Chuck Blade Steak Boneless", "Tasty.", "nobsc-chuck-blade-steak-boneless"),
(3, 1, 1, "Chuck Blade Steak Cap Off", "Tasty.", "nobsc-chuck-blade-steak-cap-off"),

(3, 1, 1, "Chuck Cross Rib Roast", "Tasty.", "nobsc-chuck-cross-rib-roast"),
(3, 1, 1, "Chuck Cross Rib Roast Boneless", "Tasty.", "nobsc-chuck-cross-rib-roast-boneless"),
(3, 1, 1, "Chuck Eye Edge Roast", "Tasty.", "nobsc-chuck-eye-edge-roast"),
(3, 1, 1, "Chuck Eye Roast Boneless", "Tasty.", "nobsc-chuck-eye-roast-steak"),
(3, 1, 1, "Chuck Eye Steak Boneless", "Tasty.", "nobsc-chuck-eye-steak-boneless"),
(3, 1, 1, "Chuck Flanken Style Ribs", "Tasty.", "nobsc-chuck-flanken-style-ribs"),
(3, 1, 1, "Chuck Flanken Style Ribs Boneless", "Tasty.", "nobsc-chuck-flanken-style-ribs-boneless"),
(3, 1, 1, "Chuck Flat Ribs", "Tasty.", "nobsc-chuck-flat-ribs"),
(3, 1, 1, "Chuck Mock Tender Roast", "Tasty.", "nobsc-chuck-mock-tender-roast"),
(3, 1, 1, "Chuck Mock Tender Steak", "Tasty.", "nobsc-chuck-mock-tender-steak"),

(3, 1, 1, "Chuck Neck Roast", "Tasty.", "nobsc-chuck-neck-roast"),
(3, 1, 1, "Chuck Neck Roast Boneless", "Tasty.", "nobsc-chuck-neck-roast-boneless"),
(3, 1, 1, "Chuck Roast Boneless", "Tasty.", "nobsc-chuck-roast-boneless"),
(3, 1, 1, "Chuck Short Ribs", "Tasty.", "nobsc-chuck-short-ribs"),
(3, 1, 1, "Chuck Short Ribs Boneless", "Tasty.", "nobsc-chuck-short-ribs-boneless"),
(3, 1, 1, "Chuck Shoulder Center Steak Ranch Steak", "Tasty.", "nobsc-chuck-shoulder-center-steak-ranch-steak"),
(3, 1, 1, "Chuck Shoulder Roast", "Tasty.", "nobsc-chuck-shoulder-roast"),
(3, 1, 1, "Chuck Shoulder Roast Boneless", "Tasty.", "nobsc-chuck-shoulder-roast-boneless"),
(3, 1, 1, "Chuck Shoulder Steak Boneless", "Tasty.", "nobsc-chuck-shoulder-steak-boneless"),
(3, 1, 1, "Chuck Shoulder Tender", "Tasty.", "nobsc-chuck-shoulder-tender"),

(3, 1, 1, "Chuck Shoulder Tender Medallions", "Tasty.", "nobsc-chuck-shoulder-tender-medallions"),
(3, 1, 1, "Chuck Shoulder Top Blade Roast Boneless", "Tasty.", "nobsc-chuck-shoulder-top-blade-roast-boneless"),
(3, 1, 1, "Chuck Shoulder Top Blade Steak Boneless", "Tasty.", "nobsc-chuck-shoulder-top-blade-steak-boneless"),
(3, 1, 1, "Chuck Shoulder Top Blade Steak Flat Iron", "Tasty.", "nobsc-chuck-shoulder-top-blade-steak-flat-iron"),
(3, 1, 1, "Chuck Top Blade Roast", "Tasty.", "nobsc-chuck-top-blade-roast"),
(3, 1, 1, "Chuck Top Blade Steak Bone In", "Tasty.", "nobsc-chuck-top-blade-steak-bone-in"),
(3, 1, 1, "Chuck Under Blade Roast", "Tasty.", "nobsc-chuck-under-blade-roast"),
(3, 1, 1, "Chuck Under Blade Roast Boneless", "Tasty.", "nobsc-chuck-under-blade-roast-boneless"),
(3, 1, 1, "Chuck Under Blade Steak", "Tasty.", "nobsc-chuck-under-blade-steak"),
(3, 1, 1, "Chuck Under Blade Steak Boneless", "Tasty.", "nobsc-chuck-under-blade-steak-boneless"),

(3, 1, 1, "Round Bottom Round Roast", "Tasty.", "nobsc-round-bottom-round-roast"),
(3, 1, 1, "Round Bottom Round Roast Triangle Roast", "Tasty.", "nobsc-round-bottom-round-roast-triangle-roast"),
(3, 1, 1, "Round Bottom Round Rump Roast", "Tasty.", "nobsc-round-bottom-round-rump-roast"),
(3, 1, 1, "Round Bottom Round Steak", "Tasty.", "nobsc-round-bottom-round-steak"),
(3, 1, 1, "Round Bottom Round Steak Western Griller", "Tasty.", "nobsc-round-bottom-round-steak-western-griller"),
(3, 1, 1, "Round Eye Round Roast", "Tasty.", "nobsc-round-eye-round-roast"),
(3, 1, 1, "Round Eye Round Steak", "Tasty.", "nobsc-round-eye-round-steak"),
(3, 1, 1, "Round Heel of Round", "Tasty.", "nobsc-round-heel-of-round"),
(3, 1, 1, "Round Sirloin Tip Center Roast", "Tasty.", "nobsc-round-sirloin-tip-center-roast"),
(3, 1, 1, "Round Sirloin Tip Center Steak", "Tasty.", "nobsc-round-sirloin-tip-center-steak"),

(3, 1, 1, "Round Sirloin Tip Side Steak", "Tasty.", "nobsc-round-sirloin-tip-side-steak"),
(3, 1, 1, "Round Steak", "Tasty.", "nobsc-round-steak"),
(3, 1, 1, "Round Steak Boneless", "Tasty.", "nobsc-round-steak-boneless"),
(3, 1, 1, "Round Tip Roast", "Tasty.", "nobsc-round-tip-roast"),
(3, 1, 1, "Round Tip Roast Cap Off", "Tasty.", "nobsc-round-tip-roast-cap-off"),
(3, 1, 1, "Round Tip Steak", "Tasty.", "nobsc-round-tip-steak"),
(3, 1, 1, "Round Tip Steak Cap Off", "Tasty.", "nobsc-round-tip-steak-cap-off"),
(3, 1, 1, "Round Top Round Roast", "Tasty.", "nobsc-round-top-round-roast"),
(3, 1, 1, "Round Top Round Roast Cap Off", "Tasty.", "nobsc-round-top-round-roast-cap-off"),
(3, 1, 1, "Round Top Round Steak", "Tasty.", "nobsc-round-top-round-steak"),

(3, 1, 1, "Round Top Round Steak Butterflied", "Tasty.", "nobsc-round-top-round-steak-butterflied"),
(3, 1, 1, "Round Top Round Steak First Cut", "Tasty.", "nobsc-round-top-round-steak-first-cut"),
(3, 1, 1, "Loin Ball Tip Roast", "Tasty.", "nobsc-loin-ball-tip-roast"),
(3, 1, 1, "Loin Ball Tip Steak", "Tasty.", "nobsc-loin-ball-tip-steak"),
(3, 1, 1, "Loin Flap Meat Steak", "Tasty.", "nobsc-loin-flap-meat-steak"),
(3, 1, 1, "Loin Porterhouse Steak", "Tasty.", "nobsc-loin-porterhouse-steak"),
(3, 1, 1, "Loin Shell Sirloin Steak", "Tasty.", "nobsc-loin-shell-sirloin-steak"),
(3, 1, 1, "Loin Sirloin Steak", "Tasty.", "nobsc-loin-sirloin-steak"),
(3, 1, 1, "Loin T Bone Steak", "Tasty.", "nobsc-loin-t-bone-steak"),
(3, 1, 1, "Loin Tenderloin Roast", "Tasty.", "nobsc-loin-tenderloin-roast"),

(3, 1, 1, "Loin Tenderloin Steak", "Tasty.", "nobsc-loin-tenderloin-steak"),
(3, 1, 1, "Loin Top Loin Roast", "Tasty.", "nobsc-loin-top-loin-roast"),
(3, 1, 1, "Loin Top Loin Roast Boneless", "Tasty.", "nobsc-loin-top-loin-roast-boneless"),
(3, 1, 1, "Loin Top Loin Steak", "Tasty.", "nobsc-loin-top-loin-steak"),
(3, 1, 1, "Loin Top Loin Steak Boneless", "Tasty.", "nobsc-loin-top-loin-steak-boneless"),
(3, 1, 1, "Loin Top Sirloin Roast Boneless", "Tasty.", "nobsc-loin-top-sirloin-roast-boneless"),
(3, 1, 1, "Loin Top Sirloin Roast Boneless Cap Off", "Tasty.", "nobsc-loin-top-sirloin-roast-boneless-cap-off"),
(3, 1, 1, "Loin Top Sirloin Steak Boneless", "Tasty.", "nobsc-loin-top-sirloin-steak-boneless"),
(3, 1, 1, "Loin Top Sirloin Steak Boneless Cap Off", "Tasty.", "nobsc-loin-top-sirloin-steak-boneless-cap-off"),
(3, 1, 1, "Loin Tri Tip Roast", "Tasty.", "nobsc-loin-tri-tip-roast"),

(3, 1, 1, "Loin Tri Tip Steak", "Tasty.", "nobsc-loin-tri-tip-steak"),
(3, 1, 1, "Shank Cross Cut", "Tasty.", "nobsc-shank-cross-cut"),
(3, 1, 1, "Shank Cross Cut Boneless", "Tasty.", "nobsc-shank-cross-cut-boneless"),
(3, 1, 1, "Plate Skirt Steak", "Tasty.", "nobsc-plate-skirt-steak"),
(3, 1, 1, "Flank Steak", "Tasty.", "nobsc-flank-flank-steak"),
(3, 1, 1, "Ground Beef", "Tasty.", "nobsc-ground-beef"),
(3, 1, 1, "Back Ribs", "Tasty.", "nobsc-back-ribs"),
(3, 1, 1, "Rib Cap Meat Boneless", "Tasty.", "nobsc-rib-cap-meat-boneless"),
(3, 1, 1, "Rib Extra Trim Roast Large End", "Tasty.", "nobsc-rib-extra-trim-roast-large-end"),
(3, 1, 1, "Ribeye Roast", "Tasty.", "nobsc-ribeye-roast"),

(3, 1, 1, "Ribeye Roast Lip On Bone In", "Tasty.", "nobsc-ribeye-roast-lip-on-bone-in"),
(3, 1, 1, "Ribeye Roast Lip On Boneless", "Tasty.", "nobsc-ribeye-roast-lip-on-boneless"),
(3, 1, 1, "Ribeye Steak", 3, "nobsc-ribeye-steak"),
(3, 1, 1, "Ribeye Steak Lip On Bone In", "Tasty.", "nobsc-ribeye-steak-lip-on-bone-in"),
(3, 1, 1, "Ribeye Steak Lip On Boneless", "Tasty.", "nobsc-ribeye-steak-lip-on-boneless"),
(3, 1, 1, "Rib Roast Large End", "Tasty.", "nobsc-rib-roast-large-end"),
(3, 1, 1, "Rib Roast Large End Boneless", "Tasty.", "nobsc-rib-roast-large-end-boneless"),
(3, 1, 1, "Rib Roast Small End", "Tasty.", "nobsc-rib-roast-small-end"),
(3, 1, 1, "Rib Roast Small End Boneless", "Tasty.", "nobsc-rib-roast-small-end-boneless"),
(3, 1, 1, "Rib Rolled Cap Pot Roast Boneless", "Tasty.", "nobsc-rib-rolled-cap-pot-roast-boneless"),

(3, 1, 1, "Rib Short Ribs", "Tasty.", "nobsc-rib-short-ribs"),
(3, 1, 1, "Rib Short Ribs Boneless", "Tasty.", "nobsc-rib-short-ribs-boneless"),
(3, 1, 1, "Rib Steak Large End", "Tasty.", "nobsc-rib-steak-large-end"),
(3, 1, 1, "Rib Steak Small End", "Tasty.", "nobsc-rib-steak-small-end"),
(3, 1, 1, "Rib Steak Small End Boneless", "Tasty.", "nobsc-rib-steak-small-end-boneless"),
(13, 1, 1, "Almonds", "Tasty.", "nobsc-almonds"),
(13, 1, 1, "Cashews", "Tasty.", "nobsc-cashews"),
(13, 1, 1, "Pistachios", "Tasty.", "nobsc-pistachios"),
(14, 1, 1, "Pumpkin Seeds", "Tasty.", "nobsc-pumpkin-seeds"),
(14, 1, 1, "Sesame Seeds", "Tasty.", "nobsc-sesame-seeds"),

(12, 1, 1, "Apple", "Tasty.", "nobsc-apple"),
(12, 1, 1, "Apricot", "Tasty.", "nobsc-apricot"),
(12, 1, 1, "Banana", "Tasty.", "nobsc-banana"),
(12, 1, 1, "Blackberries", "Tasty.", "nobsc-blackberries"),
(12, 1, 1, "Blueberries", "Tasty.", "nobsc-blueberries"),
(12, 1, 1, "Cherries", "Tasty.", "nobsc-cherries"),
(12, 1, 1, "Cranberries", "Tasty.", "nobsc-cranberries"),
(12, 1, 1, "Grapes", "Tasty.", "nobsc-grapes"),
(12, 1, 1, "Guava", "Tasty.", "nobsc-guava"),
(12, 1, 1, "Kiwi", "Tasty.", "nobsc-kiwi"),

(12, 1, 1, "Mango", "Tasty.", "nobsc-mango"),
(12, 1, 1, "Watermelon", "Tasty.", "nobsc-watermelon"),
(12, 1, 1, "Nectarine", "Tasty.", "nobsc-nectarine"),
(12, 1, 1, "Papaya", "Tasty.", "nobsc-papaya"),
(12, 1, 1, "Peach", "Tasty.", "nobsc-peach"),
(12, 1, 1, "Pear", "Tasty.", "nobsc-pear"),
(12, 1, 1, "Pineapple", "Tasty.", "nobsc-pineapple"),
(12, 1, 1, "Orange", "Tasty.", "nobsc-orange"),
(12, 1, 1, "Raspberries", "Tasty.", "nobsc-raspberries"),
(12, 1, 1, "Strawberries", "Tasty.", "nobsc-strawberries"),

(12, 1, 1, "Tangerine", "Tasty.", "nobsc-tangerine"),
(12, 1, 1, "Tangelo", "Tasty.", "nobsc-tangelo"),
(12, 1, 1, "Blood Orange", "Tasty.", "nobsc-blood-orange"),
(12, 1, 1, "White Grapefruit", "Tasty.", "nobsc-white-grapefruit"),
(12, 1, 1, "Pink Grapefruit", "Tasty.", "nobsc-pink-grapefruit"),
(12, 1, 1, "Honeydew", "Tasty.", "nobsc-honeydew"),
(12, 1, 1, "Cantaloupe", "Tasty.", "nobsc-cantaloupe"),
(12, 1, 1, "Plum", "Tasty.", "nobsc-plum"),
(12, 1, 1, "Italian Plum", "Tasty.", "nobsc-italian-plum"),
(12, 1, 1, "Pomegranate", "Tasty.", "nobsc-pomegranate"),

(11, 1, 1, "Broccoli", "Tasty.", "nobsc-broccoli"),
(11, 1, 1, "Brussels Sprouts", "Tasty.", "nobsc-brussels-sprouts"),
(11, 1, 1, "Bok Choy", "Tasty.", "nobsc-bok-choy"),
(11, 1, 1, "Green Cabbage", "Tasty.", "nobsc-green-cabbage"),
(11, 1, 1, "Red Cabbage", "Tasty.", "nobsc-red-cabbage"),
(11, 1, 1, "Napa Cabbage Chinese Cabbage", "Tasty.", "nobsc-napa-cabbage-chinese-cabbage"),
(11, 1, 1, "Savoy Cabbage", "Tasty.", "nobsc-savoy-cabbage"),
(11, 1, 1, "Cauliflower", "Tasty.", "nobsc-cauliflower"),
(11, 1, 1, "Kohlrabi", "Tasty.", "nobsc-kohlrabi"),
(11, 1, 1, "Collard Greens", "Tasty.", "nobsc-collard-greens"),

(11, 1, 1, "Kale", "Tasty.", "nobsc-kale"),
(11, 1, 1, "Turnip Greens", "Tasty.", "nobsc-turnip-greens"),
(11, 1, 1, "Pak Choy Baby Bok Choy", "Tasty.", "nobsc-pak-choy-baby-bok-choy"),
(11, 1, 1, "Zucchini", "Tasty.", "nobsc-zucchini"),
(11, 1, 1, "Standard Slicing Cucumber", "Tasty.", "nobsc-standard-slicing-cucumber"),
(11, 1, 1, "Purple Eggplant", "Tasty.", "nobsc-purple-eggplant"),
(11, 1, 1, "White Eggplant", "Tasty.", "nobsc-white-eggplant"),
(11, 1, 1, "Japanese Eggplant", "Tasty.", "nobsc-japanese-eggplant"),
(11, 1, 1, "Acorn Squash", "Tasty.", "nobsc-acorn-squash"),
(11, 1, 1, "Butternut Squash", "Tasty.", "nobsc-butternut-squash"),

(11, 1, 1, "Hubbard Squash", "Tasty.", "nobsc-hubbard-squash"),
(11, 1, 1, "Pumpkin", "Tasty.", "nobsc-pumpkin"),
(11, 1, 1, "Spaghetti Squash", "Tasty.", "nobsc-spaghetti-squash"),
(11, 1, 1, "Delicata Squash", "Tasty.", "nobsc-delicata-squash"),
(11, 1, 1, "Boston Lettuce", "Tasty.", "nobsc-boston-lettuce"),
(11, 1, 1, "Bibb Lettuce", "Tasty.", "nobsc-bibb-lettuce"),
(11, 1, 1, "Iceberg Lettuce", "Tasty.", "nobsc-iceberg-lettuce"),
(11, 1, 1, "Romaine Lettuce", "Tasty.", "nobsc-romaine-lettuce"),
(11, 1, 1, "Green Leaf Lettuce", "Tasty.", "nobsc-green-leaf-lettuce"),
(11, 1, 1, "Oak Leaf Lettuce", "Tasty.", "nobsc-oak-leaf-lettuce"),

(11, 1, 1, "Red Leaf Lettuce", "Tasty.", "nobsc-red-leaf-lettuce"),
(11, 1, 1, "Arugula Rocket", "Tasty.", "nobsc-arugula-rocket"),
(11, 1, 1, "Belgian Endive", "Tasty.", "nobsc-belgian-endive"),
(11, 1, 1, "Frisee", "Tasty.", "nobsc-frisee"),
(11, 1, 1, "Escarole", "Tasty.", "nobsc-escarole"),
(11, 1, 1, "Mache Lambs Lettuce", "Tasty.", "nobsc-mache-lambs-lettuce"),
(11, 1, 1, "Radicchio", "Tasty.", "nobsc-radicchio"),
(11, 1, 1, "Watercress", "Tasty.", "nobsc-watercress"),
(11, 1, 1, "Spinach", "Tasty.", "nobsc-spinach"),
(11, 1, 1, "Swiss Chard", "Tasty.", "nobsc-swiss-chard"),

(11, 1, 1, "Beet Greens", "Tasty.", "nobsc-beet-greens"),
(11, 1, 1, "Dandelion Greens", "Tasty.", "nobsc-dandelion-greens"),
(11, 1, 1, "Mustard Greens", "Tasty.", "nobsc-mustard-greens"),
(11, 1, 1, "Shiitake Mushrooms", "Tasty.", "nobsc-shiitake-mushrooms"),
(11, 1, 1, "Cremini Mushrooms", "Tasty.", "nobsc-cremini-mushrooms"),
(11, 1, 1, "Portobello Mushrooms", "Tasty.", "nobsc-portobello-mushrooms"),
(11, 1, 1, "Pearl Onions", "Tasty.", "nobsc-pearl-onions"),
(11, 1, 1, "Globe Onion", "Tasty.", "nobsc-globe-onion"),
(11, 1, 1, "Spanish Onion", "Tasty.", "nobsc-spanish-onion"),
(11, 1, 1, "Sweet Onion", "Tasty.", "nobsc-sweet-onion"),

(11, 1, 1, "Garlic", "Tasty.", "nobsc-garlic"),
(11, 1, 1, "Shallots", "Tasty.", "nobsc-shallots"),
(11, 1, 1, "Leek", "Tasty.", "nobsc-leek"),
(11, 1, 1, "Scallion Green Onion", "Tasty.", "nobsc-scallion-green-onion"),
(11, 1, 1, "Bell Pepper", "Tasty.", "nobsc-bell-pepper"),
(11, 1, 1, "Poblano Pepper", "Tasty.", "nobsc-poblano-pepper"),
(11, 1, 1, "Jalapeno Pepper", "Tasty.", "nobsc-jalapeno-pepper"),
(11, 1, 1, "Serrano Pepper", "Tasty.", "nobsc-serrano-pepper"),
(11, 1, 1, "Thai Pepper", "Tasty.", "nobsc-thai-pepper"),
(11, 1, 1, "Habanero Pepper", "Tasty.", "nobsc-habanero-pepper"),

(11, 1, 1, "Baby Spinach", "Tasty.", "nobsc-baby-spinach"),
(11, 1, 1, "Beets", "Tasty.", "nobsc-beets"),
(11, 1, 1, "Mushrooms", "Tasty.", "nobsc-mushrooms"),
(11, 1, 1, "Onion", "Tasty.", "nobsc-onion"),
(11, 1, 1, "Winterbor Kale Curly Kale", "Tasty.", "nobsc-winterbor-kale-curly-kale"),
(11, 1, 1, "Red Russian Kale", "Tasty.", "nobsc-red-russian-kale"),
(11, 1, 1, "Grape Tomatoes", "Tasty.", "nobsc-grape-tomatoes"),
(11, 1, 1, "Green Beans", "Tasty.", "nobsc-green-beans"),
(11, 1, 1, "Green Peas", "Tasty.", "nobsc-green-peas"),
(11, 1, 1, "Celery", "Tasty.", "nobsc-celery"),

(11, 1, 1, "Asparagus", "Tasty.", "nobsc-asparagus"),
(11, 1, 1, "Snowpeas", "Tasty.", "nobsc-snowpeas"),
(11, 1, 1, "Sugar Snap Peas", "Tasty.", "nobsc-sugar-snap-peas"),
(11, 1, 1, "Carrots", "Tasty.", "nobsc-carrots"),
(11, 1, 1, "Parsnips", "Tasty.", "nobsc-parsnips"),
(11, 1, 1, "Turnips", "Tasty.", "nobsc-turnips"),
(11, 1, 1, "White Turnips", "Tasty.", "nobsc-white-turnips"),
(11, 1, 1, "Radishes", "Tasty.", "nobsc-radishes"),
(11, 1, 1, "French Radishes", "Tasty.", "nobsc-french-radishes"),
(11, 1, 1, "Baby Gold Beets", "Tasty.", "nobsc-baby-gold-beets"),

(11, 1, 1, "Red Beets", "Tasty.", "nobsc-red-beets"),
(11, 1, 1, "Daikon", "Tasty.", "nobsc-daikon"),
(11, 1, 1, "Horseradish", "Tasty.", "nobsc-horseradish"),
(11, 1, 1, "Rutabaga", "Tasty.", "nobsc-rutabaga"),
(11, 1, 1, "Ginger", "Tasty.", "nobsc-ginger"),
(11, 1, 1, "Sunchoke Jerusalem Artichoke", "Tasty.", "nobsc-sunchoke-jerusalem-artichoke"),
(11, 1, 1, "Fennel", "Tasty.", "nobsc-fennel"),
(11, 1, 1, "Tomatillo", "Tasty.", "nobsc-tomatillo"),
(11, 1, 1, "Standard Beefsteak Tomatoes", "Tasty.", "nobsc-standard-beefsteak-tomatoes"),
(11, 1, 1, "Plum Roma San Marzano Tomatoes", "Tasty.", "nobsc-plum-roma-san-marzano-tomatoes"),

(11, 1, 1, "Cherry Tomatoes", "Tasty.", "nobsc-cherry-tomatoes"),
(2, 1, 1, "Shrimp", "Tasty.", "nobsc-shrimp"),
(2, 1, 1, "Crab", "Tasty.", "nobsc-crab"),
(1, 1, 1, "Tuna", "Tasty.", "nobsc-tuna"),
(1, 1, 1, "Salmon", "Tasty.", "nobsc-salmon"),
(1, 1, 1, "Tilapia", "Tasty.", "nobsc-tilapia"),
(1, 1, 1, "Pollock", "Tasty.", "nobsc-pollock"),
(1, 1, 1, "Catfish", "Tasty.", "nobsc-catfish"),
(1, 1, 1, "Cod", "Tasty.", "nobsc-cod"),
(2, 1, 1, "Clams", "Tasty.", "nobsc-clams"),

(16, 1, 1, "Basil", "Tasty.", "nobsc-basil"),
(16, 1, 1, "Cilantro", "Tasty.", "nobsc-cilantro"),
(16, 1, 1, "Fenugreek", "Tasty.", "nobsc-fenugreek"),
(16, 1, 1, "Parsley", "Tasty.", "nobsc-parsley"),
(16, 1, 1, "Rosemary", "Tasty.", "nobsc-rosemary"),
(16, 1, 1, "Sage", "Tasty.", "nobsc-sage"),
(16, 1, 1, "Thyme", "Tasty.", "nobsc-thyme"),
(15, 1, 1, "Ancho Pepper", "Tasty.", "nobsc-ancho-pepper"),
(15, 1, 1, "Arbol Pepper", "Tasty.", "nobsc-arbol-pepper"),
(15, 1, 1, "Cascabel Pepper", "Tasty.", "nobsc-cascabel-pepper"),

(15, 1, 1, "Guajillo Pepper", "Tasty.", "nobsc-guajillo-pepper"),
(15, 1, 1, "Morita Pepper", "Tasty.", "nobsc-morita-pepper"),
(15, 1, 1, "Mulato Pepper", "Tasty.", "nobsc-mulato-pepper"),
(15, 1, 1, "Pasilla Pepper", "Tasty.", "nobsc-pasilla-pepper"),
(15, 1, 1, "Pulla Pepper", "Tasty.", "nobsc-pulla-pepper"),
(15, 1, 1, "Celery Seeds", "Tasty.", "nobsc-celery-seeds"),
(15, 1, 1, "Cinnamon", "Tasty.", "nobsc-cinnamon"),
(15, 1, 1, "Ground Cinnamon", "Tasty.", "nobsc-ground-cinnamon"),
(15, 1, 1, "Cloves", "Tasty.", "nobsc-cloves"),
(15, 1, 1, "Ground Cloves", "Tasty.", "nobsc-ground-cloves"),

(15, 1, 1, "Cumin Seeds", "Tasty.", "nobsc-cumin-seeds"),
(15, 1, 1, "Cumin Powder", "Tasty.", "nobsc-cumin-powder"),
(15, 1, 1, "Fennel Seeds", "Tasty.", "nobsc-fennel-seeds"),
(15, 1, 1, "Garlic", "Tasty.", "nobsc-garlic"),
(15, 1, 1, "Garlic Powder", "Tasty.", "nobsc-garlic-powder"),
(15, 1, 1, "Ginger", "Tasty.", "nobsc-ginger"),
(15, 1, 1, "Ginger Powder", "Tasty.", "nobsc-ginger-powder"),
(15, 1, 1, "Shallots", "Tasty.", "nobsc-shallots"),
(15, 1, 1, "Turmeric", "Tasty.", "nobsc-turmeric"),
(15, 1, 1, "Turmeric Powder", "Tasty.", "nobsc-turmeric-powder"),

(10, 1, 1, "Black Turtle Beans", "Tasty.", "nobsc-black-turtle-beans"),
(10, 1, 1, "Garbanzo Beans Chickpeas", "Tasty.", "nobsc-garbanzo-beans-chickpeas"),
(10, 1, 1, "Great Northern Beans", "Tasty.", "nobsc-great-northern-beans"),
(10, 1, 1, "Pinto Beans", "Tasty.", "nobsc-pinto-beans"),
(10, 1, 1, "Red Kidney Beans", "Tasty.", "nobsc-red-kidney-beans"),
(10, 1, 1, "Split Peas", "Tasty.", "nobsc-split-peas"),
(4, 1, 1, "Bacon", "Tasty.", "nobsc-bacon"),
(5, 1, 1, "Chicken Wings", "Tasty.", "nobsc-raw-chicken-wings"),
(6, 1, 1, "Eggs", "Tasty.", "nobsc-eggs"),
(7, 1, 1, "Cream", "Tasty.", "nobsc-cream"),

(8, 1, 1, "Coconut", "Tasty.", "nobsc-coconut"),
(9, 1, 1, "Potatoes", "Tasty.", "nobsc-potatoes"),
(17, 1, 1, "Balsamic Vinegar", "Tasty.", "nobsc-balsamic-vinegar"),
(18, 1, 1, "Tobasco Sauce", "Tasty.", "nobsc-tobasco-sauce"),
(7, 1, 1, "Butter", "Tasty.", "nobsc-butter");

INSERT INTO nobsc_equipment
(equipment_type_id, author_id, owner_id, equipment_name, equipment_description, equipment_image)
VALUES
(2, 1, 1, "Chef''s Knife", "It works.", "nobsc-chefs-knife"),
(2, 1, 1, "Cutting Board", "It works.", "nobsc-cutting-board"),
(2, 1, 1, "Y Peeler", "It works.", "nobsc-y-peeler"),
(3, 1, 1, "Wooden Spoon", "It works.", "nobsc-wooden-spoon"),
(2, 1, 1, "Serated Knife", "It works.", "nobsc-serated-knife"),
(2, 1, 1, "Rubber Spatula", "It works.", "nobsc-rubber-spatula"),
(2, 1, 1, "Whisk", "It works.", "nobsc-whisk"),
(2, 1, 1, "Pepper Mill", "It works.", "nobsc-pepper-mill"),
(2, 1, 1, "Can Opener", "It works.", "nobsc-can-opener"),
(2, 1, 1, "Side Peeler", "It works.", "nobsc-side-peeler"),

(2, 1, 1, "Box Grater", "It works.", "nobsc-box-grater"),
(2, 1, 1, "Small Mixing Bowl", "It works.", "nobsc-small-mixing-bowl"),
(2, 1, 1, "Medium Mixing Bowl", "It works.", "nobsc-medium-mixing-bowl"),
(2, 1, 1, "Large Mixing Bowl", "It works.", "nobsc-large-mixing-bowl"),
(2, 1, 1, "Salad Spinner", "It works.", "nobsc-salad-spinner"),
(2, 1, 1, "Dry Measuring Cups", "It works.", "nobsc-dry-measuring-cups"),
(2, 1, 1, "Liquid Measuring Cups", "It works.", "nobsc-liquid-measuring-cups"),
(2, 1, 1, "Measuring Spoons", "It works.", "nobsc-measuring-spoons"),
(2, 1, 1, "Measuring Pitcher", "It works.", "nobsc-measuring-pitcher"),
(2, 1, 1, "Digital Scale", "It works.", "nobsc-digital-scale"),

(2, 1, 1, "Handheld Mixer", "It works.", "nobsc-handheld-mixer"),
(2, 1, 1, "Blender", "It works.", "nobsc-blender"),
(2, 1, 1, "Immersion Blender", "It works.", "nobsc-immersion-blender"),
(2, 1, 1, "Parchment Paper", "It works.", "nobsc-parchment-paper"),
(2, 1, 1, "Plastic Wrap", "It works.", "nobsc-plastic-wrap"),
(2, 1, 1, "Aluminum Foil", "It works.", "nobsc-aluminum-foil"),
(2, 1, 1, "Ceramic Stone", "It works.", "nobsc-ceramic-stone"),
(2, 1, 1, "Cheesecloth", "It works.", "nobsc-cheesecloth"),
(3, 1, 1, "Coffee Maker", "It works.", "nobsc-coffee-maker"),
(3, 1, 1, "Tea Pot", "It works.", "nobsc-tea-pot"),

(3, 1, 1, "Small Stainless Steel Skillet", "It works.", "nobsc-small-stainless-steel-skillet"),
(3, 1, 1, "Large Stainless Steel Skillet", "It works.", "nobsc-large-stainless-steel-skillet"),
(3, 1, 1, "Stainless Steel Lidded Saute Pan", "It works.", "nobsc-stainless-steel-lidded-saute-pan"),
(3, 1, 1, "Dutch Oven", "It works.", "nobsc-dutch-oven"),
(3, 1, 1, "Small Cast-Iron Skillet", "It works.", "nobsc-small-cast-iron-skillet"),
(3, 1, 1, "Large Cast-Iron Skillet", "It works.", "nobsc-large-cast-iron-skillet"),
(3, 1, 1, "Small Sauce Pan", "It works.", "nobsc-small-sauce-pan"),
(3, 1, 1, "Medium Sauce Pan", "It works.", "nobsc-medium-sauce-pan"),
(3, 1, 1, "Medium Stock Pot", "It works.", "nobsc-medium-stock-pot"),
(3, 1, 1, "Large Stock Pot", "It works.", "nobsc-large-stock-pot"),

(3, 1, 1, "Glass Baking Dish", "It works.", "nobsc-glass-baking-dish"),
(3, 1, 1, "Sturdy Baking Sheet", "It works.", "nobsc-sturdy-baking-dish"),
(3, 1, 1, "Small Gratin Dish", "It works.", "nobsc-small-gratin-dish"),
(3, 1, 1, "Large Gratin Dish", "It works.", "nobsc-large-gratin-dish"),
(3, 1, 1, "Oven Mitts", "It works.", "nobsc-oven-mitts"),
(3, 1, 1, "Splatter Screen", "It works.", "nobsc-splatter-screen"),
(3, 1, 1, "Colander", "It works.", "nobsc-colander"),
(3, 1, 1, "Mesh Strainer", "It works.", "nobsc-mesh-strainer"),
(3, 1, 1, "Tongs", "It works.", "nobsc-tongs"),
(3, 1, 1, "Slotted Spoon", "It works.", "nobsc-slotted-spoon"),

(3, 1, 1, "Serving Spoon", "It works.", "nobsc-serving-spoon"),
(3, 1, 1, "Spider", "It works.", "nobsc-spider"),
(3, 1, 1, "Sturdy Spatula", "It works.", "nobsc-sturdy-spatula"),
(3, 1, 1, "Fish Spatula", "It works.", "nobsc-fish-spatula"),
(3, 1, 1, "Ladle", "It works.", "nobsc-ladle");

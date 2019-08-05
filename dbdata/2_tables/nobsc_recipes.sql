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
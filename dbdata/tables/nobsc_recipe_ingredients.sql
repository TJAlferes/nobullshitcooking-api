CREATE TABLE `nobsc_recipe_ingredients` (
  `recipe_id` int(10) unsigned NOT NULL DEFAULT '0',
  `ingredient_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `amount` decimal(5,2) unsigned NOT NULL,
  `measurement_id` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `nobsc_ingredients` (`ingredient_id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `nobsc_measurements` (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
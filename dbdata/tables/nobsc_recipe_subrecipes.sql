CREATE TABLE `nobsc_recipe_subrecipes` (
  `recipe_id` int(10) unsigned NOT NULL,
  `subrecipe_id` int(10) unsigned NOT NULL,
  `amount` decimal(5,2) unsigned NOT NULL,
  `measurement_id` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`subrecipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `nobsc_measurements` (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
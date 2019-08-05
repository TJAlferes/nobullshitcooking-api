CREATE TABLE `nobsc_recipe_methods` (
  `recipe_id` int(10) unsigned NOT NULL,
  `method_id` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`method_id`) REFERENCES `nobsc_methods` (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
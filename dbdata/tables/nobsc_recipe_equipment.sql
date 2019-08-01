CREATE TABLE `nobsc_recipe_equipment` (
  `recipe_id` int(10) unsigned NOT NULL,
  `equipment_id` smallint(5) unsigned NOT NULL,
  `amount` tinyint(3) unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `nobsc_equipment` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
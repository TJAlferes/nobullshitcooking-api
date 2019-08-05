CREATE TABLE `nobsc_recipe_types` (
  `recipe_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `recipe_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`recipe_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
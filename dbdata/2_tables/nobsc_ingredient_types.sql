CREATE TABLE `nobsc_ingredient_types` (
  `ingredient_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `ingredient_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ingredient_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
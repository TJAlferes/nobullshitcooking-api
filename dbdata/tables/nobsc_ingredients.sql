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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
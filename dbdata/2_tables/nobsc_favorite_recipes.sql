CREATE TABLE `nobsc_favorite_recipes` (
  `user_id` int(10) unsigned NOT NULL,
  `recipe_id` int(10) unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
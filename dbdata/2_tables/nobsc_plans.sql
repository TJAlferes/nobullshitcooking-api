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
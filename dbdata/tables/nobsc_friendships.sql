CREATE TABLE `nobsc_friendships` (
  `user_id` int(10) unsigned NOT NULL,
  `friend_id` int(10) unsigned NOT NULL,
  `status` varchar(8) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`friend_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
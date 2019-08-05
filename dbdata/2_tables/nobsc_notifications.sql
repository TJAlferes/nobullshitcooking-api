CREATE TABLE `nobsc_notifications` (
  `notification_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) unsigned NOT NULL,
  `receiver_id` int(10) unsigned NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `type` varchar(45) NOT NULL,
  `note` varchar(255) NOT NULL,
  `created_on` date NOT NULL,
  PRIMARY KEY (`notification_id`),
  FOREIGN KEY (`sender_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
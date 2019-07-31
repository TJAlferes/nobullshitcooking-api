CREATE TABLE `nobsc_users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `username` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-user-default',
  `confirmation_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
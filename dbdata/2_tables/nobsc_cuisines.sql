CREATE TABLE `nobsc_cuisines` (
  `cuisine_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cuisine_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`cuisine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `nobsc_measurements` (
  `measurement_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `measurement_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
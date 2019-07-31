CREATE TABLE `nobsc_equipment` (
  `equipment_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `equipment_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `author_id` int(10) unsigned NOT NULL,
  `owner_id` int(10) unsigned NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `equipment_description` text NOT NULL,
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-equipment-default',
  PRIMARY KEY (`equipment_id`),
  FOREIGN KEY (`equipment_type_id`) REFERENCES `nobsc_equipment_types` (`equipment_type_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
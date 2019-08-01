CREATE TABLE `nobsc_equipment_types` (
  `equipment_type_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `equipment_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`equipment_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `nobsc_staff` (
  `staff_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `staffname` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-staff-default',
  `role` varchar(20) NOT NULL DEFAULT 'staff',
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
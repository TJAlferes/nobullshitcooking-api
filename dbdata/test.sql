\W

USE nobsc;

CREATE TABLE `nobsc_content` (
  `content_id` int unsigned NOT NULL AUTO_INCREMENT,
  `content_type_id` smallint unsigned NOT NULL,
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `created` date NOT NULL,
  `published` date,
  `content_items` json DEFAULT NULL,
  PRIMARY KEY (`content_id`),
  FOREIGN KEY (`content_type_id`) REFERENCES `nobsc_content_types` (`content_type_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_content_types` (
  `content_type_id` smallint unsigned NOT NULL DEFAULT '0',
  `parent_id` smallint unsigned NOT NULL DEFAULT '0',
  `content_type_name` varchar(60) UNIQUE NOT NULL,
  `content_type_path` varchar(255) UNIQUE NOT NULL,
  PRIMARY KEY (`content_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_cuisines` (
  `cuisine_id` tinyint unsigned NOT NULL DEFAULT '0',
  `cuisine_name` varchar(40) NOT NULL DEFAULT '',
  `cuisine_nation` varchar(40) UNIQUE NOT NULL,
  `cuisine_wiki` varchar(60) NOT NULL DEFAULT '',
  `cuisine_intro` text NOT NULL,
  PRIMARY KEY (`cuisine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_cuisine_equipment` (
  `cuisine_id` tinyint unsigned NOT NULL,
  `equipment_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`cuisine_id`) REFERENCES `nobsc_cuisines` (`cuisine_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `nobsc_equipment` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_cuisine_ingredients` (
  `cuisine_id` tinyint unsigned NOT NULL,
  `ingredient_id` smallint unsigned NOT NULL DEFAULT '0',
  FOREIGN KEY (`cuisine_id`) REFERENCES `nobsc_cuisines` (`cuisine_id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `nobsc_ingredients` (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_cuisine_suppliers` (
  `cuisine_id` tinyint unsigned NOT NULL,
  `supplier_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`cuisine_id`) REFERENCES `nobsc_cuisines` (`cuisine_id`),
  FOREIGN KEY (`supplier_id`) REFERENCES `nobsc_suppliers` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_equipment` (
  `equipment_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `equipment_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `equipment_description` text NOT NULL DEFAULT 'It works.',
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-equipment-default',
  PRIMARY KEY (`equipment_id`),
  FOREIGN KEY (`equipment_type_id`) REFERENCES `nobsc_equipment_types` (`equipment_type_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_equipment_types` (
  `equipment_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `equipment_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`equipment_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_favorite_recipes` (
  `user_id` int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_friendships` (
  `user_id` int unsigned NOT NULL,
  `friend_id` int unsigned NOT NULL,
  `status` varchar(20) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`friend_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_ingredients` (
  `ingredient_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `ingredient_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `ingredient_brand` varchar(100),
  `ingredient_variety` varchar(100),
  `ingredient_name` varchar(100) NOT NULL,
  `ingredient_alt_names` json DEFAULT NULL,
  `ingredient_description` text NOT NULL DEFAULT 'Tasty.',
  `ingredient_image` varchar(100) NOT NULL DEFAULT 'nobsc-ingredient-default',
  PRIMARY KEY (`ingredient_id`),
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `nobsc_ingredient_types` (`ingredient_type_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_ingredient_types` (
  `ingredient_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `ingredient_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ingredient_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_measurements` (
  `measurement_id` tinyint unsigned NOT NULL DEFAULT '0',
  `measurement_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_methods` (
  `method_id` tinyint unsigned NOT NULL DEFAULT '0',
  `method_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_notifications` (
  `notification_id` int unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int unsigned NOT NULL,
  `receiver_id` int unsigned NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `type` varchar(45) NOT NULL,
  `note` varchar(255) NOT NULL,
  `created_on` date NOT NULL,
  PRIMARY KEY (`notification_id`),
  FOREIGN KEY (`sender_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_plans` (
  `plan_id` int unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `plan_name` varchar(100) NOT NULL DEFAULT '',
  `plan_data` json DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipes` (
  `recipe_id` int unsigned NOT NULL AUTO_INCREMENT,
  `recipe_type_id` tinyint unsigned NOT NULL,
  `cuisine_id` tinyint unsigned NOT NULL,
  `author_id` int unsigned NOT NULL,
  `owner_id` int unsigned NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(150) NOT NULL DEFAULT '',
  `directions` text NOT NULL,
  `recipe_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-default',
  `equipment_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-equipment-default',
  `ingredients_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-ingredients-default',
  `cooking_image` varchar(100) NOT NULL DEFAULT 'nobsc-recipe-cooking-default',
  PRIMARY KEY (`recipe_id`),
  FOREIGN KEY (`recipe_type_id`) REFERENCES `nobsc_recipe_types` (`recipe_type_id`),
  FOREIGN KEY (`cuisine_id`) REFERENCES `nobsc_cuisines` (`cuisine_id`),
  FOREIGN KEY (`author_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`owner_id`) REFERENCES `nobsc_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_equipment` (
  `recipe_id` int unsigned NOT NULL,
  `equipment_id` smallint unsigned NOT NULL,
  `amount` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `nobsc_equipment` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_ingredients` (
  `recipe_id` int unsigned NOT NULL DEFAULT '0',
  `ingredient_id` smallint unsigned NOT NULL DEFAULT '0',
  `amount` decimal(5,2) NOT NULL,
  `measurement_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `nobsc_ingredients` (`ingredient_id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `nobsc_measurements` (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_methods` (
  `recipe_id` int unsigned NOT NULL,
  `method_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`method_id`) REFERENCES `nobsc_methods` (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_subrecipes` (
  `recipe_id` int unsigned NOT NULL,
  `subrecipe_id` int unsigned NOT NULL,
  `amount` decimal(5,2) NOT NULL,
  `measurement_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`subrecipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `nobsc_measurements` (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_recipe_types` (
  `recipe_type_id` tinyint unsigned NOT NULL DEFAULT '0',
  `recipe_type_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`recipe_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_saved_recipes` (
  `user_id` int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `nobsc_users` (`user_id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `nobsc_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_staff` (
  `staff_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `staffname` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-staff-default',
  `role` varchar(20) NOT NULL DEFAULT 'staff',
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_suppliers` (
  `supplier_id` smallint unsigned NOT NULL DEFAULT '0',
  `supplier_name` varchar(60) UNIQUE NOT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `nobsc_users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) UNIQUE NOT NULL,
  `pass` char(60) NOT NULL,
  `username` varchar(20) UNIQUE NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'nobsc-user-default',
  `confirmation_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO nobsc_content
(content_id, content_type_id, author_id, owner_id, created, published, content_items)
VALUES
(1, 2, 1, 1, "4-14-2020", NULL, "[]")

INSERT INTO nobsc_content_types
(content_type_id, parent_id, content_type_name, content_type_path)
VALUES
(1, 0, "Page", "/page"),
(2, 0, "Post", "/post"),
(3, 1, "Guide", "/page/guide"),
(4, 1, "Promo", "/page/promo"),
(5, 1, "Site", "/page/site"),
(6, 3, "Fitness", "/page/guide/fitness"),
(7, 3, "Food", "/page/guide/food"),
(8, 6, "Exercises", "/page/guide/fitness/exercises"),
(9, 6, "Principles", "/page/guide/fitness/principles"),
(10, 7, "Recipes", "/page/guide/food/recipes"),
(11, 7, "Cuisines", "/page/guide/food/cuisines"),
(12, 7, "Ingredients", "page/guide/food/ingredients"),
(13, 7, "Nutrition", "/page/guide/food/nutrition"),
(14, 7, "Equipment", "/page/guide/food/equipment"),
(15, 7, "Methods", "/page/guide/food/methods");

INSERT INTO nobsc_cuisines
(cuisine_id, cuisine_name, cuisine_nation, cuisine_wiki, cuisine_intro)
VALUES
(1, "Afghan", "Afghanistan", "Afghan_cuisine", ""),
(2, "Albanian", "Albania", "Albanian_cuisine", ""),
(3, "Algerian", "Algeria", "Algerian_cuisine", ""),
(4, "Catalan", "Andorra", "Catalan_cuisine", ""),
(5, "Angolan", "Angola", "Angolan_cuisine", ""),
(6, "Antigua and Barbuda", "Antigua and Barbuda", "Antigua_and_Barbuda_cuisine", ""),
(7, "Argentine", "Argentina", "Argentine_cuisine", ""),
(8, "Armenian", "Armenia", "Armenian_cuisine", ""),
(9, "Australian", "Australia", "Australian_cuisine", ""),
(10, "Austrian", "Austria", "Austrian_cuisine", ""),

(11, "Azerbaijani", "Azerbaijan", "Azerbaijani_cuisine", ""),
(12, "Bahamian", "Bahamas", "Bahamian_cuisine", ""),
(13, "Bahraini", "Bahrain", "Bahraini_cuisine", ""),
(14, "Bangladeshi", "Bangladesh", "Bangladeshi_cuisine", ""),
(15, "Bajan", "Barbados", "Barbadian_cuisine", ""),
(16, "Belarusian", "Belarus", "Belarusian_cuisine", ""),
(17, "Belgian", "Belgium", "Belgian_cuisine", ""),
(18, "Belizean", "Belize", "Belizean_cuisine", ""),
(19, "Benin", "Benin", "Benin_cuisine", ""),
(20, "Bhutanese", "Bhutan", "Bhutanese_cuisine", ""),

(21, "Bolivian", "Bolivia", "Bolivian_cuisine", ""),
(22, "Bosnia and Herzegovina", "Bosnia and Herzegovina", "Bosnia_and_Herzegovina_cuisine", ""),
(23, "Botswana", "Botswana", "Botswana_cuisine", ""),
(24, "Brazilian", "Brazil", "Brazilian_cuisine", ""),
(25, "Bruneian", "Brunei", "Bruneian_cuisine", ""),
(26, "Bulgarian", "Bulgaria", "Bulgarian_cuisine", ""),
(27, "Burkinabe", "Burkina Faso", "Burkinabe_cuisine", ""),
(28, "Burundian", "Burundi", "Burundian_cuisine", ""),
(29, "Ivorian", "Côte d'Ivoire", "Ivorian_cuisine", ""),
(30, "Cape Verdean", "Cabo Verde", "Cape_Verdean_cuisine", ""),

(31, "Cambodian", "Cambodia", "Cambodian_cuisine", ""),
(32, "Cameroonian", "Cameroon", "Cameroonian_cuisine", ""),
(33, "Canadian", "Canada", "Canadian_cuisine", ""),
(34, "Central African Republic", "Central African Republic", "Cuisine_of_the_Central_African_Republic", ""),
(35, "Chadian", "Chad", "Chadian_cuisine", ""),
(36, "Chilean", "Chile", "Chilean_cuisine", ""),
(37, "Chinese", "China", "Chinese_cuisine", ""),
(38, "Colombian", "Colombia", "Colombian_cuisine", ""),
(39, "NA", "Comoros", "NA", ""),
(40, "Congolese", "Congo, Democratic Republic of the", "Congolese_cuisine", ""),

(41, "Congolese", "Congo, Republic of the", "Congolese_cuisine", ""),
(42, "Costa Rican", "Costa Rica", "Costa_Rican_cuisine", ""),
(43, "Croatian", "Croatia", "Croatian_cuisine", ""),
(44, "Cuban", "Cuba", "Cuban_cuisine", ""),
(45, "Cypriot", "Cyprus", "Cypriot_cuisine", ""),
(46, "Czech", "Czechia", "Czech_cuisine", ""),
(47, "Danish", "Denmark", "Danish_cuisine", ""),
(48, "Djiboutian", "Djibouti", "Djiboutian_cuisine", ""),
(49, "Dominica", "Dominica", "Dominica_cuisine", ""),
(50, "Dominican Republic", "Dominican Republic", "Dominican_Republic_cuisine", ""),

(51, "Ecuadorian", "Ecuador", "Ecuadorian_cuisine", ""),
(52, "Egyptian", "Egypt", "Egyptian_cuisine", ""),
(53, "Salvadoran", "El Salvador", "Salvadoran_cuisine", ""),
(54, "Equatorial Guinea", "Equatorial Guinea", "Cuisine_of_Equatorial_Guinea", ""),
(55, "Eritrean", "Eritrea", "Eritrean_cuisine", ""),
(56, "Estonian", "Estonia", "Estonian_cuisine", ""),
(57, "Eswatini", "Eswatini", "Cuisine_of_Eswatini", ""),
(58, "Ethiopian", "Ethiopia", "Ethiopian_cuisine", ""),
(59, "Fijian", "Fiji", "Fijian_cuisine", ""),
(60, "Finnish", "Finland", "Finnish_cuisine", ""),

(61, "French", "France", "French_cuisine", ""),
(62, "Gabonese", "Gabon", "Gabonese_cuisine", ""),
(63, "Gambian", "Gambia", "Gambian_cuisine", ""),
(64, "Georgian", "Georgia", "Georgian_cuisine", ""),
(65, "German", "Germany", "German_cuisine", ""),
(66, "Ghanaian", "Ghana", "Ghanaian_cuisine", ""),
(67, "Greek", "Greece", "Greek_cuisine", ""),
(68, "Grenada", "Grenada", "Grenada", ""),
(69, "Guatemalan", "Guatemala", "Guatemalan_cuisine", ""),
(70, "Guinea", "Guinea", "Cuisine_of_Guinea", ""),

(71, "Guinea-Bissauan", "Guinea-Bissau", "Guinea-Bissauan_cuisine", ""),
(72, "Guyanese", "Guyana", "Culture_of_Guyana#Cuisine", ""),
(73, "Haitian", "Haiti", "Haitian_cuisine", ""),
(74, "Honduran", "Honduras", "Honduran_cuisine", ""),
(75, "Hungarian", "Hungary", "Hungarian_cuisine", ""),
(76, "Icelandic", "Iceland", "Icelandic_cuisine", ""),
(77, "Indian", "India", "Indian_cuisine", ""),
(78, "Indonesian", "Indonesia", "Indonesian_cuisine", ""),
(79, "Iranian", "Iran", "Iranian_cuisine", ""),
(80, "Iraqi", "Iraq", "Iraqi_cuisine", ""),

(81, "Irish", "Ireland", "Irish_cuisine", ""),
(82, "Israeli", "Israel", "Israeli_cuisine", ""),
(83, "Italian", "Italy", "Italian_cuisine", ""),
(84, "Jamaican", "Jamaica", "Jamaican_cuisine", ""),
(85, "Japanese", "Japan", "Japanese_cuisine", ""),
(86, "Jordanian", "Jordan", "Jordanian_cuisine", ""),
(87, "Kazakh", "Kazakhstan", "Kazakh_cuisine", ""),
(88, "Kenyan", "Kenya", "Culture_of_Kenya#Cuisine", ""),
(89, "Kiribati", "Kiribati", "Kiribati", ""),
(90, "Kosovan", "Kosovo", "Kosovan_cuisine", ""),

(91, "Kuwaiti", "Kuwait", "Kuwaiti_cuisine", ""),
(92, "Kyrgyz", "Kyrgyzstan", "Kyrgyz_cuisine", ""),
(93, "Lao", "Laos", "Lao_cuisine", ""),
(94, "Latvian", "Latvia", "Latvian_cuisine", ""),
(95, "Lebanese", "Lebanon", "Lebanese_cuisine", ""),
(96, "Basotho", "Lesotho", "Cuisine_of_Lesotho", ""),
(97, "Liberian", "Liberia", "Liberian_cuisine", ""),
(98, "Libyan", "Libya", "Libyan_cuisine", ""),
(99, "Liechtensteiner", "Liechtenstein", "Liechtenstein_cuisine", ""),
(100, "Lithuanian", "Lithuania", "Lithuanian_cuisine", ""),

(101, "Luxembourg", "Luxembourg", "Luxembourg%27s_cuisine", ""),
(102, "Malagasy", "Madagascar", "Malagasy_cuisine", ""),
(103, "Malawian", "Malawi", "Malawian_cuisine", ""),
(104, "Malaysian", "Malaysia", "Malaysian_cuisine", ""),
(105, "Maldivian", "Maldives", "Maldivian_cuisine", ""),
(106, "Malian", "Mali", "Malian_cuisine", ""),
(107, "Maltese", "Malta", "Maltese_cuisine", ""),
(108, "NA", "Marshall Islands", "NA", ""),
(109, "Mauritanian", "Mauritania", "Mauritanian_cuisine", ""),
(110, "Mauritius", "Mauritius", "Cuisine_of_Mauritius", ""),

(111, "Mexican", "Mexico", "Mexican_cuisine", ""),
(112, "NA", "Micronesia", "NA", ""),
(113, "Moldovan", "Moldova", "Moldovan_cuisine", ""),
(114, "Monégasque", "Monaco", "Monégasque_cuisine", ""),
(115, "Mongolian", "Mongolia", "Mongolian_cuisine", ""),
(116, "Montenegrin", "Montenegro", "Montenegrin_cuisine", ""),
(117, "Moroccan", "Morocco", "Moroccan_cuisine", ""),
(118, "Mozambique", "Mozambique", "Cuisine_of_Mozambique", ""),
(119, "Burmese", "Myanmar", "Burmese_cuisine", ""),
(120, "Namibian", "Namibia", "Namibian_cuisine", ""),

(121, "NA", "Nauru", "NA", ""),
(122, "Nepalese", "Nepal", "Nepalese_cuisine", ""),
(123, "Dutch", "Netherlands", "Dutch_cuisine", ""),
(124, "New Zealand", "New Zealand", "New_Zealand_cuisine", ""),
(125, "Nicaraguan", "Nicaragua", "Nicaraguan_cuisine", ""),
(126, "Niger", "Niger", "Cuisine_of_Niger", ""),
(127, "Nigerian", "Nigeria", "Nigerian_cuisine", ""),
(128, "North Korean", "North Korea", "North_Korean_cuisine", ""),
(129, "Macedonian", "North Macedonia", "Macedonian_cuisine", ""),
(130, "Norwegian", "Norway", "Norwegian_cuisine", ""),

(131, "Omani", "Oman", "Omani_cuisine", ""),
(132, "Pakistani", "Pakistan", "Pakistani_cuisine", ""),
(133, "Palauan", "Palau", "Palau#Cuisine", ""),
(134, "Palestinian", "Palestine", "Palestinian_cuisine", ""),
(135, "Panamanian", "Panama", "Panamanian_cuisine", ""),
(136, "Papua New Guinean", "Papua New Guinea", "Papua_New_Guinean_cuisine", ""),
(137, "Paraguayan", "Paraguay", "Paraguayan_cuisine", ""),
(138, "Peruvian", "Peru", "Peruvian_cuisine", ""),
(139, "Filipino", "Philippines", "Filipino_cuisine", ""),
(140, "Polish", "Poland", "Polish_cuisine", ""),

(141, "Portuguese", "Portugal", "Portuguese_cuisine", ""),
(142, "Qatari", "Qatar", "Qatari_cuisine", ""),
(143, "Romanian", "Romania", "Romanian_cuisine", ""),
(144, "Russian", "Russia", "Russian_cuisine", ""),
(145, "Rwandan", "Rwanda", "Rwandan_cuisine", ""),
(146, "NA", "Saint Kitts and Nevis", "NA", ""),
(147, "Saint Lucian", "Saint Lucia", "Saint_Lucian_cuisine", ""),
(148, "NA", "Saint Vincent and the Grenadines", "NA", ""),
(149, "Samoan", "Samoa", "NA", ""),
(150, "Sammarinese", "San Marino", "Sammarinese_cuisine", ""),

(151, "Sao Tome and Principe", "Sao Tome and Principe", "Cuisine_of_São_Tomé_and_Príncipe", ""),
(152, "Saudi Arabian", "Saudi Arabia", "Saudi_Arabian_cuisine", ""),
(153, "Senegalese", "Senegal", "Senegalese_cuisine", ""),
(154, "Serbian", "Serbia", "Serbian_cuisine", ""),
(155, "Seychellois", "Seychelles", "Seychellois_cuisine", ""),
(156, "Sierra Leonean", "Sierra Leone", "Sierra_Leonean_cuisine", ""),
(157, "Singaporean", "Singapore", "Singaporean_cuisine", ""),
(158, "Slovak", "Slovakia", "Slovak_cuisine", ""),
(159, "Slovenian", "Slovenia", "Slovenian_cuisine", ""),
(160, "NA", "Solomon Islands", "NA", ""),

(161, "Somali", "Somalia", "Somali_cuisine", ""),
(162, "South African", "South Africa", "South_African_cuisine", ""),
(163, "South Korean", "South Korea", "Korean_cuisine", ""),
(164, "South African", "South Sudan", "South_African_cuisine", ""),
(165, "Spanish", "Spain", "Spanish_cuisine", ""),
(166, "Sri Lankan", "Sri Lanka", "Sri_Lankan_cuisine", ""),
(167, "Sudanese", "Sudan", "Sudanese_cuisine", ""),
(168, "Surinamese", "Suriname", "Culture_of_Suriname#Cuisine", ""),
(169, "Swedish", "Sweden", "Swedish_cuisine", ""),
(170, "Swiss", "Switzerland", "Swiss_cuisine", ""),

(171, "Syrian", "Syria", "Syrian_cuisine", ""),
(172, "Taiwanese", "Taiwan", "Taiwanese_cuisine", ""),
(173, "Tajik", "Tajikistan", "Tajik_cuisine", ""),
(174, "Tanzanian", "Tanzania", "Culture_of_Tanzania#Cuisine", ""),
(175, "Thai", "Thailand", "Thai_cuisine", ""),
(176, "Timorese", "Timor-Leste", "East_Timor", ""),
(177, "Togolese", "Togo", "Togolese_cuisine", ""),
(178, "Tongan", "Tonga", "Culture_of_Tonga#Cuisine", ""),
(179, "Trinidad and Tobago", "Trinidad and Tobago", "Trinidad_and_Tobago_cuisine", ""),
(180, "Tunisian", "Tunisia", "Tunisian_cuisine", ""),

(181, "Turkish", "Turkey", "Turkish_cuisine", ""),
(182, "Turkmen", "Turkmenistan", "Turkmen_cuisine", ""),
(183, "Tuvaluan", "Tuvalu", "Cuisine_of_Tuvalu", ""),
(184, "Ugandan", "Uganda", "Ugandan_cuisine", ""),
(185, "Ukrainian", "Ukraine", "Ukrainian_cuisine", ""),
(186, "Emirati", "United Arab Emirates", "Emirati_cuisine", ""),
(187, "British", "United Kingdom", "British_cuisine", ""),
(188, "American", "United States of America", "American_cuisine", ""),
(189, "Uruguayan", "Uruguay", "Uruguayan_cuisine", ""),
(190, "Uzbek", "Uzbekistan", "Uzbek_cuisine", ""),

(191, "Vanuatuan", "Vanuatu", "Vanuatuan_cuisine", ""),
(192, "Venezuelan", "Venezuala", "Venezuelan_cuisine", ""),
(193, "Vietnamese", "Vietnam", "Vietnamese_cuisine", ""),
(194, "Yemeni", "Yemen", "Yemeni_cuisine", ""),
(195, "Zambian", "Zambia", "Zambian_cuisine", ""),
(196, "Zimbabwean", "Zimbabwe", "Zimbabwe#Cuisine", "");
--(197, "NA") ?

INSERT INTO nobsc_equipment
(equipment_type_id, author_id, owner_id, equipment_name, equipment_image)
VALUES
(2, 1, 1, "Chef\'s Knife", "nobsc-chefs-knife"),
(2, 1, 1, "Cutting Board", "nobsc-cutting-board"),
(2, 1, 1, "Y Peeler", "nobsc-y-peeler"),
(3, 1, 1, "Wooden Spoon", "nobsc-wooden-spoon"),
(2, 1, 1, "Serated Knife", "nobsc-serated-knife"),
(2, 1, 1, "Rubber Spatula", "nobsc-rubber-spatula"),
(2, 1, 1, "Whisk", "nobsc-whisk"),
(2, 1, 1, "Pepper Mill", "nobsc-pepper-mill"),
(2, 1, 1, "Can Opener", "nobsc-can-opener"),
(2, 1, 1, "Side Peeler", "nobsc-side-peeler"),

(2, 1, 1, "Box Grater", "nobsc-box-grater"),
(2, 1, 1, "Small Mixing Bowl", "nobsc-small-mixing-bowl"),
(2, 1, 1, "Medium Mixing Bowl", "nobsc-medium-mixing-bowl"),
(2, 1, 1, "Large Mixing Bowl", "nobsc-large-mixing-bowl"),
(2, 1, 1, "Salad Spinner", "nobsc-salad-spinner"),
(2, 1, 1, "Dry Measuring Cups", "nobsc-dry-measuring-cups"),
(2, 1, 1, "Liquid Measuring Cups", "nobsc-liquid-measuring-cups"),
(2, 1, 1, "Measuring Spoons", "nobsc-measuring-spoons"),
(2, 1, 1, "Measuring Pitcher", "nobsc-measuring-pitcher"),
(2, 1, 1, "Digital Scale", "nobsc-digital-scale"),

(2, 1, 1, "Handheld Mixer", "nobsc-handheld-mixer"),
(2, 1, 1, "Blender", "nobsc-blender"),
(2, 1, 1, "Immersion Blender", "nobsc-immersion-blender"),
(2, 1, 1, "Parchment Paper", "nobsc-parchment-paper"),
(2, 1, 1, "Plastic Wrap", "nobsc-plastic-wrap"),
(2, 1, 1, "Aluminum Foil", "nobsc-aluminum-foil"),
(2, 1, 1, "Ceramic Stone", "nobsc-ceramic-stone"),
(2, 1, 1, "Cheesecloth", "nobsc-cheesecloth"),
(3, 1, 1, "Coffee Maker", "nobsc-coffee-maker"),
(3, 1, 1, "Tea Pot", "nobsc-tea-pot"),

(3, 1, 1, "Small Stainless Steel Skillet", "nobsc-small-stainless-steel-skillet"),
(3, 1, 1, "Large Stainless Steel Skillet", "nobsc-large-stainless-steel-skillet"),
(3, 1, 1, "Stainless Steel Lidded Saute Pan", "nobsc-stainless-steel-lidded-saute-pan"),
(3, 1, 1, "Dutch Oven", "nobsc-dutch-oven"),
(3, 1, 1, "Small Cast-Iron Skillet", "nobsc-small-cast-iron-skillet"),
(3, 1, 1, "Large Cast-Iron Skillet", "nobsc-large-cast-iron-skillet"),
(3, 1, 1, "Small Sauce Pan", "nobsc-small-sauce-pan"),
(3, 1, 1, "Medium Sauce Pan", "nobsc-medium-sauce-pan"),
(3, 1, 1, "Medium Stock Pot", "nobsc-medium-stock-pot"),
(3, 1, 1, "Large Stock Pot", "nobsc-large-stock-pot"),

(3, 1, 1, "Glass Baking Dish", "nobsc-glass-baking-dish"),
(3, 1, 1, "Sturdy Baking Sheet", "nobsc-sturdy-baking-dish"),
(3, 1, 1, "Small Gratin Dish", "nobsc-small-gratin-dish"),
(3, 1, 1, "Large Gratin Dish", "nobsc-large-gratin-dish"),
(3, 1, 1, "Oven Mitts", "nobsc-oven-mitts"),
(3, 1, 1, "Splatter Screen", "nobsc-splatter-screen"),
(3, 1, 1, "Colander", "nobsc-colander"),
(3, 1, 1, "Mesh Strainer", "nobsc-mesh-strainer"),
(3, 1, 1, "Tongs", "nobsc-tongs"),
(3, 1, 1, "Slotted Spoon", "nobsc-slotted-spoon"),

(3, 1, 1, "Serving Spoon", "nobsc-serving-spoon"),
(3, 1, 1, "Spider", "nobsc-spider"),
(3, 1, 1, "Sturdy Spatula", "nobsc-sturdy-spatula"),
(3, 1, 1, "Fish Spatula", "nobsc-fish-spatula"),
(3, 1, 1, "Ladle", "nobsc-ladle");

INSERT INTO nobsc_equipment_types
(equipment_type_id, equipment_type_name)
VALUES
(1, "Cleaning"),
(2, "Preparing"),
(3, "Cooking"),
(4, "Dining"),
(5, "Storage");

INSERT INTO nobsc_ingredients
(ingredient_type_id, author_id, owner_id, ingredient_variety, ingredient_name, ingredient_image)
VALUES
(3, 1, 1, NULL,               "Chuck Seven Bone Roast",                   "nobsc-chuck-7-bone-roast"),
(3, 1, 1, NULL,               "Chuck Seven Bone Steak",                   "nobsc-chuck-7-bone-steak"),
(3, 1, 1, NULL,               "Chuck Arm Roast",                          "nobsc-chuck-arm-roast"),
(3, 1, 1, "Boneless",         "Chuck Arm Roast",                          "nobsc-chuck-arm-rost-boneless"),
(3, 1, 1, NULL,               "Chuck Arm Steak",                          "nobsc-chuck-arm-steak"),
(3, 1, 1, "Boneless",         "Chuck Arm Steak",                          "nobsc-chuck-arm-steak-boneless"),
(3, 1, 1, NULL,               "Chuck Blade Roast",                        "nobsc-chuck-blade-roast"),
(3, 1, 1, NULL,               "Chuck Blade Steak",                        "nobsc-chuck-blade-steak"),
(3, 1, 1, "Boneless",         "Chuck Blade Steak",                        "nobsc-chuck-blade-steak-boneless"),
(3, 1, 1, "Cap Off",          "Chuck Blade Steak",                        "nobsc-chuck-blade-steak-cap-off"),
(3, 1, 1, NULL,               "Chuck Cross Rib Roast",                    "nobsc-chuck-cross-rib-roast"),
(3, 1, 1, "Boneless",         "Chuck Cross Rib Roast",                    "nobsc-chuck-cross-rib-roast-boneless"),
(3, 1, 1, NULL,               "Chuck Eye Edge Roast",                     "nobsc-chuck-eye-edge-roast"),
(3, 1, 1, "Boneless",         "Chuck Eye Roast",                          "nobsc-chuck-eye-roast-steak"),
(3, 1, 1, "Boneless",         "Chuck Eye Steak",                          "nobsc-chuck-eye-steak-boneless"),
(3, 1, 1, NULL,               "Chuck Flanken Style Ribs",                 "nobsc-chuck-flanken-style-ribs"),
(3, 1, 1, "Boneless",         "Chuck Flanken Style Ribs",                 "nobsc-chuck-flanken-style-ribs-boneless"),
(3, 1, 1, NULL,               "Chuck Flat Ribs",                          "nobsc-chuck-flat-ribs"),
(3, 1, 1, NULL,               "Chuck Mock Tender Roast",                  "nobsc-chuck-mock-tender-roast"),
(3, 1, 1, NULL,               "Chuck Mock Tender Steak",                  "nobsc-chuck-mock-tender-steak"),
(3, 1, 1, NULL,               "Chuck Neck Roast",                         "nobsc-chuck-neck-roast"),
(3, 1, 1, "Boneless",         "Chuck Neck Roast",                         "nobsc-chuck-neck-roast-boneless"),
(3, 1, 1, "Boneless",         "Chuck Roast",                              "nobsc-chuck-roast-boneless"),
(3, 1, 1, NULL,               "Chuck Short Ribs",                         "nobsc-chuck-short-ribs"),
(3, 1, 1, "Boneless",         "Chuck Short Ribs",                         "nobsc-chuck-short-ribs-boneless"),
(3, 1, 1, NULL,               "Chuck Shoulder Center Steak Ranch Steak",  "nobsc-chuck-shoulder-center-steak-ranch-steak"),
(3, 1, 1, NULL,               "Chuck Shoulder Roast",                     "nobsc-chuck-shoulder-roast"),
(3, 1, 1, "Boneless",         "Chuck Shoulder Roast",                     "nobsc-chuck-shoulder-roast-boneless"),
(3, 1, 1, "Boneless",         "Chuck Shoulder Steak",                     "nobsc-chuck-shoulder-steak-boneless"),
(3, 1, 1, NULL,               "Chuck Shoulder Tender",                    "nobsc-chuck-shoulder-tender"),
(3, 1, 1, NULL,               "Chuck Shoulder Tender Medallions",         "nobsc-chuck-shoulder-tender-medallions"),
(3, 1, 1, "Boneless",         "Chuck Shoulder Top Blade Roast",           "nobsc-chuck-shoulder-top-blade-roast-boneless"),
(3, 1, 1, "Boneless",         "Chuck Shoulder Top Blade Steak",           "nobsc-chuck-shoulder-top-blade-steak-boneless"),
(3, 1, 1, NULL,               "Chuck Shoulder Top Blade Steak Flat Iron", "nobsc-chuck-shoulder-top-blade-steak-flat-iron"),
(3, 1, 1, NULL,               "Chuck Top Blade Roast",                    "nobsc-chuck-top-blade-roast"),
(3, 1, 1, "Bone In",          "Chuck Top Blade Steak",                    "nobsc-chuck-top-blade-steak-bone-in"),
(3, 1, 1, NULL,               "Chuck Under Blade Roast",                  "nobsc-chuck-under-blade-roast"),
(3, 1, 1, "Boneless",         "Chuck Under Blade Roast",                  "nobsc-chuck-under-blade-roast-boneless"),
(3, 1, 1, NULL,               "Chuck Under Blade Steak",                  "nobsc-chuck-under-blade-steak"),
(3, 1, 1, "Boneless",         "Chuck Under Blade Steak",                  "nobsc-chuck-under-blade-steak-boneless"),
(3, 1, 1, NULL,               "Round Bottom Round Roast",                 "nobsc-round-bottom-round-roast"),
(3, 1, 1, NULL,               "Round Bottom Round Roast Triangle Roast",  "nobsc-round-bottom-round-roast-triangle-roast"),
(3, 1, 1, NULL,               "Round Bottom Round Rump Roast",            "nobsc-round-bottom-round-rump-roast"),
(3, 1, 1, NULL,               "Round Bottom Round Steak",                 "nobsc-round-bottom-round-steak"),
(3, 1, 1, NULL,               "Round Bottom Round Steak Western Griller", "nobsc-round-bottom-round-steak-western-griller"),
(3, 1, 1, NULL,               "Round Eye Round Roast",                    "nobsc-round-eye-round-roast"),
(3, 1, 1, NULL,               "Round Eye Round Steak",                    "nobsc-round-eye-round-steak"),
(3, 1, 1, NULL,               "Round Heel of Round",                      "nobsc-round-heel-of-round"),
(3, 1, 1, NULL,               "Round Sirloin Tip Center Roast",           "nobsc-round-sirloin-tip-center-roast"),
(3, 1, 1, NULL,               "Round Sirloin Tip Center Steak",           "nobsc-round-sirloin-tip-center-steak"),
(3, 1, 1, NULL,               "Round Sirloin Tip Side Steak",             "nobsc-round-sirloin-tip-side-steak"),
(3, 1, 1, NULL,               "Round Steak",                              "nobsc-round-steak"),
(3, 1, 1, "Boneless",         "Round Steak",                              "nobsc-round-steak-boneless"),
(3, 1, 1, NULL,               "Round Tip Roast",                          "nobsc-round-tip-roast"),
(3, 1, 1, "Cap Off",          "Round Tip Roast",                          "nobsc-round-tip-roast-cap-off"),
(3, 1, 1, NULL,               "Round Tip Steak",                          "nobsc-round-tip-steak"),
(3, 1, 1, "Cap Off",          "Round Tip Steak",                          "nobsc-round-tip-steak-cap-off"),
(3, 1, 1, NULL,               "Round Top Round Roast",                    "nobsc-round-top-round-roast"),
(3, 1, 1, "Cap Off",          "Round Top Round Roast",                    "nobsc-round-top-round-roast-cap-off"),
(3, 1, 1, NULL,               "Round Top Round Steak",                    "nobsc-round-top-round-steak"),
(3, 1, 1, NULL,               "Round Top Round Steak Butterflied",        "nobsc-round-top-round-steak-butterflied"),
(3, 1, 1, NULL,               "Round Top Round Steak First Cut",          "nobsc-round-top-round-steak-first-cut"),
(3, 1, 1, NULL,               "Loin Ball Tip Roast",                      "nobsc-loin-ball-tip-roast"),
(3, 1, 1, NULL,               "Loin Ball Tip Steak",                      "nobsc-loin-ball-tip-steak"),
(3, 1, 1, NULL,               "Loin Flap Meat Steak",                     "nobsc-loin-flap-meat-steak"),
(3, 1, 1, NULL,               "Loin Porterhouse Steak",                   "nobsc-loin-porterhouse-steak"),
(3, 1, 1, NULL,               "Loin Shell Sirloin Steak",                 "nobsc-loin-shell-sirloin-steak"),
(3, 1, 1, NULL,               "Loin Sirloin Steak",                       "nobsc-loin-sirloin-steak"),
(3, 1, 1, NULL,               "Loin T Bone Steak",                        "nobsc-loin-t-bone-steak"),
(3, 1, 1, NULL,               "Loin Tenderloin Roast",                    "nobsc-loin-tenderloin-roast"),
(3, 1, 1, NULL,               "Loin Tenderloin Steak",                    "nobsc-loin-tenderloin-steak"),
(3, 1, 1, NULL,               "Loin Top Loin Roast",                      "nobsc-loin-top-loin-roast"),
(3, 1, 1, "Boneless",         "Loin Top Loin Roast",                      "nobsc-loin-top-loin-roast-boneless"),
(3, 1, 1, NULL,               "Loin Top Loin Steak",                      "nobsc-loin-top-loin-steak"),
(3, 1, 1, "Boneless",         "Loin Top Loin Steak",                      "nobsc-loin-top-loin-steak-boneless"),
(3, 1, 1, "Boneless",         "Loin Top Sirloin Roast",                   "nobsc-loin-top-sirloin-roast-boneless"),
(3, 1, 1, "Boneless Cap Off", "Loin Top Sirloin Roast",                   "nobsc-loin-top-sirloin-roast-boneless-cap-off"),
(3, 1, 1, "Boneless",         "Loin Top Sirloin Steak",                   "nobsc-loin-top-sirloin-steak-boneless"),
(3, 1, 1, "Boneless Cap Off", "Loin Top Sirloin Steak",                   "nobsc-loin-top-sirloin-steak-boneless-cap-off"),
(3, 1, 1, NULL,               "Loin Tri Tip Roast",                       "nobsc-loin-tri-tip-roast"),
(3, 1, 1, NULL,               "Loin Tri Tip Steak",                       "nobsc-loin-tri-tip-steak"),
(3, 1, 1, NULL,               "Shank Cross Cut",                          "nobsc-shank-cross-cut"),
(3, 1, 1, "Boneless",         "Shank Cross Cut",                          "nobsc-shank-cross-cut-boneless"),
(3, 1, 1, NULL,               "Plate Skirt Steak",                        "nobsc-plate-skirt-steak"),
(3, 1, 1, NULL,               "Flank Steak",                              "nobsc-flank-flank-steak"),
(3, 1, 1, NULL,               "Ground Beef",                              "nobsc-ground-beef"),
(3, 1, 1, NULL,               "Back Ribs",                                "nobsc-back-ribs"),
(3, 1, 1, "Boneless",         "Rib Cap Meat",                             "nobsc-rib-cap-meat-boneless"),
(3, 1, 1, NULL,               "Rib Extra Trim Roast Large End",           "nobsc-rib-extra-trim-roast-large-end"),
(3, 1, 1, NULL,               "Ribeye Roast",                             "nobsc-ribeye-roast"),
(3, 1, 1, "Lip On Bone In",   "Ribeye Roast",                             "nobsc-ribeye-roast-lip-on-bone-in"),
(3, 1, 1, "Lip On Boneless",  "Ribeye Roast",                             "nobsc-ribeye-roast-lip-on-boneless"),
(3, 1, 1, NULL,               "Ribeye Steak",                             "nobsc-ribeye-steak"),
(3, 1, 1, "Lip On Bone In",   "Ribeye Steak",                             "nobsc-ribeye-steak-lip-on-bone-in"),
(3, 1, 1, "Lip On Boneless",  "Ribeye Steak",                             "nobsc-ribeye-steak-lip-on-boneless"),
(3, 1, 1, NULL,               "Rib Roast Large End",                      "nobsc-rib-roast-large-end"),
(3, 1, 1, "Boneless",         "Rib Roast Large End",                      "nobsc-rib-roast-large-end-boneless"),
(3, 1, 1, NULL,               "Rib Roast Small End",                      "nobsc-rib-roast-small-end"),
(3, 1, 1, "Boneless",         "Rib Roast Small End",                      "nobsc-rib-roast-small-end-boneless"),
(3, 1, 1, "Boneless",         "Rib Rolled Cap Pot Roast",                 "nobsc-rib-rolled-cap-pot-roast-boneless"),
(3, 1, 1, NULL,               "Rib Short Ribs",                           "nobsc-rib-short-ribs"),
(3, 1, 1, "Boneless",         "Rib Short Ribs",                           "nobsc-rib-short-ribs-boneless"),
(3, 1, 1, NULL,               "Rib Steak Large End",                      "nobsc-rib-steak-large-end"),
(3, 1, 1, NULL,               "Rib Steak Small End",                      "nobsc-rib-steak-small-end"),
(3, 1, 1, "Boneless",         "Rib Steak Small End",                      "nobsc-rib-steak-small-end-boneless"),

(13, 1, 1, NULL,              "Almonds", "nobsc-almonds"),
(13, 1, 1, NULL,              "Brazil Nuts", "nobsc-almonds"),
(13, 1, 1, NULL,              "Cashews", "nobsc-cashews"),
(13, 1, 1, NULL,              "Hazelnuts", "nobsc-almonds"),
(13, 1, 1, NULL,              "Macadamia Nuts", "nobsc-almonds"),
(13, 1, 1, NULL,              "Peacans", "nobsc-almonds"),
(13, 1, 1, NULL,              "Peanuts", "nobsc-almonds"),
(13, 1, 1, NULL,              "Pine Nuts", "nobsc-almonds"),
(13, 1, 1, NULL,              "Pistachios", "nobsc-pistachios"),
(13, 1, 1, NULL,              "Walnuts", "nobsc-almonds"),

(14, 1, 1, NULL,              "Pumpkin Seeds", "nobsc-pumpkin-seeds"),
(14, 1, 1, NULL,              "Sesame Seeds", "nobsc-sesame-seeds"),

(12, 1, 1, "Ambrosia",         "Apple", "nobsc-apple"),
(12, 1, 1, "Baldwin",          "Apple", "nobsc-apple"),
(12, 1, 1, "Braeburn",         "Apple", "nobsc-apple"),
(12, 1, 1, "Cameo",            "Apple", "nobsc-apple"),
(12, 1, 1, "Cortland",         "Apple", "nobsc-apple"),
(12, 1, 1, "Cosmic Crisp",     "Apple", "nobsc-apple"),
(12, 1, 1, "Empire",           "Apple", "nobsc-apple"),
(12, 1, 1, "Enterprise",       "Apple", "nobsc-apple"),
(12, 1, 1, "Fuji",             "Apple", "nobsc-apple"),
(12, 1, 1, "Gala",             "Apple", "nobsc-apple"),
(12, 1, 1, "Golden Delicious", "Apple", "nobsc-apple"),
(12, 1, 1, "Granny Smith",     "Apple", "nobsc-apple"),
(12, 1, 1, "Honeycrisp",       "Apple", "nobsc-apple"),
(12, 1, 1, "Idared",           "Apple", "nobsc-apple"),
(12, 1, 1, "Jazz",             "Apple", "nobsc-apple"),
(12, 1, 1, "Jonagold",         "Apple", "nobsc-apple"),
(12, 1, 1, "Jonathan",         "Apple", "nobsc-apple"),
(12, 1, 1, "Liberty",          "Apple", "nobsc-apple"),
(12, 1, 1, "Macoun",           "Apple", "nobsc-apple"),
(12, 1, 1, "McIntosh Red",     "Apple", "nobsc-apple"),
(12, 1, 1, "Melrose",          "Apple", "nobsc-apple"),
(12, 1, 1, "Opal",             "Apple", "nobsc-apple"),
(12, 1, 1, "Ozark Gold",       "Apple", "nobsc-apple"),
(12, 1, 1, "Pinata",           "Apple", "nobsc-apple"),
(12, 1, 1, "Pink Lady",        "Apple", "nobsc-apple"),
(12, 1, 1, "Pristine",         "Apple", "nobsc-apple"),
(12, 1, 1, "Red Delicious",    "Apple", "nobsc-apple"),
(12, 1, 1, "Rome",             "Apple", "nobsc-apple"),
(12, 1, 1, "Spartan",          "Apple", "nobsc-apple"),
(12, 1, 1, "Stayman",          "Apple", "nobsc-apple"),
(12, 1, 1, "SweeTango",        "Apple", "nobsc-apple"),
(12, 1, 1, "Winesap",          "Apple", "nobsc-apple"),
(12, 1, 1, NULL,               "Apple", "nobsc-apple"),
(12, 1, 1, "Apricot", "nobsc-apricot"),
(12, 1, 1, "Banana", "nobsc-banana"),
(12, 1, 1, "Blackberries", "nobsc-blackberries"),
(12, 1, 1, "Blueberries", "nobsc-blueberries"),
(12, 1, 1, "Cherries", "nobsc-cherries"),
(12, 1, 1, "Cranberries", "nobsc-cranberries"),
(12, 1, 1, "Concord",   "Grapes", "nobsc-grapes"),
(12, 1, 1, "Flame",     "Grapes", "nobsc-grapes"),
(12, 1, 1, "Moon Drop", "Grapes", "nobsc-grapes"),
(12, 1, 1, "Ruby",      "Grapes", "nobsc-grapes"),
(12, 1, 1, "Thompson",  "Grapes", "nobsc-grapes"),
(12, 1, 1, NULL,        "Grapes", "nobsc-grapes"),
(12, 1, 1, "Guava", "nobsc-guava"),
(12, 1, 1, "Kiwi", "nobsc-kiwi"),
(12, 1, 1, "Mango", "nobsc-mango"),
(12, 1, 1, "Watermelon", "nobsc-watermelon"),
(12, 1, 1, "Nectarine", "nobsc-nectarine"),
(12, 1, 1, "Papaya", "nobsc-papaya"),
(12, 1, 1, "Peach", "nobsc-peach"),
(12, 1, 1, "Anjou Green",    "Pear", "nobsc-pear"),
(12, 1, 1, "Anjou Red",      "Pear", "nobsc-pear"),
(12, 1, 1, "Asian",          "Pear", "nobsc-pear"),
(12, 1, 1, "Bartlett",       "Pear", "nobsc-pear"),
(12, 1, 1, "Bosc",           "Pear", "nobsc-pear"),
(12, 1, 1, "Comice",         "Pear", "nobsc-pear"),
(12, 1, 1, "Concord",        "Pear", "nobsc-pear"),
(12, 1, 1, "Forelle",        "Pear", "nobsc-pear"),
(12, 1, 1, "French Butter",  "Pear", "nobsc-pear"),
(12, 1, 1, "Seckel",         "Pear", "nobsc-pear"),
(12, 1, 1, "Taylor\'s Gold", "Pear", "nobsc-pear"),
(12, 1, 1, NULL,             "Pear", "nobsc-pear"),
(12, 1, 1, "Pineapple", "nobsc-pineapple"),
(12, 1, 1, "Orange", "nobsc-orange"),
(12, 1, 1, "Raspberries", "nobsc-raspberries"),
(12, 1, 1, "Strawberries", "nobsc-strawberries"),
(12, 1, 1, "Tangerine", "nobsc-tangerine"),
(12, 1, 1, "Tangelo", "nobsc-tangelo"),
(12, 1, 1, "Blood Orange", "nobsc-blood-orange"),
(12, 1, 1, "White Grapefruit", "nobsc-white-grapefruit"),
(12, 1, 1, "Pink Grapefruit", "nobsc-pink-grapefruit"),
(12, 1, 1, "Honeydew", "nobsc-honeydew"),
(12, 1, 1, "Cantaloupe", "nobsc-cantaloupe"),
(12, 1, 1, "Italian Plum", "nobsc-italian-plum"),
(12, 1, 1, NULL, "Plum", "nobsc-plum"),
(12, 1, 1, "Pomegranate", "nobsc-pomegranate"),

(11, 1, 1, "All Blue",          "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Austrian Crescent", "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "French Fingerling", "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Kennebec",          "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "LaRette",           "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Norland Red",       "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Purple Majesty",    "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Red Gold",          "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Red Thumb",         "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Russet Ranger",     "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Russet Burbank",    "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Russet Norkotah",   "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Russet Umatilla",   "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Russian Banana",    "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Yukon Gold",        "Potatoes", "nobsc-potatoes"),
(11, 1, 1, NULL,                "Potatoes", "nobsc-potatoes"),
(11, 1, 1, "Broccoli", "nobsc-broccoli"),
(11, 1, 1, "Brussels Sprouts", "nobsc-brussels-sprouts"),
(11, 1, 1, "Bok Choy", "nobsc-bok-choy"),
(11, 1, 1, "Green", "Cabbage", "nobsc-green-cabbage"),
(11, 1, 1, "Red",   "Cabbage", "nobsc-red-cabbage"),
(11, 1, 1, "Napa",  "Cabbage", "nobsc-napa-cabbage-chinese-cabbage"),
(11, 1, 1, "Savoy", "Cabbage", "nobsc-savoy-cabbage"),
(11, 1, 1, "Cauliflower", "nobsc-cauliflower"),
(11, 1, 1, "Kohlrabi", "nobsc-kohlrabi"),
(11, 1, 1, "Collard Greens", "nobsc-collard-greens"),
(11, 1, 1, "Turnip Greens", "nobsc-turnip-greens"),
(11, 1, 1, "Pak Choy Baby Bok Choy", "nobsc-pak-choy-baby-bok-choy"),
(11, 1, 1, "Zucchini", "nobsc-zucchini"),
(11, 1, 1, "Standard Slicing Cucumber", "nobsc-standard-slicing-cucumber"),
(11, 1, 1, "Purple",   "Eggplant", "nobsc-purple-eggplant"),
(11, 1, 1, "White",    "Eggplant", "nobsc-white-eggplant"),
(11, 1, 1, "Japanese", "Eggplant", "nobsc-japanese-eggplant"),
(11, 1, 1, "Pumpkin", "nobsc-pumpkin"),
(11, 1, 1, "Acorn",     "Squash", "nobsc-acorn-squash"),
(11, 1, 1, "Butternut", "Squash", "nobsc-butternut-squash"),
(11, 1, 1, "Hubbard",   "Squash", "nobsc-hubbard-squash"),
(11, 1, 1, "Spaghetti", "Squash", "nobsc-spaghetti-squash"),
(11, 1, 1, "Delicata",  "Squash", "nobsc-delicata-squash"),
(11, 1, 1, "Boston",     "Lettuce", "nobsc-boston-lettuce"),
(11, 1, 1, "Bibb",       "Lettuce", "nobsc-bibb-lettuce"),
(11, 1, 1, "Iceberg",    "Lettuce", "nobsc-iceberg-lettuce"),
(11, 1, 1, "Romaine",    "Lettuce", "nobsc-romaine-lettuce"),
(11, 1, 1, "Green Leaf", "Lettuce", "nobsc-green-leaf-lettuce"),
(11, 1, 1, "Oak Leaf",   "Lettuce", "nobsc-oak-leaf-lettuce"),
(11, 1, 1, "Red Leaf",   "Lettuce", "nobsc-red-leaf-lettuce"),
(11, 1, 1, "Arugula Rocket", "nobsc-arugula-rocket"),
(11, 1, 1, "Belgian Endive", "nobsc-belgian-endive"),
(11, 1, 1, "Frisee", "nobsc-frisee"),
(11, 1, 1, "Escarole", "nobsc-escarole"),
(11, 1, 1, "Mache Lambs Lettuce", "nobsc-mache-lambs-lettuce"),
(11, 1, 1, "Radicchio", "nobsc-radicchio"),
(11, 1, 1, "Watercress", "nobsc-watercress"),
(11, 1, 1, "Baby",   "Spinach", "nobsc-baby-spinach"),
(11, 1, 1, "Frozen", "Spinach", "nobsc-spinach"),
(11, 1, 1, NULL,     "Spinach", "nobsc-spinach"),
(11, 1, 1, "Swiss Chard", "nobsc-swiss-chard"),
(11, 1, 1, "Beet Greens", "nobsc-beet-greens"),
(11, 1, 1, "Dandelion Greens", "nobsc-dandelion-greens"),
(11, 1, 1, "Mustard Greens", "nobsc-mustard-greens"),
(11, 1, 1, "Shiitake",   "Mushrooms", "nobsc-shiitake-mushrooms"),
(11, 1, 1, "Cremini",    "Mushrooms", "nobsc-cremini-mushrooms"),
(11, 1, 1, "Portobello", "Mushrooms", "nobsc-portobello-mushrooms"),
(11, 1, 1, NULL,         "Mushrooms", "nobsc-mushrooms"),
(11, 1, 1, "Globe",   "Onion", "nobsc-globe-onion"),
(11, 1, 1, "Green",   "Onion", "nobsc-scallion-green-onion"),
(11, 1, 1, "Pearl",   "Onions", "nobsc-pearl-onions"),
(11, 1, 1, "Spanish", "Onion", "nobsc-spanish-onion"),
(11, 1, 1, "Sweet",   "Onion", "nobsc-sweet-onion"),
(11, 1, 1, NULL,      "Onion", "nobsc-onion"),
(11, 1, 1, "Garlic", "nobsc-garlic"),
(11, 1, 1, "Shallots", "nobsc-shallots"),
(11, 1, 1, "Leek", "nobsc-leek"),
(11, 1, 1, "Bell",     "Pepper", "nobsc-bell-pepper"),
(11, 1, 1, "Poblano",  "Pepper", "nobsc-poblano-pepper"),
(11, 1, 1, "Jalapeno", "Pepper", "nobsc-jalapeno-pepper"),
(11, 1, 1, "Serrano",  "Pepper", "nobsc-serrano-pepper"),
(11, 1, 1, "Thai",     "Pepper", "nobsc-thai-pepper"),
(11, 1, 1, "Habanero", "Pepper", "nobsc-habanero-pepper"),
(11, 1, 1, "Beets", "nobsc-beets"),
(11, 1, 1, "Winterbor",   "Kale", "nobsc-winterbor-kale-curly-kale"),
(11, 1, 1, "Red Russian", "Kale", "nobsc-red-russian-kale"),
(11, 1, 1, NULL,          "Kale", "nobsc-kale"),
(11, 1, 1, "Green Beans", "nobsc-green-beans"),
(11, 1, 1, "Celery", "nobsc-celery"),
(11, 1, 1, "Asparagus", "nobsc-asparagus"),
(11, 1, 1, "Green",      "Peas", "nobsc-green-peas"),
(11, 1, 1, "Snow",       "Peas", "nobsc-snowpeas"),
(11, 1, 1, "Sugar Snap", "Peas", "nobsc-sugar-snap-peas"),
(11, 1, 1, "Carrots", "nobsc-carrots"),
(11, 1, 1, "Parsnips", "nobsc-parsnips"),
(11, 1, 1, "Turnips", "nobsc-turnips"),
(11, 1, 1, "White Turnips", "nobsc-white-turnips"),
(11, 1, 1, "Radishes", "nobsc-radishes"),
(11, 1, 1, "French Radishes", "nobsc-french-radishes"),
(11, 1, 1, "Baby Gold Beets", "nobsc-baby-gold-beets"),
(11, 1, 1, "Red Beets", "nobsc-red-beets"),
(11, 1, 1, "Daikon", "nobsc-daikon"),
(11, 1, 1, "Horseradish", "nobsc-horseradish"),
(11, 1, 1, "Rutabaga", "nobsc-rutabaga"),
(11, 1, 1, "Ginger", "nobsc-ginger"),
(11, 1, 1, "Sunchoke Jerusalem Artichoke", "nobsc-sunchoke-jerusalem-artichoke"),
(11, 1, 1, "Fennel", "nobsc-fennel"),
(11, 1, 1, "Tomatillo", "nobsc-tomatillo"),
(11, 1, 1, "Standard Beefsteak", "Tomatoes", "nobsc-standard-beefsteak-tomatoes"),
(11, 1, 1, "Plum Roma",          "Tomatoes", "nobsc-plum-roma-san-marzano-tomatoes"),
(11, 1, 1, "Plum San Marzano",   "Tomatoes", "nobsc-plum-roma-san-marzano-tomatoes"),
(11, 1, 1, "Sungold",            "Tomatoes", "nobsc-cherry-tomatoes"),
(11, 1, 1, "Cherry",             "Tomatoes", "nobsc-cherry-tomatoes"),
(11, 1, 1, "Grape",              "Tomatoes", "nobsc-grape-tomatoes"),
(11, 1, 1, NULL,                 "Tomatoes", "nobsc-cherry-tomatoes")
-- add brand and canned in next insert?
(2, 1, 1, "Clams", "nobsc-clams"),
(2, 1, 1, "Crab", "nobsc-crab"),
(2, 1, 1, "Shrimp", "nobsc-shrimp"),

(1, 1, 1, "Tuna", "nobsc-tuna"),
(1, 1, 1, "Salmon", "nobsc-salmon"),
(1, 1, 1, "Tilapia", "nobsc-tilapia"),
(1, 1, 1, "Pollock", "nobsc-pollock"),
(1, 1, 1, "Catfish", "nobsc-catfish"),
(1, 1, 1, "Cod", "nobsc-cod"),

(16, 1, 1, "Basil", "nobsc-basil"),
(16, 1, 1, "Cilantro", "nobsc-cilantro"),
(16, 1, 1, "Fenugreek", "nobsc-fenugreek"),
(16, 1, 1, "Parsley", "nobsc-parsley"),
(16, 1, 1, "Rosemary", "nobsc-rosemary"),
(16, 1, 1, "Sage", "nobsc-sage"),
(16, 1, 1, "Thyme", "nobsc-thyme"),

(15, 1, 1, "Ancho",    "Pepper", "nobsc-ancho-pepper"),
(15, 1, 1, "Arbol",    "Pepper", "nobsc-arbol-pepper"),
(15, 1, 1, "Cascabel", "Pepper", "nobsc-cascabel-pepper"),
(15, 1, 1, "Guajillo", "Pepper", "nobsc-guajillo-pepper"),
(15, 1, 1, "Morita",   "Pepper", "nobsc-morita-pepper"),
(15, 1, 1, "Mulato",   "Pepper", "nobsc-mulato-pepper"),
(15, 1, 1, "Pasilla",  "Pepper", "nobsc-pasilla-pepper"),
(15, 1, 1, "Pulla",    "Pepper", "nobsc-pulla-pepper"),
(15, 1, 1, "Celery Seeds", "nobsc-celery-seeds"),
(15, 1, 1, "Cinnamon", "nobsc-cinnamon"),
(15, 1, 1, "Ground Cinnamon", "nobsc-ground-cinnamon"),
(15, 1, 1, "Cloves", "nobsc-cloves"),
(15, 1, 1, "Ground Cloves", "nobsc-ground-cloves"),
(15, 1, 1, "Cumin Seeds", "nobsc-cumin-seeds"),
(15, 1, 1, "Cumin Powder", "nobsc-cumin-powder"),
(15, 1, 1, "Fennel Seeds", "nobsc-fennel-seeds"),
(15, 1, 1, "Garlic", "nobsc-garlic"),
(15, 1, 1, "Garlic Powder", "nobsc-garlic-powder"),
(15, 1, 1, "Ginger", "nobsc-ginger"),
(15, 1, 1, "Ginger Powder", "nobsc-ginger-powder"),
(15, 1, 1, "Shallots", "nobsc-shallots"),
(15, 1, 1, "Turmeric", "nobsc-turmeric"),
(15, 1, 1, "Turmeric Powder", "nobsc-turmeric-powder"),

(10, 1, 1, "Black Turtle",   "Beans", "nobsc-black-turtle-beans"),
(10, 1, 1, "Garbanzo",       "Beans", "nobsc-garbanzo-beans-chickpeas"),
(10, 1, 1, "Great Northern", "Beans", "nobsc-great-northern-beans"),
(10, 1, 1, "Pinto",          "Beans", "nobsc-pinto-beans"),
(10, 1, 1, "Red Kidney",     "Beans", "nobsc-red-kidney-beans"),
(10, 1, 1, "Split Peas", "nobsc-split-peas"),

(4, 1, 1, "Bacon", "nobsc-bacon"),

(5, 1, 1, "Chicken Wings", "nobsc-raw-chicken-wings"),

(6, 1, 1, "Eggs", "nobsc-eggs"),

(7, 1, 1, "Cream", "nobsc-cream"),

(8, 1, 1, "Coconut", "nobsc-coconut"),

(17, 1, 1, "Balsamic Vinegar", "nobsc-balsamic-vinegar"),

(18, 1, 1, "Tobasco Sauce", "nobsc-tobasco-sauce"),

(7, 1, 1, "Salted", "Butter", "nobsc-butter");
(7, 1, 1, "Unsalted", "Butter", "nobsc-butter");

INSERT INTO nobsc_ingredient_types
(ingredient_type_id, ingredient_type_name)
VALUES
(1, "Fish"),
(2, "Shellfish"),
(3, "Beef"),
(4, "Pork"),
(5, "Poultry"),
(6, "Egg"),
(7, "Dairy"),
(8, "Oil"),
(9, "Grain"),
(10, "Bean"),
(11, "Vegetable"),
(12, "Fruit"),
(13, "Nut"),
(14, "Seed"),
(15, "Spice"),
(16, "Herb"),
(17, "Acid"),
(18, "Product");

INSERT INTO nobsc_measurements
(measurement_id, measurement_name)
VALUES
(1, "teaspoon"),
(2, "Tablespoon"),
(3, "cup"),
(4, "ounce"),
(5, "pound"),
(6, "milliliter"),
(7, "liter"),
(8, "gram"),
(9, "kilogram"),
(10, "NA");

INSERT INTO nobsc_methods
(method_id, method_name)
VALUES
(1, "No-Cook"),
(2, "Chill"),
(3, "Freeze"),
(4, "Microwave"),
(5, "Toast"),
(6, "Steam"),
(7, "Poach"),
(8, "Simmer"),
(9, "Boil"),
(10, "Blanch"),
(11, "Stew"),
(12, "Braise"),
(13, "Bake"),
(14, "Roast"),
(15, "Broil"),
(16, "Saute"),
(17, "Pan-Fry"),
(18, "Shallow-Fry"),
(19, "Deep-Fry"),
(20, "Stir-Fry"),
(21, "Glaze"),
(22, "BBQ"),
(23, "Grill"),
(24, "Smoke");

INSERT INTO nobsc_recipes
(recipe_type_id, cuisine_id, author_id, owner_id, title, description, directions)
VALUES
(1, 1, 1, 1, "Borscht", "Excellent", "Sweet, sour, savory..."),
(2, 2, 1, 1, "Soft Buttery Pretzle", "Melting goodness...", "Set oven to 400 F. Mix dough..."),
(3, 3, 1, 1, "Grilled Chicken and Seasoned Rice", "Yum", "Marinate chicken in a..."),
(4, 4, 1, 1, "Mixed Root Vegetables", "Satisfying", "Chop vegetables into about 2 inch by 2 inch pieces..."),
(5, 5, 1, 1, "Coffee Vanilla Icecream Cake", "Special", "Set oven to 275 F. Mix dough..."),
(6, 6, 1, 1, "Fish Carrot and Potato Soup", "Nice.", "Heat stock..."),
(7, 7, 1, 1, "Possibly Greek Salad", "Who Knows", "Mix olive oil and red wine vinegar in bowl..."),
(8, 8, 1, 1, "Irish Guinness Beef Stew", "Calming", "Sear well just one side of the beef pieces..."),
(9, 9, 1, 1, "Northern Chinese Seafood Casserole", "Excellent", "Heat stock..."),
(10, 10, 1, 1, "Sweet Coconut Lime Sauce", "Interesting", "Mix..."),
(11, 11, 1, 1, "Carrot Ginger Dressing", "Tasty", "Blend carrots and..."),
(12, 12, 1, 1, "Some Kind Of Chutney", "Not Bad", "Mix...");

INSERT INTO nobsc_recipe_equipment
(recipe_id, equipment_id, amount)
VALUES
(1, 1, 1),
(2, 1, 1),
(3, 1, 1),
(4, 1, 1),
(5, 1, 1),
(6, 1, 1),
(7, 1, 1),
(8, 1, 1),
(9, 1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1);

INSERT INTO nobsc_recipe_ingredients
(recipe_id, ingredient_id, amount, measurement_id)
VALUES
(1, 116, 4, 1),
(2, 209, 2, 2),
(3, 153, 1, 3),
(4, 159, 1, 4),
(5, 165, 7, 5),
(6, 176, 1, 6),
(7, 142, 3, 7),
(8, 230, 1, 8),
(9, 202, 9, 9),
(10, 100, 20, 10),
(11, 122, 10, 1),
(12, 138, 13, 2);

INSERT INTO nobsc_recipe_methods
(recipe_id, method_id)
VALUES
(1, 6),
(2, 9),
(3, 13),
(4, 15),
(5, 16),
(6, 7),
(7, 4),
(8, 3),
(9, 2),
(10, 1),
(11, 12),
(12, 13);

INSERT INTO nobsc_recipe_types
(recipe_type_id, recipe_type_name)
VALUES
(1, "Drink"),
(2, "Appetizer"),
(3, "Main"),
(4, "Side"),
(5, "Dessert"),
(6, "Soup"),
(7, "Salad"),
(8, "Stew"),
(9, "Casserole"),
(10, "Sauce"),
(11, "Dressing"),
(12, "Condiment");

INSERT INTO nobsc_staff (email, pass, staffname) VALUES (
  "tjalferes@tjalferes.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "T. J. Alferes"
);

INSERT INTO nobsc_users (email, pass, username) VALUES (
  "tjalferes@tjalferes.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "NOBSC"
), (
  "tjalferes@gmail.com",
  "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u",
  "Unknown"
);
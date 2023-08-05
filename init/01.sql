DROP DATABASE IF EXISTS nobsc;

CREATE DATABASE nobsc CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

USE nobsc;



CREATE TABLE cuisine (
  `id`        tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `continent` varchar(2)       NOT NULL DEFAULT '',
  `code`      varchar(3)       NOT NULL DEFAULT ''  UNIQUE,
  `name`      varchar(40)      NOT NULL DEFAULT '',
  `country`   varchar(40)      NOT NULL DEFAULT ''  UNIQUE
);

CREATE TABLE equipment_type (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE ingredient_type (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE measurement (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE method (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE product_category (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE product_type (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE recipe_type (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
);

CREATE TABLE supplier (
  `id`   smallint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(60)       NOT NULL             UNIQUE
);



-- We use AUTO_INCREMENTing PKs for now, but if needed later, we will likely switch to UUIDv7

CREATE TABLE customer (
  `id`    int unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  `email` varchar(60)  NOT NULL UNIQUE
);

CREATE TABLE staff (
  `id`                int unsigned NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `email`             varchar(60)  NOT NULL              UNIQUE,
  `pass`              char(60)     NOT NULL,
  `staffname`         varchar(20)  NOT NULL              UNIQUE,
  `confirmation_code` varchar(255)          DEFAULT NULL
);

CREATE TABLE user (
  `id`                int unsigned NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `email`             varchar(60)  NOT NULL              UNIQUE,
  `pass`              char(60)     NOT NULL,
  `username`          varchar(20)  NOT NULL              UNIQUE,
  `confirmation_code` varchar(255)          DEFAULT NULL
);



CREATE TABLE equipment (
  `id`                smallint unsigned NOT NULL             PRIMARY KEY AUTO_INCREMENT,
  `equipment_type_id` tinyint unsigned  NOT NULL DEFAULT '0',
  `author_id`         int unsigned      NOT NULL,
  `owner_id`          int unsigned      NOT NULL,
  `name`              varchar(100)      NOT NULL,
  `description`       text              NOT NULL DEFAULT '',
  `image`             varchar(100)      NOT NULL DEFAULT '',
  FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_types` (`id`),
  FOREIGN KEY (`author_id`)         REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`)          REFERENCES `users` (`id`)
);

CREATE TABLE ingredient (
  `id`                 smallint unsigned NOT NULL             PRIMARY KEY AUTO_INCREMENT,
  `ingredient_type_id` tinyint unsigned  NOT NULL DEFAULT '0',
  `author_id`          int unsigned      NOT NULL,
  `owner_id`           int unsigned      NOT NULL,
  `brand`              varchar(50)       NOT NULL DEFAULT '',
  `variety`            varchar(50)       NOT NULL DEFAULT '',
  `name`               varchar(50)       NOT NULL DEFAULT '',
  `fullname`           varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)) STORED NOT NULL UNIQUE,
  `alt_names`          json                       DEFAULT NULL,
  `description`        text              NOT NULL DEFAULT '',
  `image`              varchar(100)      NOT NULL DEFAULT '',
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `ingredient_types` (`id`),
  FOREIGN KEY (`owner_id`)           REFERENCES `users` (`id`),
  FOREIGN KEY (`author_id`)          REFERENCES `users` (`id`) 
);

CREATE TABLE order (
  `id`          int unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `staff_id`    int unsigned NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  FOREIGN KEY (`staff_id`)    REFERENCES `staff` (`id`)
);

CREATE TABLE plan (
  `id`        int unsigned NOT NULL            PRIMARY KEY AUTO_INCREMENT,
  `author_id` int unsigned NOT NULL,
  `owner_id`  int unsigned NOT NULL,
  `name`      varchar(100) NOT NULL DEFAULT '',
  `data`      json DEFAULT NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`)  REFERENCES `users` (`id`)
);

CREATE TABLE product (
  `id`                  smallint unsigned NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `product_category_id` tinyint unsigned  NOT NULL DEFAULT '0',
  `product_type_id`     tinyint unsigned  NOT NULL DEFAULT '0',
  `brand`               varchar(50)       NOT NULL DEFAULT '',
  `variety`             varchar(50)       NOT NULL DEFAULT '',
  `name`                varchar(50)       NOT NULL DEFAULT '',
  `fullname`            varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)) STORED NOT NULL UNIQUE,
  `alt_names`           json                       DEFAULT NULL,
  `description`         text              NOT NULL,
  `specs`               json                       DEFAULT NULL,
  `image`               varchar(100)      NOT NULL DEFAULT '',
  FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`),
  FOREIGN KEY (`product_type_id`)     REFERENCES `product_types` (`id`)
);

CREATE TABLE recipe (
  `id`                int unsigned     NOT NULL            PRIMARY KEY AUTO_INCREMENT,
  `recipe_type_id`    tinyint unsigned NOT NULL,
  `cuisine_id`        tinyint unsigned NOT NULL,
  `author_id`         int unsigned     NOT NULL,
  `owner_id`          int unsigned     NOT NULL,
  `title`             varchar(100)     NOT NULL DEFAULT '',
  `description`       varchar(150)     NOT NULL DEFAULT '',
  `active_time`       time             NOT NULL,
  `total_time`        time             NOT NULL,
  `directions`        text             NOT NULL,
  `recipe_image`      varchar(100)     NOT NULL DEFAULT '',
  `equipment_image`   varchar(100)     NOT NULL DEFAULT '',
  `ingredients_image` varchar(100)     NOT NULL DEFAULT '',
  `cooking_image`     varchar(100)     NOT NULL DEFAULT '',
  `video`             varchar(100)     NOT NULL DEFAULT '',
  FOREIGN KEY (`recipe_type_id`) REFERENCES `recipe_types` (`id`),
  FOREIGN KEY (`cuisine_id`)     REFERENCES `cuisines` (`id`),
  FOREIGN KEY (`author_id`)      REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`)       REFERENCES `users` (`id`)
);



CREATE TABLE favorite_recipe (
  `user_id`   int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
);

CREATE TABLE friendship (
  `user_id`   int unsigned NOT NULL,
  `friend_id` int unsigned NOT NULL,
  `status`    varchar(20)  NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`),
  FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)
);

CREATE TABLE order_product (
  `order_id`   int unsigned      NOT NULL,
  `product_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`order_id`)   REFERENCES `orders` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
);

CREATE TABLE product_supplier (
  `product_id`  smallint unsigned NOT NULL,
  `supplier_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`product_id`)  REFERENCES `products` (`id`),
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
);

CREATE TABLE recipe_equipment (
  `recipe_id`    int unsigned      NOT NULL,
  `amount`       tinyint unsigned  NOT NULL,
  `equipment_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`)    REFERENCES `recipes` (`id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`)
);

CREATE TABLE recipe_ingredient (
  `recipe_id`      int unsigned      NOT NULL DEFAULT '0',
  `amount`         decimal(5,2)      NOT NULL,
  `measurement_id` tinyint unsigned  NOT NULL,
  `ingredient_id`  smallint unsigned NOT NULL DEFAULT '0',
  FOREIGN KEY (`recipe_id`)      REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`),
  FOREIGN KEY (`ingredient_id`)  REFERENCES `ingredients` (`id`)
);

CREATE TABLE recipe_method (
  `recipe_id` int unsigned     NOT NULL,
  `method_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`method_id`) REFERENCES `methods` (`id`)
);

CREATE TABLE recipe_subrecipe (
  `recipe_id`      int unsigned     NOT NULL,
  `amount`         decimal(5,2)     NOT NULL,
  `measurement_id` tinyint unsigned NOT NULL,
  `subrecipe_id`   int unsigned     NOT NULL,
  FOREIGN KEY (`recipe_id`)      REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`),
  FOREIGN KEY (`subrecipe_id`)   REFERENCES `recipes` (`id`)
);

CREATE TABLE saved_recipe (
  `user_id`   int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
);



INSERT INTO staff (email, pass, staffname) VALUES
("tjalferes@tjalferes.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "T. J. Alferes");

INSERT INTO user (email, pass, username) VALUES
("tjalferes@tjalferes.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "NOBSC"),
("tjalferes@gmail.com",     "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "Unknown"),
("testman@testman.com",     "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "Testman");

INSERT INTO equipment_type (id, name) VALUES (1, "Cleaning"), (2, "Preparing"), (3, "Cooking"), (4, "Dining"), (5, "Storage");

INSERT INTO ingredient_type (id, name) VALUES
(1,  "Fish"),
(2,  "Shellfish"),
(3,  "Beef"),
(4,  "Pork"),
(5,  "Poultry"),
(6,  "Egg"),
(7,  "Dairy"),
(8,  "Oil"),
(9,  "Grain"),
(10, "Bean"),
(11, "Vegetable"),
(12, "Fruit"),
(13, "Nut"),
(14, "Seed"),
(15, "Spice"),
(16, "Herb"),
(17, "Acid"),
(18, "Product");

INSERT INTO measurement (id, name) VALUES
(1,  "teaspoon"),
(2,  "Tablespoon"),
(3,  "cup"),
(4,  "ounce"),
(5,  "pound"),
(6,  "milliliter"),
(7,  "liter"),
(8,  "gram"),
(9,  "kilogram"),
(10, "NA");

INSERT INTO method (id, name) VALUES
(1,  "No-Cook"),
(2,  "Chill"),
(3,  "Freeze"),
(4,  "Microwave"),
(5,  "Toast"),
(6,  "Steam"),
(7,  "Poach"),
(8,  "Simmer"),
(9,  "Boil"),
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

INSERT INTO recipe_type (id, name) VALUES
(1,  "Drink"),
(2,  "Appetizer"),
(3,  "Main"),
(4,  "Side"),
(5,  "Dessert"),
(6,  "Soup"),
(7,  "Salad"),
(8,  "Stew"),
(9,  "Casserole"),
(10, "Sauce"),
(11, "Dressing"),
(12, "Condiment");

INSERT INTO cuisine (id, continent, code, name, country) VALUES
(1,  "AF", "DZA", "Algerian",                 "Algeria"),
(2,  "AF", "AGO", "Angolan",                  "Angola"),
(3,  "AF", "BEN", "Benin",                    "Benin"),
(4,  "AF", "BWA", "Botswana",                 "Botswana"),
(5,  "AF", "BFA", "Burkinabe",                "Burkina Faso"),
(6,  "AF", "BDI", "Burundian",                "Burundi"),
(7,  "AF", "CPV", "Cape Verdean",             "Cabo Verde"),
(8,  "AF", "CMR", "Cameroonian",              "Cameroon"),
(9,  "AF", "CAF", "Central African Republic", "Central African Republic"),
(10, "AF", "TCD", "Chadian",                  "Chad"),
(11, "AF", "COM", "Comoros",                  "Comoros"),
(12, "AF", "COD", "Congolese (Democratic)",   "Congo, Democratic Republic of the"),
(13, "AF", "COG", "Congolese",                "Congo, Republic of the"),
(14, "AF", "CIV", "Ivorian",                  "Côte d'Ivoire"),
(15, "AF", "DJI", "Djiboutian",               "Djibouti"),
(16, "AF", "EGY", "Egyptian",                 "Egypt"),
(17, "AF", "GNQ", "Equatorial Guinea",        "Equatorial Guinea"),
(18, "AF", "ERI", "Eritrean",                 "Eritrea"),
(19, "AF", "SWZ", "Eswatini",                 "Eswatini"),
(20, "AF", "ETH", "Ethiopian",                "Ethiopia"),
(21, "AF", "GAB", "Gabonese",                 "Gabon"),
(22, "AF", "GMB", "Gambian",                  "Gambia"),
(23, "AF", "GHA", "Ghanaian",                 "Ghana"),
(24, "AF", "GIN", "Guinea",                   "Guinea"),
(25, "AF", "GNB", "Guinea-Bissauan",          "Guinea-Bissau"),
(26, "AF", "KEN", "Kenyan",                   "Kenya"),
(27, "AF", "LSO", "Basotho",                  "Lesotho"),
(28, "AF", "LBR", "Liberian",                 "Liberia"),
(29, "AF", "LBY", "Libyan",                   "Libya"),
(30, "AF", "MDG", "Malagasy",                 "Madagascar"),
(31, "AF", "MWI", "Malawian",                 "Malawi"),
(32, "AF", "MLI", "Malian",                   "Mali"),
(33, "AF", "MRT", "Mauritanian",              "Mauritania"),
(34, "AF", "MUS", "Mauritius",                "Mauritius"),
(35, "AF", "MAR", "Moroccan",                 "Morocco"),
(36, "AF", "MOZ", "Mozambique",               "Mozambique"),
(37, "AF", "NAM", "Namibian",                 "Namibia"),
(38, "AF", "NER", "Niger",                    "Niger"),
(39, "AF", "NGA", "Nigerian",                 "Nigeria"),
(40, "AF", "RWA", "Rwandan",                  "Rwanda"),
(41, "AF", "STP", "Sao Tome and Principe",    "Sao Tome and Principe"),
(42, "AF", "SEN", "Senegalese",               "Senegal"),
(43, "AF", "SYC", "Seychellois",              "Seychelles"),
(44, "AF", "SLE", "Sierra Leonean",           "Sierra Leone"),
(45, "AF", "SOM", "Somali",                   "Somalia"),
(46, "AF", "ZAF", "South African",            "South Africa"),
(47, "AF", "SSD", "South Sudanese",           "South Sudan"),
(48, "AF", "SDN", "Sudanese",                 "Sudan"),
(49, "AF", "TZA", "Tanzanian",                "Tanzania"),
(50, "AF", "TGO", "Togolese",                 "Togo"),
(51, "AF", "TUN", "Tunisian",                 "Tunisia"),
(52, "AF", "UGA", "Ugandan",                  "Uganda"),
(53, "AF", "ZMB", "Zambian",                  "Zambia"),
(54, "AF", "ZWE", "Zimbabwean",               "Zimbabwe"),

(55, "AM", "USA", "American",               "United States of America"),
(56, "AM", "ATG", "Antigua and Barbuda",    "Antigua and Barbuda"),
(57, "AM", "ARG", "Argentine",              "Argentina"),
(58, "AM", "BHS", "Bahamian",               "Bahamas"),
(59, "AM", "BRB", "Bajan",                  "Barbados"),
(60, "AM", "BLZ", "Belizean",               "Belize"),
(61, "AM", "BOL", "Bolivian",               "Bolivia"),
(62, "AM", "BRA", "Brazilian",              "Brazil"),
(63, "AM", "CAN", "Canadian",               "Canada"),
(64, "AM", "CHL", "Chilean",                "Chile"),
(65, "AM", "COL", "Colombian",              "Colombia"),
(66, "AM", "CRI", "Costa Rican",            "Costa Rica"),
(67, "AM", "CUB", "Cuban",                  "Cuba"),
(68, "AM", "DMA", "Dominica",               "Dominica"),
(69, "AM", "DOM", "Dominican Republic",     "Dominican Republic"),
(70, "AM", "ECU", "Ecuadorian",             "Ecuador"),
(71, "AM", "GRD", "Grenada",                "Grenada"),
(72, "AM", "GTM", "Guatemalan",             "Guatemala"),
(73, "AM", "GUY", "Guyanese",               "Guyana"),
(74, "AM", "HTI", "Haitian",                "Haiti"),
(75, "AM", "HND", "Honduran",               "Honduras"),
(76, "AM", "JAM", "Jamaican",               "Jamaica"),
(77, "AM", "MEX", "Mexican",                "Mexico"),
(78, "AM", "NIC", "Nicaraguan",             "Nicaragua"),
(79, "AM", "PAN", "Panamanian",             "Panama"),
(80, "AM", "PRY", "Paraguayan",             "Paraguay"),
(81, "AM", "PER", "Peruvian",               "Peru"),
(82, "AM", "KNA", "Kittian Nevisian",       "Saint Kitts and Nevis"),
(83, "AM", "LCA", "Saint Lucian",           "Saint Lucia"),
(84, "AM", "VCT", "Vincentian Grenadinian", "Saint Vincent and the Grenadines"),
(85, "AM", "SLV", "Salvadoran",             "El Salvador"),
(86, "AM", "SUR", "Surinamese",             "Suriname"),
(87, "AM", "TTO", "Trinidad and Tobago",    "Trinidad and Tobago"),
(88, "AM", "URY", "Uruguayan",              "Uruguay"),
(89, "AM", "VEN", "Venezuelan",             "Venezuala"),

(90,  "AS", "AFG", "Afghan",        "Afghanistan"),
(91,  "AS", "ARM", "Armenian",      "Armenia"),
(92,  "AS", "AZE", "Azerbaijani",   "Azerbaijan"),
(93,  "AS", "BHR", "Bahraini",      "Bahrain"),
(94,  "AS", "BGD", "Bangladeshi",   "Bangladesh"),
(95,  "AS", "BTN", "Bhutanese",     "Bhutan"),
(96,  "AS", "BRN", "Bruneian",      "Brunei"),
(97,  "AS", "KHM", "Cambodian",     "Cambodia"),
(98,  "AS", "CHN", "Chinese",       "China"),
(99,  "AS", "CYP", "Cypriot",       "Cyprus"),
(100, "AS", "GEO", "Georgian",      "Georgia"),
(101, "AS", "IND", "Indian",        "India"),
(102, "AS", "IDN", "Indonesian",    "Indonesia"),
(103, "AS", "IRN", "Iranian",       "Iran"),
(104, "AS", "IRQ", "Iraqi",         "Iraq"),
(105, "AS", "ISR", "Israeli",       "Israel"),
(106, "AS", "JPN", "Japanese",      "Japan"),
(107, "AS", "JOR", "Jordanian",     "Jordan"),
(108, "AS", "KAZ", "Kazakh",        "Kazakhstan"),
(109, "AS", "KWT", "Kuwaiti",       "Kuwait"),
(110, "AS", "KGZ", "Kyrgyz",        "Kyrgyzstan"),
(111, "AS", "LAO", "Lao",           "Laos"),
(112, "AS", "LBN", "Lebanese",      "Lebanon"),
(113, "AS", "MYS", "Malaysian",     "Malaysia"),
(114, "AS", "MDV", "Maldivian",     "Maldives"),
(115, "AS", "MNG", "Mongolian",     "Mongolia"),
(116, "AS", "MMR", "Burmese",       "Myanmar"),
(117, "AS", "NPL", "Nepalese",      "Nepal"),
(118, "AS", "PRK", "North Korean",  "North Korea"),
(119, "AS", "OMN", "Omani",         "Oman"),
(120, "AS", "PAK", "Pakistani",     "Pakistan"),
(121, "AS", "PSE", "Palestinian",   "Palestine"),
(122, "AS", "PHL", "Filipino",      "Philippines"),
(123, "AS", "QAT", "Qatari",        "Qatar"),
(124, "AS", "RUS", "Russian",       "Russia"),
(125, "AS", "SAU", "Saudi Arabian", "Saudi Arabia"),
(126, "AS", "SGP", "Singaporean",   "Singapore"),
(127, "AS", "KOR", "South Korean",  "South Korea"),
(128, "AS", "LKA", "Sri Lankan",    "Sri Lanka"),
(129, "AS", "SYR", "Syrian",        "Syria"),
(130, "AS", "TWN", "Taiwanese",     "Taiwan"),
(131, "AS", "TJK", "Tajik",         "Tajikistan"),
(132, "AS", "THA", "Thai",          "Thailand"),
(133, "AS", "TLS", "Timorese",      "Timor-Leste"),
(134, "AS", "TUR", "Turkish",       "Turkey"),
(135, "AS", "TKM", "Turkmen",       "Turkmenistan"),
(136, "AS", "ARE", "Emirati",       "United Arab Emirates"),
(137, "AS", "UZB", "Uzbek",         "Uzbekistan"),
(138, "AS", "VNM", "Vietnamese",    "Vietnam"),
(139, "AS", "YEM", "Yemeni",        "Yemen"),

(140, "EU", "ALB", "Albanian",               "Albania"),
(141, "EU", "AND", "Catalan",                "Andorra"),
(142, "EU", "AUT", "Austrian",               "Austria"),
(143, "EU", "BLR", "Belarusian",             "Belarus"),
(144, "EU", "BEL", "Belgian",                "Belgium"),
(145, "EU", "BIH", "Bosnia and Herzegovina", "Bosnia and Herzegovina"),
(146, "EU", "BGR", "Bulgarian",              "Bulgaria"),
(147, "EU", "HRV", "Croatian",               "Croatia"),
(148, "EU", "CZE", "Czech",                  "Czechia"),
(149, "EU", "DNK", "Danish",                 "Denmark"),
(150, "EU", "EST", "Estonian",               "Estonia"),
(151, "EU", "FIN", "Finnish",                "Finland"),
(152, "EU", "FRA", "French",                 "France"),
(153, "EU", "DEU", "German",                 "Germany"),
(154, "EU", "GRC", "Greek",                  "Greece"),
(155, "EU", "HUN", "Hungarian",              "Hungary"),
(156, "EU", "ISL", "Icelandic",              "Iceland"),
(157, "EU", "IRL", "Irish",                  "Ireland"),
(158, "EU", "ITA", "Italian",                "Italy"),
(160, "EU", "XXK", "Kosovan",                "Kosovo"),
(161, "EU", "LVA", "Latvian",                "Latvia"),
(162, "EU", "LIE", "Liechtensteiner",        "Liechtenstein"),
(163, "EU", "LTU", "Lithuanian",             "Lithuania"),
(164, "EU", "LUX", "Luxembourg",             "Luxembourg"),
(165, "EU", "MLT", "Maltese",                "Malta"),
(166, "EU", "MDA", "Moldovan",               "Moldova"),
(167, "EU", "MCO", "Monégasque",             "Monaco"),
(168, "EU", "MNE", "Montenegrin",            "Montenegro"),
(169, "EU", "NLD", "Dutch",                  "Netherlands"),
(170, "EU", "MKD", "Macedonian",             "North Macedonia"),
(171, "EU", "NOR", "Norwegian",              "Norway"),
(172, "EU", "POL", "Polish",                 "Poland"),
(173, "EU", "PRT", "Portuguese",             "Portugal"),
(174, "EU", "ROU", "Romanian",               "Romania"),
(175, "EU", "SMR", "Sammarinese",            "San Marino"),
(176, "EU", "SRB", "Serbian",                "Serbia"),
(177, "EU", "SVK", "Slovak",                 "Slovakia"),
(178, "EU", "SVN", "Slovenian",              "Slovenia"),
(179, "EU", "ESP", "Spanish",                "Spain"),
(180, "EU", "SWE", "Swedish",                "Sweden"),
(181, "EU", "CHE", "Swiss",                  "Switzerland"),
(182, "EU", "UKR", "Ukrainian",              "Ukraine"),
(183, "EU", "GBR", "British",                "United Kingdom"),

(184, "OC", "AUS", "Australian",        "Australia"),
(185, "OC", "FJI", "Fijian",            "Fiji"),
(186, "OC", "KIR", "Kiribati",          "Kiribati"),
(187, "OC", "MHL", "Marshallese",       "Marshall Islands"),
(188, "OC", "FSM", "Micronesian",       "Micronesia"),
(189, "OC", "NRU", "Nauruan",           "Nauru"),
(190, "OC", "NZL", "New Zealand",       "New Zealand"),
(191, "OC", "PLW", "Palauan",           "Palau"),
(192, "OC", "PNG", "Papua New Guinean", "Papua New Guinea"),
(193, "OC", "WSM", "Samoan",            "Samoa"),
(194, "OC", "SLB", "Solomon Islander",  "Solomon Islands"),
(195, "OC", "TON", "Tongan",            "Tonga"),
(196, "OC", "TUV", "Tuvaluan",          "Tuvalu"),
(197, "OC", "VUT", "Vanuatuan",         "Vanuatu");

INSERT INTO equipment
(equipment_type_id, author_id, owner_id, name, image)
VALUES
(2, 1, 1, "Ceramic Stone",                    "ceramic-stone"),
(2, 1, 1, "Chef\'s Knife",                    "chefs-knife"),
(2, 1, 1, "Cutting Board",                    "cutting-board"),
(2, 1, 1, "Y Peeler",                         "y-peeler"),
(3, 1, 1, "Wooden Spoon",                     "wooden-spoon"),
(2, 1, 1, "Serated Knife",                    "serated-knife"),
(2, 1, 1, "Rubber Spatula",                   "rubber-spatula"),
(2, 1, 1, "Whisk",                            "whisk"),
(2, 1, 1, "Pepper Mill",                      "pepper-mill"),
(2, 1, 1, "Can Opener",                       "can-opener"),
(2, 1, 1, "Side Peeler",                      "side-peeler"),
(2, 1, 1, "Box Grater",                       "box-grater"),
(2, 1, 1, "Small Mixing Bowl",                "small-mixing-bowl"),
(2, 1, 1, "Medium Mixing Bowl",               "medium-mixing-bowl"),
(2, 1, 1, "Large Mixing Bowl",                "large-mixing-bowl"),
(2, 1, 1, "Salad Spinner",                    "salad-spinner"),
(2, 1, 1, "Dry Measuring Cups",               "dry-measuring-cups"),
(2, 1, 1, "Liquid Measuring Cups",            "liquid-measuring-cups"),
(2, 1, 1, "Measuring Spoons",                 "measuring-spoons"),
(2, 1, 1, "Measuring Pitcher",                "measuring-pitcher"),
(2, 1, 1, "Digital Scale",                    "digital-scale"),
(2, 1, 1, "Handheld Mixer",                   "handheld-mixer"),
(2, 1, 1, "Blender",                          "blender"),
(2, 1, 1, "Immersion Blender",                "immersion-blender"),
(2, 1, 1, "Parchment Paper",                  "parchment-paper"),
(2, 1, 1, "Plastic Wrap",                     "plastic-wrap"),
(2, 1, 1, "Aluminum Foil",                    "aluminum-foil"),
(2, 1, 1, "Cheesecloth",                      "cheesecloth"),

(3, 1, 1, "Coffee Maker",                     "coffee-maker"),
(3, 1, 1, "Tea Pot",                          "tea-pot"),
(3, 1, 1, "Microwave",                        "ladle"),
(3, 1, 1, "Toaster Oven",                     "ladle"),
(3, 1, 1, "Small Sauce Pan",                  "small-sauce-pan"),
(3, 1, 1, "Medium Sauce Pan",                 "medium-sauce-pan"),
(3, 1, 1, "Medium Stock Pot",                 "medium-stock-pot"),
(3, 1, 1, "Large Stock Pot",                  "large-stock-pot"),
(3, 1, 1, "Stainless Steel Lidded Saute Pan", "stainless-steel-lidded-saute-pan"),
(3, 1, 1, "Small Stainless Steel Skillet",    "small-stainless-steel-skillet"),
(3, 1, 1, "Large Stainless Steel Skillet",    "large-stainless-steel-skillet"),
(3, 1, 1, "Small Cast-Iron Skillet",          "small-cast-iron-skillet"),
(3, 1, 1, "Large Cast-Iron Skillet",          "large-cast-iron-skillet"),
(3, 1, 1, "Glass Baking Dish",                "glass-baking-dish"),
(3, 1, 1, "Sturdy Baking Sheet",              "sturdy-baking-dish"),
(3, 1, 1, "Small Gratin Dish",                "small-gratin-dish"),
(3, 1, 1, "Large Gratin Dish",                "large-gratin-dish"),
(3, 1, 1, "Dutch Oven",                       "dutch-oven"),
(3, 1, 1, "Oven Mitts",                       "oven-mitts"),
(3, 1, 1, "Splatter Screen",                  "splatter-screen"),
(3, 1, 1, "Colander",                         "colander"),
(3, 1, 1, "Mesh Strainer",                    "mesh-strainer"),
(3, 1, 1, "Tongs",                            "tongs"),
(3, 1, 1, "Slotted Spoon",                    "slotted-spoon"),
(3, 1, 1, "Serving Spoon",                    "serving-spoon"),
(3, 1, 1, "Spider",                           "spider"),
(3, 1, 1, "Sturdy Spatula",                   "sturdy-spatula"),
(3, 1, 1, "Fish Spatula",                     "fish-spatula"),
(3, 1, 1, "Ladle",                            "ladle");

INSERT INTO ingredient
(ingredient_type_id, author_id, owner_id, variety, name, image)
VALUES
(1, 1, 1, "",                    "Tuna",                                     "tuna"),
(1, 1, 1, "",                    "Salmon",                                   "salmon"),
(1, 1, 1, "",                    "Tilapia",                                  "tilapia"),
(1, 1, 1, "",                    "Pollock",                                  "pollock"),
(1, 1, 1, "",                    "Catfish",                                  "catfish"),
(1, 1, 1, "",                    "Cod",                                      "cod"),

(2, 1, 1, "",                    "Clams",                                    "clams"),
(2, 1, 1, "",                    "Crab",                                     "crab"),
(2, 1, 1, "",                    "Shrimp",                                   "shrimp"),

(3, 1, 1, "",                    "Chuck Seven Bone Roast",                   "chuck-7-bone-roast"),
(3, 1, 1, "",                    "Chuck Seven Bone Steak",                   "chuck-7-bone-steak"),
(3, 1, 1, "",                    "Chuck Arm Roast",                          "chuck-arm-roast"),
(3, 1, 1, "Boneless",            "Chuck Arm Roast",                          "chuck-arm-rost-boneless"),
(3, 1, 1, "",                    "Chuck Arm Steak",                          "chuck-arm-steak"),
(3, 1, 1, "Boneless",            "Chuck Arm Steak",                          "chuck-arm-steak-boneless"),
(3, 1, 1, "",                    "Chuck Blade Roast",                        "chuck-blade-roast"),
(3, 1, 1, "",                    "Chuck Blade Steak",                        "chuck-blade-steak"),
(3, 1, 1, "Boneless",            "Chuck Blade Steak",                        "chuck-blade-steak-boneless"),
(3, 1, 1, "Cap Off",             "Chuck Blade Steak",                        "chuck-blade-steak-cap-off"),
(3, 1, 1, "",                    "Chuck Cross Rib Roast",                    "chuck-cross-rib-roast"),
(3, 1, 1, "Boneless",            "Chuck Cross Rib Roast",                    "chuck-cross-rib-roast-boneless"),
(3, 1, 1, "",                    "Chuck Eye Edge Roast",                     "chuck-eye-edge-roast"),
(3, 1, 1, "Boneless",            "Chuck Eye Roast",                          "chuck-eye-roast-steak"),
(3, 1, 1, "Boneless",            "Chuck Eye Steak",                          "chuck-eye-steak-boneless"),
(3, 1, 1, "",                    "Chuck Flanken Style Ribs",                 "chuck-flanken-style-ribs"),
(3, 1, 1, "Boneless",            "Chuck Flanken Style Ribs",                 "chuck-flanken-style-ribs-boneless"),
(3, 1, 1, "",                    "Chuck Flat Ribs",                          "chuck-flat-ribs"),
(3, 1, 1, "",                    "Chuck Mock Tender Roast",                  "chuck-mock-tender-roast"),
(3, 1, 1, "",                    "Chuck Mock Tender Steak",                  "chuck-mock-tender-steak"),
(3, 1, 1, "",                    "Chuck Neck Roast",                         "chuck-neck-roast"),
(3, 1, 1, "Boneless",            "Chuck Neck Roast",                         "chuck-neck-roast-boneless"),
(3, 1, 1, "Boneless",            "Chuck Roast",                              "chuck-roast-boneless"),
(3, 1, 1, "",                    "Chuck Short Ribs",                         "chuck-short-ribs"),
(3, 1, 1, "Boneless",            "Chuck Short Ribs",                         "chuck-short-ribs-boneless"),
(3, 1, 1, "",                    "Chuck Shoulder Center Steak Ranch Steak",  "chuck-shoulder-center-steak-ranch-steak"),
(3, 1, 1, "",                    "Chuck Shoulder Roast",                     "chuck-shoulder-roast"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Roast",                     "chuck-shoulder-roast-boneless"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Steak",                     "chuck-shoulder-steak-boneless"),
(3, 1, 1, "",                    "Chuck Shoulder Tender",                    "chuck-shoulder-tender"),
(3, 1, 1, "",                    "Chuck Shoulder Tender Medallions",         "chuck-shoulder-tender-medallions"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Top Blade Roast",           "chuck-shoulder-top-blade-roast-boneless"),
(3, 1, 1, "Boneless",            "Chuck Shoulder Top Blade Steak",           "chuck-shoulder-top-blade-steak-boneless"),
(3, 1, 1, "",                    "Chuck Shoulder Top Blade Steak Flat Iron", "chuck-shoulder-top-blade-steak-flat-iron"),
(3, 1, 1, "",                    "Chuck Top Blade Roast",                    "chuck-top-blade-roast"),
(3, 1, 1, "Bone In",             "Chuck Top Blade Steak",                    "chuck-top-blade-steak-bone-in"),
(3, 1, 1, "",                    "Chuck Under Blade Roast",                  "chuck-under-blade-roast"),
(3, 1, 1, "Boneless",            "Chuck Under Blade Roast",                  "chuck-under-blade-roast-boneless"),
(3, 1, 1, "",                    "Chuck Under Blade Steak",                  "chuck-under-blade-steak"),
(3, 1, 1, "Boneless",            "Chuck Under Blade Steak",                  "chuck-under-blade-steak-boneless"),
(3, 1, 1, "",                    "Round Bottom Round Roast",                 "round-bottom-round-roast"),
(3, 1, 1, "",                    "Round Bottom Round Roast Triangle Roast",  "round-bottom-round-roast-triangle-roast"),
(3, 1, 1, "",                    "Round Bottom Round Rump Roast",            "round-bottom-round-rump-roast"),
(3, 1, 1, "",                    "Round Bottom Round Steak",                 "round-bottom-round-steak"),
(3, 1, 1, "",                    "Round Bottom Round Steak Western Griller", "round-bottom-round-steak-western-griller"),
(3, 1, 1, "",                    "Round Eye Round Roast",                    "round-eye-round-roast"),
(3, 1, 1, "",                    "Round Eye Round Steak",                    "round-eye-round-steak"),
(3, 1, 1, "",                    "Round Heel of Round",                      "round-heel-of-round"),
(3, 1, 1, "",                    "Round Sirloin Tip Center Roast",           "round-sirloin-tip-center-roast"),
(3, 1, 1, "",                    "Round Sirloin Tip Center Steak",           "round-sirloin-tip-center-steak"),
(3, 1, 1, "",                    "Round Sirloin Tip Side Steak",             "round-sirloin-tip-side-steak"),
(3, 1, 1, "",                    "Round Steak",                              "round-steak"),
(3, 1, 1, "Boneless",            "Round Steak",                              "round-steak-boneless"),
(3, 1, 1, "",                    "Round Tip Roast",                          "round-tip-roast"),
(3, 1, 1, "Cap Off",             "Round Tip Roast",                          "round-tip-roast-cap-off"),
(3, 1, 1, "",                    "Round Tip Steak",                          "round-tip-steak"),
(3, 1, 1, "Cap Off",             "Round Tip Steak",                          "round-tip-steak-cap-off"),
(3, 1, 1, "",                    "Round Top Round Roast",                    "round-top-round-roast"),
(3, 1, 1, "Cap Off",             "Round Top Round Roast",                    "round-top-round-roast-cap-off"),
(3, 1, 1, "",                    "Round Top Round Steak",                    "round-top-round-steak"),
(3, 1, 1, "",                    "Round Top Round Steak Butterflied",        "round-top-round-steak-butterflied"),
(3, 1, 1, "",                    "Round Top Round Steak First Cut",          "round-top-round-steak-first-cut"),
(3, 1, 1, "",                    "Loin Ball Tip Roast",                      "loin-ball-tip-roast"),
(3, 1, 1, "",                    "Loin Ball Tip Steak",                      "loin-ball-tip-steak"),
(3, 1, 1, "",                    "Loin Flap Meat Steak",                     "loin-flap-meat-steak"),
(3, 1, 1, "",                    "Loin Porterhouse Steak",                   "loin-porterhouse-steak"),
(3, 1, 1, "",                    "Loin Shell Sirloin Steak",                 "loin-shell-sirloin-steak"),
(3, 1, 1, "",                    "Loin Sirloin Steak",                       "loin-sirloin-steak"),
(3, 1, 1, "",                    "Loin T Bone Steak",                        "loin-t-bone-steak"),
(3, 1, 1, "",                    "Loin Tenderloin Roast",                    "loin-tenderloin-roast"),
(3, 1, 1, "",                    "Loin Tenderloin Steak",                    "loin-tenderloin-steak"),
(3, 1, 1, "",                    "Loin Top Loin Roast",                      "loin-top-loin-roast"),
(3, 1, 1, "Boneless",            "Loin Top Loin Roast",                      "loin-top-loin-roast-boneless"),
(3, 1, 1, "",                    "Loin Top Loin Steak",                      "loin-top-loin-steak"),
(3, 1, 1, "Boneless",            "Loin Top Loin Steak",                      "loin-top-loin-steak-boneless"),
(3, 1, 1, "Boneless",            "Loin Top Sirloin Roast",                   "loin-top-sirloin-roast-boneless"),
(3, 1, 1, "Boneless Cap Off",    "Loin Top Sirloin Roast",                   "loin-top-sirloin-roast-boneless-cap-off"),
(3, 1, 1, "Boneless",            "Loin Top Sirloin Steak",                   "loin-top-sirloin-steak-boneless"),
(3, 1, 1, "Boneless Cap Off",    "Loin Top Sirloin Steak",                   "loin-top-sirloin-steak-boneless-cap-off"),
(3, 1, 1, "",                    "Loin Tri Tip Roast",                       "loin-tri-tip-roast"),
(3, 1, 1, "",                    "Loin Tri Tip Steak",                       "loin-tri-tip-steak"),
(3, 1, 1, "",                    "Shank Cross Cut",                          "shank-cross-cut"),
(3, 1, 1, "Boneless",            "Shank Cross Cut",                          "shank-cross-cut-boneless"),
(3, 1, 1, "",                    "Plate Skirt Steak",                        "plate-skirt-steak"),
(3, 1, 1, "",                    "Flank Steak",                              "flank-flank-steak"),
(3, 1, 1, "",                    "Ground Beef",                              "ground-beef"),
(3, 1, 1, "",                    "Back Ribs",                                "back-ribs"),
(3, 1, 1, "Boneless",            "Rib Cap Meat",                             "rib-cap-meat-boneless"),
(3, 1, 1, "",                    "Rib Extra Trim Roast Large End",           "rib-extra-trim-roast-large-end"),
(3, 1, 1, "",                    "Ribeye Roast",                             "ribeye-roast"),
(3, 1, 1, "Lip On Bone In",      "Ribeye Roast",                             "ribeye-roast-lip-on-bone-in"),
(3, 1, 1, "Lip On Boneless",     "Ribeye Roast",                             "ribeye-roast-lip-on-boneless"),
(3, 1, 1, "",                    "Ribeye Steak",                             "ribeye-steak"),
(3, 1, 1, "Lip On Bone In",      "Ribeye Steak",                             "ribeye-steak-lip-on-bone-in"),
(3, 1, 1, "Lip On Boneless",     "Ribeye Steak",                             "ribeye-steak-lip-on-boneless"),
(3, 1, 1, "",                    "Rib Roast Large End",                      "rib-roast-large-end"),
(3, 1, 1, "Boneless",            "Rib Roast Large End",                      "rib-roast-large-end-boneless"),
(3, 1, 1, "",                    "Rib Roast Small End",                      "rib-roast-small-end"),
(3, 1, 1, "Boneless",            "Rib Roast Small End",                      "rib-roast-small-end-boneless"),
(3, 1, 1, "Boneless",            "Rib Rolled Cap Pot Roast",                 "rib-rolled-cap-pot-roast-boneless"),
(3, 1, 1, "",                    "Rib Short Ribs",                           "rib-short-ribs"),
(3, 1, 1, "Boneless",            "Rib Short Ribs",                           "rib-short-ribs-boneless"),
(3, 1, 1, "",                    "Rib Steak Large End",                      "rib-steak-large-end"),
(3, 1, 1, "",                    "Rib Steak Small End",                      "rib-steak-small-end"),
(3, 1, 1, "Boneless",            "Rib Steak Small End",                      "rib-steak-small-end-boneless"),

(4, 1, 1, "",                    "Bacon",                                    "bacon"),

(5, 1, 1, "Bone In",             "Chicken Breasts",                          "raw-chicken-wings"),
(5, 1, 1, "Boneless",            "Chicken Breasts",                          "raw-chicken-wings"),
(5, 1, 1, "",                    "Chicken Breasts",                          "raw-chicken-wings"),
(5, 1, 1, "",                    "Chicken Tenderloins",                      "raw-chicken-wings"),
(5, 1, 1, "Bone In",             "Chicken Thighs",                           "raw-chicken-wings"),
(5, 1, 1, "Boneless",            "Chicken Thighs",                           "raw-chicken-wings"),
(5, 1, 1, "",                    "Chicken Thighs",                           "raw-chicken-wings"),
(5, 1, 1, "",                    "Chicken Wings",                            "raw-chicken-wings"),

(6, 1, 1, "",                    "Extra Large Eggs",                         "eggs"),
(6, 1, 1, "",                    "Large Eggs",                               "eggs"),
(6, 1, 1, "",                    "Medium Eggs",                              "eggs"),

(7, 1, 1, "Salted",              "Butter",                                   "butter"),
(7, 1, 1, "Unsalted",            "Butter",                                   "butter"),
(7, 1, 1, "",                    "Cream",                                    "cream"),

(8, 1, 1, "",                    "Coconut",                                  "coconut"),

(9, 1, 1, "Corn",                "Starch",                                   "eggs"),
(9, 1, 1, "Potato",              "Starch",                                   "eggs"),
(9, 1, 1, "All-Purpose",         "Flour",                                    "eggs"),

(10, 1, 1, "Black Turtle",       "Beans",                                    "black-turtle-beans"),
(10, 1, 1, "Garbanzo",           "Beans",                                    "garbanzo-beans-chickpeas"),
(10, 1, 1, "Great Northern",     "Beans",                                    "great-northern-beans"),
(10, 1, 1, "Pinto",              "Beans",                                    "pinto-beans"),
(10, 1, 1, "Red Kidney",         "Beans",                                    "red-kidney-beans"),
(10, 1, 1, "",                   "Split Peas",                               "split-peas"),

(11, 1, 1, "All Blue",           "Potatoes",                                 "potatoes"),
(11, 1, 1, "Austrian Crescent",  "Potatoes",                                 "potatoes"),
(11, 1, 1, "French Fingerling",  "Potatoes",                                 "potatoes"),
(11, 1, 1, "Kennebec",           "Potatoes",                                 "potatoes"),
(11, 1, 1, "LaRette",            "Potatoes",                                 "potatoes"),
(11, 1, 1, "Norland Red",        "Potatoes",                                 "potatoes"),
(11, 1, 1, "Purple Majesty",     "Potatoes",                                 "potatoes"),
(11, 1, 1, "Red Gold",           "Potatoes",                                 "potatoes"),
(11, 1, 1, "Red Thumb",          "Potatoes",                                 "potatoes"),
(11, 1, 1, "Russet Ranger",      "Potatoes",                                 "potatoes"),
(11, 1, 1, "Russet Burbank",     "Potatoes",                                 "potatoes"),
(11, 1, 1, "Russet Norkotah",    "Potatoes",                                 "potatoes"),
(11, 1, 1, "Russet Umatilla",    "Potatoes",                                 "potatoes"),
(11, 1, 1, "Russian Banana",     "Potatoes",                                 "potatoes"),
(11, 1, 1, "Yukon Gold",         "Potatoes",                                 "potatoes"),
(11, 1, 1, "",                   "Potatoes",                                 "potatoes"),
(11, 1, 1, "",                   "Broccoli",                                 "broccoli"),
(11, 1, 1, "",                   "Brussels Sprouts",                         "brussels-sprouts"),
(11, 1, 1, "",                   "Bok Choy",                                 "bok-choy"),
(11, 1, 1, "Green",              "Cabbage",                                  "green-cabbage"),
(11, 1, 1, "Red",                "Cabbage",                                  "red-cabbage"),
(11, 1, 1, "Napa",               "Cabbage",                                  "napa-cabbage-chinese-cabbage"),
(11, 1, 1, "Savoy",              "Cabbage",                                  "savoy-cabbage"),
(11, 1, 1, "",                   "Cauliflower",                              "cauliflower"),
(11, 1, 1, "",                   "Kohlrabi",                                 "kohlrabi"),
(11, 1, 1, "",                   "Collard Greens",                           "collard-greens"),
(11, 1, 1, "",                   "Turnip Greens",                            "turnip-greens"),
(11, 1, 1, "",                   "Pak Choy Baby Bok Choy",                   "pak-choy-baby-bok-choy"),
(11, 1, 1, "",                   "Zucchini",                                 "zucchini"),
(11, 1, 1, "Standard Slicing",   "Cucumber",                                 "standard-slicing-cucumber"),
(11, 1, 1, "Purple",             "Eggplant",                                 "purple-eggplant"),
(11, 1, 1, "White",              "Eggplant",                                 "white-eggplant"),
(11, 1, 1, "Japanese",           "Eggplant",                                 "japanese-eggplant"),
(11, 1, 1, "",                   "Pumpkin",                                  "pumpkin"),
(11, 1, 1, "Acorn",              "Squash",                                   "acorn-squash"),
(11, 1, 1, "Butternut",          "Squash",                                   "butternut-squash"),
(11, 1, 1, "Hubbard",            "Squash",                                   "hubbard-squash"),
(11, 1, 1, "Spaghetti",          "Squash",                                   "spaghetti-squash"),
(11, 1, 1, "Delicata",           "Squash",                                   "delicata-squash"),
(11, 1, 1, "Boston",             "Lettuce",                                  "boston-lettuce"),
(11, 1, 1, "Bibb",               "Lettuce",                                  "bibb-lettuce"),
(11, 1, 1, "Iceberg",            "Lettuce",                                  "iceberg-lettuce"),
(11, 1, 1, "Romaine",            "Lettuce",                                  "romaine-lettuce"),
(11, 1, 1, "Green Leaf",         "Lettuce",                                  "green-leaf-lettuce"),
(11, 1, 1, "Oak Leaf",           "Lettuce",                                  "oak-leaf-lettuce"),
(11, 1, 1, "Red Leaf",           "Lettuce",                                  "red-leaf-lettuce"),
(11, 1, 1, "",                   "Arugula Rocket",                           "arugula-rocket"),
(11, 1, 1, "",                   "Belgian Endive",                           "belgian-endive"),
(11, 1, 1, "",                   "Frisee",                                   "frisee"),
(11, 1, 1, "",                   "Escarole",                                 "escarole"),
(11, 1, 1, "",                   "Mache Lambs Lettuce",                      "mache-lambs-lettuce"),
(11, 1, 1, "",                   "Radicchio",                                "radicchio"),
(11, 1, 1, "",                   "Watercress",                               "watercress"),
(11, 1, 1, "Baby",               "Spinach",                                  "baby-spinach"),
(11, 1, 1, "Frozen",             "Spinach",                                  "spinach"),
(11, 1, 1, "",                   "Spinach",                                  "spinach"),
(11, 1, 1, "",                   "Swiss Chard",                              "swiss-chard"),
(11, 1, 1, "",                   "Beet Greens",                              "beet-greens"),
(11, 1, 1, "",                   "Dandelion Greens",                         "dandelion-greens"),
(11, 1, 1, "",                   "Mustard Greens",                           "mustard-greens"),
(11, 1, 1, "Shiitake",           "Mushrooms",                                "shiitake-mushrooms"),
(11, 1, 1, "Cremini",            "Mushrooms",                                "cremini-mushrooms"),
(11, 1, 1, "Portobello",         "Mushrooms",                                "portobello-mushrooms"),
(11, 1, 1, "",                   "Mushrooms",                                "mushrooms"),
(11, 1, 1, "Globe",              "Onion",                                    "globe-onion"),
(11, 1, 1, "Green",              "Onion",                                    "scallion-green-onion"),
(11, 1, 1, "Spanish",            "Onion",                                    "spanish-onion"),
(11, 1, 1, "Sweet",              "Onion",                                    "sweet-onion"),
(11, 1, 1, "",                   "Onion",                                    "onion"),
(11, 1, 1, "Pearl",              "Onions",                                   "pearl-onions"),
(11, 1, 1, "",                   "Garlic",                                   "garlic"),
(11, 1, 1, "",                   "Shallots",                                 "shallots"),
(11, 1, 1, "",                   "Leek",                                     "leek"),
(11, 1, 1, "Bell",               "Pepper",                                   "bell-pepper"),
(11, 1, 1, "Poblano",            "Pepper",                                   "poblano-pepper"),
(11, 1, 1, "Jalapeno",           "Pepper",                                   "jalapeno-pepper"),
(11, 1, 1, "Serrano",            "Pepper",                                   "serrano-pepper"),
(11, 1, 1, "Thai",               "Pepper",                                   "thai-pepper"),
(11, 1, 1, "Habanero",           "Pepper",                                   "habanero-pepper"),
(11, 1, 1, "Winterbor",          "Kale",                                     "winterbor-kale-curly-kale"),
(11, 1, 1, "Red Russian",        "Kale",                                     "red-russian-kale"),
(11, 1, 1, "",                   "Kale",                                     "kale"),
(11, 1, 1, "",                   "Green Beans",                              "green-beans"),
(11, 1, 1, "",                   "Celery",                                   "celery"),
(11, 1, 1, "",                   "Asparagus",                                "asparagus"),
(11, 1, 1, "Green",              "Peas",                                     "green-peas"),
(11, 1, 1, "Snow",               "Peas",                                     "snowpeas"),
(11, 1, 1, "Sugar Snap",         "Peas",                                     "sugar-snap-peas"),
(11, 1, 1, "",                   "Carrots",                                  "carrots"),
(11, 1, 1, "",                   "Parsnips",                                 "parsnips"),
(11, 1, 1, "White",              "Turnips",                                  "white-turnips"),
(11, 1, 1, "",                   "Turnips",                                  "turnips"),
(11, 1, 1, "French",             "Radishes",                                 "french-radishes"),
(11, 1, 1, "",                   "Radishes",                                 "radishes"),
(11, 1, 1, "Baby Gold",          "Beets",                                    "baby-gold-beets"),
(11, 1, 1, "Red",                "Beets",                                    "red-beets"),
(11, 1, 1, "",                   "Beets",                                    "beets"),
(11, 1, 1, "",                   "Daikon",                                   "daikon"),
(11, 1, 1, "",                   "Horseradish",                              "horseradish"),
(11, 1, 1, "",                   "Rutabaga",                                 "rutabaga"),
(11, 1, 1, "",                   "Ginger",                                   "ginger"),
(11, 1, 1, "",                   "Sunchoke Jerusalem Artichoke",             "sunchoke-jerusalem-artichoke"),
(11, 1, 1, "",                   "Fennel",                                   "fennel"),
(11, 1, 1, "",                   "Tomatillo",                                "tomatillo"),
(11, 1, 1, "Standard Beefsteak", "Tomatoes",                                 "standard-beefsteak-tomatoes"),
(11, 1, 1, "Plum Roma",          "Tomatoes",                                 "plum-roma-san-marzano-tomatoes"),
(11, 1, 1, "Plum San Marzano",   "Tomatoes",                                 "plum-roma-san-marzano-tomatoes"),
(11, 1, 1, "Sungold",            "Tomatoes",                                 "cherry-tomatoes"),
(11, 1, 1, "Cherry",             "Tomatoes",                                 "cherry-tomatoes"),
(11, 1, 1, "Grape",              "Tomatoes",                                 "grape-tomatoes"),
(11, 1, 1, "",                   "Tomatoes",                                 "cherry-tomatoes"),

(12, 1, 1, "Ambrosia",           "Apple",                                    "apple"),
(12, 1, 1, "Baldwin",            "Apple",                                    "apple"),
(12, 1, 1, "Braeburn",           "Apple",                                    "apple"),
(12, 1, 1, "Cameo",              "Apple",                                    "apple"),
(12, 1, 1, "Cortland",           "Apple",                                    "apple"),
(12, 1, 1, "Cosmic Crisp",       "Apple",                                    "apple"),
(12, 1, 1, "Empire",             "Apple",                                    "apple"),
(12, 1, 1, "Enterprise",         "Apple",                                    "apple"),
(12, 1, 1, "Fuji",               "Apple",                                    "apple"),
(12, 1, 1, "Gala",               "Apple",                                    "apple"),
(12, 1, 1, "Golden Delicious",   "Apple",                                    "apple"),
(12, 1, 1, "Granny Smith",       "Apple",                                    "apple"),
(12, 1, 1, "Honeycrisp",         "Apple",                                    "apple"),
(12, 1, 1, "Idared",             "Apple",                                    "apple"),
(12, 1, 1, "Jazz",               "Apple",                                    "apple"),
(12, 1, 1, "Jonagold",           "Apple",                                    "apple"),
(12, 1, 1, "Jonathan",           "Apple",                                    "apple"),
(12, 1, 1, "Liberty",            "Apple",                                    "apple"),
(12, 1, 1, "Macoun",             "Apple",                                    "apple"),
(12, 1, 1, "McIntosh Red",       "Apple",                                    "apple"),
(12, 1, 1, "Melrose",            "Apple",                                    "apple"),
(12, 1, 1, "Opal",               "Apple",                                    "apple"),
(12, 1, 1, "Ozark Gold",         "Apple",                                    "apple"),
(12, 1, 1, "Pinata",             "Apple",                                    "apple"),
(12, 1, 1, "Pink Lady",          "Apple",                                    "apple"),
(12, 1, 1, "Pristine",           "Apple",                                    "apple"),
(12, 1, 1, "Red Delicious",      "Apple",                                    "apple"),
(12, 1, 1, "Rome",               "Apple",                                    "apple"),
(12, 1, 1, "Spartan",            "Apple",                                    "apple"),
(12, 1, 1, "Stayman",            "Apple",                                    "apple"),
(12, 1, 1, "SweeTango",          "Apple",                                    "apple"),
(12, 1, 1, "Winesap",            "Apple",                                    "apple"),
(12, 1, 1, "",                   "Apple",                                    "apple"),
(12, 1, 1, "",                   "Apricot",                                  "apricot"),
(12, 1, 1, "",                   "Banana",                                   "banana"),
(12, 1, 1, "",                   "Blackberries",                             "blackberries"),
(12, 1, 1, "",                   "Blueberries",                              "blueberries"),
(12, 1, 1, "",                   "Cherries",                                 "cherries"),
(12, 1, 1, "Dried",              "Cranberries",                              "cranberries"),
(12, 1, 1, "",                   "Cranberries",                              "cranberries"),
(12, 1, 1, "Concord",            "Grapes",                                   "grapes"),
(12, 1, 1, "Flame",              "Grapes",                                   "grapes"),
(12, 1, 1, "Moon Drop",          "Grapes",                                   "grapes"),
(12, 1, 1, "Ruby",               "Grapes",                                   "grapes"),
(12, 1, 1, "Thompson",           "Grapes",                                   "grapes"),
(12, 1, 1, "",                   "Grapes",                                   "grapes"),
(12, 1, 1, "",                   "Guava",                                    "guava"),
(12, 1, 1, "",                   "Kiwi",                                     "kiwi"),
(12, 1, 1, "",                   "Mango",                                    "mango"),
(12, 1, 1, "",                   "Watermelon",                               "watermelon"),
(12, 1, 1, "",                   "Nectarine",                                "nectarine"),
(12, 1, 1, "",                   "Papaya",                                   "papaya"),
(12, 1, 1, "",                   "Peach",                                    "peach"),
(12, 1, 1, "Anjou Green",        "Pear",                                     "pear"),
(12, 1, 1, "Anjou Red",          "Pear",                                     "pear"),
(12, 1, 1, "Asian",              "Pear",                                     "pear"),
(12, 1, 1, "Bartlett",           "Pear",                                     "pear"),
(12, 1, 1, "Bosc",               "Pear",                                     "pear"),
(12, 1, 1, "Comice",             "Pear",                                     "pear"),
(12, 1, 1, "Concord",            "Pear",                                     "pear"),
(12, 1, 1, "Forelle",            "Pear",                                     "pear"),
(12, 1, 1, "French Butter",      "Pear",                                     "pear"),
(12, 1, 1, "Seckel",             "Pear",                                     "pear"),
(12, 1, 1, "Taylor\'s Gold",     "Pear",                                     "pear"),
(12, 1, 1, "",                   "Pear",                                     "pear"),
(12, 1, 1, "",                   "Pineapple",                                "pineapple"),
(12, 1, 1, "",                   "Orange",                                   "orange"),
(12, 1, 1, "",                   "Raspberries",                              "raspberries"),
(12, 1, 1, "",                   "Strawberries",                             "strawberries"),
(12, 1, 1, "",                   "Tangerine",                                "tangerine"),
(12, 1, 1, "",                   "Tangelo",                                  "tangelo"),
(12, 1, 1, "",                   "Blood Orange",                             "blood-orange"),
(12, 1, 1, "",                   "White Grapefruit",                         "white-grapefruit"),
(12, 1, 1, "",                   "Pink Grapefruit",                          "pink-grapefruit"),
(12, 1, 1, "",                   "Honeydew",                                 "honeydew"),
(12, 1, 1, "",                   "Cantaloupe",                               "cantaloupe"),
(12, 1, 1, "Italian",            "Plum",                                     "italian-plum"),
(12, 1, 1, "",                   "Plum",                                     "plum"),
(12, 1, 1, "",                   "Pomegranate",                              "pomegranate"),

(13, 1, 1, "",                   "Almonds",                                  "almonds"),
(13, 1, 1, "",                   "Brazil Nuts",                              "almonds"),
(13, 1, 1, "",                   "Cashews",                                  "cashews"),
(13, 1, 1, "",                   "Hazelnuts",                                "almonds"),
(13, 1, 1, "",                   "Macadamia Nuts",                           "almonds"),
(13, 1, 1, "",                   "Peacans",                                  "almonds"),
(13, 1, 1, "",                   "Peanuts",                                  "almonds"),
(13, 1, 1, "",                   "Pine Nuts",                                "almonds"),
(13, 1, 1, "",                   "Pistachios",                               "pistachios"),
(13, 1, 1, "",                   "Walnuts",                                  "almonds"),

(14, 1, 1, "",                   "Chia Seeds",                               "sesame-seeds"),
(14, 1, 1, "",                   "Hemp Seeds",                               "sesame-seeds"),
(14, 1, 1, "",                   "Poppy Seeds",                              "sesame-seeds"),
(14, 1, 1, "",                   "Pumpkin Seeds",                            "pumpkin-seeds"),
(14, 1, 1, "",                   "Sesame Seeds",                             "sesame-seeds"),
(14, 1, 1, "",                   "Quinoa",                                   "sesame-seeds"),

(15, 1, 1, "Ancho",              "Pepper",                                   "ancho-pepper"),
(15, 1, 1, "Arbol",              "Pepper",                                   "arbol-pepper"),
(15, 1, 1, "Cascabel",           "Pepper",                                   "cascabel-pepper"),
(15, 1, 1, "Guajillo",           "Pepper",                                   "guajillo-pepper"),
(15, 1, 1, "Morita",             "Pepper",                                   "morita-pepper"),
(15, 1, 1, "Mulato",             "Pepper",                                   "mulato-pepper"),
(15, 1, 1, "Pasilla",            "Pepper",                                   "pasilla-pepper"),
(15, 1, 1, "Pulla",              "Pepper",                                   "pulla-pepper"),
(15, 1, 1, "",                   "Celery Seeds",                             "celery-seeds"),
(15, 1, 1, "",                   "Cinnamon",                                 "cinnamon"),
(15, 1, 1, "",                   "Ground Cinnamon",                          "ground-cinnamon"),
(15, 1, 1, "",                   "Cloves",                                   "cloves"),
(15, 1, 1, "",                   "Ground Cloves",                            "ground-cloves"),
(15, 1, 1, "",                   "Caraway Seeds",                            "cumin-seeds"),
(15, 1, 1, "",                   "Cumin Seeds",                              "cumin-seeds"),
(15, 1, 1, "",                   "Cumin Powder",                             "cumin-powder"),
(15, 1, 1, "",                   "Fennel Seeds",                             "fennel-seeds"),
(15, 1, 1, "",                   "Garlic",                                   "garlic"),
(15, 1, 1, "",                   "Garlic Powder",                            "garlic-powder"),
(15, 1, 1, "",                   "Ginger",                                   "ginger"),
(15, 1, 1, "",                   "Ginger Powder",                            "ginger-powder"),
(15, 1, 1, "",                   "Shallots",                                 "shallots"),
(15, 1, 1, "",                   "Turmeric",                                 "turmeric"),
(15, 1, 1, "",                   "Turmeric Powder",                          "turmeric-powder"),

(16, 1, 1, "",                   "Basil",                                    "basil"),
(16, 1, 1, "",                   "Cilantro",                                 "cilantro"),
(16, 1, 1, "",                   "Fenugreek",                                "fenugreek"),
(16, 1, 1, "",                   "Parsley",                                  "parsley"),
(16, 1, 1, "",                   "Rosemary",                                 "rosemary"),
(16, 1, 1, "",                   "Sage",                                     "sage"),
(16, 1, 1, "",                   "Thyme",                                    "thyme"),

(17, 1, 1, "Apple Cider",        "Vinegar",                                  "apple-cider-vinegar"),
(17, 1, 1, "Balsamic",           "Vinegar",                                  "balsamic-vinegar"),
(17, 1, 1, "Rice",               "Vinegar",                                  "rice-vinegar"),

(18, 1, 1, "",                   "Fish Sauce",                               "fish-sauce"),
(18, 1, 1, "Dark",               "Soy Sauce",                                "dark-soy-sauce"),
(18, 1, 1, "Light",              "Soy Sauce",                                "light-soy-sauce");

INSERT INTO ingredient
(ingredient_type_id, author_id, owner_id, brand, name, description, image)
VALUES
(18, 1, 1, "Tobasco",            "Hot Sauce",                                "tobasco-hot-sauce");

INSERT INTO recipe
(recipe_type_id, cuisine_id, author_id, owner_id, title, description, active_time, total_time, directions)
VALUES
(1,  1,  1, 1, "Borscht",                            "Excellent",        "00:30:00", "04:00:00", "Chop beets and onions..."),
(2,  2,  1, 1, "Soft Buttery Pretzle",               "Melting goodness", "00:20:00", "01:20:00", "Set oven to 400 F. Mix dough..."),
(3,  3,  1, 1, "Grilled Chicken and Seasoned Rice",  "Yum",              "01:00:00", "02:00:00", "Marinate chicken in a..."),
(4,  4,  1, 1, "Mixed Root Vegetables",              "Satisfying",       "00:15:00", "01:00:00", "Chop vegetables into about 2 inch by 2 inch pieces..."),
(5,  5,  1, 1, "Coffee Vanilla Icecream Cake",       "Special",          "00:30:00", "01:00:00", "Set oven to 275 F. Mix dough..."),
(6,  6,  1, 1, "Fish Carrot and Potato Soup",        "Nice.",            "00:45:00", "01:00:00", "Heat stock..."),
(7,  7,  1, 1, "Possibly Greek Salad",               "Who Knows",        "00:08:00", "00:08:00", "Mix olive oil and red wine vinegar in bowl..."),
(8,  8,  1, 1, "Irish Guinness Beef Stew",           "Calming",          "00:45:00", "04:00:00", "Sear well just one side of the beef pieces..."),
(9,  9,  1, 1, "Northern Chinese Seafood Casserole", "Excellent",        "00:45:00", "01:30:00", "Heat stock..."),
(10, 10, 1, 1, "Sweet Coconut Lime Sauce",           "Interesting",      "00:20:00", "00:20:00", "Mix..."),
(11, 11, 1, 1, "Carrot Ginger Dressing",             "Tasty",            "00:20:00", "00:20:00", "Blend carrots and..."),
(12, 12, 1, 1, "Some Kind Of Chutney",               "Not Bad",          "00:30:00", "01:00:00", "Mix...");

INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES
(1,  1, 1),
(2,  1, 1),
(3,  1, 1),
(4,  1, 1),
(5,  1, 1),
(6,  1, 1),
(7,  1, 1),
(8,  1, 1),
(9,  1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1);

INSERT INTO recipe_ingredient (recipe_id, amount, measurement_id, ingredient_id) VALUES
(1,  4,  1,  116),
(2,  2,  2,  209),
(3,  1,  3,  153),
(4,  1,  4,  159),
(5,  7,  5,  165),
(6,  1,  6,  176),
(7,  3,  7,  142),
(8,  1,  8,  230),
(9,  9,  9,  202),
(10, 20, 10, 100),
(11, 10,  1, 122),
(12, 13,  2, 138);

INSERT INTO recipe_method (recipe_id, method_id) VALUES
(1,  6),
(2,  9),
(3,  13),
(4,  15),
(5,  16),
(6,  7),
(7,  4),
(8,  3),
(9,  2),
(10, 1),
(11, 12),
(12, 13);



CREATE FULLTEXT INDEX fulltext_idx_name ON equipment (name);

CREATE FULLTEXT INDEX fulltext_idx_brand   ON ingredient (brand);
CREATE FULLTEXT INDEX fulltext_idx_variety ON ingredient (variety);
CREATE FULLTEXT INDEX fulltext_idx_name    ON ingredient (name);

CREATE FULLTEXT INDEX fulltext_idx_brand   ON product (brand);
CREATE FULLTEXT INDEX fulltext_idx_variety ON product (variety);
CREATE FULLTEXT INDEX fulltext_idx_name    ON product (name);

CREATE FULLTEXT INDEX fulltext_idx_title ON recipe (title);

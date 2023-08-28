DROP DATABASE IF EXISTS nobsc;

CREATE DATABASE nobsc CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

USE nobsc;

--==============================================================================

CREATE TABLE unit (
  `unit_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `unit_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

--==============================================================================

CREATE TABLE staff (
  `staff_id`          CHAR(36)     PRIMARY KEY,
  `email`             VARCHAR(60)  NOT NULL UNIQUE,
  `password`          CHAR(60)     NOT NULL,
  `staffname`         VARCHAR(20)  NOT NULL UNIQUE,
  `confirmation_code` VARCHAR(255) DEFAULT NULL,
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--==============================================================================

CREATE TABLE user (
  `user_id`           CHAR(36)     PRIMARY KEY,
  `email`             VARCHAR(60)  NOT NULL UNIQUE,
  `password`          CHAR(60)     NOT NULL,
  `username`          VARCHAR(20)  NOT NULL UNIQUE,
  `confirmation_code` VARCHAR(255) DEFAULT NULL,
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- this may need improvement
CREATE TABLE friendship (
  `user_id`   CHAR(36)    NOT NULL,
  `friend_id` CHAR(36)    NOT NULL,
  `status`    VARCHAR(20) NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`friend_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

--==============================================================================

CREATE TABLE image (
  `image_id`   CHAR(36)     PRIMARY KEY,
  `image_url`  VARCHAR(100) NOT NULL,
  `alt_text`   VARCHAR(255) NOT NULL DEFAULT '',
  `caption`    VARCHAR(255) NOT NULL DEFAULT '',
  `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--==============================================================================

CREATE TABLE video (
  `video_id`   CHAR(36)     PRIMARY KEY,
  `video_url`  VARCHAR(100) NOT NULL,
  `title`      VARCHAR(100) NOT NULL DEFAULT '',
  `alt_text`   VARCHAR(255) NOT NULL DEFAULT '',
  `caption`    VARCHAR(255) NOT NULL DEFAULT '',
  `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--==============================================================================

CREATE TABLE chatgroup (
  `chatroom_id`   CHAR(36)    PRIMARY KEY,
  `owner_id`      CHAR(36)    NOT NULL,
  `chatroom_name` VARCHAR(32) NOT NULL,
  `invite_code`   CHAR(36)    NOT NULL,
  `created_at`    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE chatroom (
  `chatroom_id`   CHAR(36)    PRIMARY KEY,
  `chatgroup_id`  CHAR(36)    NOT NULL,
  `chatroom_name` VARCHAR(32) NOT NULL,
  `created_at`    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`chatgroup_id`) REFERENCES `chatgroup` (`chatgroup_id`) ON DELETE CASCADE
);

CREATE TABLE chatmessage (
  `chatmessage_id` CHAR(36)  PRIMARY KEY,
  `chatroom_id`    CHAR(36)  NOT NULL,
  `sender_id`      CHAR(36)  NOT NULL,
  `receiver_id`    CHAR(36)  NOT NULL,
  `content`        TEXT      NOT NULL,
  `image_id`       CHAR(36)  DEFAULT NULL,
  `video_id`       CHAR(36)  DEFAULT NULL,
  `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`chatroom_id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`)   REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`)    REFERENCES `image` (`image_id`)
);

CREATE TABLE chatgroup_user (
  `chatgroup_id` CHAR(36) NOT NULL,
  `user_id`      CHAR(36) NOT NULL,
  `is_admin`,
  `is_muted`,
  PRIMARY KEY (`chatgroup_id`, `user_id`),  -- do this for other junction tables???
  FOREIGN KEY (`chatgroup_id`) REFERENCES `chatgroup` (`chatgroup_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)     REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE chatroom_user (
  `chatroom_id` CHAR(36) NOT NULL,
  `user_id`     CHAR(36) NOT NULL,
  `is_admin`,
  `is_muted`,
  PRIMARY KEY (`chatroom_id`, `user_id`),  -- do this for other junction tables???
  FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`chatroom_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)     REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

--==============================================================================

CREATE TABLE equipment_type (
  `equipment_type_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `equipment_type_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE equipment (
  `equipment_id`      CHAR(36)         PRIMARY KEY,
  `equipment_type_id` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  `owner_id`          CHAR(36)         NOT NULL,
  `equipment_name`    VARCHAR(100)     NOT NULL,
  `notes`             TEXT             NOT NULL DEFAULT '',
  `image_id`          CHAR(36)         NOT NULL,
  FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_type` (`equipment_type_id`),
  FOREIGN KEY (`owner_id`)          REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

--==============================================================================

CREATE TABLE ingredient_type (
  `ingredient_type_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ingredient_type_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE ingredient (
  `ingredient_id`          CHAR(36)         PRIMARY KEY,
  `ingredient_type_id`     TINYINT UNSIGNED NOT NULL DEFAULT '0',
  `owner_id`               CHAR(36)         NOT NULL,
  `ingredient_brand`       VARCHAR(50)      NOT NULL DEFAULT '',
  `ingredient_variety`     VARCHAR(50)      NOT NULL DEFAULT '',
  `ingredient_name`        VARCHAR(50)      NOT NULL DEFAULT '',
  `notes`                  TEXT             NOT NULL DEFAULT '',
  `image_id`               CHAR(36)         NOT NULL,
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `ingredient_type` (`ingredient_type_id`),
  FOREIGN KEY (`owner_id`)           REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE ingredient_alt_name (
  `ingredient_id` CHAR(36),
  `alt_name`      VARCHAR(50),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`) ON DELETE CASCADE,
);

--==============================================================================

-- CREATE TABLE page ();

-- CREATE TABLE page_image ();

--==============================================================================

-- CREATE TABLE post ();

-- CREATE TABLE post_image ();

--==============================================================================

-- CREATE TABLE product ();

-- CREATE TABLE product_image ();

--==============================================================================

CREATE TABLE recipe_type (
  `recipe_type_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `recipe_type_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE method (
  `method_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `method_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE cuisine (
  `cuisine_id`     TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cuisine_name`   VARCHAR(50)      NOT NULL DEFAULT '',
  `continent_code` CHAR(2)          NOT NULL DEFAULT '',
  `country_code`   CHAR(3)          NOT NULL DEFAULT '' UNIQUE,
  `country_name`   VARCHAR(50)      NOT NULL DEFAULT '' UNIQUE
);

-- official recipes created by staff
CREATE TABLE recipe (
  `recipe_id`         CHAR(36)         PRIMARY KEY,
  `recipe_type_id`    TINYINT UNSIGNED NOT NULL,
  `cuisine_id`        TINYINT UNSIGNED NOT NULL,
  `author_id`          CHAR(36)         NOT NULL,
  `owner_id`          CHAR(36)         NOT NULL,
  `title`             VARCHAR(100)     NOT NULL UNIQUE,
  `description`       VARCHAR(150)     NOT NULL DEFAULT '',
  `active_time`       TIME             NOT NULL,
  `total_time`        TIME             NOT NULL,
  `directions`        TEXT             NOT NULL,
  `image_id`          CHAR(36)         NOT NULL,
  --`video_id`          CHAR(36)         NOT NULL,
  `created_at`        TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`recipe_type_id`) REFERENCES `recipe_type` (`recipe_type_id`),
  FOREIGN KEY (`cuisine_id`)     REFERENCES `cuisine` (`cuisine_id`),
  FOREIGN KEY (`author_id`)       REFERENCES `user` (`user_id`)
  FOREIGN KEY (`owner_id`)       REFERENCES `user` (`user_id`)
);

CREATE TABLE recipe_image (
  `recipe_id` CHAR(36) NOT NULL,
  `image_id`  CHAR(36) NOT NULL,
  `type`      TINYINT UNSIGNED NOT NULL,
  `order`     TINYINT UNSIGNED NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`)  REFERENCES `image` (`image_id`) ON DELETE CASCADE
);

CREATE TABLE recipe_equipment (
  `recipe_id`    CHAR(36)         NOT NULL,
  `amount`       TINYINT UNSIGNED DEFAULT NULL,
  `equipment_id` CHAR(36)         NOT NULL,
  FOREIGN KEY (`recipe_id`)    REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE,
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient (
  `recipe_id`     CHAR(36)         NOT NULL,
  `amount`        DECIMAL(5,2)     DEFAULT NULL,
  `unit_id`       TINYINT UNSIGNED DEFAULT NULL,
  `ingredient_id` CHAR(36)         NOT NULL,
  FOREIGN KEY (`recipe_id`)     REFERENCES `recipe` (`recipe_id`)  ON DELETE CASCADE,
  FOREIGN KEY (`unit_id`)       REFERENCES `unit` (`unit_id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`) ON DELETE CASCADE
);

CREATE TABLE recipe_method (
  `recipe_id` CHAR(36)         NOT NULL,
  `method_id` TINYINT UNSIGNED NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE,
  FOREIGN KEY (`method_id`) REFERENCES `method` (`method_id`)
);

CREATE TABLE recipe_subrecipe (
  `recipe_id`    CHAR(36)         NOT NULL,
  `amount`       DECIMAL(5,2)     DEFAULT NULL,
  `unit_id`      TINYINT UNSIGNED DEFAULT NULL,
  `subrecipe_id` CHAR(36)         NOT NULL,
  FOREIGN KEY (`recipe_id`)    REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE,
  FOREIGN KEY (`unit_id`)      REFERENCES `unit` (`unit_id`),
  FOREIGN KEY (`subrecipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE
);

CREATE TABLE favorite_recipe (
  `user_id`   CHAR(36) NOT NULL,
  `recipe_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE
);

CREATE TABLE saved_recipe (
  `user_id`   CHAR(36) NOT NULL,
  `recipe_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE
);

--==============================================================================

CREATE TABLE plan (
  `plan_id`   CHAR(36)    PRIMARY KEY,
  `author_id` CHAR(36)    NOT NULL,
  `owner_id`  CHAR(36)    NOT NULL,
  `plan_name` VARCHAR(50) NOT NULL DEFAULT '',
  FOREIGN KEY (`author_id`)  REFERENCES `user` (`user_id`) ON DELETE CASCADE
  FOREIGN KEY (`owner_id`)  REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE plan_day (
  `day_id`     CHAR(36) PRIMARY KEY,
  `plan_id`    CHAR(36) NOT NULL,
  `day_number` TINYINT  NOT NULL,
  FOREIGN KEY (`plan_id`) REFERENCES `plan` (`plan_id`) ON DELETE CASCADE
);

CREATE TABLE plan_day_recipe (
  `day_id`    CHAR(36) NOT NULL,
  `recipe_id` CHAR(36) NOT NULL,
  --PRIMARY KEY (day_id, recipe_id),
  FOREIGN KEY (`day_id`)    REFERENCES `plan_day` (`day_id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE
);

--==============================================================================

INSERT INTO staff (email, password, staffname) VALUES
("tjalferes@tjalferes.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "T. J. Alferes");

INSERT INTO user (email, password, username) VALUES
("tjalferes@tjalferes.com", "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "NOBSC"),
("tjalferes@gmail.com",     "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "Unknown"),
("testman@testman.com",     "$2b$10$t9rf/EFZEq9Pno49TaYwnOmILd8Fl64L2GTZM1K8JvHqquILnkg5u", "Testman");

INSERT INTO equipment_type (equipment_type_name) VALUES
("Cleaning"),
("Preparing"),
("Cooking"),
("Dining"),
("Storage");

INSERT INTO ingredient_type (ingredient_type_name) VALUES
("Fish"),
("Shellfish"),
("Beef"),
("Pork"),
("Poultry"),
("Egg"),
("Dairy"),
("Oil"),
("Grain"),
("Bean"),
("Vegetable"),
("Fruit"),
("Nut"),
("Seed"),
("Spice"),
("Herb"),
("Acid"),
("Product");

INSERT INTO unit (unit_name) VALUES
("teaspoon"),
("Tablespoon"),
("cup"),
("ounce"),
("pound"),
("milliliter"),
("liter"),
("gram"),
("kilogram"),
("pinch"),
("dash"),
("drop"),
("clove"),
("head"),
("NA");

INSERT INTO method (method_name) VALUES
("No-Cook"),
("Chill"),
("Freeze"),
("Microwave"),
("Toast"),
("Steam"),
("Poach"),
("Simmer"),
("Boil"),
("Blanch"),
("Stew"),
("Braise"),
("Bake"),
("Roast"),
("Broil"),
("Saute"),
("Pan-Fry"),
("Shallow-Fry"),
("Deep-Fry"),
("Stir-Fry"),
("Glaze"),
("BBQ"),
("Grill"),
("Smoke");

INSERT INTO recipe_type (recipe_type_name) VALUES
("Drink"),
("Appetizer"),
("Main"),
("Side"),
("Dessert"),
("Soup"),
("Salad"),
("Stew"),
("Casserole"),
("Sauce"),
("Dressing"),
("Condiment");

INSERT INTO cuisine (continent_code, country_code, cuisine_name, country_name) VALUES
("AF", "DZA", "Algerian",                 "Algeria"),
("AF", "AGO", "Angolan",                  "Angola"),
("AF", "BEN", "Benin",                    "Benin"),
("AF", "BWA", "Botswana",                 "Botswana"),
("AF", "BFA", "Burkinabe",                "Burkina Faso"),
("AF", "BDI", "Burundian",                "Burundi"),
("AF", "CPV", "Cape Verdean",             "Cabo Verde"),
("AF", "CMR", "Cameroonian",              "Cameroon"),
("AF", "CAF", "Central African Republic", "Central African Republic"),
("AF", "TCD", "Chadian",                  "Chad"),
("AF", "COM", "Comoros",                  "Comoros"),
("AF", "COD", "Congolese (Democratic)",   "Congo, Democratic Republic of the"),
("AF", "COG", "Congolese",                "Congo, Republic of the"),
("AF", "CIV", "Ivorian",                  "Côte d'Ivoire"),
("AF", "DJI", "Djiboutian",               "Djibouti"),
("AF", "EGY", "Egyptian",                 "Egypt"),
("AF", "GNQ", "Equatorial Guinea",        "Equatorial Guinea"),
("AF", "ERI", "Eritrean",                 "Eritrea"),
("AF", "SWZ", "Eswatini",                 "Eswatini"),
("AF", "ETH", "Ethiopian",                "Ethiopia"),
("AF", "GAB", "Gabonese",                 "Gabon"),
("AF", "GMB", "Gambian",                  "Gambia"),
("AF", "GHA", "Ghanaian",                 "Ghana"),
("AF", "GIN", "Guinea",                   "Guinea"),
("AF", "GNB", "Guinea-Bissauan",          "Guinea-Bissau"),
("AF", "KEN", "Kenyan",                   "Kenya"),
("AF", "LSO", "Basotho",                  "Lesotho"),
("AF", "LBR", "Liberian",                 "Liberia"),
("AF", "LBY", "Libyan",                   "Libya"),
("AF", "MDG", "Malagasy",                 "Madagascar"),
("AF", "MWI", "Malawian",                 "Malawi"),
("AF", "MLI", "Malian",                   "Mali"),
("AF", "MRT", "Mauritanian",              "Mauritania"),
("AF", "MUS", "Mauritius",                "Mauritius"),
("AF", "MAR", "Moroccan",                 "Morocco"),
("AF", "MOZ", "Mozambique",               "Mozambique"),
("AF", "NAM", "Namibian",                 "Namibia"),
("AF", "NER", "Niger",                    "Niger"),
("AF", "NGA", "Nigerian",                 "Nigeria"),
("AF", "RWA", "Rwandan",                  "Rwanda"),
("AF", "STP", "Sao Tome and Principe",    "Sao Tome and Principe"),
("AF", "SEN", "Senegalese",               "Senegal"),
("AF", "SYC", "Seychellois",              "Seychelles"),
("AF", "SLE", "Sierra Leonean",           "Sierra Leone"),
("AF", "SOM", "Somali",                   "Somalia"),
("AF", "ZAF", "South African",            "South Africa"),
("AF", "SSD", "South Sudanese",           "South Sudan"),
("AF", "SDN", "Sudanese",                 "Sudan"),
("AF", "TZA", "Tanzanian",                "Tanzania"),
("AF", "TGO", "Togolese",                 "Togo"),
("AF", "TUN", "Tunisian",                 "Tunisia"),
("AF", "UGA", "Ugandan",                  "Uganda"),
("AF", "ZMB", "Zambian",                  "Zambia"),
("AF", "ZWE", "Zimbabwean",               "Zimbabwe"),

("AM", "USA", "American",               "United States of America"),
("AM", "ATG", "Antigua and Barbuda",    "Antigua and Barbuda"),
("AM", "ARG", "Argentine",              "Argentina"),
("AM", "BHS", "Bahamian",               "Bahamas"),
("AM", "BRB", "Bajan",                  "Barbados"),
("AM", "BLZ", "Belizean",               "Belize"),
("AM", "BOL", "Bolivian",               "Bolivia"),
("AM", "BRA", "Brazilian",              "Brazil"),
("AM", "CAN", "Canadian",               "Canada"),
("AM", "CHL", "Chilean",                "Chile"),
("AM", "COL", "Colombian",              "Colombia"),
("AM", "CRI", "Costa Rican",            "Costa Rica"),
("AM", "CUB", "Cuban",                  "Cuba"),
("AM", "DMA", "Dominica",               "Dominica"),
("AM", "DOM", "Dominican Republic",     "Dominican Republic"),
("AM", "ECU", "Ecuadorian",             "Ecuador"),
("AM", "GRD", "Grenada",                "Grenada"),
("AM", "GTM", "Guatemalan",             "Guatemala"),
("AM", "GUY", "Guyanese",               "Guyana"),
("AM", "HTI", "Haitian",                "Haiti"),
("AM", "HND", "Honduran",               "Honduras"),
("AM", "JAM", "Jamaican",               "Jamaica"),
("AM", "MEX", "Mexican",                "Mexico"),
("AM", "NIC", "Nicaraguan",             "Nicaragua"),
("AM", "PAN", "Panamanian",             "Panama"),
("AM", "PRY", "Paraguayan",             "Paraguay"),
("AM", "PER", "Peruvian",               "Peru"),
("AM", "KNA", "Kittian Nevisian",       "Saint Kitts and Nevis"),
("AM", "LCA", "Saint Lucian",           "Saint Lucia"),
("AM", "VCT", "Vincentian Grenadinian", "Saint Vincent and the Grenadines"),
("AM", "SLV", "Salvadoran",             "El Salvador"),
("AM", "SUR", "Surinamese",             "Suriname"),
("AM", "TTO", "Trinidad and Tobago",    "Trinidad and Tobago"),
("AM", "URY", "Uruguayan",              "Uruguay"),
("AM", "VEN", "Venezuelan",             "Venezuala"),

("AS", "AFG", "Afghan",        "Afghanistan"),
("AS", "ARM", "Armenian",      "Armenia"),
("AS", "AZE", "Azerbaijani",   "Azerbaijan"),
("AS", "BHR", "Bahraini",      "Bahrain"),
("AS", "BGD", "Bangladeshi",   "Bangladesh"),
("AS", "BTN", "Bhutanese",     "Bhutan"),
("AS", "BRN", "Bruneian",      "Brunei"),
("AS", "KHM", "Cambodian",     "Cambodia"),
("AS", "CHN", "Chinese",       "China"),
("AS", "CYP", "Cypriot",       "Cyprus"),
("AS", "GEO", "Georgian",      "Georgia"),
("AS", "IND", "Indian",        "India"),
("AS", "IDN", "Indonesian",    "Indonesia"),
("AS", "IRN", "Iranian",       "Iran"),
("AS", "IRQ", "Iraqi",         "Iraq"),
("AS", "ISR", "Israeli",       "Israel"),
("AS", "JPN", "Japanese",      "Japan"),
("AS", "JOR", "Jordanian",     "Jordan"),
("AS", "KAZ", "Kazakh",        "Kazakhstan"),
("AS", "KWT", "Kuwaiti",       "Kuwait"),
("AS", "KGZ", "Kyrgyz",        "Kyrgyzstan"),
("AS", "LAO", "Lao",           "Laos"),
("AS", "LBN", "Lebanese",      "Lebanon"),
("AS", "MYS", "Malaysian",     "Malaysia"),
("AS", "MDV", "Maldivian",     "Maldives"),
("AS", "MNG", "Mongolian",     "Mongolia"),
("AS", "MMR", "Burmese",       "Myanmar"),
("AS", "NPL", "Nepalese",      "Nepal"),
("AS", "PRK", "North Korean",  "North Korea"),
("AS", "OMN", "Omani",         "Oman"),
("AS", "PAK", "Pakistani",     "Pakistan"),
("AS", "PSE", "Palestinian",   "Palestine"),
("AS", "PHL", "Filipino",      "Philippines"),
("AS", "QAT", "Qatari",        "Qatar"),
("AS", "RUS", "Russian",       "Russia"),
("AS", "SAU", "Saudi Arabian", "Saudi Arabia"),
("AS", "SGP", "Singaporean",   "Singapore"),
("AS", "KOR", "South Korean",  "South Korea"),
("AS", "LKA", "Sri Lankan",    "Sri Lanka"),
("AS", "SYR", "Syrian",        "Syria"),
("AS", "TWN", "Taiwanese",     "Taiwan"),
("AS", "TJK", "Tajik",         "Tajikistan"),
("AS", "THA", "Thai",          "Thailand"),
("AS", "TLS", "Timorese",      "Timor-Leste"),
("AS", "TUR", "Turkish",       "Turkey"),
("AS", "TKM", "Turkmen",       "Turkmenistan"),
("AS", "ARE", "Emirati",       "United Arab Emirates"),
("AS", "UZB", "Uzbek",         "Uzbekistan"),
("AS", "VNM", "Vietnamese",    "Vietnam"),
("AS", "YEM", "Yemeni",        "Yemen"),

("EU", "ALB", "Albanian",               "Albania"),
("EU", "AND", "Catalan",                "Andorra"),
("EU", "AUT", "Austrian",               "Austria"),
("EU", "BLR", "Belarusian",             "Belarus"),
("EU", "BEL", "Belgian",                "Belgium"),
("EU", "BIH", "Bosnia and Herzegovina", "Bosnia and Herzegovina"),
("EU", "BGR", "Bulgarian",              "Bulgaria"),
("EU", "HRV", "Croatian",               "Croatia"),
("EU", "CZE", "Czech",                  "Czechia"),
("EU", "DNK", "Danish",                 "Denmark"),
("EU", "EST", "Estonian",               "Estonia"),
("EU", "FIN", "Finnish",                "Finland"),
("EU", "FRA", "French",                 "France"),
("EU", "DEU", "German",                 "Germany"),
("EU", "GRC", "Greek",                  "Greece"),
("EU", "HUN", "Hungarian",              "Hungary"),
("EU", "ISL", "Icelandic",              "Iceland"),
("EU", "IRL", "Irish",                  "Ireland"),
("EU", "ITA", "Italian",                "Italy"),
("EU", "XXK", "Kosovan",                "Kosovo"),
("EU", "LVA", "Latvian",                "Latvia"),
("EU", "LIE", "Liechtensteiner",        "Liechtenstein"),
("EU", "LTU", "Lithuanian",             "Lithuania"),
("EU", "LUX", "Luxembourg",             "Luxembourg"),
("EU", "MLT", "Maltese",                "Malta"),
("EU", "MDA", "Moldovan",               "Moldova"),
("EU", "MCO", "Monégasque",             "Monaco"),
("EU", "MNE", "Montenegrin",            "Montenegro"),
("EU", "NLD", "Dutch",                  "Netherlands"),
("EU", "MKD", "Macedonian",             "North Macedonia"),
("EU", "NOR", "Norwegian",              "Norway"),
("EU", "POL", "Polish",                 "Poland"),
("EU", "PRT", "Portuguese",             "Portugal"),
("EU", "ROU", "Romanian",               "Romania"),
("EU", "SMR", "Sammarinese",            "San Marino"),
("EU", "SRB", "Serbian",                "Serbia"),
("EU", "SVK", "Slovak",                 "Slovakia"),
("EU", "SVN", "Slovenian",              "Slovenia"),
("EU", "ESP", "Spanish",                "Spain"),
("EU", "SWE", "Swedish",                "Sweden"),
("EU", "CHE", "Swiss",                  "Switzerland"),
("EU", "UKR", "Ukrainian",              "Ukraine"),
("EU", "GBR", "British",                "United Kingdom"),

("OC", "AUS", "Australian",        "Australia"),
("OC", "FJI", "Fijian",            "Fiji"),
("OC", "KIR", "Kiribati",          "Kiribati"),
("OC", "MHL", "Marshallese",       "Marshall Islands"),
("OC", "FSM", "Micronesian",       "Micronesia"),
("OC", "NRU", "Nauruan",           "Nauru"),
("OC", "NZL", "New Zealand",       "New Zealand"),
("OC", "PLW", "Palauan",           "Palau"),
("OC", "PNG", "Papua New Guinean", "Papua New Guinea"),
("OC", "WSM", "Samoan",            "Samoa"),
("OC", "SLB", "Solomon Islander",  "Solomon Islands"),
("OC", "TON", "Tongan",            "Tonga"),
("OC", "TUV", "Tuvaluan",          "Tuvalu"),
("OC", "VUT", "Vanuatuan",         "Vanuatu");

INSERT INTO equipment
(equipment_type_id, author_id, owner_id, equipment_name, image_id)
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
(ingredient_type_id, author_id, owner_id, ingredient_variety, ingredient_name, image_id)
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
(ingredient_type_id, author_id, owner_id, ingredient_brand, ingredient_name, notes, image_id)
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

INSERT INTO recipe_ingredient (recipe_id, amount, unit_id, ingredient_id) VALUES
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
(11, 10, 1,  122),
(12, 13, 2,  138);

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



CREATE FULLTEXT INDEX fulltext_idx_name ON equipment (equipment_name);

CREATE FULLTEXT INDEX fulltext_idx_brand   ON ingredient (brand);
CREATE FULLTEXT INDEX fulltext_idx_variety ON ingredient (variety);
CREATE FULLTEXT INDEX fulltext_idx_name    ON ingredient (ingredient_name);

CREATE FULLTEXT INDEX fulltext_idx_title ON recipe (title);

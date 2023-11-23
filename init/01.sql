DROP DATABASE IF EXISTS nobsc;

CREATE DATABASE nobsc CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE nobsc;

CREATE TABLE unit (
  `unit_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `unit_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE staff (
  `staff_id`          CHAR(36)     PRIMARY KEY,
  `email`             VARCHAR(60)  NOT NULL UNIQUE,
  `password`          CHAR(60)     NOT NULL,
  `staffname`         VARCHAR(20)  NOT NULL UNIQUE,
  `confirmation_code` VARCHAR(255) DEFAULT NULL,
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user (
  `user_id`           CHAR(36)     PRIMARY KEY,
  `email`             VARCHAR(60)  NOT NULL UNIQUE,
  `password`          CHAR(60)     NOT NULL,
  `username`          VARCHAR(20)  NOT NULL UNIQUE,
  `confirmation_code` VARCHAR(255) DEFAULT NULL,
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_reset (
  `reset_id`           CHAR(36)  PRIMARY KEY,
  `user_id`            CHAR(36)  NOT NULL UNIQUE,
  `temporary_password` CHAR(60)  NOT NULL,
  `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE image (
  `image_id`       CHAR(36)     PRIMARY KEY,
  `image_filename` VARCHAR(100) NOT NULL DEFAULT 'default',
  `caption`        VARCHAR(150) NOT NULL DEFAULT '',
  `author_id`      CHAR(36)     NOT NULL,
  `owner_id`       CHAR(36)     NOT NULL,
  `created_at`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `user` (`user_id`),
  FOREIGN KEY (`owner_id`)  REFERENCES `user` (`user_id`)
);

CREATE TABLE user_image (
  `user_id`  CHAR(36) NOT NULL,
  `image_id` CHAR(36) NOT NULL,
  `current`  BOOLEAN  NOT NULL DEFAULT false,
  FOREIGN KEY (`user_id`)  REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`) ON DELETE CASCADE
);

CREATE TABLE friendship (
  `user_id`   CHAR(36)    NOT NULL,
  `friend_id` CHAR(36)    NOT NULL,
  `status`    VARCHAR(20) NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`friend_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE chatgroup (
  `chatgroup_id`   CHAR(36)    PRIMARY KEY,
  `owner_id`       CHAR(36)    NOT NULL,
  `chatgroup_name` VARCHAR(32) NOT NULL,
  `invite_code`    CHAR(36)    NOT NULL,
  `created_at`     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  `chatroom_id`    CHAR(36),
  `sender_id`      CHAR(36)  NOT NULL,
  `receiver_id`    CHAR(36),
  `content`        TEXT      NOT NULL,
  `image_id`       CHAR(36)  DEFAULT NULL,
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
  `is_admin`     BOOLEAN  NOT NULL DEFAULT false,
  `is_muted`     BOOLEAN  NOT NULL DEFAULT false,
  PRIMARY KEY (`chatgroup_id`, `user_id`),
  FOREIGN KEY (`chatgroup_id`) REFERENCES `chatgroup` (`chatgroup_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)      REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE chatroom_user (
  `chatroom_id` CHAR(36) NOT NULL,
  `user_id`     CHAR(36) NOT NULL,
  `is_admin`    BOOLEAN  NOT NULL DEFAULT false,
  `is_muted`    BOOLEAN  NOT NULL DEFAULT false,
  PRIMARY KEY (`chatroom_id`, `user_id`),
  FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`chatroom_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)     REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE equipment_type (
  `equipment_type_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `equipment_type_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE equipment (
  `equipment_id`      CHAR(36)         PRIMARY KEY,
  `equipment_type_id` TINYINT UNSIGNED NOT NULL,
  `owner_id`          CHAR(36)         NOT NULL,
  `equipment_name`    VARCHAR(100)     NOT NULL,
  `notes`             TEXT             NOT NULL,
  `image_id`          CHAR(36)         NOT NULL,
  FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_type` (`equipment_type_id`),
  FOREIGN KEY (`owner_id`)          REFERENCES `user` (`user_id`),
  FOREIGN KEY (`image_id`)          REFERENCES `image` (`image_id`)
);

CREATE TABLE ingredient_type (
  `ingredient_type_id`   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ingredient_type_name` VARCHAR(25)      NOT NULL DEFAULT ''
);

CREATE TABLE ingredient (
  `ingredient_id`          CHAR(36)         PRIMARY KEY,
  `ingredient_type_id`     TINYINT UNSIGNED NOT NULL,
  `owner_id`               CHAR(36)         NOT NULL,
  `ingredient_brand`       VARCHAR(50)      NOT NULL DEFAULT '',
  `ingredient_variety`     VARCHAR(50)      NOT NULL DEFAULT '',
  `ingredient_name`        VARCHAR(50)      NOT NULL DEFAULT '',
  `notes`                  TEXT             NOT NULL,
  `image_id`               CHAR(36)         NOT NULL,
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `ingredient_type` (`ingredient_type_id`),
  FOREIGN KEY (`owner_id`)           REFERENCES `user` (`user_id`),
  FOREIGN KEY (`image_id`)           REFERENCES `image` (`image_id`)
);

CREATE TABLE ingredient_alt_name (
  `ingredient_id` CHAR(36)     NOT NULL,
  `alt_name`      VARCHAR(50),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`) ON DELETE CASCADE
);

-- CREATE TABLE page ();

-- CREATE TABLE page_image ();

-- CREATE TABLE post ();

-- CREATE TABLE post_image ();

-- CREATE TABLE product ();

-- CREATE TABLE product_image ();

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
  `continent_code` CHAR(2)          NOT NULL DEFAULT '',
  `country_code`   CHAR(3)          NOT NULL DEFAULT '' UNIQUE,
  `cuisine_name`   VARCHAR(50)      NOT NULL DEFAULT '',
  `country_name`   VARCHAR(50)      NOT NULL DEFAULT '' UNIQUE
);

CREATE TABLE recipe (
  `recipe_id`         CHAR(36)         PRIMARY KEY,
  `recipe_type_id`    TINYINT UNSIGNED NOT NULL,
  `cuisine_id`        TINYINT UNSIGNED NOT NULL,
  `author_id`         CHAR(36)         NOT NULL,
  `owner_id`          CHAR(36)         NOT NULL,
  `title`             VARCHAR(100)     NOT NULL UNIQUE,
  `description`       VARCHAR(150)     NOT NULL DEFAULT '',
  `active_time`       TIME             NOT NULL,
  `total_time`        TIME             NOT NULL,
  `directions`        TEXT             NOT NULL,
  `created_at`        TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`recipe_type_id`) REFERENCES `recipe_type` (`recipe_type_id`),
  FOREIGN KEY (`cuisine_id`)     REFERENCES `cuisine` (`cuisine_id`),
  FOREIGN KEY (`author_id`)      REFERENCES `user` (`user_id`),
  FOREIGN KEY (`owner_id`)       REFERENCES `user` (`user_id`)
);

CREATE TABLE recipe_image (
  `recipe_id` CHAR(36) NOT NULL,
  `image_id`  CHAR(36) NOT NULL,
  `type`      TINYINT UNSIGNED NOT NULL,
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

CREATE TABLE plan (
  `plan_id`   CHAR(36)    PRIMARY KEY,
  `author_id` CHAR(36)    NOT NULL,
  `owner_id`  CHAR(36)    NOT NULL,
  `plan_name` VARCHAR(50) NOT NULL DEFAULT '',
  FOREIGN KEY (`author_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`owner_id`)  REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE plan_recipe (
  `plan_id`       CHAR(36) NOT NULL,
  `recipe_id`     CHAR(36) NOT NULL,
  `day_number`    TINYINT  NOT NULL,
  `recipe_number` TINYINT  NOT NULL,
  -- PRIMARY KEY (day_id, recipe_id),
  FOREIGN KEY (`plan_id`)   REFERENCES `plan` (`plan_id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`) ON DELETE CASCADE
);

-- ==============================================================================

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



CREATE FULLTEXT INDEX fulltext_idx_equipment_name ON equipment (equipment_name);

CREATE FULLTEXT INDEX fulltext_idx_ingredient_brand   ON ingredient (ingredient_brand);
CREATE FULLTEXT INDEX fulltext_idx_ingredient_variety ON ingredient (ingredient_variety);
CREATE FULLTEXT INDEX fulltext_idx_ingredient_name    ON ingredient (ingredient_name);

CREATE FULLTEXT INDEX fulltext_idx_title ON recipe (title);

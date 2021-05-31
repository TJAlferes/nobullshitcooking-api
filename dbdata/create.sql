\W

DROP DATABASE nobsc;

CREATE DATABASE nobsc;

USE nobsc;

CREATE TABLE `content_types` (
  `id`        smallint unsigned NOT NULL DEFAULT '0'  PRIMARY KEY,
  `parent_id` smallint unsigned NOT NULL DEFAULT '0',
  `name`      varchar(60)       NOT NULL              UNIQUE,
  `path`      varchar(255)      NOT NULL              UNIQUE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cuisines` (
  `id`     tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name`   varchar(40)      NOT NULL DEFAULT ''  UNIQUE,
  `nation` varchar(40)      NOT NULL DEFAULT ''  UNIQUE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipment_types` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ingredient_types` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `measurements` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `methods` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_categories` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_types` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_types` (
  `id`   tinyint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(25)               DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `suppliers` (
  `id`   smallint unsigned NOT NULL DEFAULT '0' PRIMARY KEY,
  `name` varchar(60)       NOT NULL             UNIQUE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `customers` (
  `id`    int unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  `email` varchar(60)  NOT NULL UNIQUE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
  `id`                int unsigned NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `email`             varchar(60)  NOT NULL              UNIQUE,
  `pass`              char(60)     NOT NULL,
  `staffname`          varchar(20)  NOT NULL              UNIQUE,
  `confirmation_code` varchar(255)          DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id`                int unsigned NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `email`             varchar(60)  NOT NULL              UNIQUE,
  `pass`              char(60)     NOT NULL,
  `username`          varchar(20)  NOT NULL              UNIQUE,
  `confirmation_code` varchar(255)          DEFAULT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `content` (
  `id`              int unsigned      NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `content_type_id` smallint unsigned NOT NULL DEFAULT '0',
  `author_id`       int unsigned      NOT NULL,
  `owner_id`        int unsigned      NOT NULL,
  `created`         char(10)          NOT NULL,
  `published`       char(10),
  `title`           varchar(100)      NOT NULL,
  `image`           varchar(100)      NOT NULL DEFAULT '',
  `items`           json                       DEFAULT NULL,
  FOREIGN KEY (`content_type_id`) REFERENCES `content_types` (`id`),
  FOREIGN KEY (`author_id`)       REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`)        REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipment` (
  `id`                smallint unsigned NOT NULL             PRIMARY KEY AUTO_INCREMENT,
  `equipment_type_id` tinyint unsigned  NOT NULL DEFAULT '0',
  `author_id`         int unsigned      NOT NULL,
  `owner_id`          int unsigned      NOT NULL,
  `name`              varchar(100)      NOT NULL,
  `description`       text              NOT NULL,
  `image`             varchar(100)      NOT NULL DEFAULT '',
  FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_types` (`id`),
  FOREIGN KEY (`author_id`)         REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`)          REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ingredients` (
  `id`                 smallint unsigned NOT NULL             PRIMARY KEY AUTO_INCREMENT,
  `ingredient_type_id` tinyint unsigned  NOT NULL DEFAULT '0',
  `author_id`          int unsigned      NOT NULL,
  `owner_id`           int unsigned      NOT NULL,
  `brand`              varchar(50)       NOT NULL DEFAULT '',
  `variety`            varchar(50)       NOT NULL DEFAULT '',
  `name`               varchar(50)       NOT NULL DEFAULT '',
  `fullname`           varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)),
  `alt_names`          json                       DEFAULT NULL,
  `description`        text              NOT NULL,
  `image`              varchar(100)      NOT NULL DEFAULT '',
  FOREIGN KEY (`ingredient_type_id`) REFERENCES `ingredient_types` (`id`),
  FOREIGN KEY (`owner_id`)           REFERENCES `users` (`id`),
  FOREIGN KEY (`author_id`)          REFERENCES `users` (`id`) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `orders` (
  `id`          int unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `staff_id`    int unsigned NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  FOREIGN KEY (`staff_id`)    REFERENCES `staff` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `plans` (
  `id`        int unsigned NOT NULL            PRIMARY KEY AUTO_INCREMENT,
  `author_id` int unsigned NOT NULL,
  `owner_id`  int unsigned NOT NULL,
  `name`      varchar(100) NOT NULL DEFAULT '',
  `data`      json DEFAULT NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`owner_id`)  REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `products` (
  `id`                  smallint unsigned NOT NULL              PRIMARY KEY AUTO_INCREMENT,
  `product_category_id` tinyint unsigned  NOT NULL DEFAULT '0',
  `product_type_id`     tinyint unsigned  NOT NULL DEFAULT '0',
  `brand`               varchar(50)       NOT NULL DEFAULT '',
  `variety`             varchar(50)       NOT NULL DEFAULT '',
  `name`                varchar(50)       NOT NULL DEFAULT '',
  `fullname`            varchar(152) GENERATED ALWAYS AS (CONCAT(brand, ' ', variety, ' ', name)),
  `alt_names`           json                       DEFAULT NULL,
  `description`         text              NOT NULL,
  `specs`               json                       DEFAULT NULL,
  `image`               varchar(100)      NOT NULL DEFAULT '',
  FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`),
  FOREIGN KEY (`product_type_id`)     REFERENCES `product_types` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipes` (
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
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `favorite_recipes` (
  `user_id`   int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `friendships` (
  `user_id`   int unsigned NOT NULL,
  `friend_id` int unsigned NOT NULL,
  `status`    varchar(20)  NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`),
  FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `order_products` (
  `order_id`   int unsigned      NOT NULL,
  `product_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`order_id`)   REFERENCES `orders` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_suppliers` (
  `product_id`  smallint unsigned NOT NULL,
  `supplier_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`product_id`)  REFERENCES `products` (`id`),
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_equipment` (
  `recipe_id`    int unsigned      NOT NULL,
  `amount`       tinyint unsigned  NOT NULL,
  `equipment_id` smallint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`)    REFERENCES `recipes` (`id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_ingredients` (
  `recipe_id`      int unsigned      NOT NULL DEFAULT '0',
  `amount`         decimal(5,2)      NOT NULL,
  `measurement_id` tinyint unsigned  NOT NULL,
  `ingredient_id`  smallint unsigned NOT NULL DEFAULT '0',
  FOREIGN KEY (`recipe_id`)      REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`),
  FOREIGN KEY (`ingredient_id`)  REFERENCES `ingredients` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_methods` (
  `recipe_id` int unsigned     NOT NULL,
  `method_id` tinyint unsigned NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`),
  FOREIGN KEY (`method_id`) REFERENCES `methods` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recipe_subrecipes` (
  `recipe_id`      int unsigned     NOT NULL,
  `amount`         decimal(5,2)     NOT NULL,
  `measurement_id` tinyint unsigned NOT NULL,
  `subrecipe_id`   int unsigned     NOT NULL,
  FOREIGN KEY (`recipe_id`)      REFERENCES `recipes` (`id`),
  FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`),
  FOREIGN KEY (`subrecipe_id`)   REFERENCES `recipes` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `saved_recipes` (
  `user_id`   int unsigned NOT NULL,
  `recipe_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
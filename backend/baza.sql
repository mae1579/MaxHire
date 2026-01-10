-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Wersja serwera:               10.4.32-MariaDB - mariadb.org binary distribution
-- Serwer OS:                    Win64
-- HeidiSQL Wersja:              12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Zrzut struktury bazy danych storemax
CREATE DATABASE IF NOT EXISTS `storemax` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `storemax`;

-- Zrzut struktury tabela storemax.offers
CREATE TABLE IF NOT EXISTS `offers` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(40) NOT NULL,
  `company` varchar(40) NOT NULL,
  `description` varchar(155) NOT NULL,
  `tech` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tech`)),
  `links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`links`)),
  `updated` varchar(50) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `FK_offers_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Zrzucanie danych dla tabeli storemax.offers: ~4 rows (około)
INSERT INTO `offers` (`id`, `title`, `company`, `description`, `tech`, `links`, `updated`, `user_id`) VALUES
	('2638e05d-64e0-4040-88d2-2aa10cd67502', 'Webdeveloper', '', 'Witaj jestem web developerem', NULL, NULL, NULL, 'bc197781-5fce-42b9-aad6-10591e639771'),
	('3e376799-fe7d-4c39-9544-53b98b6dac02', 'React Developer', 'MegaK', 'Jestem full stack developer aplikacji webowych', '["java script","React","express.js"]', NULL, NULL, 'a0277004-f8b6-4d95-871f-4959e0451753'),
	('84029169-b273-4cde-b755-30cd1f1e5d14', 'Web developer Mateusz', '', 'Jestem web developerem ktory programuje w najnowszyhc jezykach i robi zajebsite strony', '["java script","React","express.js"]', NULL, NULL, 'bc197781-5fce-42b9-aad6-10591e639771'),
	('fd253cb7-27dd-42c2-818f-340b9ba1c4fd', 'Web developer Mateusz', '', 'Jestem full stack developer aplikacji webowych', '["java script","React","express.js"]', NULL, NULL, 'a0277004-f8b6-4d95-871f-4959e0451753');

-- Zrzut struktury tabela storemax.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(7) DEFAULT NULL,
  `name` varchar(55) NOT NULL,
  `surname` varchar(55) NOT NULL,
  `phone` varchar(9) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Zrzucanie danych dla tabeli storemax.users: ~8 rows (około)
INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `surname`, `phone`, `photo`) VALUES
	('2638e05d-64e0-4040-88d2-2aa10cd67501', 'Milkigmail@.com', '$2b$10$pzoOdtzHGTz7UZNL./iSE.4f6cuDvSL6yEvOGOG8kBKijov41vQPe', 'user', 'Mario', 'Creed', NULL, NULL),
	('483c5e36-d237-4b10-9ea5-8103b55d3e05', 'moon@gmail.com', '$2b$10$uavRx4rMnJmyGobeqptkpez.VJEpW4bkHUeM1azQIEraf7h79aEre', 'user', 'Jacard', 'Moon', NULL, NULL),
	('5d2c4420-78af-41ab-bff0-e7d711463b98', 'KOLEK@gmail.com', '$2b$10$C7pGbWGhKwMba.L2znTt1eGKAf7e7yrNhFkrnxEz5kdFvkV3uQktm', 'user', 'Jacard', 'Moon', NULL, 'https:.pl'),
	('a0277004-f8b6-4d95-871f-4959e0451753', 'hell@gmail.com', '$2b$10$edd5TsthV1G196tmdHbwwu4eWiuP658VRZWxtEkHv8ZITCOGhBGfi', 'user', 'John', 'Hell', NULL, 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1768008026/ProfilePhoto/vexjqgshmtdwrds9bgkq.jpg'),
	('b79fa00b-6652-4f77-90b2-8dd933f9ec80', 'kamil@wp.pl', '$2b$10$8uzrDSp4luTeZiKsBkGb/e4TKRg.bdBLwN9irPbpmLEW9qs0/CKMe', 'user', 'Jacard', 'Moon', NULL, 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1768008486/ProfilePhoto/tw7v5btvlulcqj4tlpus.jpg'),
	('bc197781-5fce-42b9-aad6-10591e639771', 'kowalski@wp.pl', '$2b$10$y27Yghrct7FhplUr3M2wO.Onm/Ngr/J.53/z9aG3wlOy9wzZjZ4Se', 'user', 'Adam', 'Nowak', NULL, NULL),
	('e11ac16f-a76c-4cda-a3d2-8cebd0cbef83', 'janek@gmail.com', '$2b$10$y27Yghrct7FhplUr3M2wO.Onm/Ngr/J.53/z9aG3wlOy9wzZjZ4Se', 'user', 'Janek', 'Nowak', NULL, NULL),
	('fb2f6f95-ea70-4d08-8939-bc3b8a91de71', 'm@gmail.com', '$2b$10$ksCVQDKYGN2gGFm/h75/melSEjukB4LI4Dvnxaa2L5XsYUx2lRX.u', 'user', 'Jacard', 'Moon', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

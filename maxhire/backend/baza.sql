-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Wersja serwera:               10.4.32-MariaDB - mariadb.org binary distribution
-- Serwer OS:                    Win64
-- HeidiSQL Wersja:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Zrzut struktury bazy danych storemax
CREATE DATABASE IF NOT EXISTS `storemax` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `storemax`;

-- Zrzut struktury tabela storemax.profiles
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(20) DEFAULT uuid(),
  `name` varchar(13) DEFAULT NULL,
  `surname` varchar(51) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `phone` varchar(9) DEFAULT NULL,
  `photo` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eksport danych został odznaczony.

-- Zrzut struktury tabela storemax.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(7) DEFAULT NULL,
  `name` varchar(10) NOT NULL,
  `surname` varchar(10) NOT NULL,
  `phone` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eksport danych został odznaczony.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 06, 2026 at 05:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storemax`
--

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(40) NOT NULL,
  `company` varchar(40) NOT NULL,
  `description` varchar(155) NOT NULL,
  `tech` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tech`)),
  `links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`links`)),
  `updated` varchar(50) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `title`, `company`, `description`, `tech`, `links`, `updated`, `user_id`) VALUES
('2638e05d-64e0-4040-88d2-2aa10cd67502', 'Webdeveloper', '', 'Witaj jestem web developerem', NULL, NULL, NULL, 'bc197781-5fce-42b9-aad6-10591e639771'),
('3e376799-fe7d-4c39-9544-53b98b6dac02', 'React Developer', 'MegaK', 'Jestem full stack developer aplikacji webowych', '[\"java script\",\"React\",\"express.js\"]', NULL, '1767612334', 'a0277004-f8b6-4d95-871f-4959e0451753'),
('84029169-b273-4cde-b755-30cd1f1e5d14', 'Web developer Mateusz', 'cwl', 'Jestem web developerem ktory programuje w najnowszyhc jezykach i robi zajebsite strony', '[\"java script\",\"React\",\"express.js\"]', NULL, '1765712334', 'bc197781-5fce-42b9-aad6-10591e639771'),
('fd253cb7-27dd-42c2-818f-340b9ba1c4fd', 'Web developer Mateusz', '', 'Jestem full stack developer aplikacji webowych', '[\"java script\",\"React\",\"express.js\"]', NULL, '1766612334', 'a0277004-f8b6-4d95-871f-4959e0451753');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(7) DEFAULT NULL,
  `name` varchar(55) NOT NULL,
  `surname` varchar(55) NOT NULL,
  `phone` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `surname`, `phone`) VALUES
('2638e05d-64e0-4040-88d2-2aa10cd67501', 'Milkigmail@.com', '$2b$10$pzoOdtzHGTz7UZNL./iSE.4f6cuDvSL6yEvOGOG8kBKijov41vQPe', 'user', 'Mario', 'Creed', NULL),
('a0277004-f8b6-4d95-871f-4959e0451753', 'hell@gmail.com', '$2b$10$edd5TsthV1G196tmdHbwwu4eWiuP658VRZWxtEkHv8ZITCOGhBGfi', 'user', 'John', 'Hell', NULL),
('bc197781-5fce-42b9-aad6-10591e639771', 'kowalski@wp.pl', '$2b$10$y27Yghrct7FhplUr3M2wO.Onm/Ngr/J.53/z9aG3wlOy9wzZjZ4Se', 'user', 'Adam', 'Nowak', NULL),
('e11ac16f-a76c-4cda-a3d2-8cebd0cbef83', 'janek@gmail.com', '$2b$10$y27Yghrct7FhplUr3M2wO.Onm/Ngr/J.53/z9aG3wlOy9wzZjZ4Se', 'user', 'Janek', 'Nowak', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `FK_offers_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

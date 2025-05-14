-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.32 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ratings_app
CREATE DATABASE IF NOT EXISTS `ratings_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ratings_app`;

-- Dumping structure for table ratings_app.ratings
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` int NOT NULL,
  `userId` int DEFAULT NULL,
  `storeId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `comment` text,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_10` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_12` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_14` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_16` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_18` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_20` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_4` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_6` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_8` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ratings_app.ratings: ~2 rows (approximately)
INSERT INTO `ratings` (`id`, `value`, `userId`, `storeId`, `createdAt`, `updatedAt`, `comment`) VALUES
	(1, 5, 26, 3, '2025-05-14 04:54:34', '2025-05-14 04:54:56', NULL),
	(2, 5, 25, 1, '2025-05-14 05:04:44', '2025-05-14 05:59:22', 'very good'),
	(3, 4, 26, 1, '2025-05-14 06:05:43', '2025-05-14 06:05:43', ''),
	(4, 5, 26, 4, '2025-05-14 06:08:21', '2025-05-14 06:08:21', 'Greatest youtuber in the history of the mankind'),
	(5, 4, 28, 1, '2025-05-14 06:46:08', '2025-05-14 06:46:08', 'not bad');

-- Dumping structure for table ratings_app.stores
CREATE TABLE IF NOT EXISTS `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `ownerId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_10` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_2` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_3` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_4` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_5` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_6` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_7` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_8` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_9` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ratings_app.stores: ~2 rows (approximately)
INSERT INTO `stores` (`id`, `name`, `email`, `address`, `ownerId`, `createdAt`, `updatedAt`) VALUES
	(1, 'Ayush piyush dsvdse \'s Store', 'a@gmail.com', 'po', 18, '2025-05-13 13:18:20', '2025-05-13 13:18:20'),
	(3, 'storeOwner\'s Store', 'storeOwner@exadfbmplfgbdsve.com', '123 Street, City', 20, '2025-05-13 14:46:19', '2025-05-13 14:46:19'),
	(4, 'Tech in air is the only one in your Youtube feed', 'ayushghodke21@gmail.com', 'Dhanakwadi, Pune', 27, '2025-05-14 06:07:13', '2025-05-14 06:07:13');

-- Dumping structure for table ratings_app.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(400) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','store_owner') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ratings_app.users: ~11 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `address`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
	(14, 'Ayush Shailesh Ghodke', 'ayushghodke21@gmail.com', 'pune', '$2b$10$kUCMU1KEcS7lKoQPK.WF1emjmOFhn4PvLPHOeLOeY73r6TNbIQOb6', 'store_owner', '2025-05-13 12:21:44', '2025-05-13 12:21:44'),
	(16, 'John Doe with a long name here', 'john@exadfbmplfgbdsve.com', '123 Street, City', '$2b$10$6QCXjwUVkoOof9VUZKSIRODhMmkJOPo2DiO8vX8PwpCQOjvrRZOQm', 'user', '2025-05-13 12:24:05', '2025-05-13 12:24:05'),
	(17, 'Ayush Shailesh Ghodke', 'ayushghodke@gmail.com', 'Ayu', '$2b$10$GEqPG56EsEc41vyeXfiJV.iuUg7y7xQ7uUs57KMmUhKk.Bt.PbR/G', 'user', '2025-05-13 13:05:19', '2025-05-13 13:05:19'),
	(18, 'Ayush piyush dsvdse ', 'a@gmail.com', 'po', '$2b$10$IIbKWqmrxdXgjaD.2yb3n.83hDyXwVN6bnOMPQGqOnNFpigZEAcfq', 'store_owner', '2025-05-13 13:18:20', '2025-05-13 13:18:20'),
	(20, 'storeOwner', 'storeOwner@exadfbmplfgbdsve.com', '123 Street, City', '$2b$10$CDmVU.aDWZhFSb5r8Gfxaef7PdGBdEbQP1Iw3Gb/u2eVwzv.HesyW', 'store_owner', '2025-05-13 14:46:19', '2025-05-13 14:46:19'),
	(22, 'John Doe with a long name here', 'name@exadfbmplfgbdsve.com', '123 Street, City', '$2b$10$jwrqsrPKuAdGO5mlh7H1..byd48izyTCpr0ezFE62/wWVrgQbrl/6', 'user', '2025-05-13 15:03:12', '2025-05-13 15:03:12'),
	(24, 'Ayush Shailesh Ghodke', 'ayushghod@gmail.com', 'pune', '$2b$10$8u0xLzID0j4MOD9X4zDjA.jXoThpgGRJENsX8KDDkVB4ppN84EMjq', 'user', '2025-05-14 03:58:16', '2025-05-14 03:58:16'),
	(25, 'Ayush Shailesh Ghodke', 'ayush3@gmail.com', 'pune', '$2b$10$z.b8zEAO0LXr.XH4BQYjjuoeUTGrqSmbpkjWdCSFLmewGbLBGMkDe', 'user', '2025-05-14 03:59:06', '2025-05-14 05:56:32'),
	(26, 'Ayush Shailesh Ghodke', 'ayush1@gmail.com', 'Sr no 6/9, Opposite to Dilip Banglow\nAshtdwar Soc Lane No 4, Taljai Road\nAshtdwar ganesh temple, Near Dhamdhere Bunglow', '$2b$10$Wr2G0ewayHz5sRyi5bpqCeCvqxa8hIaYALm7ydeJmqsUcK4ItY346', 'user', '2025-05-14 04:52:57', '2025-05-14 04:52:57'),
	(27, 'Ayush Shailesh Ghodke', 'ayushghodke213@gmail.com', 'Dhanakwadi, Pune', '$2b$10$XKcu/mveTIveOLwurepwTujQ6dT2/VuQXfb0dF3r1d5RbP37kCZZK', 'store_owner', '2025-05-14 06:06:38', '2025-05-14 06:06:38'),
	(28, 'Ayush Shailesh Ghodke', 'ayushghodke123@gmail.com', 'Sr no 6/9, Opposite to Dilip Banglow\nAshtdwar Soc Lane No 4, Taljai Road\nAshtdwar ganesh temple, Near Dhamdhere Bunglow', '$2b$10$/ErC8GtSxknYOYtkGXvMQeFI0FTD2sbZ2vUzVbLqyPP2TEsyEuobC', 'admin', '2025-05-14 06:33:31', '2025-05-14 06:33:31');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

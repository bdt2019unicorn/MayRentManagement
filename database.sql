SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


DROP TABLE IF EXISTS `apartment`;
CREATE TABLE IF NOT EXISTS `apartment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_id` int(11) NOT NULL DEFAULT 1,
  `area` decimal(10,0) NOT NULL DEFAULT 0,
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT 1,
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT 1,
  `balcony` tinyint(1) NOT NULL DEFAULT 0,
  `number_of_windows` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `apartment`;
INSERT INTO `apartment` (`id`, `name`, `building_id`, `area`, `number_of_bedrooms`, `number_of_bathroom`, `balcony`, `number_of_windows`) VALUES
(1, 'MAY', 1, '0', 1, 1, 0, 0),
(2, 'G01', 1, '0', 1, 1, 0, 0),
(3, 'G02', 1, '0', 1, 1, 0, 0),
(4, '101', 1, '0', 1, 1, 0, 0),
(5, '102', 1, '0', 1, 1, 0, 0),
(6, '103', 1, '0', 1, 1, 0, 0),
(7, '201', 1, '0', 1, 1, 1, 0),
(8, '202', 1, '0', 1, 1, 0, 0),
(9, '203', 1, '0', 1, 1, 0, 0),
(10, '301', 1, '0', 1, 1, 0, 0),
(11, '302', 1, '0', 1, 1, 0, 0),
(12, '303', 1, '0', 1, 1, 0, 0),
(13, '304', 1, '0', 1, 1, 0, 0),
(14, '401', 1, '0', 1, 1, 0, 0),
(15, '402', 1, '0', 1, 1, 0, 0);

DROP TABLE IF EXISTS `buildings`;
CREATE TABLE IF NOT EXISTS `buildings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `buildings`;
INSERT INTO `buildings` (`id`, `name`) VALUES
(1, 'May An Phu'),
(2, 'May Thi Nghe');

DROP TABLE IF EXISTS `expense`;
CREATE TABLE IF NOT EXISTS `expense` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expense_type_id` int(11) NOT NULL,
  `Start_period` date DEFAULT NULL,
  `End_period` date DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_type_id` (`expense_type_id`,`building_id`),
  KEY `apartment_id` (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `expense`;
DROP TABLE IF EXISTS `expense_type`;
CREATE TABLE IF NOT EXISTS `expense_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `expense_type`;
INSERT INTO `expense_type` (`id`, `name`) VALUES
(1, 'Salary'),
(2, 'Supplies (Flower, fuel)'),
(3, 'Water'),
(4, 'Telephone'),
(5, 'Electricity'),
(6, 'Marketing (commission, newspaper, advertisement)'),
(7, 'Repair and maintenance '),
(8, 'Cash payback to tenants'),
(9, 'Other');

DROP TABLE IF EXISTS `invoice`;
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `apartment` (`leaseagrm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `invoice`;
DROP TABLE IF EXISTS `invoice_leaseagrm`;
CREATE TABLE IF NOT EXISTS `invoice_leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL DEFAULT 1.000,
  `amount` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `revenue_type_id` (`revenue_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `invoice_leaseagrm`;
DROP TABLE IF EXISTS `invoice_utilities`;
CREATE TABLE IF NOT EXISTS `invoice_utilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `current_utility_reading_id` int(11) NOT NULL,
  `past_utility_reading_id` int(11) NOT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL,
  `amount` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `current_utility_reading_id` (`current_utility_reading_id`),
  KEY `past_utility_reading_id` (`past_utility_reading_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `invoice_utilities`;
DROP TABLE IF EXISTS `leaseagrm`;
CREATE TABLE IF NOT EXISTS `leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apartment_id` int(11) NOT NULL,
  `Tenant_ID` int(11) DEFAULT NULL,
  `ocupants_ids` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Start_date` date DEFAULT NULL,
  `Finish` date DEFAULT NULL,
  `Rent_amount` decimal(13,3) DEFAULT NULL,
  `Deposit_amount` decimal(13,3) DEFAULT NULL,
  `Deposit_payment_date` date DEFAULT NULL,
  `Deposit_payback_date` date DEFAULT NULL,
  `Monthly_payment_date` tinyint(4) DEFAULT NULL,
  `Deposit_currency` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Deposit_exchange_rate` decimal(13,3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `apartment_id` (`apartment_id`,`Tenant_ID`),
  KEY `Tenant_ID` (`Tenant_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `leaseagrm`;
INSERT INTO `leaseagrm` (`id`, `name`, `apartment_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`) VALUES
(1, 'AP Alan Kan G01', 2, 1, '[2,3]', '2020-09-14', '2020-12-24', '11111.000', '1.000', '2020-09-10', NULL, 1, 'vnd', '1.000'),
(2, 'AP Proctor G02 ', 3, 4, '[5]', '2020-09-21', '2021-01-14', '22222.000', '1.000', '2020-09-21', NULL, 1, 'vnd', '1.000');

DROP TABLE IF EXISTS `revenue`;
CREATE TABLE IF NOT EXISTS `revenue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leaseagrm_id` (`leaseagrm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `revenue`;
DROP TABLE IF EXISTS `revenue_type`;
CREATE TABLE IF NOT EXISTS `revenue_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `revenue_type`;
INSERT INTO `revenue_type` (`id`, `name`, `is_utility`) VALUES
(1, 'Rent', 0),
(2, 'Electricity', 1),
(3, 'Water', 1),
(4, 'Telephone', 0),
(5, 'Wireless', 0),
(6, 'Garage rental', 0),
(7, 'Laundry', 0),
(8, 'Deposit', 0),
(9, 'Other', 0);

DROP TABLE IF EXISTS `tenant`;
CREATE TABLE IF NOT EXISTS `tenant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Last_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Middle_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `First_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Date_of_birth` date DEFAULT NULL,
  `Nationality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Passport_ID_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Mobile_Phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Work_Phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Work_Email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Personal_Email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `tenant`;
INSERT INTO `tenant` (`id`, `Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`) VALUES
(1, 'Kan', 'MIssion', 'Alan', '1978-10-09', 'Chinese', 'AK1223', '02615513546', '0654132', 'a.k@gmail.com', 'a.k@gmail.com', 'Mission Ready HQ ', 's34ydfg'),
(2, 'Bernardin Christophe', 'Christophe', 'Jean', '1998-11-09', 'Phap', '17CE19159', '0888411139', NULL, NULL, 'jeanchristophebernardin@gmail.com', NULL, NULL),
(3, 'Schill', '', 'Christoph', '1985-12-09', 'Austria', 'P6845625', '0936658805', NULL, NULL, 'christoph.schill@pracsis.com', NULL, NULL),
(4, 'Proctor', 'James', 'Travis', '1997-09-28', '', '551087763', '01265552956', NULL, NULL, 'travisproctor9@gmail.com', NULL, NULL),
(5, 'Allada', '', 'Mahendra', '1745-09-06', '', 'BB109945', '', NULL, NULL, '', NULL, NULL);

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viber_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE `user`;
INSERT INTO `user` (`id`, `username`, `password`, `phone_number`, `email`, `viber_number`, `approved`) VALUES
(1, 'blastor555', '123456', '0259784563', 'blastor555@gmail.com', '0123654789', 1);

DROP TABLE IF EXISTS `utility_price`;
CREATE TABLE IF NOT EXISTS `utility_price` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `revenue_type_id` int(11) NOT NULL,
  `value` decimal(13,3) NOT NULL,
  `date_valid` date NOT NULL,
  `date_enter` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `utility_price`;
DROP TABLE IF EXISTS `utility_reading`;
CREATE TABLE IF NOT EXISTS `utility_reading` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `revenue_type_id` int(11) NOT NULL,
  `apartment_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `number` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`),
  KEY `apartment_id` (`apartment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `utility_reading`;

ALTER TABLE `apartment`
  ADD CONSTRAINT `apartment_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice_leaseagrm`
  ADD CONSTRAINT `invoice_leaseagrm_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_leaseagrm_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice_utilities`
  ADD CONSTRAINT `invoice_utilities_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_2` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_3` FOREIGN KEY (`past_utility_reading_id`) REFERENCES `utility_reading` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_4` FOREIGN KEY (`current_utility_reading_id`) REFERENCES `utility_reading` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `leaseagrm`
  ADD CONSTRAINT `leaseagrm_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_2` FOREIGN KEY (`Tenant_ID`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_price`
  ADD CONSTRAINT `utility_price_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`);

ALTER TABLE `utility_reading`
  ADD CONSTRAINT `utility_reading_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`),
  ADD CONSTRAINT `utility_reading_ibfk_2` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

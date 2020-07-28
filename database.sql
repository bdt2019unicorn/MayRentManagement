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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `apartment` (`id`, `name`, `building_id`, `area`, `number_of_bedrooms`, `number_of_bathroom`, `balcony`, `number_of_windows`) VALUES
( 1, 'MAY', 1, '0', 1, 1, 0, 0),
( 2, 'G01', 1, '0', 1, 1, 0, 0),
( 3, 'G02', 1, '0', 1, 1, 0, 0),
( 4, '101', 1, '0', 1, 1, 0, 0),
( 5, '102', 1, '0', 1, 1, 0, 0),
( 6, '103', 1, '0', 1, 1, 0, 0),
( 7, '201', 1, '0', 1, 1, 1, 0),
( 8, '202', 1, '0', 1, 1, 0, 0),
( 9, '203', 1, '0', 1, 1, 0, 0),
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
  `apartment_id` int(11) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(10,0) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_type_id` (`expense_type_id`,`apartment_id`),
  KEY `apartment_id` (`apartment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `expense_type`;
CREATE TABLE IF NOT EXISTS `expense_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

DROP TABLE IF EXISTS `leaseagrm`;
CREATE TABLE IF NOT EXISTS `leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apartment_id` int(11) NOT NULL,
  `Tenant_ID` int(11) DEFAULT NULL,
  `ocupants_ids` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Start_date` date DEFAULT NULL,
  `Finish` date DEFAULT NULL,
  `Rent_amount` decimal(10,0) DEFAULT NULL,
  `Deposit_amount` decimal(10,0) DEFAULT NULL,
  `Deposit_payment_date` date DEFAULT NULL,
  `Deposit_payback_date` date DEFAULT NULL,
  `Monthly_payment_date` tinyint(4) DEFAULT NULL,
  `Deposit_currency` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Deposit_exchange_rate` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `apartment_id` (`apartment_id`,`Tenant_ID`),
  KEY `Tenant_ID` (`Tenant_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `leaseagrm` (`name`, `apartment_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`) VALUES
('currently have somebody - rent paid ', 4, 447, '[446,436]', '2020-02-01', '2021-02-28', '500', '3000', '2020-02-01', '2021-02-28', 1, 'NZD', '15'),
('Allada everything paid and stuff ends in the past', 5, 440, '[444]', '2019-10-01', '2019-12-31', '560', '5600', '2019-10-01', '2019-12-31', 1, 'NZD', '14000'),
('Olivier stuff ends in the past', 5, 442, '[]', '2020-01-01', '2020-05-31', '598', '5987', '2020-01-01', '2020-05-31', 1, 'NZD', '12092'),
('Current**occupied and someone move in the future ', 6, 445, '[]', '2020-04-01', '2020-08-01', '12', '545', '2020-04-01', '2020-08-01', 1, 'vnd', '1'),
('New**occupied and someone move in the future ', 6, 439, '[]', '2020-11-01', '2022-02-28', '1', '1', '2020-11-01', '2022-02-28', 1, 'vnd', '1'),
('vacant - move in future with deposit', 7, 444, '[]', '2020-08-15', '2021-11-27', '1', '1', '2020-06-25', '2021-11-27', 1, 'vnd', '1'),
('vacant - move in future without deposit', 8, 438, NULL, '2020-09-02', '2021-05-29', '1', '1', NULL, NULL, 1, 'vnd', '1'),
('current-somebody in the future without deposit', 9, 437, NULL, '2020-05-01', '2020-07-31', '1', '1', '2020-05-01', '2020-07-31', 1, 'vnd', '1'),
('movin-somebody in the future without deposit', 9, 436, NULL, '2020-08-01', '2020-10-31', '1', '1', NULL, NULL, 1, 'vnd', '1');

DROP TABLE IF EXISTS `revenue`;
CREATE TABLE IF NOT EXISTS `revenue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Revenue_type_id` int(11) DEFAULT NULL,
  `Start_period` date DEFAULT NULL,
  `End_period` date DEFAULT NULL,
  `apartment_id` int(11) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(10,0) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Revenue_type_id` (`Revenue_type_id`,`apartment_id`),
  KEY `apartment_id` (`apartment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `revenue` (`name`, `Revenue_type_id`, `Start_period`, `End_period`, `apartment_id`, `Payment_date`, `Amount`, `Note`) VALUES
('Rent paid until date 1st time', 1, '2020-02-01', '2020-07-04', 4, '2020-02-01', '253242', NULL),
('102**done in the past**Allada', 1, '2019-10-01', '2019-12-31', 5, '2019-12-31', '2323', NULL),
('102**done in the past**Olivier', 1, '2020-01-01', '2020-05-31', 5, '2020-05-31', '534542', NULL),
('random money ', 7, '2020-06-01', '2020-06-30', 1, '2020-06-01', '126485', NULL),
('Current**occupied and paid', 1, '2020-04-01', '2020-08-01', 6, '2020-08-01', '2352', NULL),
('current paid-somebody in the future without deposi', 1, '2020-05-01', '2020-07-01', 9, '2020-06-19', '224324', NULL),
('4 - payment 2nd time', 1, '2020-07-04', '2020-08-31', 4, '2020-07-04', '1', NULL),
('4 - payment 3rd time', 1, '2020-08-31', '2020-09-28', 4, '2020-08-31', '1', NULL),
('202May2018elect', 2, '2018-05-07', '2018-05-31', 8, '2018-04-24', '720124', 'Mr.Parameter paid'),
('202May2018water', 3, '2018-05-07', '2018-05-31', 8, '2018-04-24', '77740', 'Mr.Parameter paid'),
('202May2018rent', 1, '2018-05-07', '2018-05-31', 8, '2018-04-24', '12000000', 'Mr.Parameter paid'),
('203May2018deposit', 8, '2018-05-16', '2019-05-15', 9, '2018-04-26', '10000000', 'Ms. Huyen'),
('102May2018rent', 1, '2018-05-01', '2018-05-31', 5, '2018-05-02', '17133750', 'Mr.Travis'),
('102May2018elect', 2, '2018-05-01', '2018-05-31', 5, '2018-05-02', '2059379', 'Mr.Travis'),
('102May2018water', 3, '2018-05-01', '2018-05-31', 5, '2018-05-02', '252655', 'Mr.Travis'),
('301May2018rent', 1, '2018-05-01', '2018-05-31', 10, '2018-05-01', '12430000', 'Mr.Humpreys'),
('301May2018elect', 2, '2018-05-01', '2018-05-31', 10, '2018-05-01', '1009930', 'Mr.Humpreys'),
('301May2018water', 3, '2018-05-01', '2018-05-31', 10, '2018-05-01', '19435', 'Mr.Humpreys'),
('G02May2018rent', 1, '2018-05-01', '2018-05-31', 3, '2018-05-02', '14157700', 'Ms Khanh'),
('G02May2018electt', 2, '2018-05-01', '2018-05-31', 3, '2018-05-02', '891373', 'Ms Khanh'),
('G02May2018water', 3, '2018-05-01', '2018-05-31', 3, '2018-05-02', '252655', 'Ms Khanh'),
('203May2018rent', 1, '2018-05-01', '2018-05-16', 9, '2018-05-03', '10318000', 'Mr LUCA'),
('203May2018Elect', 2, '2018-05-01', '2018-05-16', 9, '2018-05-03', '2599472', 'Mr LUCA'),
('203May2018water', 3, '2018-05-01', '2018-05-16', 9, '2018-05-03', '660790', 'Mr LUCA'),
('202May2018elect', 2, '2018-05-07', '2018-05-31', 8, '2018-04-24', '720124', 'Mr.Parameter paid'),
('202May2018water', 3, '2018-05-07', '2018-05-31', 8, '2018-04-24', '77740', 'Mr.Parameter paid'),
('202May2018rent', 1, '2018-05-07', '2018-05-31', 8, '2018-04-24', '12000000', 'Mr.Parameter paid'),
('203May2018deposit', 8, '2018-05-16', '2019-05-15', 9, '2018-04-26', '10000000', 'Ms. Huyen'),
('102May2018rent', 1, '2018-05-01', '2018-05-31', 5, '2018-05-02', '17133750', 'Mr.Travis'),
('102May2018elect', 2, '2018-05-01', '2018-05-31', 5, '2018-05-02', '2059379', 'Mr.Travis'),
('102May2018water', 3, '2018-05-01', '2018-05-31', 5, '2018-05-02', '252655', 'Mr.Travis'),
('301May2018rent', 1, '2018-05-01', '2018-05-31', 10, '2018-05-01', '12430000', 'Mr.Humpreys'),
('301May2018elect', 2, '2018-05-01', '2018-05-31', 10, '2018-05-01', '1009930', 'Mr.Humpreys'),
('301May2018water', 3, '2018-05-01', '2018-05-31', 10, '2018-05-01', '19435', 'Mr.Humpreys'),
('G02May2018rent', 1, '2018-05-01', '2018-05-31', 3, '2018-05-02', '14157700', 'Ms Khanh'),
('G02May2018electt', 2, '2018-05-01', '2018-05-31', 3, '2018-05-02', '891373', 'Ms Khanh'),
('G02May2018water', 3, '2018-05-01', '2018-05-31', 3, '2018-05-02', '252655', 'Ms Khanh'),
('203May2018rent', 1, '2018-05-01', '2018-05-16', 9, '2018-05-03', '10318000', 'Mr LUCA'),
('203May2018Elect', 2, '2018-05-01', '2018-05-16', 9, '2018-05-03', '2599472', 'Mr LUCA'),
('203May2018water', 3, '2018-05-01', '2018-05-16', 9, '2018-05-03', '660790', 'Mr LUCA'),
('Random', 7, '2020-07-01', '2020-07-31', 11, '2020-07-21', '4324253', ''),
('Test min', 7, '2020-07-01', '2020-07-31', 19, '2020-07-20', '-4235345', ''),
('test income', 8, '2020-07-01', '2020-07-31', 3, NULL, '-654654', ''),
('TEst', 5, '2020-07-01', '2020-07-30', 6, NULL, '98789', ''),
('Test reven - number', 6, '2020-07-01', '2020-07-02', 10, '2020-07-03', '9855', '');

DROP TABLE IF EXISTS `revenue_type`;
CREATE TABLE IF NOT EXISTS `revenue_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=459 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tenant` (`Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`) VALUES
('Kan', 'Test', 'Alan', '1985-06-18', 'Chinese', 'AK1223', '02615513546', '0654132', 'a.k@gmail.com', 'a.k@gmail.com', 'Mission Ready HQ ', 's34ydfg'),
('Bernardin Christophe', 'Christophe', 'Jean', '1919-11-09', 'Phap', '17CE19159', '0888411139', NULL, NULL, 'jeanchristophebernardin@gmail.com', NULL, NULL),
('Schill', '', 'Christoph', NULL, 'Austria', 'P6845625', '0936658805', NULL, NULL, 'christoph.schill@pracsis.com', NULL, NULL),
('Proctor', 'James', 'Travis', NULL, '', '551087763', '01265552956', NULL, NULL, 'travisproctor9@gmail.com', NULL, NULL),
('Allada', '', 'Mahendra', NULL, '', 'BB109945', '', NULL, NULL, '', NULL, NULL),
('Camille', 'Laur Marie', 'Alice', '1919-04-08', '', '', '0786893563', NULL, NULL, '', NULL, NULL),
('Olivier', '', 'Justine', NULL, '', '11DA13800', '0366125021', NULL, NULL, '', NULL, NULL),
('Hardwick', 'Peter', 'Andrew', NULL, '', '525204860', '', NULL, NULL, '', NULL, NULL),
('Paget', '', 'Christopher', '1919-09-05', '', 'E4097092', '0903735799', NULL, NULL, 'christopherwpaget@yahoo.com', NULL, NULL),
('Muschamp', 'Richard', 'Tim', '1919-08-10', '', 'M1455923', '0794065365', NULL, NULL, 'timmuschamp@yahoo.com.au', NULL, NULL),
('Deffein', '', 'Patrick', '1919-04-08', '', '10AP23821', '0903102418', NULL, NULL, 'deffeinp@yahoo.fr', NULL, NULL),
('Clark', 'William', 'Michael', '1919-04-05', '', '46357961', '', NULL, NULL, '', NULL, NULL),
('Mills', '', 'Adrian Robert', '1919-05-07', 'England', '521542670', '', NULL, NULL, '', NULL, NULL),
('Kornyk', '', 'Natalia', '1920-07-20', '', '234lks', '06354684545', '', '', '', '', ''),
('Lon', '', 'Jen', '1920-07-15', '', 'gfsdgsg', '34536457456', '', '', '', '', ''),
('DJ', NULL, 'Spash', '1998-07-31', 'VN', 'lskjoi0294', '2298438538', NULL, NULL, NULL, NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` (`id`, `username`, `password`, `phone_number`, `email`, `viber_number`, `approved`) VALUES
(1, 'blastor555', 'TB3456', '0259784563', 'blastor555@gmail.com', '0123654789', 1);

DROP TABLE IF EXISTS `utility_price`;
CREATE TABLE IF NOT EXISTS `utility_price` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `revenue_type_id` int(11) NOT NULL,
  `value` decimal(10,0) NOT NULL,
  `date_valid` date NOT NULL,
  `date_enter` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

INSERT INTO `utility_price` (`id`, `revenue_type_id`, `value`, `date_valid`, `date_enter`) VALUES
(1, 2, '100', '2020-06-01', '2020-07-01'),
(2, 3, '200', '2020-06-01', '2020-06-01'),
(3, 2, '200', '2020-07-06', '2020-07-06'),
(4, 3, '500', '2020-07-25', '2020-07-06'),
(5, 2, '234', '2020-07-09', '2020-07-28'),
(6, 2, '125', '2020-07-17', '2020-07-28'),
(7, 3, '900', '2020-08-08', '2020-07-28');

DROP TABLE IF EXISTS `utility_reading`;
CREATE TABLE IF NOT EXISTS `utility_reading` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `revenue_type_id` int(11) NOT NULL,
  `apartment_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `number` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`),
  KEY `apartment_id` (`apartment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4;

INSERT INTO `utility_reading` (`revenue_type_id`, `apartment_id`, `date`, `number`) VALUES
(2, 10, '2020-05-12 15:48:00', '125'),
(3, 10, '2020-05-12 15:49:00', '85'),
(2, 8, '2020-05-18 15:48:00', '564564'),
(3, 8, '2020-05-17 15:49:00', '5484'),
(2, 9, '2020-05-18 15:48:00', '332'),
(3, 9, '2020-05-17 15:49:00', '799'),
(2, 12, '2020-05-18 15:48:00', '215'),
(3, 12, '2020-05-17 15:49:00', '1647'),
(2, 11, '2020-05-18 15:48:00', '356'),
(3, 11, '2020-05-17 15:49:00', '1618'),
(2, 2, '2020-06-01 00:00:00', '10'),
(3, 2, '2020-06-01 00:00:00', '10'),
(2, 3, '2020-06-15 00:00:00', '2'),
(3, 3, '2020-06-15 00:00:00', '2'),
(2, 2, '2020-06-30 00:00:00', '13'),
(3, 2, '2020-06-30 00:00:00', '13'),
(2, 3, '2020-06-30 00:00:00', '10'),
(3, 3, '2020-06-30 00:00:00', '10'),
(2, 4, '2020-06-30 00:00:00', '7'),
(3, 4, '2020-06-30 00:00:00', '7'),
(2, 3, '2020-07-07 00:00:00', '15'),
(3, 3, '2020-07-07 00:00:00', '15'),
(2, 4, '2020-07-07 00:00:00', '19'),
(3, 4, '2020-07-07 00:00:00', '19'),
(2, 4, '2020-07-19 00:00:00', '20'),
(3, 4, '2020-07-19 00:00:00', '20'),
(2, 2, '2020-07-28 15:48:00', '564564'),
(3, 2, '2020-07-27 15:49:00', '5484'),
(2, 3, '2020-07-28 15:48:01', '332'),
(3, 3, '2020-07-27 15:49:01', '799'),
(2, 4, '2020-07-28 15:48:02', '215'),
(3, 4, '2020-07-27 15:49:02', '1647'),
(2, 5, '2020-07-28 15:48:03', '356'),
(3, 5, '2020-07-27 15:49:03', '1618');


ALTER TABLE `apartment`
  ADD CONSTRAINT `apartment_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `leaseagrm`
  ADD CONSTRAINT `leaseagrm_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_2` FOREIGN KEY (`Tenant_ID`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`Revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `revenue_ibfk_2` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

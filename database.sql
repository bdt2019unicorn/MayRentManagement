SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


DROP TABLE IF EXISTS `buildings`;
CREATE TABLE IF NOT EXISTS `buildings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `buildings` (`id`, `name`) VALUES
(1, 'May An Phu'),
(2, 'May Thi Nghe'),
(3, 'PKK');

DROP TABLE IF EXISTS `expense`;
CREATE TABLE IF NOT EXISTS `expense` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `expense_type_id` int(11) NOT NULL,
  `Start_period` date DEFAULT NULL,
  `End_period` date DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `expense_type_id` (`expense_type_id`,`building_id`),
  KEY `building_id` (`building_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

DROP TABLE IF EXISTS `expense_type`;
CREATE TABLE IF NOT EXISTS `expense_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `note` text COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `leaseagrm_id` (`leaseagrm_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `invoices` (`id`, `name`, `leaseagrm_id`, `note`) VALUES
(22, 'Resolve \"AP1\" period 15 Jan 2019 - 31 Oct 2020', 69, NULL),
(23, 'Resolve \"AP2\" period 19 Feb 2019 - 31 Oct 2020', 70, NULL),
(24, 'AP1 - testing 17 Nov 2020', 69, 'Test this thing ');

DROP TABLE IF EXISTS `invoice_leaseagrm`;
CREATE TABLE IF NOT EXISTS `invoice_leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL DEFAULT '1.000',
  `amount` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `revenue_type_id` (`revenue_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `invoice_leaseagrm` (`id`, `name`, `revenue_type_id`, `invoice_id`, `start_date`, `end_date`, `price`, `quantity`, `amount`) VALUES
(22, 'Rent \"AP1\" period 15 Jan 2019 - 31 Oct 2020', 1, 22, '2019-01-15', '2020-10-31', '1.000', '1.000', '21.548'),
(23, 'Rent \"AP2\" period 19 Feb 2019 - 31 Oct 2020', 1, 23, '2019-02-19', '2020-10-31', '1.000', '1.000', '20.357'),
(24, 'Garage rental (31 Oct 2020 - 31 Oct 2020)', 6, 24, '2020-10-31', '2020-10-31', '145.000', '1.000', '145.000');

DROP TABLE IF EXISTS `invoice_utilities`;
CREATE TABLE IF NOT EXISTS `invoice_utilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `utility_reading_id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL,
  `amount` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `utility_reading_id` (`utility_reading_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

DROP TABLE IF EXISTS `leaseagrm`;
CREATE TABLE IF NOT EXISTS `leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `Tenant_ID` int(11) DEFAULT NULL,
  `ocupants_ids` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Start_date` date DEFAULT NULL,
  `Finish` date DEFAULT NULL,
  `Rent_amount` decimal(13,3) DEFAULT NULL,
  `Deposit_amount` decimal(13,3) DEFAULT NULL,
  `Deposit_payment_date` date DEFAULT NULL,
  `Deposit_payback_date` date DEFAULT NULL,
  `Monthly_payment_date` tinyint(4) DEFAULT NULL,
  `Deposit_currency` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Deposit_exchange_rate` decimal(13,3) DEFAULT NULL,
  `note` text COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `Tenant_ID` (`Tenant_ID`),
  KEY `unit_id` (`unit_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `leaseagrm` (`id`, `name`, `unit_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`, `note`) VALUES
(54, 'A1', NULL, NULL, NULL, '2021-04-17', '2022-06-06', '1.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(55, 'A2', NULL, NULL, NULL, '2021-04-22', '2022-10-19', '2.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(56, 'A3', NULL, NULL, NULL, '2021-12-10', '2022-11-23', '3.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(57, 'A4', NULL, NULL, NULL, '2021-06-22', '2022-03-08', '4.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(58, 'A5', NULL, NULL, NULL, '2021-01-03', '2022-03-05', '5.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(59, 'A6', NULL, NULL, NULL, '2021-08-14', '2022-08-03', '6.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(60, 'A7', NULL, NULL, NULL, '2021-02-18', '2023-01-25', '7.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(61, 'A8', NULL, NULL, NULL, '2021-11-20', '2022-06-22', '8.000', NULL, NULL, NULL, NULL, NULL, '1.000', NULL),
(69, 'AP1', 2, 6, NULL, '2019-01-15', '2021-09-28', '1.000', '1.000', NULL, '2019-01-15', NULL, NULL, '1.000', NULL),
(70, 'AP2', 3, 10, NULL, '2019-02-19', '2021-11-05', '1.000', '1.000', NULL, '2019-02-19', NULL, NULL, '1.000', NULL),
(71, 'AP3', 4, 11, NULL, '2019-03-26', '2021-12-13', '1.000', '1.000', NULL, '2019-03-26', NULL, NULL, '1.000', NULL);

DROP TABLE IF EXISTS `revenue`;
CREATE TABLE IF NOT EXISTS `revenue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `leaseagrm_id` (`leaseagrm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `revenue` (`id`, `name`, `leaseagrm_id`, `Payment_date`, `Amount`, `Note`) VALUES
(6, 'Rent \"AP1\" period 15 Jan 2019 - 31 Oct 2020', 69, '2020-10-31', '21.548', NULL),
(7, 'Rent \"AP2\" period 19 Feb 2019 - 31 Oct 2020', 70, '2020-10-31', '20.357', NULL);

DROP TABLE IF EXISTS `revenue_type`;
CREATE TABLE IF NOT EXISTS `revenue_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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
  `Last_Name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Middle_Name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `First_Name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Date_of_birth` date DEFAULT NULL,
  `Nationality` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Passport_ID_number` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `visa_expiry_date` date DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `police_registration_date` date DEFAULT NULL,
  `expected_departure_date` date DEFAULT NULL,
  `Mobile_Phone` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Work_Phone` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Work_Email` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Personal_Email` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Company_Name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Company_address` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `tenant` (`id`, `Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `visa_expiry_date`, `building_id`, `police_registration_date`, `expected_departure_date`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`, `note`) VALUES
(6, 'Deffein', 'Marie', ' Yvon Patrick', '1989-01-01', 'FRA', '19FF66040', NULL, 1, NULL, NULL, '0903102418', '0', 'deffeinp@yahoo.fr', 'deffeinp@yahoo.fr', '0', '0', NULL),
(10, 'Proctor', 'James', 'Travis', '1976-05-12', 'USA', '567926124', NULL, 1, NULL, NULL, '0765552956', '0', '0', 'travisproctor9@gmail.com', '0', '0', NULL),
(11, 'Proctor', 'Jill', 'Tifany', '1976-05-12', 'USA', '566338262', NULL, 1, NULL, NULL, '0898320261', '0', '0', 'tiffanyproctor80@gmail.com', '0', '0', NULL),
(13, 'Gaffney', 'David', 'Roger', '1976-05-12', 'AUS', 'E4131610', NULL, 1, NULL, NULL, '0919794048', '0', '0', 'rogergaffney@gmail.com', '0', '0', NULL),
(15, 'Bouineau', 'Armelle', ' Josette Clara ', '1976-06-24', 'FRA', '18FH33060', NULL, 1, NULL, NULL, '0', '0', 'test.lka@yopmail.com', 'test.lka@yopmail.com', '0', '0', NULL),
(16, 'Thomine', ' Raoul', 'Leon Benjamin', '1976-05-12', 'FRA', '17AF32957', NULL, 1, NULL, NULL, 'khong co', '0', '0', 'benjamin.thomie@gmail.com', '0', '0', NULL),
(18, 'Paget ', 'William', 'Christopher', '1976-05-12', 'AUS', 'E4097092', NULL, 1, NULL, NULL, '0903735799', '0', '0', 'christopherwpaget@yahoo.com ', '0', '0', NULL),
(19, 'Muschamp', 'Richard', 'Timothy', '1976-05-12', '26580', 'PA9635513', NULL, 1, NULL, NULL, '0794065365', '0', '0', 'Timm@afg.vn', '0', '0', NULL),
(21, 'Clark ', ' William', 'Michael', '1976-05-12', 'USA', '567118083', NULL, 1, NULL, NULL, '0896409764', '0', '0', '0', '0', '0', NULL),
(23, 'Sadd', 'Azzahrae', 'Fatima', '1976-05-12', 'MAR', 'TZ5195461', NULL, 1, NULL, NULL, '0932648005', '0', '0', 'Fatimaczzahrae.sawd1@gmail.com', '0', '0', NULL),
(161, 'Tenant Thi Nghe 1', NULL, NULL, '1995-06-29', 'VN', 'PPN1', NULL, 2, NULL, NULL, '0123456781', NULL, NULL, 'PPN1@YOPMAIL.COM', 'Test', NULL, NULL),
(162, 'Tenant Thi Nghe 2', NULL, NULL, '1997-09-24', 'VN', 'PPN2', NULL, 2, NULL, NULL, '0123456782', NULL, NULL, 'PPN2@YOPMAIL.COM', 'Test', NULL, NULL),
(163, 'Tenant Thi Nghe 3', NULL, NULL, '1995-02-03', 'VN', 'PPN3', NULL, 2, NULL, NULL, '0123456783', NULL, NULL, 'PPN3@YOPMAIL.COM', 'Test', NULL, NULL),
(164, 'Tenant Thi Nghe 4', NULL, NULL, '1997-04-10', 'VN', 'PPN4', NULL, 2, NULL, NULL, '0123456784', NULL, NULL, 'PPN4@YOPMAIL.COM', 'Test', NULL, NULL),
(165, 'Tenant Thi Nghe 5', NULL, NULL, '1992-03-16', 'VN', 'PPN5', NULL, 2, NULL, NULL, '0123456785', NULL, NULL, 'PPN5@YOPMAIL.COM', 'Test', NULL, NULL),
(166, 'Tenant Thi Nghe 6', NULL, NULL, '1998-10-28', 'VN', 'PPN6', NULL, 2, NULL, NULL, '0123456786', NULL, NULL, 'PPN6@YOPMAIL.COM', 'Test', NULL, NULL);

DROP TABLE IF EXISTS `unit`;
CREATE TABLE IF NOT EXISTS `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(10) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `building_id` int(11) NOT NULL DEFAULT '1',
  `area` decimal(10,0) NOT NULL DEFAULT '0',
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT '1',
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT '1',
  `balcony` tinyint(1) DEFAULT '0',
  `number_of_windows` tinyint(4) NOT NULL DEFAULT '0',
  `note` text COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `unit` (`id`, `name`, `building_id`, `area`, `number_of_bedrooms`, `number_of_bathroom`, `balcony`, `number_of_windows`, `note`) VALUES
(1, 'MAY', 1, '0', 1, 1, 0, 0, ''),
(2, 'G01', 1, '0', 1, 1, 0, 0, ''),
(3, 'G02', 1, '0', 1, 1, 0, 0, ''),
(4, '101', 1, '0', 1, 1, 0, 0, ''),
(5, '102', 1, '0', 1, 1, 0, 0, ''),
(6, '103', 1, '0', 1, 1, 0, 0, ''),
(7, '201', 1, '0', 1, 1, 1, 0, ''),
(8, '202', 1, '0', 1, 1, 0, 0, ''),
(9, '203', 1, '0', 1, 1, 0, 0, ''),
(10, '301', 1, '0', 1, 1, 0, 0, ''),
(11, '302', 1, '0', 1, 1, 0, 0, ''),
(12, '303', 1, '0', 1, 1, 0, 0, ''),
(13, '304', 1, '0', 1, 1, 0, 0, ''),
(14, '401', 1, '0', 1, 1, 0, 0, ''),
(15, '402', 1, '0', 1, 1, 0, 0, ''),
(16, '304TN', 2, '0', 1, 1, 0, 0, ''),
(17, '401TN', 2, '0', 1, 1, 0, 0, ''),
(18, '402', 2, '0', 1, 1, 0, 0, '');

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `viber_number` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `user` (`id`, `username`, `password`, `phone_number`, `email`, `viber_number`, `approved`) VALUES
(1, 'blastor555', '123456', '0259784563', 'blastor555@gmail.com', '0123654789', 1),
(3, 'QuocAnh', 'MayRentManagement', '+84903959969', 'lhqanh@gmail.com', '+4915901244095', 1);

DROP TABLE IF EXISTS `utility_price`;
CREATE TABLE IF NOT EXISTS `utility_price` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `revenue_type_id` int(11) NOT NULL,
  `value` decimal(13,3) NOT NULL,
  `date_valid` date NOT NULL,
  `date_enter` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `utility_price` (`id`, `revenue_type_id`, `value`, `date_valid`, `date_enter`) VALUES
(1, 2, '11.000', '2020-10-01', '2020-11-18');

DROP TABLE IF EXISTS `utility_reading`;
CREATE TABLE IF NOT EXISTS `utility_reading` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `revenue_type_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL,
  `number` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`),
  KEY `unit_id` (`unit_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `utility_reading` (`id`, `revenue_type_id`, `unit_id`, `date`, `number`) VALUES
(1, 2, 3, '2020-11-01 17:18:00', '10.000'),
(2, 2, 3, '2020-11-14 17:20:00', '15.000'),
(3, 3, 3, '2020-11-10 17:34:00', '1.000'),
(4, 3, 3, '2020-11-14 17:34:00', '10.000');


ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice_leaseagrm`
  ADD CONSTRAINT `invoice_leaseagrm_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_leaseagrm_ibfk_2` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice_utilities`
  ADD CONSTRAINT `invoice_utilities_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_3` FOREIGN KEY (`utility_reading_id`) REFERENCES `utility_reading` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `leaseagrm`
  ADD CONSTRAINT `leaseagrm_ibfk_2` FOREIGN KEY (`Tenant_ID`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_3` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tenant`
  ADD CONSTRAINT `tenant_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`);

ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_price`
  ADD CONSTRAINT `utility_price_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_reading`
  ADD CONSTRAINT `utility_reading_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `utility_reading_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

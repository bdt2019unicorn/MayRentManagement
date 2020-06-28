-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2020 at 06:20 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `may`
--

-- --------------------------------------------------------

--
-- Table structure for table `apartment`
--

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

--
-- Truncate table before insert `apartment`
--

TRUNCATE TABLE `apartment`;
--
-- Dumping data for table `apartment`
--

INSERT INTO `apartment` (`id`, `name`, `building_id`, `area`, `number_of_bedrooms`, `number_of_bathroom`, `balcony`, `number_of_windows`) VALUES
(1, 'MAY', 1, '0', 1, 1, 0, 0),
(2, 'G01', 1, '0', 1, 1, 0, 0),
(3, 'G02', 1, '0', 1, 1, 0, 0),
(4, '101', 1, '0', 1, 1, 0, 0),
(5, '102', 1, '0', 1, 1, 0, 0),
(6, '103', 1, '0', 1, 1, 0, 0),
(7, '201', 1, '0', 1, 1, 0, 0),
(8, '202', 1, '0', 1, 1, 0, 0),
(9, '203', 1, '0', 1, 1, 0, 0),
(10, '301', 1, '0', 1, 1, 0, 0),
(11, '302', 1, '0', 1, 1, 0, 0),
(12, '303', 1, '0', 1, 1, 0, 0),
(13, '401', 1, '0', 1, 1, 0, 0),
(14, '402', 1, '0', 1, 1, 0, 0),
(19, '304', 1, '0', 1, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
CREATE TABLE IF NOT EXISTS `buildings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `buildings`
--

TRUNCATE TABLE `buildings`;
--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`id`, `name`) VALUES
(1, 'May An Phu'),
(2, 'May Thi Nghe');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `expense`
--

TRUNCATE TABLE `expense`;
-- --------------------------------------------------------

--
-- Table structure for table `expense_type`
--

DROP TABLE IF EXISTS `expense_type`;
CREATE TABLE IF NOT EXISTS `expense_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `expense_type`
--

TRUNCATE TABLE `expense_type`;
--
-- Dumping data for table `expense_type`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `leaseagrm`
--

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

--
-- Truncate table before insert `leaseagrm`
--

TRUNCATE TABLE `leaseagrm`;
--
-- Dumping data for table `leaseagrm`
--

INSERT INTO `leaseagrm` (`id`, `name`, `apartment_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`) VALUES
(66, 'currently have somebody - rent paid ', 4, 447, '[446,436]', '2020-02-01', '2021-02-28', '500', '3000', '2020-02-01', '2021-02-28', 1, 'NZD', '15'),
(67, 'Allada everything paid and stuff ends in the past', 5, 440, '[444]', '2019-10-01', '2019-12-31', '560', '5600', '2019-10-01', '2019-12-31', 1, 'NZD', '14000'),
(68, 'Olivier stuff ends in the past', 5, 442, '[]', '2020-01-01', '2020-05-31', '598', '5987', '2020-01-01', '2020-05-31', 1, 'NZD', '12092'),
(69, 'Current**occupied and someone move in the future ', 6, 445, '[]', '2020-04-01', '2020-08-01', '12', '545', '2020-04-01', '2020-08-01', 1, 'vnd', '1'),
(70, 'New**occupied and someone move in the future ', 6, 439, '[]', '2020-11-01', '2022-02-28', '1', '1', '2020-11-01', '2022-02-28', 1, 'vnd', '1'),
(71, 'vacant - move in future with deposit', 7, 444, '[]', '2020-08-15', '2021-11-27', '1', '1', '2020-06-25', '2021-11-27', 1, 'vnd', '1'),
(72, 'vacant - move in future without deposit', 8, 438, NULL, '2020-09-02', '2021-05-29', '1', '1', NULL, NULL, 1, 'vnd', '1'),
(73, 'current-somebody in the future without deposit', 9, 437, NULL, '2020-05-01', '2020-07-31', '1', '1', '2020-05-01', '2020-07-31', 1, 'vnd', '1'),
(74, 'movin-somebody in the future without deposit', 9, 436, NULL, '2020-08-01', '2020-10-31', '1', '1', NULL, NULL, 1, 'vnd', '1');

-- --------------------------------------------------------

--
-- Table structure for table `revenue`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `revenue`
--

TRUNCATE TABLE `revenue`;
--
-- Dumping data for table `revenue`
--

INSERT INTO `revenue` (`id`, `name`, `Revenue_type_id`, `Start_period`, `End_period`, `apartment_id`, `Payment_date`, `Amount`, `Note`) VALUES
(105, 'Rent paid until date 1st time', 1, '2020-02-01', '2020-07-04', 4, '2020-02-01', '253242', NULL),
(106, '102**done in the past**Allada', 1, '2019-10-01', '2019-12-31', 5, '2019-12-31', '2323', NULL),
(107, '102**done in the past**Olivier', 1, '2020-01-01', '2020-05-31', 5, '2020-05-31', '534542', NULL),
(108, 'random money ', 7, '2020-06-01', '2020-06-30', 1, '2020-06-01', '126485', NULL),
(109, 'Current**occupied and paid', 1, '2020-04-01', '2020-08-01', 6, '2020-08-01', '2352', NULL),
(110, 'current paid-somebody in the future without deposi', 1, '2020-05-01', '2020-07-01', 9, '2020-06-19', '224324', NULL),
(111, '4 - payment 2nd time', 1, '2020-07-04', '2020-08-31', 4, '2020-07-04', '1', NULL),
(112, '4 - payment 3rd time', 1, '2020-08-31', '2020-09-28', 4, '2020-08-31', '1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `revenue_type`
--

DROP TABLE IF EXISTS `revenue_type`;
CREATE TABLE IF NOT EXISTS `revenue_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `revenue_type`
--

TRUNCATE TABLE `revenue_type`;
--
-- Dumping data for table `revenue_type`
--

INSERT INTO `revenue_type` (`id`, `name`) VALUES
(1, 'Rent'),
(2, 'Electricity'),
(3, 'Water'),
(4, 'Telephone'),
(5, 'Wireless'),
(6, 'Garage rental'),
(7, 'Laundry'),
(8, 'Deposit'),
(9, 'Other');

-- --------------------------------------------------------

--
-- Table structure for table `tenant`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=457 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `tenant`
--

TRUNCATE TABLE `tenant`;
--
-- Dumping data for table `tenant`
--

INSERT INTO `tenant` (`id`, `Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`) VALUES
(436, 'Kan', 'Test', 'Alan', '1920-06-15', 'Chinese', 'AK1223', '02615513546', '0654132', 'a.k@gmail.com', 'a.k@gmail.com', 'sfsf', 's34ydfg'),
(437, 'Bernardin Christophe', 'Christophe', 'Jean', '1919-11-09', 'Phap', '17CE19159', '0888411139', NULL, NULL, 'jeanchristophebernardin@gmail.com', NULL, NULL),
(438, 'Schill', '', 'Christoph', NULL, 'Austria', 'P6845625', '0936658805', NULL, NULL, 'christoph.schill@pracsis.com', NULL, NULL),
(439, 'Proctor', 'James', 'Travis', NULL, '', '551087763', '01265552956', NULL, NULL, 'travisproctor9@gmail.com', NULL, NULL),
(440, 'Allada', '', 'Mahendra', NULL, '', 'BB109945', '', NULL, NULL, '', NULL, NULL),
(441, 'Camille', 'Laur Marie', 'Alice', '1919-04-08', '', '', '0786893563', NULL, NULL, '', NULL, NULL),
(442, 'Olivier', '', 'Justine', NULL, '', '11DA13800', '0366125021', NULL, NULL, '', NULL, NULL),
(443, 'Hardwick', 'Peter', 'Andrew', NULL, '', '525204860', '', NULL, NULL, '', NULL, NULL),
(444, 'Paget', '', 'Christopher', '1919-09-05', '', 'E4097092', '0903735799', NULL, NULL, 'christopherwpaget@yahoo.com', NULL, NULL),
(445, 'Muschamp', 'Richard', 'Tim', '1919-08-10', '', 'M1455923', '0794065365', NULL, NULL, 'timmuschamp@yahoo.com.au', NULL, NULL),
(446, 'Deffein', '', 'Patrick', '1919-04-08', '', '10AP23821', '0903102418', NULL, NULL, 'deffeinp@yahoo.fr', NULL, NULL),
(447, 'Clark', 'William', 'Michael', '1919-04-05', '', '46357961', '', NULL, NULL, '', NULL, NULL),
(448, 'Mills', '', 'Adrian Robert', '1919-05-07', 'England', '521542670', '', NULL, NULL, '', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `user`
--

TRUNCATE TABLE `user`;
--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `phone_number`, `email`, `viber_number`, `approved`) VALUES
(1, 'blastor555', '123456', '651468451', 'blastor555@gmail.com', '65849684', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `apartment`
--
ALTER TABLE `apartment`
  ADD CONSTRAINT `apartment_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `leaseagrm`
--
ALTER TABLE `leaseagrm`
  ADD CONSTRAINT `leaseagrm_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_2` FOREIGN KEY (`Tenant_ID`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `revenue`
--
ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`Revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `revenue_ibfk_2` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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
  `building_id` int(11) NOT NULL DEFAULT '1',
  `area` decimal(10,0) NOT NULL DEFAULT '0',
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT '1',
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT '1',
  `balcony` tinyint(1) NOT NULL DEFAULT '0',
  `number_of_windows` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `Note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `expense_type_id` (`expense_type_id`,`building_id`),
  KEY `apartment_id` (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `expense_type`;
CREATE TABLE IF NOT EXISTS `expense_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `name` varchar(50) NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `apartment` (`leaseagrm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `invoices` (`id`, `name`, `leaseagrm_id`) VALUES
(1, '1-23 Sep 2020', 1),
(2, '2-07 Oct 2020', 2);

DROP TABLE IF EXISTS `invoice_leaseagrm`;
CREATE TABLE IF NOT EXISTS `invoice_leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `invoice_leaseagrm` (`id`, `name`, `revenue_type_id`, `invoice_id`, `start_date`, `end_date`, `price`, `quantity`, `amount`) VALUES
(1, 'Rent (14 Sep 2020 - 30 Sep 2020)', 1, 1, '2020-09-14', '2020-09-30', '11111.000', '0.533', '5922.163');

DROP TABLE IF EXISTS `invoice_utilities`;
CREATE TABLE IF NOT EXISTS `invoice_utilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `invoice_utilities` (`id`, `name`, `invoice_id`, `utility_reading_id`, `revenue_type_id`, `price`, `quantity`, `amount`) VALUES
(1, 'G01 - Electricity 16 Sep 2020 - 20 Sep 2020', 1, 3, 2, '21.000', '6.000', '126.000'),
(2, 'G01 - Water 16 Sep 2020 - 20 Sep 2020', 1, 4, 3, '32.000', '6.000', '192.000'),
(3, 'G02 - Electricity 21 Sep 2020 - 28 Sep 2020', 2, 7, 2, '31.000', '11.000', '341.000');

DROP TABLE IF EXISTS `leaseagrm`;
CREATE TABLE IF NOT EXISTS `leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apartment_id` int(11) DEFAULT NULL,
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
  KEY `Tenant_ID` (`Tenant_ID`),
  KEY `apartment_id` (`apartment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `leaseagrm` (`id`, `name`, `apartment_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`) VALUES
(1, 'AP Alan Kan G01', 2, 1, '[2,3]', '2020-09-14', '2020-12-24', '11111.000', '1.000', '2020-09-10', NULL, 1, 'vnd', '1.000'),
(2, 'AP Proctor G02 ', 3, 4, '[5]', '2020-09-21', '2021-01-14', '22222.000', '1.000', '2020-09-21', NULL, 1, 'vnd', '1.000'),
(3, 'A12369', NULL, 15, NULL, '2021-03-13', '2022-03-13', '7.000', '7.000', NULL, NULL, 1, 'vnd', '1.000'),
(4, 'A12370', 13, 22, NULL, '2021-03-27', '2022-11-27', '5.000', '5.000', NULL, NULL, 1, 'vnd', '1.000'),
(5, 'A12371', 15, 19, NULL, '2021-04-02', '2021-08-02', '4.000', '4.000', NULL, NULL, 1, 'vnd', '1.000'),
(6, 'A12372', NULL, 22, NULL, '2021-04-13', '2022-09-13', '2.000', '2.000', NULL, NULL, 1, 'vnd', '1.000'),
(7, 'A12373', NULL, 21, NULL, '2021-04-21', '2022-08-21', '4.000', '4.000', NULL, NULL, 1, 'vnd', '1.000'),
(8, 'A12374', 9, 14, NULL, '2021-03-27', '2022-11-27', '4.000', '4.000', NULL, NULL, 1, 'vnd', '1.000'),
(9, 'A12375', 7, 6, NULL, '2021-04-14', '2022-10-14', '3.000', '3.000', NULL, NULL, 1, 'vnd', '1.000'),
(10, 'A12376', 8, 8, NULL, '2021-04-02', '2021-05-02', '10.000', '10.000', NULL, NULL, 1, 'vnd', '1.000'),
(11, 'A12377', NULL, 6, NULL, '2021-03-20', '2022-03-20', '6.000', '6.000', NULL, NULL, 1, 'vnd', '1.000'),
(12, 'A12378', NULL, 16, NULL, '2021-03-13', '2021-10-13', '8.000', '8.000', NULL, NULL, 1, 'vnd', '1.000'),
(13, 'A12379', NULL, 6, NULL, '2021-04-07', '2021-11-07', '3.000', '3.000', NULL, NULL, 1, 'vnd', '1.000'),
(14, 'A12380', NULL, 17, NULL, '2021-04-07', '2022-11-07', '8.000', '8.000', NULL, NULL, 1, 'vnd', '1.000'),
(15, 'A12381', NULL, NULL, NULL, '2021-04-03', '2022-05-03', '6.000', '6.000', NULL, NULL, 1, 'vnd', '1.000');

DROP TABLE IF EXISTS `revenue`;
CREATE TABLE IF NOT EXISTS `revenue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `leaseagrm_id` (`leaseagrm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `revenue_type`;
CREATE TABLE IF NOT EXISTS `revenue_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `police_registration_date` date DEFAULT NULL,
  `expected_departure_date` date DEFAULT NULL,
  `visa_expiry_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tenant` (`id`, `Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`, `police_registration_date`, `expected_departure_date`, `visa_expiry_date`) VALUES
(1, 'Kan', 'MIssion', 'Alan', '1978-10-09', 'Chinese', 'AK1223', '02615513546', '0654132', 'a.k@gmail.com', 'a.k@gmail.com', 'Mission Ready HQ ', 's34ydfg', NULL, NULL, NULL),
(2, 'Bernardin Christophe', 'Christophe', 'Jean', '1998-11-09', 'Phap', '17CE19159', '0888411139', NULL, NULL, 'jeanchristophebernardin@gmail.com', NULL, NULL, NULL, NULL, NULL),
(3, 'Schill', '', 'Christoph', '1985-12-09', 'Austria', 'P6845625', '0936658805', NULL, NULL, 'christoph.schill@pracsis.com', NULL, NULL, NULL, NULL, NULL),
(4, 'Proctor', 'James', 'Travis', '1997-09-28', '', '551087763', '01265552956', NULL, NULL, 'travisproctor9@gmail.com', NULL, NULL, NULL, NULL, NULL),
(5, 'Allada', '', 'Mahendra', '1745-09-06', '', 'BB109945', '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(6, 'Woodward', 'Test', 'Roseanne  ', '1966-01-06', 'English', 'WoodwardTestRoseanne  24113English', '0663528695', '0663528695', 'Roseanne  .Woodward@yopmail.com', 'Roseanne  .Woodward@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(7, 'Galvan', 'Test', 'Daria  ', '1941-05-01', 'English', 'GalvanTestDaria  15097English', '0105912617', '0105912617', 'Daria  .Galvan@yopmail.com', 'Daria  .Galvan@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(8, 'Flowers', 'Test', 'Drucilla  ', '1974-02-17', 'English', 'FlowersTestDrucilla  27077English', '010867331', '010867331', 'Drucilla  .Flowers@yopmail.com', 'Drucilla  .Flowers@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(9, 'Winters', 'Test', 'Jamar  ', '1946-03-08', 'English', 'WintersTestJamar  16869English', '0255646666', '0255646666', 'Jamar  .Winters@yopmail.com', 'Jamar  .Winters@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(10, 'Steele', 'Test', 'Daria  ', '1948-07-16', 'English', 'SteeleTestDaria  17730English', '0482676836', '0482676836', 'Daria  .Steele@yopmail.com', 'Daria  .Steele@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(11, 'Tanner', 'Test', 'Mozell  ', '1983-09-02', 'English', 'TannerTestMozell  30561English', '0134312786', '0134312786', 'Mozell  .Tanner@yopmail.com', 'Mozell  .Tanner@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(12, 'Galvan', 'Test', 'Cathie  ', '1911-10-29', 'English', 'GalvanTestCathie  4320English', '0956315247', '0956315247', 'Cathie  .Galvan@yopmail.com', 'Cathie  .Galvan@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(13, 'Gregory', 'Test', 'Karleen  ', '1918-05-08', 'English', 'GregoryTestKarleen  6703English', '0967405003', '0967405003', 'Karleen  .Gregory@yopmail.com', 'Karleen  .Gregory@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(14, 'Thornton', 'Test', 'Daria  ', '1964-09-11', 'English', 'ThorntonTestDaria  23631English', '0753565155', '0753565155', 'Daria  .Thornton@yopmail.com', 'Daria  .Thornton@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(15, 'Boyle', 'Test', 'Karleen  ', '1943-07-13', 'English', 'BoyleTestKarleen  15900English', '0794502435', '0794502435', 'Karleen  .Boyle@yopmail.com', 'Karleen  .Boyle@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(16, 'Winters', 'Test', 'Gilbert  ', '1972-01-09', 'English', 'WintersTestGilbert  26307English', '0474880854', '0474880854', 'Gilbert  .Winters@yopmail.com', 'Gilbert  .Winters@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(17, 'Steele', 'Test', 'Willis  ', '1924-08-21', 'English', 'SteeleTestWillis  9000English', '0558832040', '0558832040', 'Willis  .Steele@yopmail.com', 'Willis  .Steele@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(18, 'Woodward', 'Test', 'Holli  ', '1928-04-06', 'English', 'WoodwardTestHolli  10324English', '0145447641', '0145447641', 'Holli  .Woodward@yopmail.com', 'Holli  .Woodward@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(19, 'Castaneda', 'Test', 'Cathie  ', '1998-06-03', 'English', 'CastanedaTestCathie  35949English', '0358037062', '0358037062', 'Cathie  .Castaneda@yopmail.com', 'Cathie  .Castaneda@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(20, 'Harper', 'Test', 'Temeka  ', '1971-11-07', 'English', 'HarperTestTemeka  26244English', '0202745208', '0202745208', 'Temeka  .Harper@yopmail.com', 'Temeka  .Harper@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(21, 'Winters', 'Test', 'Karleen  ', '1939-10-14', 'English', 'WintersTestKarleen  14532English', '0762069443', '0762069443', 'Karleen  .Winters@yopmail.com', 'Karleen  .Winters@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(22, 'Gregory', 'Test', 'Phyllis  ', '1920-06-09', 'English', 'GregoryTestPhyllis  7466English', '0925124235', '0925124235', 'Phyllis  .Gregory@yopmail.com', 'Phyllis  .Gregory@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(23, 'Gregory', 'Test', 'Drucilla  ', '1968-09-09', 'English', 'GregoryTestDrucilla  25090English', '0723313282', '0723313282', 'Drucilla  .Gregory@yopmail.com', 'Drucilla  .Gregory@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(24, 'Flowers', 'Test', 'Holli  ', '1912-07-22', 'English', 'FlowersTestHolli  4587English', '029696841', '029696841', 'Holli  .Flowers@yopmail.com', 'Holli  .Flowers@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(25, 'Tanner', 'Test', 'Jamar  ', '1942-07-01', 'English', 'TannerTestJamar  15523English', '0851800125', '0851800125', 'Jamar  .Tanner@yopmail.com', 'Jamar  .Tanner@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(26, 'Woodward', 'Test', 'Cathie  ', '1923-03-18', 'English', 'WoodwardTestCathie  8478English', '0739665839', '0739665839', 'Cathie  .Woodward@yopmail.com', 'Cathie  .Woodward@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(27, 'Thornton', 'Test', 'Danial  ', '1988-01-26', 'English', 'ThorntonTestDanial  32168English', '0514266376', '0514266376', 'Danial  .Thornton@yopmail.com', 'Danial  .Thornton@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(28, 'Hickman', 'Test', 'Gilbert  ', '1977-09-17', 'English', 'HickmanTestGilbert  28385English', '080707334', '080707334', 'Gilbert  .Hickman@yopmail.com', 'Gilbert  .Hickman@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL),
(29, 'Winters', 'Test', 'Roseanne  ', '1952-01-21', 'English', 'WintersTestRoseanne  19014English', '0438844886', '0438844886', 'Roseanne  .Winters@yopmail.com', 'Roseanne  .Winters@yopmail.com', 'MAY TEST', NULL, NULL, NULL, NULL);

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viber_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

INSERT INTO `utility_price` (`id`, `revenue_type_id`, `value`, `date_valid`, `date_enter`) VALUES
(1, 2, '11.000', '2020-09-01', '2020-09-20'),
(2, 3, '22.000', '2020-09-02', '2020-09-20'),
(3, 2, '21.000', '2020-09-15', '2020-09-20'),
(4, 3, '32.000', '2020-09-16', '2020-09-20'),
(5, 2, '31.000', '2020-09-19', '2020-09-20'),
(6, 3, '42.000', '2020-09-19', '2020-09-20');

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

INSERT INTO `utility_reading` (`id`, `revenue_type_id`, `apartment_id`, `date`, `number`) VALUES
(1, 2, 2, '2020-09-16 23:11:00', '5.000'),
(2, 3, 2, '2020-09-16 23:11:00', '6.000'),
(3, 2, 2, '2020-09-20 23:12:00', '11.000'),
(4, 3, 2, '2020-09-20 23:12:00', '12.000'),
(5, 2, 3, '2020-09-21 21:00:00', '0.000'),
(6, 3, 3, '2020-09-21 21:00:00', '0.000'),
(7, 2, 3, '2020-09-28 21:00:00', '11.000'),
(8, 3, 3, '2020-09-28 21:00:00', '22.000');


ALTER TABLE `apartment`
  ADD CONSTRAINT `apartment_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice_leaseagrm`
  ADD CONSTRAINT `invoice_leaseagrm_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_leaseagrm_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoice_utilities`
  ADD CONSTRAINT `invoice_utilities_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_2` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_utilities_ibfk_3` FOREIGN KEY (`utility_reading_id`) REFERENCES `utility_reading` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `leaseagrm`
  ADD CONSTRAINT `leaseagrm_ibfk_2` FOREIGN KEY (`Tenant_ID`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_3` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_price`
  ADD CONSTRAINT `utility_price_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`);

ALTER TABLE `utility_reading`
  ADD CONSTRAINT `utility_reading_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartment` (`id`),
  ADD CONSTRAINT `utility_reading_ibfk_2` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

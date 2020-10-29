SET FOREIGN_KEY_CHECKS=0;
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
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `buildings` (`id`, `name`) VALUES
(1, 'May An Phu'),
(2, 'May Thi Nghe'),
(3, 'PKK');

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
  KEY `building_id` (`building_id`) USING BTREE
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

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leaseagrm_id` (`leaseagrm_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `leaseagrm`;
CREATE TABLE IF NOT EXISTS `leaseagrm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
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
  KEY `unit_id` (`unit_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `leaseagrm` (`id`, `name`, `unit_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`) VALUES
(3, '', 4, NULL, NULL, '0020-01-04', '0023-07-03', 12000000.000, 11415000.000, '0020-01-04', '0023-07-03', 1, NULL, NULL),
(4, '', 5, NULL, NULL, '0019-09-01', '0021-08-01', 17625000.000, 12000000.000, '0019-09-01', '0021-08-01', 1, NULL, NULL),
(5, '', 6, NULL, NULL, '0020-11-07', '0024-06-07', 18067000.000, 38511000.000, '0020-11-07', '0024-06-07', 1, NULL, NULL),
(6, '', 8, NULL, NULL, '0020-01-10', '0023-07-03', 13000000.000, 13000000.000, '0020-01-10', '0023-07-03', 1, NULL, NULL),
(7, '', 9, NULL, NULL, '0019-01-09', '0020-01-09', 17000000.000, 19755250.000, '0019-01-09', '0020-01-09', 1, NULL, NULL),
(8, '', 11, NULL, NULL, '0017-10-01', NULL, 15939000.000, 15939000.000, '0017-10-01', NULL, 1, NULL, NULL),
(9, '', 12, NULL, NULL, '0020-01-08', '0023-07-07', 18067000.000, 18067000.000, '0020-01-08', '0023-07-07', 1, NULL, NULL),
(10, '', 15, NULL, NULL, '0020-03-02', '0023-06-07', 16278500.000, 16859875.000, '0020-03-02', '0023-06-07', 1, NULL, NULL),
(11, '', 4, NULL, NULL, '0020-01-04', '0023-07-03', 12000000.000, 11415000.000, '0020-01-04', '0023-07-03', 1, NULL, NULL),
(12, '', 5, NULL, NULL, '0019-09-01', '0021-08-01', 17625000.000, 12000000.000, '0019-09-01', '0021-08-01', 1, NULL, NULL),
(13, '', 6, NULL, NULL, '0020-11-07', '0024-06-07', 18067000.000, 38511000.000, '0020-11-07', '0024-06-07', 1, NULL, NULL),
(14, '', 8, NULL, NULL, '0020-01-10', '0023-07-03', 13000000.000, 13000000.000, '0020-01-10', '0023-07-03', 1, NULL, NULL),
(15, '', 9, NULL, NULL, '0019-01-09', '0020-01-09', 17000000.000, 19755250.000, '0019-01-09', '0020-01-09', 1, NULL, NULL),
(16, '', 11, NULL, NULL, '0017-10-01', NULL, 15939000.000, 15939000.000, '0017-10-01', NULL, 1, NULL, NULL),
(17, '', 12, NULL, NULL, '0020-01-08', '0023-07-07', 18067000.000, 18067000.000, '0020-01-08', '0023-07-07', 1, NULL, NULL),
(18, '', 15, NULL, NULL, '0020-03-02', '0023-06-07', 16278500.000, 16859875.000, '0020-03-02', '0023-06-07', 1, NULL, NULL),
(19, '', 4, NULL, NULL, NULL, NULL, 12000000.000, 11415000.000, NULL, NULL, 1, NULL, NULL),
(20, '', 5, NULL, NULL, NULL, NULL, 17625000.000, 12000000.000, NULL, NULL, 1, NULL, NULL),
(21, '', 6, NULL, NULL, NULL, NULL, 18067000.000, 38511000.000, NULL, NULL, 1, NULL, NULL),
(22, '', 8, NULL, NULL, NULL, NULL, 13000000.000, 13000000.000, NULL, NULL, 1, NULL, NULL),
(23, '', 9, NULL, NULL, NULL, NULL, 17000000.000, 19755250.000, NULL, NULL, 1, NULL, NULL),
(24, '', 11, NULL, NULL, NULL, NULL, 15939000.000, 15939000.000, NULL, NULL, 1, NULL, NULL),
(25, '', 12, NULL, NULL, NULL, NULL, 18067000.000, 18067000.000, NULL, NULL, 1, NULL, NULL),
(26, '', 15, NULL, NULL, NULL, NULL, 16278500.000, 16859875.000, NULL, NULL, 1, NULL, NULL),
(63, 'DNTN DV Ráº¡ng Mi', 54, NULL, NULL, '2020-01-01', '2024-07-12', 2230.000, NULL, NULL, NULL, 15, NULL, NULL),
(64, 'CÃ´ng Ty CP Äáº§u TÆ° PhÃ¡t Triá»ƒn Háº¡ Táº§ng V', 55, NULL, NULL, '2013-04-12', NULL, 20909091.000, 66000000.000, NULL, NULL, 30, 'VNÄ', NULL),
(65, 'CÃ”NG TY TNHH FUJIKIN VIá»†T NAM', 56, NULL, NULL, '2019-01-12', '2023-06-11', 30690000.000, 45900000.000, '2020-05-11', '2023-06-11', 7, 'VNÄ', NULL),
(66, 'VÄƒn PhÃ²ng Luáº­t SÆ° NHQuang vÃ  Cá»™ng Sá»±', 57, NULL, NULL, '2020-01-04', '2024-07-03', 880.000, 33500000.000, '2014-04-04', '2024-07-03', 15, 'VNÄ', NULL),
(67, ' CÃ´ng Ty TNHH ARCA Viá»‡t Nam\r\n                  ', 58, NULL, NULL, '2020-01-01', '2023-07-12', 682.000, NULL, NULL, NULL, 15, NULL, NULL),
(68, 'CÃ”NG TY TNHH DP CHEMICALS VIá»†T NAM', 59, NULL, NULL, '2021-09-10', '2022-08-04', 1406.000, 74000000.000, '2013-08-10', '2022-08-04', 30, 'VNÄ', NULL),
(69, 'CÃ”NG TY TNHH FUBIC ENGINEERING', 60, NULL, NULL, '2021-04-10', '2023-03-10', 1760.000, 3412.000, '2017-03-09', '2023-03-10', 30, 'USD', 22280.000),
(70, 'CÃ”NG TY TNHH DP CHEMICALS VIá»†T NAM', 61, NULL, NULL, '2021-09-10', '2022-08-04', 624.000, 43000000.000, '2021-06-03', '2022-08-04', 28, NULL, NULL),
(71, 'KOCKS ARDELT KRANBAU GMBH', 62, NULL, NULL, '2016-01-04', '2023-07-03', 1455.000, 68400000.000, '2015-05-04', '2023-07-03', 7, 'VNÄ', NULL),
(72, 'KOCKS ARDELT KRANBAU GMBH', 63, NULL, NULL, '2019-01-01', '2022-07-12', 374.000, 26235000.000, '2021-06-01', '2022-07-12', 7, 'VNÄ', NULL),
(73, 'CÃ”NG TY TNHH Dá»ŠCH Vá»¤ VÃ€ Äáº¦U TÆ¯ HOÃ€NG AN', 64, NULL, NULL, '2020-01-11', '2023-07-10', 78300000.000, 180000000.000, '2018-04-10', '2023-07-10', 15, 'VNÄ', NULL),
(74, 'CÃ”NG TY TNHH CIRCLE VIá»†T NAM', 65, NULL, NULL, '2019-05-08', '2021-04-08', 1575.000, 110045250.000, '2019-05-07', '2021-04-08', 12, 'VNÄ', NULL),
(75, 'CÃ”NG TY TNHH WINDMOELLER & HOELSCHER VIá»†T NAM', 66, NULL, NULL, '2020-04-10', '2023-03-10', 1840.000, 127885065.000, '2020-07-10', '2023-03-10', 26, 'VNÄ', NULL),
(76, '\r\nVOYAGER DISTRIBUTING CO PTY LTD\r\n', 67, NULL, NULL, '2021-10-01', '2023-09-01', 1745.000, 79300000.000, '2015-08-12', '2023-09-01', 30, 'VNÄ', NULL),
(77, '\r\nVOYAGER DISTRIBUTING CO PTY LTD\r\n', 68, NULL, NULL, '2021-04-09', '2022-03-03', 1400.000, 96873000.000, '2019-12-07', '2022-03-03', 23, 'VNÄ', NULL),
(78, 'CÃ”NG TY TNHH Dá»° ÃN KIáº¾N TRÃšC TRáº®NG', 69, NULL, NULL, '2020-04-09', '2022-03-09', 3440.000, 267000000.000, '2014-03-11', '2022-03-09', 15, 'VNÄ', NULL),
(79, 'VIá»†N PHÃT TRIá»‚N QUáº¢N TRá»Š VÃ€ CÃ”NG NGHá»†', 70, NULL, NULL, '2019-04-05', '2021-03-05', 1610.000, 112345800.000, '2019-02-05', '2021-03-05', 11, 'VNÄ', NULL),
(80, 'CÃ”NG TY TNHH ENSIGN LOGISTICS (VIá»†T NAM)', 71, NULL, NULL, '2021-03-06', '2022-02-06', 1760.000, 120410400.000, '2018-08-05', '2022-02-06', 22, 'VNÄ', NULL),
(81, 'Mobifone', 72, NULL, NULL, '2016-01-11', '2022-07-10', 108000000.000, NULL, NULL, NULL, 15, NULL, NULL);

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
  `police_registration_date` date DEFAULT NULL,
  `expected_departure_date` date DEFAULT NULL,
  `visa_expiry_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tenant` (`id`, `Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`) VALUES
(6, 'Deffein', 'Marie', ' Yvon Patrick', NULL, 'FRA', '19FF66040', '0903102418', '0', '0', 'deffeinp@yahoo.fr', '0', '0'),
(7, 'Schill', '0', 'Christoph', NULL, ' AUT', 'P6845625', '0936658805', '0', '0', 'christoph.schill@pracsis.com', '0', '0'),
(8, 'Nguyá»…n', 'CÃ´ng ', 'Tá»‘ Loan', NULL, 'VN', '1188005073', '0833213588', '0', '0', 'ctloan88@yahoo.com', '0', '0'),
(9, 'Schill', 'Will', 'CÃ´ng', NULL, 'VN', '0', '0', '0', '0', '0', '0', '0'),
(10, 'Proctor', 'James', 'Travis', NULL, 'USA', '567926124', '0765552956', '0', '0', 'travisproctor9@gmail.com', '0', '0'),
(11, 'Proctor', 'Jill', 'Tifany', NULL, 'USA', '566338262', '0898320261', '0', '0', 'tiffanyproctor80@gmail.com', '0', '0'),
(12, '0', '0', '0', NULL, '0', '0', '0', '0', '0', '0', '0', '0'),
(13, 'Gaffney', 'David', 'Roger', NULL, 'AUS', 'E4131610', '0919794048', '0', '0', 'rogergaffney@gmail.com', '0', '0'),
(14, 'Nguyá»…n', 'Thá»‹', 'Quá»³nh Nhung', NULL, 'vn', '1182000705', '0989060207', '0', '0', 'nhung.infos@gmail.com', '0', '0'),
(15, 'Bouineau', 'Armelle', ' Josette Clara ', NULL, 'FRA', '18FH33060', '0', '0', '0', '0', '0', '0'),
(16, 'Thomine', ' Raoul', 'Leon Benjamin', NULL, 'FRA', '17AF32957', 'khong co', '0', '0', 'benjamin.thomie@gmail.com', '0', '0'),
(18, 'Paget ', 'William', 'Christopher', NULL, 'AUS', 'E4097092', '0903735799', '0', '0', 'christopherwpaget@yahoo.com ', '0', '0'),
(19, 'Muschamp', 'Richard', 'Timothy', NULL, '26580', 'PA9635513', '0794065365', '0', '0', 'Timm@afg.vn', '0', '0'),
(21, 'Clark ', ' William', 'Michael', NULL, 'USA', '567118083', '0896409764', '0', '0', '0', '0', '0'),
(22, 'Ido', '0', ' Akihiro', NULL, 'JPN', 'TR6090564', '0962447632', '0', '0', 'lthyen@arca.vn', '0', '0'),
(23, 'Sadd', 'Azzahrae', 'Fatima', NULL, 'MAR', 'TZ5195461', '0932648005', '0', '0', 'Fatimaczzahrae.sawd1@gmail.com', '0', '0'),
(24, 'Akla', '0', 'Walid', NULL, 'MAR', 'MO3793781', '0902834757', '0', '0', 'Walid.akla@gmail.com', '0', '0'),
(25, 'Flavie', 'Combeaux', 'Florence Marie', NULL, 'FRA', '14AT78715', '0792443921', '0', '0', 'Flavie_comebeaux@hotmail.com', '0', '0'),
(26, 'Sarti', 'Sebastien', 'Julien', NULL, 'FRA', '14DR16713', '0937795211', '0', '0', 'maitrejuliensarti@gmail.com', '0', '0'),
(27, 'Gegic', '0', ' Alma', NULL, 'BIH', 'B1106465', '0772978716', '0', '0', 'Almaa.gegic@gmail.com', '0', '0'),
(28, 'Äinh', 'NhÆ°', 'MÆ°á»i', NULL, 'Viá»‡t Nam', NULL, '0975628625', '02839417638', NULL, NULL, 'DNTN Dá»‹ch Vá»¥ Ráº¡ng Mi', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(29, NULL, NULL, 'Quyáº¿t', NULL, 'Viá»‡t Nam', NULL, '0939404440', NULL, NULL, NULL, 'CÃ´ng Ty CP Äáº§u TÆ° PhÃ¡t Triá»ƒn Háº¡ Táº§ng V', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(30, NULL, NULL, 'QuyÃªn', NULL, 'Viá»‡t Nam', NULL, '01695070575', NULL, NULL, NULL, 'CÃ”NG TY TNHH FUJIKIN VIá»†T NAM', 'LÃ´ H-2B, Khu CÃ´ng nghiá»‡p ThÄƒng Long, xÃ£ VÃµn'),
(31, NULL, 'Ngá»c', 'Lan', NULL, 'Viá»‡t Nam', NULL, '0903219191', NULL, NULL, NULL, 'VÄƒn PhÃ²ng Luáº­t SÆ° NHQuang vÃ  Cá»™ng Sá»±', ' B23 Khu Biá»‡t Thá»± Trung HÃ²a NhÃ¢n ChÃ­nh, P. '),
(32, NULL, NULL, 'Yáº¿n', NULL, 'Viá»‡t Nam', NULL, '0907401958', NULL, NULL, NULL, ' CÃ´ng Ty TNHH ARCA Viá»‡t Nam\r\n                  ', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(33, NULL, NULL, 'NgÃ¢n', NULL, 'Viá»‡t Nam', NULL, '0908686401', NULL, NULL, NULL, 'CÃ”NG TY TNHH DP CHEMICALS VIá»†T NAM', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(34, NULL, NULL, 'ThÆ°', NULL, 'Viá»‡t Nam', NULL, '0963731499', NULL, NULL, NULL, 'CÃ”NG TY TNHH FUBIC ENGINEERING', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(35, NULL, NULL, 'HÆ°Æ¡ng', NULL, 'Viá»‡t Nam', NULL, '0918128012', NULL, NULL, NULL, 'KOCKS ARDELT KRANBAU GMBH', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(36, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CÃ”NG TY TNHH Dá»ŠCH Vá»¤ VÃ€ Äáº¦U TÆ¯ HOÃ€NG AN', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(37, NULL, NULL, 'DÅ©ng', NULL, 'Viá»‡t Nam', NULL, '0918282279', NULL, NULL, NULL, 'CÃ”NG TY TNHH CIRCLE VIá»†T NAM', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(38, NULL, NULL, 'Thi', NULL, 'Viá»‡t Nam', NULL, '0972440110', NULL, NULL, NULL, 'CÃ”NG TY TNHH WINDMOELLER & HOELSCHER VIá»†T NAM', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(39, NULL, 'Quáº¿', 'Anh', NULL, 'Viá»‡t Nam', NULL, '0903319239', NULL, NULL, NULL, '\r\nVOYAGER DISTRIBUTING CO PTY LTD\r\n', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(40, NULL, NULL, 'Thi', NULL, 'Viá»‡t Nam', NULL, '0908394890', NULL, NULL, NULL, 'CÃ”NG TY TNHH Dá»° ÃN KIáº¾N TRÃšC TRáº®NG', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(41, 'LÆ°u', 'Nháº­t', 'Huy', NULL, 'Viá»‡t Nam', NULL, '0908690099', NULL, NULL, NULL, 'VIá»†N PHÃT TRIá»‚N QUáº¢N TRá»Š VÃ€ CÃ”NG NGHá»†', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(42, NULL, NULL, 'Chá»‹ Hoan', NULL, 'Viá»‡t Nam', NULL, '098962235', NULL, NULL, NULL, 'CÃ”NG TY TNHH ENSIGN LOGISTICS (VIá»†T NAM)', '47-49-51 PhÃ¹ng Kháº¯c Khoan, P. Äa Kao, Quáº­n 1'),
(43, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Mobifone', NULL);

DROP TABLE IF EXISTS `unit`;
CREATE TABLE IF NOT EXISTS `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_id` int(11) NOT NULL DEFAULT '1',
  `area` decimal(10,0) NOT NULL DEFAULT '0',
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT '1',
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT '1',
  `balcony` tinyint(1) NOT NULL DEFAULT '0',
  `number_of_windows` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `unit` (`id`, `name`, `building_id`, `area`, `number_of_bedrooms`, `number_of_bathroom`, `balcony`, `number_of_windows`) VALUES
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

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
  `unit_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `number` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revenue_type_id` (`revenue_type_id`),
  KEY `unit_id` (`unit_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

INSERT INTO `utility_reading` (`id`, `revenue_type_id`, `unit_id`, `date`, `number`) VALUES
(1, 2, 2, '2020-09-16 23:11:00', '5.000'),
(2, 3, 2, '2020-09-16 23:11:00', '6.000'),
(3, 2, 2, '2020-09-20 23:12:00', '11.000'),
(4, 3, 2, '2020-09-20 23:12:00', '12.000'),
(5, 2, 3, '2020-09-21 21:00:00', '0.000'),
(6, 3, 3, '2020-09-21 21:00:00', '0.000'),
(7, 2, 3, '2020-09-28 21:00:00', '11.000'),
(8, 3, 3, '2020-09-28 21:00:00', '22.000');


ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `leaseagrm`
  ADD CONSTRAINT `leaseagrm_ibfk_2` FOREIGN KEY (`Tenant_ID`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_3` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

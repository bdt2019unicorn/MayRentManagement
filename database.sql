SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `buildings`;
INSERT INTO `buildings` (`id`, `name`) VALUES
(1, 'May An Phu'),
(2, 'May Thi Nghe'),
(3, 'PKK');

DROP TABLE IF EXISTS `expense`;
CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `expense_type_id` int(11) NOT NULL,
  `Start_period` date DEFAULT NULL,
  `End_period` date DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `expense`;
DROP TABLE IF EXISTS `expense_type`;
CREATE TABLE `expense_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `invoices`;
DROP TABLE IF EXISTS `invoice_leaseagrm`;
CREATE TABLE `invoice_leaseagrm` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL DEFAULT '1.000',
  `amount` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `invoice_leaseagrm`;
DROP TABLE IF EXISTS `invoice_utilities`;
CREATE TABLE `invoice_utilities` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `utility_reading_id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL,
  `amount` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `invoice_utilities`;
DROP TABLE IF EXISTS `leaseagrm`;
CREATE TABLE `leaseagrm` (
  `id` int(11) NOT NULL,
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
  `note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `leaseagrm`;
INSERT INTO `leaseagrm` (`id`, `name`, `unit_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`, `note`) VALUES
(2, 'Test lease for invoice test ', 2, 6, NULL, '2020-10-01', '2020-12-31', '100.000', '100.000', '2020-10-01', NULL, 1, NULL, NULL, NULL),
(3, 'Test invoice middle month ', 3, 10, NULL, '2020-10-14', '2020-12-31', '100.000', '100.000', NULL, NULL, NULL, NULL, NULL, NULL);

DROP TABLE IF EXISTS `revenue`;
CREATE TABLE `revenue` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `revenue`;
DROP TABLE IF EXISTS `revenue_type`;
CREATE TABLE `revenue_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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
CREATE TABLE `tenant` (
  `id` int(11) NOT NULL,
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
  `note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `tenant`;
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
(50, 'A123', NULL, '0.769426502', '1984-12-19', ' France', 'A123-648', NULL, 2, NULL, NULL, '0670059789', NULL, NULL, 'A123@yopmail.com', 'Test', NULL, 'A12331035May Thi Nghe FranceA123-6480670059789A123@yopmail.comTest'),
(51, 'A124', NULL, '0.730953546', '1993-09-02', ' France', 'A124-424', NULL, 2, NULL, NULL, '0595115024', NULL, NULL, 'A124@yopmail.com', 'Test', NULL, 'A12434214May Thi Nghe FranceA124-4240595115024A124@yopmail.comTest'),
(52, 'A125', NULL, '0.859840589', '1998-07-18', ' France', 'A125-901', NULL, 2, NULL, NULL, '0209892844', NULL, NULL, 'A125@yopmail.com', 'Test', NULL, 'A12535994May Thi Nghe FranceA125-9010209892844A125@yopmail.comTest'),
(53, 'A126', NULL, '0.20362042', '1992-05-28', ' France', 'A126-274', NULL, 2, NULL, NULL, '0382911010', NULL, NULL, 'A126@yopmail.com', 'Test', NULL, 'A12633752May Thi Nghe FranceA126-2740382911010A126@yopmail.comTest'),
(54, 'A127', NULL, '0.555797146', '1987-03-05', ' France', 'A127-234', NULL, 2, NULL, NULL, '0418910379', NULL, NULL, 'A127@yopmail.com', 'Test', NULL, 'A12731841May Thi Nghe FranceA127-2340418910379A127@yopmail.comTest'),
(55, 'A128', NULL, '0.453206863', '2000-09-07', ' France', 'A128-430', NULL, 3, NULL, NULL, '0398240203', NULL, NULL, 'A128@yopmail.com', 'Test', NULL, 'A12836776PKK FranceA128-4300398240203A128@yopmail.comTest'),
(56, 'A129', NULL, '0.428971622', '1983-01-19', ' France', 'A129-440', NULL, 3, NULL, NULL, '0113109118', NULL, NULL, 'A129@yopmail.com', 'Test', NULL, 'A12930335PKK FranceA129-4400113109118A129@yopmail.comTest'),
(57, 'A130', NULL, '0.57420115', '1981-10-03', ' France', 'A130-794', NULL, 3, NULL, NULL, '0469447717', NULL, NULL, 'A130@yopmail.com', 'Test', NULL, 'A13029862PKK FranceA130-7940469447717A130@yopmail.comTest'),
(58, 'A131', NULL, '0.558041664', '1978-09-21', ' France', 'A131-707', NULL, 3, NULL, NULL, '0317172883', NULL, NULL, 'A131@yopmail.com', 'Test', NULL, 'A13128754PKK FranceA131-7070317172883A131@yopmail.comTest'),
(59, 'A132', NULL, '0.595589747', '1978-10-17', ' France', 'A132-763', NULL, 3, NULL, NULL, '0770619269', NULL, NULL, 'A132@yopmail.com', 'Test', NULL, 'A13228780PKK FranceA132-7630770619269A132@yopmail.comTest'),
(60, 'A133', NULL, '0.384704763', '1983-04-14', ' France', 'A133-557', NULL, 3, NULL, NULL, '0419518241', NULL, NULL, 'A133@yopmail.com', 'Test', NULL, 'A13330420PKK FranceA133-5570419518241A133@yopmail.comTest'),
(61, 'A134', NULL, '0.107451092', '2000-08-08', ' France', 'A134-137', NULL, 3, NULL, NULL, '0779682046', NULL, NULL, 'A134@yopmail.com', 'Test', NULL, 'A13436746PKK FranceA134-1370779682046A134@yopmail.comTest'),
(62, 'A135', NULL, '0.157009161', '1982-11-30', ' France', 'A135-485', NULL, 3, NULL, NULL, '0499002230', NULL, NULL, 'A135@yopmail.com', 'Test', NULL, 'A13530285PKK FranceA135-4850499002230A135@yopmail.comTest');

DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `id` int(11) NOT NULL,
  `name` char(10) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `building_id` int(11) NOT NULL DEFAULT '1',
  `area` decimal(10,0) NOT NULL DEFAULT '0',
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT '1',
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT '1',
  `balcony` tinyint(1) NOT NULL DEFAULT '0',
  `number_of_windows` tinyint(4) NOT NULL DEFAULT '0',
  `note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `unit`;
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
(16, 'U456', 3, '972', 1, 1, 0, 0, '0.742440228'),
(17, 'U457', 3, '572', 1, 1, 0, 0, '0.63393974'),
(18, 'U458', 3, '598', 1, 1, 0, 0, '0.86623356'),
(19, 'U459', 3, '886', 1, 1, 0, 0, '0.983214657'),
(20, 'U460', 3, '154', 1, 1, 0, 0, '0.655182599'),
(21, 'U461', 2, '919', 1, 1, 1, 0, '0.839903849'),
(22, 'U462', 2, '615', 1, 1, 1, 0, '0.539196949'),
(23, 'U463', 2, '479', 1, 1, 1, 0, '0.485941832'),
(24, 'U464', 2, '816', 1, 1, 1, 0, '0.83644809'),
(25, 'U465', 2, '184', 1, 1, 1, 0, '0.002457925'),
(26, 'U466', 2, '964', 1, 1, 1, 0, '0.853117166'),
(27, 'U467', 2, '403', 1, 1, 1, 0, '0.082539025'),
(28, 'U468', 2, '266', 1, 1, 1, 0, '0.042268011');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `viber_number` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `user`;
INSERT INTO `user` (`id`, `username`, `password`, `phone_number`, `email`, `viber_number`, `approved`) VALUES
(1, 'blastor555', '123456', '0259784563', 'blastor555@gmail.com', '0123654789', 1),
(3, 'QuocAnh', 'MayRentManagement', '+84903959969', 'lhqanh@gmail.com', '+4915901244095', 1);

DROP TABLE IF EXISTS `utility_price`;
CREATE TABLE `utility_price` (
  `id` bigint(20) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `value` decimal(13,3) NOT NULL,
  `date_valid` date NOT NULL,
  `date_enter` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `utility_price`;
DROP TABLE IF EXISTS `utility_reading`;
CREATE TABLE `utility_reading` (
  `id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `number` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

TRUNCATE TABLE `utility_reading`;

ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_type_id` (`expense_type_id`,`building_id`),
  ADD KEY `building_id` (`building_id`) USING BTREE;

ALTER TABLE `expense_type`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leaseagrm_id` (`leaseagrm_id`) USING BTREE;

ALTER TABLE `invoice_leaseagrm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `revenue_type_id` (`revenue_type_id`);

ALTER TABLE `invoice_utilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `revenue_type_id` (`revenue_type_id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `utility_reading_id` (`utility_reading_id`);

ALTER TABLE `leaseagrm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Tenant_ID` (`Tenant_ID`),
  ADD KEY `unit_id` (`unit_id`) USING BTREE;

ALTER TABLE `revenue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leaseagrm_id` (`leaseagrm_id`);

ALTER TABLE `revenue_type`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tenant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `building_id` (`building_id`);

ALTER TABLE `unit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `building_id` (`building_id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `utility_price`
  ADD PRIMARY KEY (`id`),
  ADD KEY `revenue_type_id` (`revenue_type_id`);

ALTER TABLE `utility_reading`
  ADD PRIMARY KEY (`id`),
  ADD KEY `revenue_type_id` (`revenue_type_id`),
  ADD KEY `unit_id` (`unit_id`) USING BTREE;


ALTER TABLE `buildings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `expense_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `invoice_leaseagrm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `invoice_utilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `leaseagrm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `revenue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `revenue_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tenant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `utility_price`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `utility_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


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
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

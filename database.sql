SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_link` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_branch` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorize_signature` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorize_title` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `buildings` (`id`, `name`, `account_name`, `account_number`, `bank`, `bank_link`, `bank_branch`, `company`, `authorize_signature`, `authorize_title`, `email`, `phone`, `address`) VALUES
(2, 'May Thi Nghe', 'HO QUOC HUNG', ' 0210107275570001', 'Ngan Hang TMCP Sai gon (https://scb.com.vn/)', 'https://scb.com.vn/', 'TAN DINH', 'May Corporation', 'Ly Dieu Minh', 'Building Supervisor', 'nguyenvubinh@outlook.com', '01694958317', 'MAY Apartments\r\n216/3/21 Nguyen Van Huong\r\nThao Dien Ward, Dist. 2. HCMC.'),
(5, 'PKK', 'DNTN Nguyen Le', '', '', '', '', 'DNTN Nguyen Le', 'Phuong Mai', 'Building Supervisor', 'nguyenvubinh@outlook.com', '01694958317', '47 Phung Khac Khoan, District 1'),
(6, 'MAP', 'HO QUOC HUNG ', ' 0210107275570001 ', 'Ngan Hang TMCP Sai gon (https://scb.com.vn/) ', 'https://scb.com.vn/ ', 'TAN DINH ', 'May Corporation ', 'Ly Dieu Minh ', 'Building Supervisor ', 'nguyenvubinh@outlook.com ', '01694958317 ', 'MAY Apartments\r\n216/3/21 Nguyen Van Huong\r\nThao Dien Ward, Dist. 2. HCMC. ');

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `document_type_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `file` longblob NOT NULL,
  `file_extension` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci,
  `username` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `document_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `document_type` (`id`, `name`) VALUES
(1, 'Lease agreement'),
(2, 'Inventory list'),
(3, 'Picture'),
(4, 'ID/Passport/Visa'),
(5, 'Client photo'),
(6, 'Business license');

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expense_type_id` int(11) NOT NULL,
  `Start_period` date DEFAULT NULL,
  `End_period` date DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expense_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
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

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `invoices` (`id`, `name`, `leaseagrm_id`, `note`) VALUES
(4, '124 (CUULONG) - PKKG01 - Month end 30 Nov 2020', 124, NULL),
(5, '126 (FUJIKIN) - PKK101 - Month end 30 Nov 2020', 126, NULL),
(6, '127 (NHQUANG) - PKK102 - Month end 30 Nov 2020', 127, NULL),
(7, '128 (ARCA) - PKK103 - Month end 30 Nov 2020', 128, NULL),
(8, '129 (DP) - PKK104 - Month end 30 Nov 2020', 129, NULL),
(9, '130 (KOCKS) - PKK201 - Month end 30 Nov 2020', 130, NULL),
(10, '131 (KOCKS) - PKK202 - Month end 30 Nov 2020', 131, NULL),
(11, '132 (DP) - PKK203 - Month end 30 Nov 2020', 132, NULL),
(12, '133 (FUBIC) - PKK204 - Month end 30 Nov 2020', 133, NULL),
(13, '134 (HOANGAN) - PKK301 - Month end 30 Nov 2020', 134, NULL),
(14, '135 (CIRCLE) - PKK401 - Month end 30 Nov 2020', 135, NULL),
(15, '136 (WIND) - PKK402 - Month end 30 Nov 2020', 136, NULL),
(16, '137 (VOYAGER1) - PKK501 - Month end 30 Nov 2020', 137, NULL),
(17, '138 (VOYAGER2) - PKK502 - Month end 30 Nov 2020', 138, NULL),
(18, '139 (KIENTRUCTRANG) - PKK601 - Month end 30 Nov 20', 139, NULL),
(19, '140 (IMT) - PKK701 - Month end 30 Nov 2020', 140, NULL),
(20, '141 (ENSIGN) - PKK702 - Month end 30 Nov 2020', 141, NULL),
(21, '142 (MOBIFONE) - PKKT01 - Month end 30 Nov 2020', 142, NULL),
(23, 'Resolve \"RANGMI\" period 16 Dec 2012 - 31 Oct 2020', 125, NULL),
(24, '144-01 Dec 2020', 144, NULL),
(25, '145-01 Dec 2020', 145, NULL);

CREATE TABLE `invoice_leaseagrm` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL DEFAULT '1.000',
  `amount` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `invoice_leaseagrm` (`id`, `name`, `revenue_type_id`, `invoice_id`, `start_date`, `end_date`, `price`, `quantity`, `amount`) VALUES
(3, 'Rent (01 Jan 2020 - 30 Nov 2020)', 1, 4, '2020-01-01', '2020-11-30', 51836350.000, 11.000, 570199850.000),
(4, 'Rent (01 Dec 2019 - 30 Nov 2020)', 1, 5, '2019-12-01', '2020-11-30', 30690000.000, 12.000, 368280000.000),
(5, 'Rent (01 Apr 2020 - 30 Nov 2020)', 1, 6, '2020-04-01', '2020-11-30', 20508400.000, 8.000, 164067200.000),
(6, 'Rent (01 Jan 2020 - 30 Nov 2020)', 1, 7, '2020-01-01', '2020-11-30', 15856500.000, 11.000, 174421500.000),
(7, 'Rent (21 Oct 2020 - 30 Nov 2020)', 1, 8, '2020-10-21', '2020-11-30', 32717620.000, 1.333, 43612587.460),
(8, 'Rent (01 Apr 2016 - 30 Nov 2020)', 1, 9, '2016-04-01', '2020-11-30', 33741500.000, 56.000, 1889524000.000),
(9, 'Rent (01 Jan 2019 - 30 Nov 2020)', 1, 10, '2019-01-01', '2020-11-30', 8702980.000, 23.000, 200168540.000),
(10, 'Rent (21 Oct 2020 - 30 Nov 2020)', 1, 11, '2020-10-21', '2020-11-30', 14520480.000, 1.333, 19355799.840),
(11, 'Rent (16 Oct 2020 - 30 Nov 2020)', 1, 12, '2020-10-16', '2020-11-30', 40955200.000, 1.500, 61432800.000),
(12, 'Rent (01 Nov 2020 - 30 Nov 2020)', 1, 13, '2020-11-01', '2020-11-30', 78300000.000, 1.000, 78300000.000),
(13, 'Rent (05 Aug 2019 - 30 Nov 2020)', 1, 14, '2019-08-05', '2020-11-30', 36650250.000, 15.839, 580503309.750),
(14, 'Rent (16 Oct 2019 - 30 Nov 2020)', 1, 15, '2019-10-16', '2020-11-30', 42816800.000, 13.500, 578026800.000),
(15, 'Rent (16 Sep 2020 - 30 Nov 2020)', 1, 16, '2020-09-16', '2020-11-30', 32578000.000, 2.484, 80923752.000),
(16, 'Rent (22 Jan 2020 - 30 Nov 2020)', 1, 17, '2020-01-22', '2020-11-30', 40606150.000, 10.290, 417837283.500),
(17, 'Rent (16 Sep 2019 - 30 Nov 2020)', 1, 18, '2019-09-16', '2020-11-30', 80048800.000, 14.484, 1159426819.200),
(18, 'Rent (04 May 2019 - 30 Nov 2020)', 1, 19, '2019-05-04', '2020-11-30', 37464700.000, 18.900, 708082830.000),
(19, 'Rent (15 Jun 2020 - 30 Nov 2020)', 1, 20, '2020-06-15', '2020-11-30', 40955200.000, 5.516, 225908883.200),
(20, 'Rent (01 Nov 2016 - 30 Nov 2020)', 1, 21, '2016-11-01', '2020-11-30', 108000000.000, 49.000, 5292000000.000),
(22, 'Rent \"RANGMI\" period 16 Dec 2012 - 31 Oct 2020', 1, 23, '2012-12-16', '2020-10-31', 20909091.000, 1.000, 1976243644.956),
(23, 'Rent (01 Apr 2020 - 01 Dec 2020)', 1, 24, '2020-04-01', '2020-12-01', 12000000.000, 8.032, 96384000.000),
(24, 'Rent (09 Jan 2019 - 01 Dec 2020)', 1, 25, '2019-01-09', '2020-12-01', 17625000.000, 22.767, 401268375.000);

CREATE TABLE `invoice_utilities` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `utility_reading_id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL,
  `amount` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `invoice_utilities` (`id`, `name`, `invoice_id`, `utility_reading_id`, `revenue_type_id`, `price`, `quantity`, `amount`) VALUES
(4, 'MAP101 - Electricity 28 Sep 2020 - 29 Oct 2020', 24, 348, 2, 4.000, 338.000, 1.000),
(5, 'MAP101 - Water 28 Sep 2020 - 29 Oct 2020', 24, 335, 3, 42.000, 16.000, 672.000),
(6, 'MAP102 - Electricity 28 Sep 2020 - 29 Oct 2020', 25, 349, 2, 4.000, 333.000, 1.000),
(7, 'MAP102 - Water 28 Sep 2020 - 29 Oct 2020', 25, 336, 3, 42.000, 12.000, 504.000);

CREATE TABLE `leaseagrm` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `Tenant_ID` int(11) DEFAULT NULL,
  `ocupants_ids` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Start_date` date DEFAULT NULL,
  `Finish` date DEFAULT NULL,
  `Rent_amount` decimal(13,3) DEFAULT NULL,
  `leaseagrm_period_id` int(11) DEFAULT NULL,
  `Deposit_amount` decimal(13,3) DEFAULT NULL,
  `Deposit_payment_date` date DEFAULT NULL,
  `Deposit_payback_date` date DEFAULT NULL,
  `Monthly_payment_date` tinyint(4) DEFAULT NULL,
  `Deposit_currency` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Deposit_exchange_rate` decimal(13,3) DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `leaseagrm` (`id`, `name`, `unit_id`, `Tenant_ID`, `ocupants_ids`, `Start_date`, `Finish`, `Rent_amount`, `leaseagrm_period_id`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate`, `note`) VALUES
(124, 'CUULONG', 92, 91, NULL, '2020-01-01', '2022-12-31', 51836350.000, 2, NULL, NULL, '2022-12-31', 15, NULL, NULL, NULL),
(125, 'RANGMI', 93, 92, '', '2012-12-16', '2022-12-31', 20909091.000, 2, 66000000.000, NULL, NULL, 30, 'VND', 0.000, ''),
(126, 'FUJIKIN', 94, 93, NULL, '2019-12-01', '2021-11-30', 30690000.000, 2, 45900000.000, '2018-11-29', '2021-11-30', 7, 'VND', NULL, NULL),
(127, 'NHQUANG', 95, 94, NULL, '2020-04-01', '2022-03-31', 20508400.000, 2, 33500000.000, '2014-04-04', '2022-03-31', 15, 'VND', NULL, NULL),
(128, 'ARCA', 96, 95, NULL, '2020-01-01', '2021-12-31', 15856500.000, 2, NULL, NULL, NULL, 15, NULL, NULL, NULL),
(129, 'DP', 97, 96, NULL, '2020-10-21', '2021-04-20', 32717620.000, 2, 74000000.000, '2013-10-08', '2021-04-20', 30, 'VND', NULL, NULL),
(130, 'KOCKS', 98, 97, NULL, '2016-04-01', '2021-03-31', 33741500.000, 2, 68400000.000, '2014-04-17', '2021-03-31', 7, 'VND', NULL, NULL),
(131, 'KOCKS', 99, 97, NULL, '2019-01-01', '2020-12-31', 8702980.000, 2, 26235000.000, '2019-01-30', '2020-12-31', 7, 'VND', NULL, NULL),
(132, 'DP', 100, 96, NULL, '2020-10-21', '2021-04-20', 14520480.000, 2, 43000000.000, '2019-03-30', '2021-04-20', 28, 'VND', NULL, NULL),
(133, 'FUBIC', 101, 98, NULL, '2020-10-16', '2022-10-15', 40955200.000, 2, 76019360.000, '2016-09-15', '2022-10-15', 30, 'USD', 22280.000, NULL),
(134, 'HOANGAN', 102, 99, NULL, '2020-11-01', '2021-10-31', 78300000.000, 2, 180000000.000, '2017-10-16', '2021-10-31', 15, 'VND', NULL, NULL),
(135, 'CIRCLE', 103, 100, NULL, '2019-08-05', '2021-08-04', 36650250.000, 2, 110045250.000, '2019-07-05', '2021-08-04', 12, 'VND', NULL, NULL),
(136, 'WIND', 104, 101, NULL, '2019-10-16', '2022-10-15', 42816800.000, 2, 127885065.000, '2019-10-19', '2022-10-15', 26, 'VND', NULL, NULL),
(137, 'VOYAGER1', 105, 102, NULL, '2020-09-16', '2021-03-15', 32578000.000, 2, 96873000.000, '2018-07-24', '2021-03-15', 23, 'VND', NULL, NULL),
(138, 'VOYAGER2', 106, 102, NULL, '2020-01-22', '2022-01-21', 40606150.000, 2, 79300000.000, '2015-12-08', '2022-01-21', 30, 'VND', NULL, NULL),
(139, 'KIENTRUCTRANG', 107, 103, NULL, '2019-09-16', '2021-09-15', 80048800.000, 2, 267000000.000, '2014-11-03', '2021-09-15', 22, 'VND', NULL, NULL),
(140, 'IMT', 108, 104, NULL, '2019-05-04', '2021-05-03', 37464700.000, 2, 112345800.000, '2019-05-02', '2021-05-03', 11, 'VND', NULL, NULL),
(141, 'ENSIGN', 109, 105, NULL, '2020-06-15', '2021-06-14', 40955200.000, 2, 120410400.000, '2018-05-08', '2018-05-08', 14, 'VND', NULL, NULL),
(142, 'MOBIFONE', 110, 106, NULL, '2016-11-01', '2021-10-31', 108000000.000, 2, NULL, '2021-06-14', NULL, NULL, 'VND', NULL, NULL),
(144, 'Deffein Patrick', 114, 158, NULL, '2020-04-01', '2021-03-31', 12000000.000, 2, 11415000.000, '2020-04-01', '2021-03-31', 1, NULL, NULL, NULL),
(145, 'Schill Christoph', 115, 159, NULL, '2019-01-09', '2021-01-08', 17625000.000, 2, 12000000.000, '2019-01-09', '2021-01-08', 1, NULL, NULL, NULL),
(146, 'Proctor Travis', 116, 162, NULL, '2020-07-11', '2022-07-30', 18067000.000, 2, 38511000.000, '2020-07-11', '2022-07-30', 1, NULL, NULL, NULL),
(147, 'Gaffney Roger', 118, 164, NULL, '2020-10-01', '2021-03-31', 13000000.000, 2, 13000000.000, '2020-10-01', '2021-03-31', 1, NULL, NULL, NULL),
(148, 'Bouineau Armelle', 119, 166, NULL, '2019-09-01', '2020-09-01', 17000000.000, 2, 19755250.000, '2019-09-01', '2020-09-01', 1, NULL, NULL, NULL);

CREATE TABLE `leaseagrm_period` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_basic` tinyint(1) NOT NULL DEFAULT '1',
  `calculation_method` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

INSERT INTO `leaseagrm_period` (`id`, `name`, `is_basic`, `calculation_method`) VALUES
(1, 'years', 1, NULL),
(2, 'months', 1, NULL),
(3, 'weeks', 1, NULL),
(4, 'days', 1, NULL),
(5, 'hours', 1, NULL),
(6, 'minutes', 1, NULL),
(7, 'seconds', 1, NULL),
(8, '2 months', 0, 'end_period.diff(start_period, \"months\", true)/2; '),
(9, '3 months', 0, 'end_period.diff(start_period, \"months\", true)/3; ');

CREATE TABLE `revenue` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `revenue` (`id`, `name`, `leaseagrm_id`, `Payment_date`, `Amount`, `Note`) VALUES
(1, 'Rent \"RANGMI\" period 16 Dec 2012 - 31 Oct 2020', 125, '2020-10-31', 1976243644.956, NULL),
(2, 'Deffein Patrick MAP101 Dec 2020', 144, '2020-12-01', 96384673.000, 'Deffein Patrick MAP101 Dec 2020 revenue'),
(3, 'Schill Christoph Dec 2020', 145, '2020-12-01', 401268880.000, 'Schill Christoph Dec 2020');

CREATE TABLE `revenue_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT '0'
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

CREATE TABLE `tenant` (
  `id` int(11) NOT NULL,
  `Last_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Middle_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `First_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Date_of_birth` date DEFAULT NULL,
  `Nationality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Passport_ID_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `visa_expiry_date` date DEFAULT NULL,
  `police_registration_date` date DEFAULT NULL,
  `expected_departure_date` date DEFAULT NULL,
  `Mobile_Phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Work_Phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Work_Email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Personal_Email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tenant` (`id`, `Last_Name`, `Middle_Name`, `First_Name`, `Date_of_birth`, `Nationality`, `Passport_ID_number`, `building_id`, `visa_expiry_date`, `police_registration_date`, `expected_departure_date`, `Mobile_Phone`, `Work_Phone`, `Work_Email`, `Personal_Email`, `Company_Name`, `Company_address`, `note`) VALUES
(91, NULL, 'Hong', 'Quyet', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0939404440', NULL, NULL, NULL, 'CUU LONG', '47-49-51 PKK, Distric 1, HCMC', 'CUULONG'),
(92, NULL, 'Nhu', 'Muoi', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0975628625', '02839417638', NULL, NULL, 'RANG MI', '47-49-51 PKK, Distric 1, HCMC', 'RANGMI'),
(93, NULL, 'Thao', 'Quyen', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '01695070575', NULL, NULL, NULL, 'FUJIKIN', ' H-2B, Thang Long industrial park,  Äong Anh Dist', 'FUJIKIN'),
(94, NULL, 'Ngoc', 'Lan', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0903219191', '02838226290', NULL, NULL, 'NH QUANG', 'B23, Thanh Xuan Distric, HNC', 'NHQUANG'),
(95, NULL, 'Hoang', 'Yen', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0907401958', '02839393924', NULL, NULL, 'ARCA', '47-49-51 PKK, Distric 1, HCMC', 'ARCA'),
(96, NULL, 'Thi', 'Ngan', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0908686401', NULL, NULL, NULL, 'DP CHEMICALS', '47-49-51 PKK, Distric 1, HCMC', 'DP'),
(97, NULL, 'Dieu', 'Huong', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0918128012', NULL, NULL, NULL, 'KOCKS ARDELT', '47-49-51 PKK, Distric 1, HCMC', 'KOCKS'),
(98, NULL, 'Anh', 'Thu', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0963731499', NULL, NULL, NULL, 'FUBIC ENGINEERING', '47-49-51 PKK, Distric 1, HCMC', 'FUBIC'),
(99, NULL, NULL, 'Yen', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0909973003', '02838277683', NULL, NULL, 'HOANG AN', '47-49-51 PKK, Distric 1, HCMC', 'HOANGAN'),
(100, NULL, NULL, 'Dung', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0918282279', NULL, NULL, NULL, 'CIRCLE VIET NAM', '47-49-51 PKK, Distric 1, HCMC', 'CIRCLE'),
(101, NULL, 'Mai', 'Thi', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0972440110', NULL, NULL, NULL, ' WINDMOELLER & HOELSCHER ', '47-49-51 PKK, Distric 1, HCMC', 'WIND'),
(102, NULL, 'Que', 'Anh', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0903319239', NULL, NULL, NULL, 'VOYAGER DISTRIBUTING CO PTY LTD', '47-49-51 PKK, Distric 1, HCMC', 'VOYAGER '),
(103, NULL, 'Yen ', 'Thi', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0908394890', NULL, NULL, NULL, 'KIEN TRUC TRANG', '47-49-51 PKK, Distric 1, HCMC', 'KIENTRUCTRANG'),
(104, NULL, 'Nhat', 'Huy', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0908690099', NULL, NULL, NULL, 'VIEN CONG NGHE', '47-49-51 PKK, Distric 1, HCMC', 'IMT'),
(105, NULL, 'Gia', 'Hoan', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, '0908962235', NULL, NULL, NULL, 'ENSIGN LOGISTICS', '47-49-51 PKK, Distric 1, HCMC', 'ENSIGN'),
(106, 'Mobifone', 'Mobifone', 'Mobifone', NULL, 'VietNam', NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'MOBIFONE'),
(158, 'Deffein', 'Marie  Yvon', '  Patrick', '1961-08-04', 'FRA', '19FF66040', 6, '0000-00-00', '0000-00-00', '0000-00-00', '0903102418', NULL, NULL, 'deffeinp@yahoo.fr', NULL, NULL, NULL),
(159, 'Schill', NULL, 'Christoph', '1977-09-30', ' AUT', 'P6845625', 6, '0000-00-00', '0000-00-00', '0000-00-00', '0936658805', NULL, NULL, 'christoph.schill@pracsis.com', NULL, NULL, NULL),
(160, 'Nguyen', 'Cong', 'To Loan', '1988-03-05', 'VN', '1188005073', 6, NULL, NULL, NULL, '0833213588', NULL, NULL, 'ctloan88@yahoo.com', NULL, NULL, NULL),
(161, 'Schill', 'Will', 'Cong', '2018-02-11', 'VN', NULL, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, 'Proctor', 'James', 'Travis', '1982-08-22', 'USA', '567926124', 6, '0000-00-00', '0000-00-00', '0000-00-00', '0765552956', NULL, NULL, 'travisproctor9@gmail.com', NULL, NULL, NULL),
(163, 'Proctor', 'Jill', 'Tifany', '1980-10-27', 'USA', '566338262', 6, '0000-00-00', '0000-00-00', '0000-00-00', '0898320261', NULL, NULL, 'tiffanyproctor80@gmail.com', NULL, NULL, NULL),
(164, 'Gaffney', 'David', 'Roger', '1963-09-29', 'AUS', 'E4131610', 6, '0000-00-00', '0000-00-00', '0000-00-00', '0919794048', NULL, NULL, 'rogergaffney@gmail.com', NULL, NULL, NULL),
(165, 'Nguyen', 'Thi', 'Quynh Nhung', '1982-10-30', 'VN', '1182000705', 6, NULL, NULL, NULL, '0989060207', NULL, NULL, 'nhung.infos@gmail.com', NULL, NULL, NULL),
(166, 'Bouineau', 'Armelle', ' Josette Clara ', '1996-03-20', 'FRA', '18FH33060', 6, '0000-00-00', '0000-00-00', '0000-00-00', '0977216933', NULL, NULL, 'clara.bouineau@gmail.com', NULL, NULL, NULL),
(167, 'Thomine', ' Raoul', 'Leon Benjamin', '1991-11-23', 'FRA', '17AF32957', 6, '0000-00-00', '0000-00-00', '0000-00-00', NULL, NULL, NULL, 'benjamin.thomie@gmail.com', NULL, NULL, NULL);

CREATE TABLE `unit` (
  `id` int(11) NOT NULL,
  `name` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_id` int(11) NOT NULL DEFAULT '1',
  `area` decimal(10,0) NOT NULL DEFAULT '0',
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT '1',
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT '1',
  `balcony` tinyint(1) DEFAULT '0',
  `number_of_windows` tinyint(4) NOT NULL DEFAULT '0',
  `note` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `unit` (`id`, `name`, `building_id`, `area`, `number_of_bedrooms`, `number_of_bathroom`, `balcony`, `number_of_windows`, `note`) VALUES
(92, 'PKKG01', 5, 20, 1, 1, 0, 0, NULL),
(93, 'PKKG02', 5, 80, 1, 1, 0, 0, NULL),
(94, 'PKK101', 5, 60, 1, 1, 0, 0, NULL),
(95, 'PKK102', 5, 40, 1, 1, 0, 0, NULL),
(96, 'PKK103', 5, 31, 1, 1, 0, 0, NULL),
(97, 'PKK104', 5, 76, 1, 1, 0, 0, NULL),
(98, 'PKK201', 5, 80, 1, 1, 0, 0, NULL),
(99, 'PKK202', 5, 17, 1, 1, 0, 0, NULL),
(100, 'PKK203', 5, 29, 1, 1, 0, 0, NULL),
(101, 'PKK204', 5, 80, 1, 1, 0, 0, NULL),
(102, 'PKK301', 5, 160, 1, 1, 0, 0, NULL),
(103, 'PKK401', 5, 70, 1, 1, 0, 0, NULL),
(104, 'PKK402', 5, 80, 1, 1, 0, 0, NULL),
(105, 'PKK501', 5, 70, 1, 1, 0, 0, NULL),
(106, 'PKK502', 5, 80, 1, 1, 0, 0, NULL),
(107, 'PKK601', 5, 160, 1, 1, 0, 0, NULL),
(108, 'PKK701', 5, 70, 1, 1, 0, 0, NULL),
(109, 'PKK702', 5, 80, 1, 1, 0, 0, NULL),
(110, 'PKKT01', 5, 10, 1, 1, 0, 0, NULL),
(112, 'MAPG01', 6, 70, 2, 2, 0, 3, NULL),
(113, 'MAPG02', 6, 57, 1, 1, 0, 2, NULL),
(114, 'MAP101', 6, 60, 1, 1, 0, 1, NULL),
(115, 'MAP102', 6, 70, 2, 2, 0, 2, NULL),
(116, 'MAP103', 6, 103, 3, 3, 0, 2, NULL),
(117, 'MAP201', 6, 60, 1, 1, 0, 1, NULL),
(118, 'MAP202', 6, 70, 2, 2, 0, 2, NULL),
(119, 'MAP203', 6, 103, 3, 3, 0, 2, NULL),
(120, 'MAP301', 6, 60, 1, 1, 0, 1, NULL),
(121, 'MAP302', 6, 70, 2, 2, 0, 2, NULL),
(122, 'MAP303', 6, 103, 3, 3, 0, 3, NULL),
(123, 'MAP401', 6, 48, 1, 1, 0, 1, NULL),
(124, 'MAP402', 6, 75, 2, 2, 0, 2, NULL),
(125, 'MAYMAP1', 6, 100, 1, 1, NULL, 1, 'Building A37, for utilities meter'),
(126, 'MAYMAP2', 6, 1, 1, 1, NULL, 1, 'Building A38, for utilities meter'),
(127, 'MAYMTN1', 2, 1, 1, 1, NULL, 1, 'May Thi Nghe, for utilities meter'),
(128, 'MAYMTN2', 2, 1, 1, 1, NULL, 1, 'May Thi Nghe, for utilities meter'),
(129, 'PKK302', 5, 1, 1, 1, NULL, 1, 'PKK Tang 3');

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viber_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` (`id`, `username`, `password`, `phone_number`, `email`, `viber_number`, `approved`) VALUES
(1, 'blastor555', 'TB3456', '0259784563', 'blastor555@gmail.com', '0123654789', 1),
(3, 'QuocAnh', 'MayRentManagement', '+84903959969', 'lhqanh@gmail.com', '+4915901244095', 1);

CREATE TABLE `utility_price` (
  `id` bigint(20) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `value` decimal(13,3) NOT NULL,
  `date_valid` date NOT NULL,
  `date_enter` date NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `utility_price` (`id`, `revenue_type_id`, `value`, `date_valid`, `date_enter`, `username`, `modified_time`) VALUES
(1, 2, 11.000, '2020-09-01', '2020-09-20', NULL, NULL),
(2, 3, 22.000, '2020-09-02', '2020-09-20', NULL, NULL),
(3, 2, 21.000, '2020-09-15', '2020-09-20', NULL, NULL),
(4, 3, 32.000, '2020-09-16', '2020-09-20', NULL, NULL),
(5, 2, 31.000, '2020-09-19', '2020-09-20', NULL, NULL),
(6, 3, 42.000, '2020-09-19', '2020-09-20', NULL, NULL),
(7, 2, 4587.000, '2020-09-20', '2020-11-17', NULL, NULL);

CREATE TABLE `utility_reading` (
  `id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL,
  `number` decimal(13,3) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `utility_reading` (`id`, `revenue_type_id`, `unit_id`, `date`, `number`, `username`, `modified_time`) VALUES
(233, 3, 92, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(234, 3, 93, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(235, 3, 94, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(236, 3, 95, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(237, 3, 96, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(238, 3, 97, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(239, 3, 98, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(240, 3, 99, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(241, 3, 100, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(242, 3, 101, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(243, 3, 102, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(244, 3, 103, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(245, 3, 104, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(246, 3, 105, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(247, 3, 106, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(248, 3, 107, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(249, 3, 108, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(250, 3, 109, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(251, 3, 110, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(256, 2, 92, '2020-09-30 00:00:00', 29151.000, NULL, NULL),
(257, 2, 93, '2020-09-30 00:00:00', 75916.000, NULL, NULL),
(258, 2, 94, '2020-09-30 00:00:00', 49904.000, NULL, NULL),
(259, 2, 95, '2020-09-30 00:00:00', 9881.000, NULL, NULL),
(260, 2, 96, '2020-09-30 00:00:00', 25096.000, NULL, NULL),
(261, 2, 97, '2020-09-30 00:00:00', 46507.000, NULL, NULL),
(262, 2, 98, '2020-09-30 00:00:00', 34434.000, NULL, NULL),
(263, 2, 99, '2020-09-30 00:00:00', 1618.000, NULL, NULL),
(264, 2, 100, '2020-09-30 00:00:00', 40386.000, NULL, NULL),
(265, 2, 101, '2020-09-30 00:00:00', 7454.000, NULL, NULL),
(266, 2, 102, '2020-09-30 00:00:00', 40361.000, NULL, NULL),
(267, 2, 103, '2020-09-30 00:00:00', 44454.000, NULL, NULL),
(268, 2, 104, '2020-09-30 00:00:00', 66800.000, NULL, NULL),
(269, 2, 105, '2020-09-30 00:00:00', 30617.000, NULL, NULL),
(270, 2, 106, '2020-09-30 00:00:00', 29289.000, NULL, NULL),
(271, 2, 107, '2020-09-30 00:00:00', 56263.000, NULL, NULL),
(272, 2, 108, '2020-09-30 00:00:00', 31542.000, NULL, NULL),
(273, 2, 109, '2020-09-30 00:00:00', 98457.000, NULL, NULL),
(274, 2, 110, '2020-09-30 00:00:00', 0.000, NULL, NULL),
(331, 3, 125, '2020-11-06 00:00:00', 5538.000, NULL, NULL),
(332, 3, 126, '2020-11-06 00:00:00', 4623.000, NULL, NULL),
(333, 3, 112, '2020-11-06 00:00:00', 3073.000, NULL, NULL),
(334, 3, 113, '2020-11-06 00:00:00', 1667.000, NULL, NULL),
(335, 3, 114, '2020-10-29 00:00:00', 1406.000, NULL, NULL),
(336, 3, 115, '2020-10-29 00:00:00', 1691.000, NULL, NULL),
(337, 3, 116, '2020-10-29 00:00:00', 2789.000, NULL, NULL),
(338, 3, 117, '2020-11-06 00:00:00', 848.000, NULL, NULL),
(339, 3, 118, '2020-10-29 00:00:00', 1276.000, NULL, NULL),
(340, 3, 119, '2020-10-29 00:00:00', 1799.000, NULL, NULL),
(341, 3, 120, '2020-11-06 00:00:00', 376.000, NULL, NULL),
(342, 3, 121, '2020-10-29 00:00:00', 1676.000, NULL, NULL),
(343, 3, 122, '2020-10-29 00:00:00', 1933.000, NULL, NULL),
(344, 3, 123, '2020-11-06 00:00:00', 553.000, NULL, NULL),
(345, 3, 124, '2020-10-15 00:00:00', 1535.000, NULL, NULL),
(346, 2, 112, '2020-11-06 00:00:00', 35878.000, NULL, NULL),
(347, 2, 113, '2020-11-06 00:00:00', 52216.000, NULL, NULL),
(348, 2, 114, '2020-10-29 00:00:00', 42715.000, NULL, NULL),
(349, 2, 115, '2020-10-29 00:00:00', 57920.000, NULL, NULL),
(350, 2, 116, '2020-10-29 00:00:00', 5348.000, NULL, NULL),
(351, 2, 117, '2020-11-06 00:00:00', 6674.000, NULL, NULL),
(352, 2, 118, '2020-10-29 00:00:00', 46837.000, NULL, NULL),
(353, 2, 119, '2020-10-29 00:00:00', 72587.000, NULL, NULL),
(354, 2, 120, '2020-11-06 00:00:00', 89059.000, NULL, NULL),
(355, 2, 121, '2020-10-29 00:00:00', 18326.000, NULL, NULL),
(356, 2, 122, '2020-10-29 00:00:00', 64437.000, NULL, NULL),
(357, 2, 123, '2020-11-06 00:00:00', 19750.000, NULL, NULL),
(358, 2, 124, '2020-10-15 00:00:00', 66128.000, NULL, NULL),
(359, 3, 125, '2020-11-06 00:00:00', 5538.000, NULL, NULL),
(360, 3, 126, '2020-11-06 00:00:00', 4623.000, NULL, NULL),
(361, 3, 112, '2020-11-06 00:00:00', 3073.000, NULL, NULL),
(362, 3, 113, '2020-11-06 00:00:00', 1667.000, NULL, NULL),
(363, 3, 114, '2020-09-28 00:00:00', 1390.000, NULL, NULL),
(364, 3, 115, '2020-09-28 00:00:00', 1679.000, NULL, NULL),
(365, 3, 116, '2020-09-28 00:00:00', 2772.000, NULL, NULL),
(366, 3, 117, '2020-11-06 00:00:00', 848.000, NULL, NULL),
(367, 3, 118, '2020-09-28 00:00:00', 1267.000, NULL, NULL),
(368, 3, 119, '2020-09-28 00:00:00', 1791.000, NULL, NULL),
(369, 3, 120, '2020-11-06 00:00:00', 376.000, NULL, NULL),
(370, 3, 121, '2020-09-28 00:00:00', 1673.000, NULL, NULL),
(371, 3, 122, '2020-09-28 00:00:00', 1923.000, NULL, NULL),
(372, 3, 123, '2020-11-06 00:00:00', 553.000, NULL, NULL),
(373, 3, 124, '2020-09-14 00:00:00', 1518.000, NULL, NULL),
(374, 2, 112, '2020-11-06 00:00:00', 35878.000, NULL, NULL),
(375, 2, 113, '2020-11-06 00:00:00', 52216.000, NULL, NULL),
(376, 2, 114, '2020-09-28 00:00:00', 42377.000, NULL, NULL),
(377, 2, 115, '2020-09-28 00:00:00', 57587.000, NULL, NULL),
(378, 2, 116, '2020-09-28 00:00:00', 4662.000, NULL, NULL),
(379, 2, 117, '2020-11-06 00:00:00', 6674.000, NULL, NULL),
(380, 2, 118, '2020-09-28 00:00:00', 46416.000, NULL, NULL),
(381, 2, 119, '2020-09-28 00:00:00', 72064.000, NULL, NULL),
(382, 2, 120, '2020-11-06 00:00:00', 89059.000, NULL, NULL),
(383, 2, 121, '2020-09-28 00:00:00', 18117.000, NULL, NULL),
(384, 2, 122, '2020-09-28 00:00:00', 63993.000, NULL, NULL),
(385, 2, 123, '2020-11-06 00:00:00', 19750.000, NULL, NULL),
(386, 2, 124, '2020-09-14 00:00:00', 65463.000, NULL, NULL);


ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `apartment` (`unit_id`),
  ADD KEY `document_type` (`document_type_id`);

ALTER TABLE `document_type`
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
  ADD KEY `unit_id` (`unit_id`) USING BTREE,
  ADD KEY `leaseagrm_period_id` (`leaseagrm_period_id`);

ALTER TABLE `leaseagrm_period`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `document_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `expense_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

ALTER TABLE `invoice_leaseagrm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

ALTER TABLE `invoice_utilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `leaseagrm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

ALTER TABLE `leaseagrm_period`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `revenue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `revenue_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `tenant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `utility_price`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `utility_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=387;


ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`);

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
  ADD CONSTRAINT `leaseagrm_ibfk_3` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leaseagrm_ibfk_4` FOREIGN KEY (`leaseagrm_period_id`) REFERENCES `leaseagrm_period` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`leaseagrm_id`) REFERENCES `leaseagrm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tenant`
  ADD CONSTRAINT `tenant_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_price`
  ADD CONSTRAINT `utility_price_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `utility_price_ibfk_2` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_reading`
  ADD CONSTRAINT `utility_reading_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `utility_reading_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

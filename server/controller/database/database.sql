CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `account_name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `bank` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `bank_link` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `bank_branch` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `company` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `authorize_signature` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `authorize_title` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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

CREATE TABLE `expense_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `invoice_leaseagrm` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL DEFAULT '1.000',
  `amount` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `invoice_utilities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `utility_reading_id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `price` decimal(13,3) NOT NULL,
  `quantity` decimal(13,3) NOT NULL,
  `amount` decimal(13,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `leaseagrm` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `Tenant_ID` int(11) DEFAULT NULL,
  `ocupants_ids` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Start_date` date DEFAULT NULL,
  `Finish` date DEFAULT NULL,
  `Rent_amount` decimal(13,3) DEFAULT NULL,
  `leaseagrm_period_id` int(11) DEFAULT NULL,
  `Deposit_amount` decimal(13,3) DEFAULT NULL,
  `Deposit_payment_date` date DEFAULT NULL,
  `Deposit_payback_date` date DEFAULT NULL,
  `Monthly_payment_date` tinyint(4) DEFAULT NULL,
  `Deposit_currency` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `Deposit_exchange_rate` decimal(13,3) DEFAULT NULL,
  `note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `leaseagrm_period` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_basic` tinyint(1) NOT NULL DEFAULT '1',
  `calculation_method` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `revenue` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `leaseagrm_id` int(11) NOT NULL,
  `Payment_date` date DEFAULT NULL,
  `Amount` decimal(13,3) DEFAULT NULL,
  `Note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `revenue_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_utility` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

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

CREATE TABLE `unit` (
  `id` int(11) NOT NULL,
  `name` char(10) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `building_id` int(11) NOT NULL DEFAULT '1',
  `area` decimal(10,0) NOT NULL DEFAULT '0',
  `number_of_bedrooms` tinyint(4) NOT NULL DEFAULT '1',
  `number_of_bathroom` tinyint(4) NOT NULL DEFAULT '1',
  `balcony` tinyint(1) DEFAULT '0',
  `number_of_windows` tinyint(4) NOT NULL DEFAULT '0',
  `note` text COLLATE utf8mb4_vietnamese_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `viber_number` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `utility_price` (
  `id` bigint(20) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `value` decimal(13,3) NOT NULL,
  `date_valid` date NOT NULL,
  `date_enter` date NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE `utility_reading` (
  `id` int(11) NOT NULL,
  `revenue_type_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL,
  `number` decimal(13,3) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;


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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `document_type`
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

ALTER TABLE `leaseagrm_period`
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
  ADD CONSTRAINT `tenant_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`);

ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_price`
  ADD CONSTRAINT `utility_price_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `utility_reading`
  ADD CONSTRAINT `utility_reading_ibfk_1` FOREIGN KEY (`revenue_type_id`) REFERENCES `revenue_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `utility_reading_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


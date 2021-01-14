			SET @rent_id = '1'; 
			CREATE TEMPORARY TABLE IF NOT EXISTS `leaseagrm_overview` AS 
			(
				SELECT 
					`id` AS `leaseid`, 
					`Tenant_ID` AS `tenantid`, 
					`unit_id`, 
					`Start_date`, 
					`Finish`, 
					`Deposit_payment_date`, 
					(
						CASE 
							WHEN `Start_date`<CURRENT_DATE THEN CONCAT('Until ', DATE_FORMAT(`Finish`, '%M %d, %Y'))
							ELSE CONCAT('Move in on ', DATE_FORMAT(`Start_date`, '%M %d, %Y'))
						END
					) AS `Rental Status`, 
					(
						CASE 
							WHEN `Start_date`<CURRENT_DATE THEN CONCAT('2', DATE_FORMAT(`Finish`, '%Y%m%d'))
							ELSE CONCAT('1', DATE_FORMAT(`Start_date`, '%Y%m%d'))
						END
					) AS `Rental Status Value`, 
					(
						IFNULL
						(
							CONCAT
							(
								'Until ', 
								(
									SELECT DATE_FORMAT(MAX(`invoice_leaseagrm`.`end_date`), '%M %d, %Y') FROM `invoice_leaseagrm` 
									WHERE 
										`invoice_leaseagrm`.`invoice_id` IN 
										(
											SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
										) AND 
										`invoice_leaseagrm`.`revenue_type_id` = @rent_id
								) 
							), 
							IF(ISNULL(`Deposit_payment_date`), NULL, 'Deposit paid')
						)
					) AS `Payment Status`, 
					(
						IFNULL
						(
							CONCAT
							(
								'2', 
								(
									SELECT DATE_FORMAT(MAX(`invoice_leaseagrm`.`end_date`), '%Y%m%d') FROM `invoice_leaseagrm` 
									WHERE 
										`invoice_leaseagrm`.`invoice_id` IN 
										(
											SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
										) AND 
										`invoice_leaseagrm`.`revenue_type_id` = @rent_id
								) 
							), 
							IF(ISNULL(`Deposit_payment_date`), 0, 1)
						)
					) AS `Payment Status Value`, 
					(SELECT CONCAT(IFNULL(`tenant`.`First_Name`,''),' ',IFNULL(`tenant`.`Middle_Name`,''),' ',IFNULL(`tenant`.`Last_Name`,'')) FROM `tenant` WHERE `tenant`.`id`=`Tenant_ID`) AS `Tenant Name`
				FROM `leaseagrm` WHERE `Finish`>=CURRENT_DATE
			); 
	
			SELECT 
				`unit`.`id` AS `ID`, 
				`unit`.`name` AS `Unit Name`, 
				IF
				(
					ISNULL(`leaseagrm_overview`.`Rental Status`), 'Vacant', 
					CONCAT
					(
						'<router-link to=\"leaseagrm/edit?id=', 
						CAST(`leaseagrm_overview`.`leaseid` AS CHAR),'\" append>', 
						CAST(`leaseagrm_overview`.`Rental Status` AS CHAR), 
						'</router-link>'
					)
				) AS `Rental Status`,
				IFNULL(`leaseagrm_overview`.`Rental Status Value`, 0) AS `Rental Status Value`, 
				`leaseagrm_overview`.`Payment Status`, 
				IFNULL(`leaseagrm_overview`.`Payment Status Value`, 0) AS `Payment Status Value`, 
				`leaseagrm_overview`.`Tenant Name`, 
				`leaseagrm_overview`.`leaseid`, 
				`leaseagrm_overview`.`tenantid`	
			FROM `unit` LEFT JOIN `leaseagrm_overview` ON `unit`.`id` = `leaseagrm_overview`.`unit_id`
			WHERE `unit`.`building_id` = '5'
			ORDER BY `unit`.`id`; 
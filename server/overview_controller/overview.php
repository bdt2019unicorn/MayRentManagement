<?php 
    require_once("../helper/database.php"); 

	$key = "building_id"; 

	$building_id = (isset($_GET[$key]))? $_GET[$key]: "";

	$sql = 
	"
		SELECT 
			`overview`.*, 
		    (
		        CASE
		        	WHEN `overview`.`leaseid` IS NULL THEN ''
		        	ELSE 
		        		CASE
		        			WHEN `overview`.`leasestart`<=CURRENT_DATE THEN DATE_FORMAT(`overview`.`leasefinish`, '%M %d, %Y')
		        			ELSE CONCAT('Move in on ', DATE_FORMAT(`overview`.`leasestart`, '%M %d, %Y'))
		        		END       
		        END
		    ) AS `Rent Until`, 
            (
		        CASE
		        	WHEN `overview`.`leaseid` IS NULL THEN '0'
		        	ELSE 
		        		CASE
		        			WHEN `overview`.`leasestart`<=CURRENT_DATE THEN CONCAT('2', DATE_FORMAT(`overview`.`leasefinish`, '%Y%m%d')) 
		        			ELSE CONCAT('1', DATE_FORMAT(`overview`.`leasestart`, '%Y%m%d'))
		        		END       
		        END
		    ) AS `Rent Until Value`, 
		    (
		        CASE
		        	WHEN `overview`.`leaseid` IS NULL THEN ''
		        	ELSE 
		        		CASE
		        			WHEN (`overview`.`leasestart`<=CURRENT_DATE) AND (`overview`.`revenueid` IS NOT NULL) THEN DATE_FORMAT(`overview`.`rentend`, '%M %d, %Y')
		        			ELSE 
		        				CASE
		        					WHEN `overview`.`Deposit_payment_date` IS NULL THEN ''
		        					ELSE 'Deposit Paid'
		        				END 
		        		END      
		        END
		    ) AS `Paid Until`, 
            (
		        CASE
		        	WHEN `overview`.`leaseid` IS NULL THEN '0'
		        	ELSE 
		        		CASE
		        			WHEN (`overview`.`leasestart`<=CURRENT_DATE) AND (`overview`.`revenueid` IS NOT NULL) THEN DATE_FORMAT(`overview`.`rentend`, '%Y%m%d')
		        			ELSE 
		        				CASE
		        					WHEN `overview`.`Deposit_payment_date` IS NULL THEN '0'
		        					ELSE '1'
		        				END 
		        		END      
		        END
		    ) AS `Paid Until Value`
		FROM
			(
				SELECT * 
				FROM
					(
				        SELECT `id`, `name` AS `apartmentname` 
				        FROM `apartment`
				        WHERE `apartment`.`building_id` = '{$building_id}'
				    ) AS `apartments`
				    LEFT JOIN 
				        (
				            SELECT `id` AS `leaseid`, `name` AS `leasename`, `apartment_id`, `Tenant_ID`, `ocupants_ids`, `Start_date` AS `leasestart`, `Finish` AS `leasefinish`, `Deposit_payment_date`
				            FROM `leaseagrm` 
				            WHERE `leaseagrm`.`Finish`>CURRENT_DATE
				        ) AS `currentlease` ON `apartments`.`id` = `currentlease`.`apartment_id` 
				    LEFT JOIN 
				    	(
				            SELECT `revenue`.`id` AS `revenueid`, `revenue`.`name` AS `revenuename`, `best_record`.*
				            FROM
				                (
				                    SELECT `apartment_id` AS `apartmentid`, MAX(`End_period`) AS `rentend`
				                    FROM `revenue` 
				                    WHERE `revenue`.`Revenue_type_id`='1' AND `revenue`.`Payment_date` IS NOT NULL 
				                    GROUP BY `apartment_id`
				                ) AS `best_record`, `revenue`
				            WHERE `revenue`.`apartment_id` = `best_record`.`apartmentid` AND `revenue`.`End_period` = `best_record`.`rentend`
				        ) AS `revenues` ON `apartments`.`id`= `revenues`.`apartmentid` 
				    LEFT JOIN 
				    	(
				            SELECT `id` AS `tenantid`, CONCAT(`tenant`.`First_Name`,' ',`tenant`.`Middle_Name`,' ',`tenant`.`Last_Name`) AS `tenantname`
				            FROM `tenant`
				        ) AS `tenants` ON `tenants`.`tenantid` = `currentlease`.`Tenant_ID`

			) AS `overview`
	"; 

	$raw_table = Connect::GetData($sql); 

	$column_match = array
	(
		'id' => 'ID',
		'apartmentname'=> 'Apartment Name', 
		'Rent Until'=>'Rent Until', 
		'Rent Until Value'=>'Rent Until Value', 
		'leaseid'=>'leaseid',
		'Paid Until'=>'Paid Until', 
		'Paid Until Value'=>'Paid Until Value', 
		'tenantname'=> 'Tenant Name', 
		'tenantid' => 'tenantid'
	);

	$table = array(); 
	foreach ($raw_table as $raw_row) 
	{
		$row = array(); 
		foreach ($column_match as $raw_column => $column) 
		{
			$row[$column] = $raw_row[$raw_column]; 
		}

		$list = json_decode($raw_row['ocupants_ids']); 
		$ocupant_title = 'Ocupant Name'; 
		$row[$ocupant_title] = ''; 
		if($list)
		{

			foreach ($list as $id) 
			{
				$ocupant = Connect::GeneralData('tenant', $id)[0]; 
				$text = "{$ocupant['First_Name']} {$ocupant['Last_Name']} "; 
				$template = 
				"
					<router-link to='tenant/edit?id={$id}' append>
						{$text}
					</router-link>
				"; 
				$row[$ocupant_title].="{$template}, "; 
			}
			$row[$ocupant_title] = substr_replace($row[$ocupant_title], '', strrpos($row[$ocupant_title], ','), 1); 
		}


		$CheckElementInArray = function($row, &$table)
		{
			for ($i=0; $i < count($table) ; $i++) 
			{ 
				if($table[$i]==$row)
				{
					return; 
				}
			}
			array_push($table, $row); 
		}; 

		$CheckElementInArray($row, $table); 
	}
	echo json_encode($table);




	/*

SELECT 
	`id` AS `leaseid`, 
	`Tenant_ID` AS `tenantid`, 
	`apartment_id`, 
    `Start_date`, 
    `Finish`, 
    `Deposit_payment_date`, 
    (SELECT CONCAT(`tenant`.`First_Name`,' ',`tenant`.`Middle_Name`,' ',`tenant`.`Last_Name`) FROM `tenant` WHERE `tenant`.`id`=`leaseagrm`.`Tenant_ID`) AS `Tenant Name`
FROM `leaseagrm` 
WHERE `Finish`>=CURRENT_DATE


SELECT 
	`id` AS `leaseid`, 
	`Tenant_ID` AS `tenantid`, 
	`apartment_id`, 
    `Start_date`, 
    `Finish`, 
	`Deposit_payment_date`, 
	    (
        CASE 
        	WHEN `Start_date`<CURRENT_DATE THEN DATE_FORMAT(`Finish`, '%M %d, %Y')
        	ELSE CONCAT('Move in on ', DATE_FORMAT(`Start_date`, '%M %d, %Y'))
        END
    ) AS `Rent Until`, 
    (
        CASE 
        	WHEN `Start_date`<CURRENT_DATE THEN CONCAT('2', DATE_FORMAT(`Finish`, '%Y%m%d'))
        	ELSE CONCAT('1', DATE_FORMAT(`Start_date`, '%Y%m%d'))
        END
    ) AS `Rent Until Value`, 
    (SELECT CONCAT(`tenant`.`First_Name`,' ',`tenant`.`Middle_Name`,' ',`tenant`.`Last_Name`) FROM `tenant` WHERE `tenant`.`id`=`leaseagrm`.`Tenant_ID`) AS `Tenant Name`
FROM `leaseagrm` 
WHERE `Finish`>=CURRENT_DATE



CREATE TEMPORARY TABLE IF NOT EXISTS `leaseagrm_overview_temp` AS 
(

    SELECT 
        `id` AS `leaseid`, 
        `Tenant_ID` AS `tenantid`, 
        `apartment_id`, 
        `Start_date`, 
        `Finish`, 
        `Deposit_payment_date`, 
            (
            CASE 
                WHEN `Start_date`<CURRENT_DATE THEN DATE_FORMAT(`Finish`, '%M %d, %Y')
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
            SELECT IFNULL(SUM(`revenue`.`Amount`),0) FROM `revenue` WHERE `revenue`.`leaseagrm_id` = `id`
        ) AS `paid_amount`, 
        (
            SELECT IFNULL(SUM(`invoice_leaseagrm`.`amount`), 0) FROM `invoice_leaseagrm` 
            WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
        ) AS `invoice_leaseagrm_amount`, 
        (
            SELECT IFNULL(SUM(`invoice_utilities`.`amount`), 0) FROM `invoice_utilities` 
            WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
        ) AS `invoice_utilities_amount`, 
        (SELECT CONCAT(`tenant`.`First_Name`,' ',`tenant`.`Middle_Name`,' ',`tenant`.`Last_Name`) FROM `tenant` WHERE `tenant`.`id`=`Tenant_ID`) AS `Tenant Name`
    FROM `leaseagrm` 
    WHERE `Finish`>=CURRENT_DATE
); 















CREATE TEMPORARY TABLE IF NOT EXISTS `leaseagrm_overview_temp` AS 
(

    SELECT 
        `id` AS `leaseid`, 
		`Tenant_ID` AS `tenantid`, 
		`ocupants_ids`, 
        `apartment_id`, 
        `Start_date`, 
        `Finish`, 
        `Deposit_payment_date`, 
            (
            CASE 
                WHEN `Start_date`<CURRENT_DATE THEN DATE_FORMAT(`Finish`, '%M %d, %Y')
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
            SELECT IFNULL(SUM(`revenue`.`Amount`),0) FROM `revenue` WHERE `revenue`.`leaseagrm_id` = `id`
        ) AS `paid_amount`, 
        (
            SELECT IFNULL(SUM(`invoice_leaseagrm`.`amount`), 0) FROM `invoice_leaseagrm` 
            WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
        ) AS `invoice_leaseagrm_amount`, 
        (
            SELECT IFNULL(SUM(`invoice_utilities`.`amount`), 0) FROM `invoice_utilities` 
            WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
        ) AS `invoice_utilities_amount`, 
        (SELECT CONCAT(`tenant`.`First_Name`,' ',`tenant`.`Middle_Name`,' ',`tenant`.`Last_Name`) FROM `tenant` WHERE `tenant`.`id`=`Tenant_ID`) AS `Tenant Name`
    FROM `leaseagrm` 
    WHERE `Finish`>=CURRENT_DATE
); 

CREATE TEMPORARY TABLE `leaseagrm_overview` AS 
(
   SELECT 
		*, 
		(
			CASE
				WHEN `paid_amount` = 0 THEN IF(ISNULL(`Deposit_payment_date`), NULL, 'Deposit paid')
				ELSE `paid_amount` - `invoice_leaseagrm_amount` - `invoice_utilities_amount`
			END
		) AS `Payment Status`, 
		(`paid_amount` - `invoice_leaseagrm_amount` - `invoice_utilities_amount`) AS `Payment Status Value`
	FROM `leaseagrm_overview_temp`
); 

SELECT 
	`apartment`.`id` AS `ID`, 
	`apartment`.`name` AS `Apartment Name`, 
	IFNULL(`leaseagrm_overview`.`Rental Status`, 'Vacant') AS `Rental Status`,
	IFNULL(`leaseagrm_overview`.`Rental Status Value`, 0) AS `Rental Status Value`, 
	`leaseagrm_overview`.`Payment Status`, 
	`leaseagrm_overview`.`Payment Status Value`, 
	`leaseagrm_overview`.`Tenant Name`, 
	IFNULL(`leaseagrm_overview`.`ocupants_ids`, '[]') AS `ocupants_ids`, 
	`leaseagrm_overview`.`leaseid`, 
	`leaseagrm_overview`.`tenantid`	
FROM `apartment` LEFT JOIN `leaseagrm_overview` ON `apartment`.`id` = `leaseagrm_overview`.`apartment_id`
WHERE `apartment`.`building_id` = '1'
ORDER BY `apartment`.`id`; 



	*/
?>

 


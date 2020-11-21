<?php 
    require_once("../helper/database.php"); 

	$sql = 
	"
		CREATE TEMPORARY TABLE IF NOT EXISTS `leaseagrm_overview_temp` AS 
		(
			SELECT 
				`id` AS `leaseid`, 
				`Tenant_ID` AS `tenantid`, 
				`ocupants_ids`, 
				`unit_id`, 
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
			`leaseagrm_overview`.`ocupants_ids`, 
			`leaseagrm_overview`.`leaseid`, 
			`leaseagrm_overview`.`tenantid`	
		FROM `unit` LEFT JOIN `leaseagrm_overview` ON `unit`.`id` = `leaseagrm_overview`.`unit_id`
		WHERE `unit`.`building_id` = '{$_GET['building_id']}'
		ORDER BY `unit`.`id`; 
	"; 

	$raw_table = Connect::MultiQuery($sql); 

	$table = array(); 
	foreach ($raw_table as $raw_row) 
	{
		$row = $raw_row; 

		$list = json_decode($raw_row['ocupants_ids']); 
		if($list)
		{
			$ocupant_names = []; 
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
				array_push($ocupant_names, $template); 
			}

			$row['Ocupant Name'] = implode(",", $ocupant_names); 
		}
		else 
		{
			$row['Ocupant Name'] = ""; 
		}

		array_push($table, $row); 
	}
	echo json_encode($table);
?>
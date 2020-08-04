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
				$ocupant = Connect::GetDataWithId($id, 'tenant')[0]; 
				$text = "{$ocupant['First_Name']} {$ocupant['Last_Name']} "; 
				$template = 
				"
					<a-hyperlink :params='{controller:`tenant`, action: `edit`, object_id:`{$id}`}'>
						{$text}
					</a-hyperlink>
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
?>

 


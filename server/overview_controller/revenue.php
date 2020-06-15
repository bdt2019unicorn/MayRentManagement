<?php 
	
	require_once("./overview.php"); 
	$sql = 
	"
		SELECT revenue.name AS `Name`, `revenue_type`.`name` as `Revenue Type`, `Start_period`, `End_period`, apartment.name AS `Apartment`, `Payment_date`, `Amount`, `Note` 
		FROM `revenue`, `revenue_type`,`apartment` 
		WHERE 
			`revenue`.`Revenue_type_id` = `revenue_type`.`id` AND 
		    `revenue`.`apartment_id` = `apartment`.`id`; 
	"; 
	GetDataOverview($sql); 
?>
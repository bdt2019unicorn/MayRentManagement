<?php 
	
	require_once("./general.php"); 
	$sql = 
	"
		SELECT `expense`.`name` AS `Name`, expense_type.name AS `Expense Type`, `Start_period`, `End_period`, apartment.name AS `Apartment`, `Payment_date`, `Amount`, `Note` 
		FROM `expense`, `expense_type`, `apartment`
		WHERE 
			`expense`.`expense_type_id` = `expense_type`.`id` AND 
		    `expense`.`apartment_id` = `apartment`.`id`;
	"; 
	GetDataGeneral($sql); 
?>
<?php 

	require_once("./general.php"); 

	if(isset($_GET['building_id'])&&!isset($_GET["id"]))
	{
		$sql = 
		"
	
			SELECT `leaseagrm`.`id` as `ID`, `leaseagrm`.`name` AS `Name`, apartment.name as `Apartment`, CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate` 
	
			FROM `leaseagrm`, `apartment`, `tenant`
			WHERE 
				`leaseagrm`.`apartment_id` = `apartment`.`id` AND 
				`leaseagrm`.`Tenant_ID` = `tenant`.`id` AND 
				`apartment`.`building_id` = '{$_GET['building_id']}'; 
		"; 
	
		GetDataGeneral($sql); 
	}

	else 
	{
		GetDataFromTable("leaseagrm", $conditions); 
	}

?>
<?php 
	require_once("./overview.php"); 

	$sql = 
	"
		SELECT *, concat(`First_Name`, ' ', `Middle_Name`,' ', `Last_Name`) as `full_name` 
		FROM `tenant`;
	"; 
	GetDataOverview($sql); 
?>
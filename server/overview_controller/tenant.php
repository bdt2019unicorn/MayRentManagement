<?php 
	require_once("./general.php"); 

	$sql = 
	"
		SELECT *, concat(`First_Name`, ' ', `Middle_Name`,' ', `Last_Name`) as `full_name` 
		FROM `tenant`
	"; 

	if(isset($_GET["id"]))
	{
		$sql.=" WHERE id = '{$_GET['id']}' "; 
	}
	GetDataGeneral($sql); 
?>
<?php 
	require_once("../helper/connect.php"); 
	$sql = 
	"
		SELECT * 
		FROM `buildings`
	"; 

	$data = Connect::GetData($sql); 

	echo json_encode($data);



?>
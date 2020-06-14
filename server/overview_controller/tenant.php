<?php 
	require_once("../helper/connect.php"); 
	$sql = 
	"
		SELECT * 
		FROM `tenant`
	"; 


	$data = Connect::GetData($sql); 

	echo json_encode($data);
?>
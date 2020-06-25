<?php 
	require_once("../helper/connect.php"); 
	$data = json_decode($_POST["excel"])[0]; 
	$sql = 
	"
		SELECT * 
		FROM `user` 
		WHERE 
			`approved`=true AND 
			`username`='". $data->username. "' AND 
			`password`= '". $data->password . "'; 
	"; 
	$data = Connect::GetData($sql); 
	echo (count($data)>0)? true: false;
?>
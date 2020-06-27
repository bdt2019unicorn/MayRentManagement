<?php 
	
	require_once "../helper/connect.php"; 

	function GetDataGeneral($sql)
	{
		$data = Connect::GetData($sql); 
		echo json_encode($data);
	}

	function GetDataFromTable($table)
	{
		$sql = 
		"
			SELECT * 
			FROM `". $table ."`
		"; 
		GetDataGeneral($sql); 
	}

?>
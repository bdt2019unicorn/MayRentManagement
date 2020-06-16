<?php 
	
	require_once __DIR__."../helper/connect.php"; 

	function GetDataOverview($sql)
	{
		$data = Connect::GetData($sql); 
		echo json_encode($data);
	}

	function GetDataGeneral($table)
	{
		$sql = 
		"
			SELECT * 
			FROM `". $table ."`
		"; 
		GetDataOverview($sql); 
	}

?>
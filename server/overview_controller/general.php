<?php 
	
	require_once("../helper/connect.php"); 
	require_once("../helper/query.php"); 

	function GetDataGeneral($sql)
	{
		$data = Connect::GetData($sql); 
		echo json_encode($data);
	}

	function GetDataFromTable($table, $conditions=null)
	{
		$sql = 
		"
			SELECT * 
			FROM `". $table ."`
		"; 

		if($conditions)
		{
			$sql.= Query::Where($conditions); 
		}

		GetDataGeneral($sql); 
	}

?>
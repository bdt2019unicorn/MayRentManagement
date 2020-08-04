<?php 
    require_once("../helper/database.php"); 

	$conditions = []; 
	if(isset($_GET["id"]))
	{
		$conditions["id"] = $_GET["id"]; 
	}

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
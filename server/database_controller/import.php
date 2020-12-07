<?php 
    require_once("../helper/database.php"); 

	$import_controller = $_GET["import_controller"]; 
	if($import_controller=="login")
	{
		$data = json_decode($_POST["excel"])[0]; 

		$user_information = Connect::SelectData("user", ["*"], ["approved"=>1, "username"=>$data->username, "password"=>$data->password]); 
		if(isset($user_information[0]["id"]))
		{
			echo $user_information[0]["id"]; 
		}
	}
	else
	{
		require_once("./helper.php"); 
		$params = Params($import_controller); 
		$excel = json_decode($_POST['excel']); 
		$queries = array_map(fn($row)=>Query::Insert($params['table'], RowData($row, $params)), $excel); 
	    $result = Connect::ExecTransaction($queries); 
		echo $result; 
	}
?>
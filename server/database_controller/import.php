<?php 
    require_once("../helper/database.php"); 

	$import_controller = $_GET["import_controller"]; 
	if($import_controller=="login")
	{
		$data = json_decode($_POST["excel"])[0]; 

		$user_information = Database::SelectData("user", ["*"], ["approved"=>1, "username"=>$data->username, "password"=>$data->password]); 
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
		$test_mode = CurrentEnvironment::TestMode(); 
		$queries = array_map(function($row)use ($params, $test_mode){return Query::Insert($params['table'], RowData($row, $params, $test_mode));}, $excel); 
		$result = Database::ExecTransaction($queries); 
		echo $result; 
	}
?>
<?php
	require_once("../../helper/database.php"); 
	$import_controller = $_GET["import_controller"]??$_GET["table"]; 
	if($import_controller=="login")
	{
		$data = json_decode($_POST["excel"])[0]; 
		$user_information = Database::SelectData("user", ["*"], ["approved"=>1, "username"=>$data->username, "password"=>$data->password]); 
		echo isset($user_information[0]["id"])? json_encode($user_information[0]) : false; 	
	}
	else
	{
		require_once("./helper.php"); 
		$params = Params($import_controller); 
		$excel = json_decode($_POST['excel']); 
		$test_mode = CurrentEnvironment::TestMode(); 
		$queries = array_map(function($row)use ($params, $test_mode, $import_controller){return Query::Insert($params['table']?:$import_controller, RowData($row, $params, $test_mode));}, $excel); 
		$result = Database::ExecTransaction($queries); 
		echo $result; 
		Database::LogUserAction($result, "Import", $import_controller, $_POST['excel'], implode("\n", $queries)); 
	}
?>
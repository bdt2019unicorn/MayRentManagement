<?php 
    require_once("../helper/database.php"); 


	function ExecExcelCommand($params)
	{
	    $excel = json_decode($_POST['excel']); 
	    $queries = []; 

	    foreach ($excel as $row) 
	    {
			$data = []; 
	        $AddData = function($key, $value) use (&$data, &$AddData, $params)
	        {

	            $ModifyKey = function($key)
	            {
		            $key = trim($key); 
		            $key = str_replace(' ','_',$key);
		            $key = str_replace("/","_",$key); 
		            $key = str_replace("-","",$key); 
		            $key = strtolower($key); 
		            return $key; 
	            }; 

	            $key = $ModifyKey($key); 

	            if(in_array($key, $params['exclude_columns']))
	            {
	            	return; 
	            }

	            if(isset($params['get_id'][$key]))
	            {
					$AddData
					(
						$params['get_id'][$key]['change'], 
						Connect::GetId
						(
							$params['get_id'][$key]['search'],
							$value,
							$params['get_id'][$key]['table']
						)
					); 
                    return; 
	            }


	            if(in_array($key, $params['date_collumns']))
	            {
					$date = date_create_from_format("d/m/Y", $value);
					$value = date_format($date, "Y-m-d");  
	            }
	            else if(in_array($key, $params['comma']))
	            {
	            	$value = str_replace(",", '', $value); 
	            }
				
				$data[$key] = $value; 


			}; 

	        foreach ($row as $key => $value) 
	        {
	            $AddData($key, $value); 
			}   
	        array_push($queries,Query::Insert($params['table'],$data)); 
		}
		
	    $result = Connect::ExecTransaction($queries); 
		echo $result; 
		
	}

	function Login()
	{
		$data = json_decode($_POST["excel"])[0]; 

		$user_information = Connect::SelectData("user", ["*"], ["approved"=>1, "username"=>$data->username, "password"=>$data->password]); 
		if(isset($user_information[0]["id"]))
		{
			echo $user_information[0]["id"]; 
		}
	}

	$import_controller = $_GET["import_controller"]; 
	if($import_controller=="login")
	{
		Login(); 
	}
	else
	{
		$params = array
		(
			"table" => "", 
			"date_collumns" => [], 
			"exclude_columns" => [], 
			"get_id" => [], 
			"year_number" => "20", 
			"comma" => []
		); 
	
		$data =  file_get_contents("params.json"); 
		$controller = json_decode($data, true)[$import_controller]; 
		foreach ($controller as $key => $value) 
		{
			$params[$key] = $value; 
		}

		ExecExcelCommand($params); 
	}
?>
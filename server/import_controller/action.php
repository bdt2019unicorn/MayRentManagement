<?php 
    require_once("../helper/database.php"); 


	function ExecExcelCommand($params)
	{
	    $excel = json_decode($_POST['excel']); 
	    $queries = []; 

	    foreach ($excel as $row) 
	    {
	        $sql = "INSERT INTO `{$params['table']}`"; 
	        $columns = "("; 
	        $values = "VALUES ("; 

	        $StringAddition = function($key, $value) use (&$columns, &$values, &$StringAddition, $params)
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
					$StringAddition
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

				$columns.=$key.',';

	            if(in_array($key, $params['date_collumns']))
	            {
	            	$value = "STR_TO_DATE('".substr_replace($value,"/".$params['year_number'],strrpos($value,"/"),1)."','%m/%d/%Y')"; 
	            }
	            else if(in_array($key, $params['comma']))
	            {
	            	$value = "'".str_replace(",", '', $value)."'"; 
	            }
	            else 
	            {
	            	$value = "'".$value."'"; 
	            }
	            $values.= $value.",";  
	        }; 

	        foreach ($row as $key => $value) 
	        {
	            $StringAddition($key, $value); 
	        }   
	        
	        $columns = substr_replace($columns, "",strrpos($columns,","),1) . ")"; 
	        $values = substr_replace($values, "",strrpos($values,","),1) . ")";
	        $sql.= $columns."\n".$values.";"; 
	        array_push($queries,$sql); 
		}
		
	    $result = Connect::ExecTransaction($queries); 
		echo $result; 
		
	}

	function Login()
	{
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
	
		if(isset($data[0]["id"]))
		{
			echo $data[0]["id"]; 
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
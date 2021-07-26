<?php 
	require_once("../../helper/support.php"); 
    function Params($table)
    {
        $params = array
		(
			"table" => "", 
			"exclude_columns" => [], 
			"date_columns" => [], 
			"get_id" => [], 
			"comma" => [], 
			"change" => [], 
			"user_info" => false 
		); 
	
		$data =  file_get_contents("params.json"); 
		DisableError();
		try 
		{
			$controller = json_decode($data, true)[$table]; 
			foreach ($controller as $key => $value) 
			{
				$params[$key] = $value; 
			}
		}
		catch(Throwable $throwable){}
        return $params; 
	}

	function RowData($row, $params, $test_mode = false)
	{
		$data = []; 
		$AddData = function($key, $value) use (&$data, &$AddData, $params, $test_mode)
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
			if(in_array($key, $params["exclude_columns"]))
			{
				return; 
			}
			if(isset($params['get_id'][$key]))
			{

				$key_params = $params['get_id'][$key]; 

				$conditions = [$key_params['search'] => $value]; 
				if($key_params["find_by_building"]??false)
				{
					$conditions["building_id"] = $_GET["building_id"]; 
				}

				$reference_id = Database::GetId($key_params['table'], $conditions); 
				if($reference_id)
				{
					$key = $params['get_id'][$key]['change']; 
					$value = $reference_id; 
					goto InputData; 
				}
				else 
				{
					return; 
				}
			}
			else if(isset($params['change'][$key]))
			{
				$key = $params['change'][$key]; 
			}
			if(in_array($key, $params['date_columns']))
			{
				$value = trim($value); 
				$date = date_create_from_format("d/m/Y", $value);
				$date_time = false; 
				if(!$date)
				{
					$date = date_create($value); 
					$date_time = true; 
					if(!$date)
					{
						return; 
					}
				}
				$value = date_format($date, $date_time? "Y-m-d H:i:s": "Y-m-d");  
			}
			else if(in_array($key, $params['comma']))
			{
				$value = trim($value); 
				$value = str_replace(",", '', $value); 
			}
			InputData: 
			$data[$key] = $test_mode? str_replace("'", "''", $value) : addslashes($value); 
		}; 

		foreach ($row as $key => $value) 
		{
			$AddData($key, $value); 
		}   

		if($params["user_info"])
		{
			$data["username"] = $_POST["username"]; 
			$data["modified_time"] = $_POST["modified_time"]; 
		}
		return $data; 
	}
?>
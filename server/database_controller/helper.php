<?php 
    function Params($table)
    {
        $params = array
		(
			"table" => "", 
			"date_columns" => [], 
			"get_id" => [], 
			"comma" => [], 
			"change" => []
		); 
	
		$data =  file_get_contents("params.json"); 
		$controller = json_decode($data, true)[$table]; 
		foreach ($controller as $key => $value) 
		{
			$params[$key] = $value; 
        }
        return $params; 
	}

	function RowData($row, $params)
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
			if(isset($params['get_id'][$key]))
			{

				$key_params = $params['get_id'][$key]; 

				$conditions = [$key_params['search'] => $value]; 
				if($key_params["find_by_building"]??false)
				{
					$conditions["building_id"] = $_GET["building_id"]; 
				}

				$reference_id = Connect::GetId($key_params['table'], $conditions); 
				if($reference_id)
				{
					$key = $params['get_id'][$key]['change']; 
					$value = $reference_id; 
				}
				else 
				{
					return; 
				}
			}
			else if(in_array($key, $params['date_columns']))
			{
				$value = trim($value); 
				$date = date_create_from_format("d/m/Y", $value);
				if(!$date)
				{
					return; 
				}
				$value = date_format($date, "Y-m-d");  
			}
			else if(in_array($key, $params['comma']))
			{
				$value = trim($value); 
				$value = str_replace(",", '', $value); 
			}
			if(isset($params['change'][$key]))
			{
				$key = $params['change'][$key]; 
			}
			$data[$key] = str_replace("'","\'",$value); 
		}; 

		foreach ($row as $key => $value) 
		{
			$AddData($key, $value); 
		}   
		return $data; 
	}
?>
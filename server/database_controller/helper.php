<?php 
    function Params($table)
    {
        $params = array
		(
			"table" => "", 
			"date_collumns" => [], 
			"exclude_columns" => [], 
			"get_id" => [], 
			"comma" => []
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
		return $data; 
	}
?>
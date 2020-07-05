<?php 
    class Query
    {
    	static public function Insert($table, $data)
    	{
    		$sql = "INSERT INTO `{$table}`"; 
    		$columns = "("; 
    		$values = "VALUES ("; 

    		foreach ($data as $column => $value) 
    		{
    			$columns.="`{$column}`,"; 
    			$values.="'{$value}',"; 
    		}
    		$sql.=" ".Query::RemoveLastCharacter($columns, ',').") ".Query::RemoveLastCharacter($values, ',').");"; 
    		return $sql; 
    	}

        static public function Update($table, $data, $conditions)
        {
        	$sql = "UPDATE `{$table}` SET "; 

        	foreach ($data as $column => $value) 
        	{
        		$sql.="`{$column}` = '{$value}', "; 
        	}

        	$sql = Query::RemoveLastCharacter($sql, ","); 
        	$sql.= " ". Query::Where($conditions); 
        	return $sql; 
        }

        static public function Where($conditions)
        {
            $sql = "WHERE "; 
            foreach ($conditions as $key => $value) 
            {
            	$sql.="`{$key}` = '{$value}' AND "; 
            }
            return Query::RemoveLastCharacter($sql, "AND"); 
        }

        static private function RemoveLastCharacter($sql, $character)
        {
        	return substr($sql,0, strrpos($sql, $character)); 
        }
    }
?>
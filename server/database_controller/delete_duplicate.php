<?php 
    require_once("../helper/database.php"); 
    $controller = $_GET["controller"]; 

    function ShouldDeleteValue($values)
    {
        global $special_columns; 
        foreach ($special_columns as $column) 
        {
            if($column!="id")
            {
                if($values[$column])
                {
                    return false; 
                }
            }
        }
        return true; 
    }

    $sql = 
    "
        SET @db=DATABASE(); 
        SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` WHERE `CONSTRAINT_SCHEMA` = @db AND `REFERENCED_TABLE_NAME`='{$controller}'; 
        SELECT DATABASE(); 
    "; 

    $references = Connect::MultiQuery($sql, true); 
    $references = $references[0]; 

    $special_columns = ["id"]; 
    $selects = ["*"]; 
    foreach ($references as $reference) 
    {
        $table_name = $reference["TABLE_NAME"]; 
        $column_name = $reference["COLUMN_NAME"]; 
        $special_column = "$table_name-$column_name"; 
        array_push($special_columns, $special_column); 
        array_push($selects, "(SELECT `{$column_name}` FROM `{$table_name}` WHERE `{$column_name}` = `{$controller}`.`id` LIMIT 1) AS `{$special_column}`"); 
    }

    $all_data = Connect::SelectData($controller, $selects); 

    $strings = []; 
    $duplicate = []; 
    foreach ($all_data as $index=>$values) 
    {
        $string = ""; 
        foreach ($values as $key=>$value) 
        {
            if(!in_array($key, $special_columns, true))
            {
                $string.=$value."\n"; 
            }
        }
        $string = trim($string); 
        if($duplicate_index = array_search($string, $strings, true))
        {
            if(ShouldDeleteValue($values))
            {
                array_push($duplicate, $values["id"]); 
            }
            else 
            {
                $duplicate_values = $all_data[$duplicate_index]; 
                if(ShouldDeleteValue($duplicate_values))
                {
                    array_push($duplicate, $duplicate_values["id"]); 
                }
            }
        }
        else 
        {
            $strings[$index] = trim($string); 
        }
    }

    if(count($duplicate))
    {
        $sql = "DELETE FROM {$controller} WHERE `id` IN (" . implode(", ", $duplicate) . ");"; 

        $result = Connect::GetData($sql); 
        echo $result; 
    }
    else 
    {
        echo true; 
    }

?>
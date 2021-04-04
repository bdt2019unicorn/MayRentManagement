<?php 
    require_once("../helper/database.php"); 
    $id = $_GET["id"]; 
    $table = $_GET["table"]; 
    $sql = 
    "
        SET @db=DATABASE(); 
        SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` 
        WHERE `TABLE_SCHEMA` = @db
        AND `REFERENCED_TABLE_NAME` = '{$table}';
        SELECT DATABASE(); 
    "; 
    $data = Connect::MultiQuery($sql, true); 
    $data = $data[0]; 
    $sql = "SELECT"; 
    $details = []; 
    foreach ($data as $reference) 
    {
        $table_name = $reference["TABLE_NAME"]; 
        $column_name = $reference["COLUMN_NAME"]; 
        $sql.="\n (SELECT COUNT(*) FROM `{$table_name}` WHERE `{$column_name}` = '{$id}')";
        array_push($details, "SELECT * FROM `{$table_name}` WHERE `$column_name` = '{$id}';"); 
    }
    $sql .=" AS `count`;";

    function CountData($count_data, $callback)
    {
        set_error_handler(function($errorno, $errstr){return null;}); 
        $count = null;
        try 
        {
            $count = boolval($count_data[0]["count"]); 
        } 
        catch (\Throwable $throwable) 
        {
            $count = boolval($count_data[0][0]["count"]); 
        } 
        if($count)
        {
            $result = $callback($count_data); 
            echo json_encode($result); 
        }
        else 
        {
            echo false; 
        }
    }

    function ArrayFilter($array)
    {
        return array_filter($array, function($value){return count($value);}); 
    }

    $test_mode = CurrentEnvironment::TestMode();
    if($test_mode)
    {
        $count_data = ConnectSqlite::Query($sql); 
        CountData
        (
            $count_data, 
            function($count_data) use ($details)
            {
                $details = array_map(function($sql){return ConnectSqlite::Query($sql);}, $details);
                return ArrayFilter($details); 
            }
        ); 
    }
    else 
    {
        $count_data = Connect::MultiQuery($sql . implode("\n", $details), true); 
        CountData
        (
            $count_data, 
            function($count_data)
            {
                unset($count_data[0]["count"]); 
                return ArrayFilter($count_data); 
            }
        ); 
    }
?>
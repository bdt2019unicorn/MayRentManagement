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
    foreach ($data as $reference) 
    {
        $table_name = $reference["TABLE_NAME"]; 
        $column_name = $reference["COLUMN_NAME"]; 
        $sql.="\n (SELECT COUNT(*) FROM `{$table_name}` WHERE `{$column_name}` = '$id')";
    }
    $sql .=" AS `count`;";
    $count_data = Database::GetData($sql); 
    echo boolval($count_data[0]["count"]); 

?>
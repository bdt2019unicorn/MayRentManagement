<?php 
    require_once("../helper/database.php"); 

    $sql = 
    "
        SET @db=DATABASE(); 
        SELECT `TABLE_NAME` AS `table_name`, CONCAT('SELECT * FROM `', `TABLE_NAME`, '`;') AS `query`
        FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = @db; 
        SELECT DATABASE(); 
    "; 

    $tables = Connect::MultiQuery($sql, true); 
    $comment = "/" . str_repeat("*", 10) . "/"; 

    $all = $tables[0]; 

    $tables = []; 
    $sql = ""; 
    foreach ($all as $table) 
    {
        $sql.= $table["query"]; 
        array_push($tables, $table["table_name"]); 
    }
    $data = Connect::MultiQuery($sql, true); 
    $result = ["START TRANSACTION;", "SET FOREIGN_KEY_CHECKS=0;", $comment]; 
    foreach ($tables as $index => $table) 
    {
        $table_data = $data[$index]; 
        foreach ($table_data as $value) 
        {
            array_push($result, Query::Insert($table, $value)); 
        }
        array_push($result, $comment); 
    }

    array_push($result, "SET FOREIGN_KEY_CHECKS=1;", "COMMIT;"); 

    header('Content-Type: application/sql');
    header('Content-Disposition: attachment; filename=may_backup_database.sql');
    echo implode("\n", $result); 
?>
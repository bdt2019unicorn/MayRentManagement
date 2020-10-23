<?php 
    require_once("../helper/database.php"); 
    // $backup = new Backup(); 
    // $backup->BackupDatabase(); 

    // header('Content-Type: application/sql');
    // header('Content-Disposition: attachment; filename=may_backup_database.sql');

    $sql = 
    "
        SET @db=DATABASE(); 
        SELECT `TABLE_NAME` AS `table_name`, CONCAT('SELECT * FROM `', `TABLE_NAME`, '`;') AS `query`
        FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = @db; 
        SELECT DATABASE(); 
    ". Query::SelectData("information_schema`.`REFERENTIAL_CONSTRAINTS", ["DISTINCT `REFERENCED_TABLE_NAME`"]); 

    $tables = Connect::MultiQuery($sql, true); 
    function AllTables($all)
    {
        $tables = []; 
        $sql = ""; 
        foreach ($all as $table) 
        {
            $sql.= $table["query"]; 
            array_push($tables, $table["table_name"]); 
        }
        $data = Connect::MultiQuery($sql, true); 
        $result = []; 
        foreach ($tables as $index => $table) 
        {
            $result[$table] = []; 
            $table_data = $data[$index]; 
            foreach ($table_data as $value) 
            {
                array_push($result[$table], Query::Insert($table, $value)); 
            }
        }
        
        return $result; 
    }
    
    $tables = 
    [
        "all"=> AllTables($tables[0]), 
        "references"=>$tables[2]
    ]; 

    // echo $sql; 

    echo '<pre>'; 
    print_r($tables); 
    echo '</pre>'; 

?>
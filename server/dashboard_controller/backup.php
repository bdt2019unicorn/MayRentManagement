<?php 
    require_once("../helper/database.php"); 

    $test_mode = CurrentEnvironment::TestMode(); 
    if($test_mode)
    {
        require_once("../helper/support.php"); 
        $path = CurrentEnvironment::TestSqliteDatabasePath(); 
        DownloadFile($path); 
    }
    else 
    {
        // $temp_folder = CurrentEnvironment::TempFolderPath(); 
        // if(!$temp_folder)
        // {
        //     $temp_folder = CurrentEnvironment::CreateFolder("/server/temp"); 
        // }
        // $backup_folder = "{$temp_folder}/backup"; 
        // $documents_folder = "{$backup_folder}/documents";
        // CurrentEnvironment::SetupFolder($backup_folder, $documents_folder); 

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
                if($table=="documents")
                {
                    // if(!file_exists("temp"))
                    // {
                    //     mkdir("temp"); 
                    // }
                    // file_put_contents("temp/file.tmp", $insert_data["file"]);
                    // $insert_data["file"] = addslashes(file_get_contents("temp/file.tmp")); 
                    // $hex = bin2hex($insert_data["file"]); 
                    // array_push($result, "\n", "\n", "\n", $hex, "\n", "\n", "\n"); 
                    $insert_data = $value; 
                    $file = "0x" . bin2hex($insert_data["file"]); 
                    unset($insert_data["file"]); 
                    // $insert_data["file"] = "0x" . bin2hex($insert_data["file"]); 
                    array_push($result, Query::Insert($table, $insert_data, ["file"=>$file])); 
                    continue; 
                }
                array_push($result, Query::Insert($table, $value)); 
            }
            array_push($result, $comment); 
        }
    
        array_push($result, "SET FOREIGN_KEY_CHECKS=1;", "COMMIT;"); 
        
        // file_put_contents("$backup_folder/may_backup_database.sql", implode("\n", $result)); 
    
        header('Content-Type: application/sql');
        header('Content-Disposition: attachment; filename=may_backup_database.sql');
        echo implode("\n", $result); 
    }

?>
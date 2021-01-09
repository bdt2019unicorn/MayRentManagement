<?php 
    require_once("./helper/database-sqlite.php"); 

    // $queries = 
    // [
    //     "INSERT INTO `expense_type`(`name`) values ('test21')", 
    //     "INSERT INTO `expense_type`(`name`) values ('test22')", 
    //     "INSERT INTO `expense_type`(`name`) values ('test23')"
    // ]; 

    // $result = ConnectSqlite::ExecTransaction($queries); 
    // echo $result; 
    // if($result===false)
    // {
    //     echo "<h1>creap</h1>"; 
    // }

    // $sql = "INSERT INTO `expense_type`(`name`) values ('test21')"; 


    // $id = ConnectSqlite::Exec($sql, true); 

    // echo $id; 


    $sql = "SELECT * FROM `tenant`1;"; 
    $data = ConnectSqlite::Query($sql); 

    echo "<pre>"; print_r($data); echo "</pre>"; 
    if($data===false)
    {
        echo "<h1>cry</h1>"; 
    }


?>
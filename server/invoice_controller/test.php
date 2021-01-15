<?php 
    require_once("./helper.php"); 
    $sql = "SELECT * FROM `documents` WHERE `id`=12"; 

    $data = Database::GetData($sql); 
    
    $insert = $data[0]; 
    unset($insert["id"]); 
    // echo "<pre>"; print_r($insert); echo "</pre>"; 
    // $sql = Query::Insert("documents", $insert); 
    // $result = ConnectSqlite::Exec($sql); 
    // echo $result; 
?>
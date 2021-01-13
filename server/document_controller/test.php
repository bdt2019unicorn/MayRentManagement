<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 

    $sql = "select * from `tenant`"; 

    $connect = Connect::GetData($sql); 
    echo "<pre>"; print_r($connect); echo "</pre>"; 
    $sqlite = ConnectSqlite::Query($sql); 
    echo "<pre>"; print_r($sqlite); echo "</pre>"; 

?>
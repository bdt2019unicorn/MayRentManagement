<?php
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 


    $sql = OverviewQueries\Documents::File(4);
    
    $data = ConnectSqlite::Query($sql); 

    // echo "<pre>"; print_r($data); echo "</pre>"; 
    if(count($data))
    {
        echo $data[0]["file"]; 
    }
?>
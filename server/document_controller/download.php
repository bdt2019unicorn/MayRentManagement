<?php
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 

    $sql = OverviewQueries\Documents::File($_POST["id"]); 
    $data = Connect::GetData($sql); 
    if(count($data))
    {
        echo $data[0]["file"]; 
    }
?>
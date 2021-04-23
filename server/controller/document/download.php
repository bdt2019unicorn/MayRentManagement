<?php
    require_once("../../helper/database.php"); 
    require_once("../../helper/overview_queries.php"); 
    print_r($_POST); 

    $sql = OverviewQueries\Documents::File($_POST["id"]); 
    $data = Database::GetData($sql); 
    if(count($data))
    {
        echo $data[0]["file"]; 
    }
?>
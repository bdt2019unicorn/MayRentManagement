<?php
    require_once("../helper/connect.php"); 
    $overview = array 
    (
        "SelectData"=>function()
        {
            $sql = "SELECT * FROM `revenue_type` WHERE `is_utility`='1';"; 
            $select_data = Connect::GetData($sql); 
            echo(json_encode($select_data)); 
        }
    ); 

    try 
    {
        $overview[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }


?>
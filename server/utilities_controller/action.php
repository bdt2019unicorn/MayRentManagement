<?php
    require_once("../helper/database.php"); 

    $overview = array 
    (
        "SelectData"=>function()
        {
            $sql = "SELECT * FROM `revenue_type` WHERE `is_utility`='1';"; 
            $select_data = Connect::GetData($sql); 
            echo(json_encode($select_data)); 
        }, 
        "CurrentPrice"=>function()
        {
            $sql = 
            "
                SELECT * FROM utility_price WHERE 
                date_valid = 
                (
                    SELECT MAX(date_valid) 
                    FROM utility_price up 
                    WHERE up.revenue_type_id=utility_price.revenue_type_id
                ) 
                AND revenue_type_id = {$_GET['revenue_type_id']}
            "; 
            $current_price = Connect::GetData($sql); 
            echo(json_encode($current_price)); 
        }, 
        "NewPrice"=>function()
        {
            $data = json_decode($_POST["NewPrice"]); 
            $sql = Query::Insert("utility_price", $data); 
            $result = Connect::GetData($sql); 
            echo $result; 
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
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
        "CurrentReadings"=>function()
        {
            $sql = 
            "
                SELECT 
                    `revenue_by_max_date`.*, 
                    (
                        SELECT `utility_reading`.`number` 
                        FROM `utility_reading`
                        WHERE 
                            `utility_reading`.`revenue_type_id` = `revenue_by_max_date`.`revenue_type_id` AND 
                            `utility_reading`.`date` = `revenue_by_max_date`.`date` AND 
                            `utility_reading`.`unit_id` = '{$_GET['unit_id']}'
                    ) AS `number`
                FROM 
                    (
                        SELECT `revenue_type_id`, MAX(`date`) AS `date`
                        FROM `utility_reading`
                        WHERE `utility_reading`.`unit_id` = '{$_GET['unit_id']}'
                        GROUP BY `revenue_type_id`
                    ) AS `revenue_by_max_date`
            "; 
            $current_readings = Connect::GetData($sql); 
            echo(json_encode($current_readings)); 

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
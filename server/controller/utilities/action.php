<?php
    require_once("../../helper/database.php"); 

    $overview = array 
    (
        "SelectStartDate"=> function()
        {
            $limit = 4; 
            $sql = "SELECT DISTINCT `date` FROM `utility_reading`"; 
            $conditions = []; 
            if(isset($_GET["revenue_type_id"]))
            {
                array_push($conditions, "`revenue_type_id` = '{$_GET['revenue_type_id']}'"); 
            }
            if(isset($_GET["unit_id"]))
            {
                array_push($conditions, "`unit_id` = '{$_GET['unit_id']}'"); 
            }
            else if(isset($_GET["building_id"]))
            {
                array_push($conditions, "`unit_id` IN (SELECT `unit`.`id` FROM `unit` WHERE `unit`.`building_id` = '{$_GET['building_id']}')"); 
            }

            if(count($conditions))
            {
                $sql.= "\n WHERE " . implode("AND", $conditions); 
            }
            $sql.=  "\nORDER BY `date` DESC LIMIT {$limit};"; 
            $dates = Database::GetData($sql); 
            $start_date = new DateTime("first day of this month"); 
            
            while($limit>=0)
            {
                $limit--; 
                if(isset($dates[$limit]))
                {
                    $new_date = new DateTime($dates[$limit]["date"]); 
                    if($new_date<$start_date)
                    {
                        $start_date = $new_date; 
                    }
                    break; 
                }
            }
            echo $start_date->format("Y-m-d"); 

        }, 
        "SelectData"=>function()
        {
            $sql = "SELECT * FROM `revenue_type` WHERE `is_utility`='1';"; 
            $select_data = Database::GetData($sql); 
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
            $current_price = Database::GetData($sql); 
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
            $current_readings = Database::GetData($sql); 
            echo(json_encode($current_readings)); 

        }, 
        "NewPrice"=>function()
        {
            $data = json_decode($_POST["NewPrice"], true); 
            $data["username"] = $_POST["username"]; 
            $data["modified_time"] = $_POST["modified_time"]; 
            $sql = Query::Insert("utility_price", $data); 
            $result = Database::GetData($sql); 
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
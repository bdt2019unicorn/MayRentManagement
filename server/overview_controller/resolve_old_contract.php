<?php 
    require_once("../helper/database.php"); 
    $commands = 
    [
        "LoadOldLeases"=> function()
        {
            $sql = 
            "
                SELECT 
                    *, 
                    GREATEST
                    (
                        `Start_date`, 
                        LAST_DAY(CURRENT_DATE - INTERVAL 1 MONTH)
                    ) AS `date_charged_until`
                FROM `leaseagrm` 
                WHERE 
                    `id` NOT IN (SELECT DISTINCT `leaseagrm_id` FROM `invoices`) AND 
                    `unit_id` IN (SELECT `id` FROM `unit` WHERE `unit`.`building_id` = '{$_GET['building_id']}') AND
                    CURRENT_DATE BETWEEN `Start_date` AND `Finish`
            "; 

            $data = Connect::GetData($sql); 
            echo json_encode($data); 
        }
    ]; 

    try 
    {
        $commands[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }
    

?>
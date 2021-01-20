<?php 
    require_once("./helper.php"); 
    $actions = array 
    (
        "LeasearmPeriodScript" => function()
        {
            $leaseagrm_period = $_POST["leaseagrm_period"]; 
            $data = Database::SelectData("leaseagrm_period",["calculation_method"], ["name"=> $leaseagrm_period]); 
            echo $data[0]["calculation_method"]; 
        }
    ); 
    
    try 
    {
        $actions[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }

?>
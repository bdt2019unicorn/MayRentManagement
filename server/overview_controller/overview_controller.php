<?php 

    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 

    $actions = ["overview", "utilities"]; 

    $generic_controllers = ["buildings", "expense_type", "revenue_type"]; 
    $overview_controller = $_GET["overview_controller"]; 

    if(in_array($overview_controller, $actions))
    {
        require_once("./{$overview_controller}.php"); 
    }
    else if (in_array($overview_controller, $generic_controllers))
    {
        echo "<h1> I am generic, error may come from here"; 
        // $overview_data = Connect::GeneralData($overview_controller, $_GET["id"]??null); 
        // echo "<pre>"; print_r($overview_data); echo "</pre>"; 
    }
    else 
    {
        $sql_queries = array 
        (
            "unit"=>function()
            {
                $unit = new OverviewQueries\Unit($_GET["edit"]??null, $_GET["building_id"]??null, $_GET["id"]??null); 
                return Query::SelectData("unit", $unit->GetArray("Selects"), $unit->GetArray("Conditions")); 
            },  
            "tenant"=> function()
            {
                $tenant = new OverviewQueries\Tenant($_GET["edit"]??null, $_GET["building_id"]??null, $_GET["id"]??null); 
                return Query::SelectData("tenant", $tenant->GetArray("Selects"), $tenant->GetArray("Conditions")); 
            },   
            "leaseagrm"=> function()
            {
                return (isset($_GET["edit"]))? Query::GeneralData("leaseagrm", $_GET["id"]??null): OverviewQueries\LeaseAgrm::OverviewBuildingId($_GET['building_id']); 
            },   
            "invoices"=>function()
            {
                return (isset($_GET["edit"]))? Query::GeneralData("invoices", $_GET["id"]??null): 
                "
                    SELECT 
                        `invoices`.`id` AS `ID`, 
                        `invoices`.`name` AS `Name`, 
                        `unit`.`name` AS `Unit`, 
                        (
                            IFNULL
                            (
                                (SELECT SUM(`amount`) FROM `invoice_leaseagrm` WHERE `invoice_leaseagrm`.`invoice_id` = `invoices`.`id`), 0
                            ) + 
                            IFNULL
                            (
                                (SELECT SUM(`amount`) FROM `invoice_utilities` WHERE `invoice_utilities`.`invoice_id` = `invoices`.`id`), 0 
                            )
                        ) AS `Amount`
                    FROM `invoices`, `leaseagrm`, `unit`
                    WHERE 
                    	`invoices`.`leaseagrm_id` = `leaseagrm`.`id` AND 
                        `leaseagrm`.`unit_id` = `unit`.`id` AND
                        `unit`.`building_id` = '{$_GET['building_id']}'
                "; 
            },                   
            "revenue"=>function()
            {
                return (isset($_GET["edit"]))? Query::GeneralData("revenue", $_GET["id"]??null): 
                "
                    SELECT `revenue`.`id` AS `ID`, `revenue`.`name` AS `Name`, `unit`.`name` AS `Apartment`, `revenue`.`Amount`, DATE_FORMAT(`revenue`.`Payment_date`,'%d/%m/%Y') AS `Payment Date`
                    FROM `revenue`,`leaseagrm`, `unit`
                    WHERE 
                        `revenue`.`leaseagrm_id` = `leaseagrm`.`id` AND
                        `leaseagrm`.`unit_id` = `unit`.`id` AND
                        `unit`.`building_id` = '{$_GET['building_id']}'
                "; 
            }, 
            "expense"=> function()
            {
                return isset($_GET["edit"])? Query::GeneralData("expense", $_GET['id']??null): 
                "
                    SELECT `expense`.`id` AS `ID`, `expense`.`name` AS `Name`, `expense_type`.`name` AS `Type`, DATE_FORMAT(`expense`.`Payment_date`,'%d/%m/%Y') AS `Payment Date`, `expense`.`Amount`
                    FROM `expense`, `expense_type` 
                    WHERE 
                        `expense`.`expense_type_id` = `expense_type`.`id` AND
                        `expense`.`building_id` = '{$_GET['building_id']}'
                "; 
            },
            "documents"=> function()
            {
                $documents = new OverviewQueries\Documents($_GET["edit"]??null, $_GET["building_id"]??null, $_GET["id"]??null); 
                return isset($_GET["unit_id"])? $documents->DocumentsByUnit($_GET["unit_id"]): $documents->Documents(); 
            }, 
            "user" => function()
            {
                return Query::GeneralData("user", $_GET["id"]); 
            }
        ); 
        $overview_data = Connect::GetData($sql_queries[$overview_controller]()); 
    }


    // if(isset($overview_data))
    // {
    //     echo json_encode($overview_data); 
    // }
?>
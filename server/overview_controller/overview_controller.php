<?php 

    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
    
    $edit = $_GET["edit"]??null; 
    $building_id = $_GET["building_id"]??null; 
    $id = $_GET["id"]??null; 
    $test_mode = CurrentEnvironment::TestMode(); 
    $unit_id = $_GET["unit_id"]??null; 

    $overview_controller = $_GET["overview_controller"]; 
    $actions = ["overview", "utilities"]; 
    $generic_controllers = ["buildings", "document_type", "expense_type", "leaseagrm_period", "revenue_type"]; 

    if(in_array($overview_controller, $actions))
    {
        require_once("./{$overview_controller}.php"); 
    }
    else if (in_array($overview_controller, $generic_controllers))
    {
        $overview_data = Database::GeneralData($overview_controller, $id); 
    }
    else 
    {
        $sql_queries = array 
        (
            "unit"=>function() use ($edit, $building_id, $id, $test_mode)
            {
                $unit = new OverviewQueries\Unit($edit, $building_id, $id, $test_mode);
                return Query::SelectData("unit", $unit->GetArray("Selects"), $unit->GetArray("Conditions")); 
            },  
            "tenant"=> function() use ($edit, $building_id, $id, $test_mode)
            {
                $tenant = new OverviewQueries\Tenant($edit, $building_id, $id, $test_mode); 
                return Query::SelectData("tenant", $tenant->GetArray("Selects"), $tenant->GetArray("Conditions")); 
            },   
            "leaseagrm"=> function() use ($edit, $building_id, $id, $test_mode)
            {
                return ($edit && $id) ? Query::GeneralData("leaseagrm", $id): OverviewQueries\LeaseAgrm::OverviewBuildingId($building_id, $test_mode); 
            },   
            "invoices"=>function() use ($edit, $building_id, $id, $test_mode)
            {
                $amount = Query::NumberFormat
                (
                    "
                        IFNULL
                        (
                            (SELECT SUM(`amount`) FROM `invoice_leaseagrm` WHERE `invoice_leaseagrm`.`invoice_id` = `invoices`.`id`), 0
                        ) + 
                        IFNULL
                        (
                            (SELECT SUM(`amount`) FROM `invoice_utilities` WHERE `invoice_utilities`.`invoice_id` = `invoices`.`id`), 0 
                        )
                    ", 
                    $test_mode
                ); 
                return $edit? Query::GeneralData("invoices", $id): 
                "
                    SELECT 
                        `invoices`.`id` AS `ID`, 
                        `invoices`.`name` AS `Name`, 
                        `unit`.`name` AS `Unit`, 
                        (
                            {$amount}
                        ) AS `Amount`
                    FROM `invoices`, `leaseagrm`, `unit`
                    WHERE 
                    	`invoices`.`leaseagrm_id` = `leaseagrm`.`id` AND 
                        `leaseagrm`.`unit_id` = `unit`.`id` AND
                        `unit`.`building_id` = '{$building_id}'
                "; 
            },                   
            "revenue"=>function() use ($edit, $building_id, $id)
            {
                return $edit? Query::GeneralData("revenue", $id): 
                "
                    SELECT `revenue`.`id` AS `ID`, `revenue`.`name` AS `Name`, `unit`.`name` AS `Apartment`, `revenue`.`Amount`, DATE_FORMAT(`revenue`.`Payment_date`,'%d/%m/%Y') AS `Payment Date`
                    FROM `revenue`,`leaseagrm`, `unit`
                    WHERE 
                        `revenue`.`leaseagrm_id` = `leaseagrm`.`id` AND
                        `leaseagrm`.`unit_id` = `unit`.`id` AND
                        `unit`.`building_id` = '{$building_id}'
                "; 
            }, 
            "expense"=> function() use ($edit, $building_id, $id)
            {
                return isset($_GET["edit"])? Query::GeneralData("expense", $id): 
                "
                    SELECT `expense`.`id` AS `ID`, `expense`.`name` AS `Name`, `expense_type`.`name` AS `Type`, DATE_FORMAT(`expense`.`Payment_date`,'%d/%m/%Y') AS `Payment Date`, `expense`.`Amount`
                    FROM `expense`, `expense_type` 
                    WHERE 
                        `expense`.`expense_type_id` = `expense_type`.`id` AND
                        `expense`.`building_id` = '{$building_id}'
                "; 
            },
            "documents"=> function() use ($edit, $building_id, $id, $unit_id, $test_mode)
            {
                $documents = new OverviewQueries\Documents($edit, $building_id, $id); 
                return $unit_id? $documents->DocumentsByUnit($unit_id, $test_mode): $documents->Documents($test_mode); 
            }, 
            "user" => function() use ($edit, $building_id, $id)
            {
                return Query::GeneralData("user", $id); 
            }
        ); 
        $overview_data = Database::GetData($sql_queries[$overview_controller]()); 
    }

    if(isset($overview_data))
    {
        echo json_encode($overview_data); 
    }
?>
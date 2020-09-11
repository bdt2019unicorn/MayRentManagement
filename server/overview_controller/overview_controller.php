<?php 
    require_once("../helper/database.php"); 

    $actions = array 
    (
        "overview"=> function()
        {
            require_once("./overview.php"); 
        }, 
        "utilities"=> function()
        {
            require_once("./utilities.php"); 
        }
    ); 

    $generic_controllers = ["buildings", "expense_type", "revenue_type"]; 
    $overview_controller = $_GET["overview_controller"]; 

    if(isset($actions[$overview_controller]))
    {
        $actions[$overview_controller](); 
    }
    else if (in_array($overview_controller, $generic_controllers))
    {
        $overview_data = Connect::GeneralData($overview_controller); 
    }
    else 
    {
        $sql_queries = array 
        (
            "apartment"=>function()
            {
                $selects = isset($_GET["edit"])? ["*"]: ["id AS ID", "name AS Name"]; 
                $conditions = null; 
                try 
                {
                    $conditions = isset($_GET["id"]) ? ["id"=>$_GET["id"]] : ["building_id"=>$_GET["building_id"]]; 
                }
                catch(\Throwable $throwable) {}

                return Query::SelectData("apartment", $selects, $conditions); 
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
            "invoice"=>function()
            {
                return (isset($_GET["edit"]))? Query::GeneralData("invoice", $_GET["id"]??null): 
                "
                    SELECT 
                        `invoice`.`id` AS `ID`, 
                        `invoice`.`name` AS `Name`, 
                        `apartment`.`name` AS `Apartment`, 
                        `invoice`.`start_date` AS `Start Date`, 
                        `invoice`.`end_date` AS `End Date`, 
                        (SELECT SUM(`amount`) FROM `invoice_details` WHERE `invoice_details`.`invoice_id` = `invoice`.`id`) AS `Amount`
                    FROM `invoice`, `leaseagrm`, `apartment`
                    WHERE 
                    	`invoice`.`leaseagrm_id` = `leaseagrm`.`id` AND 
                        `leaseagrm`.`apartment_id` = `apartment`.`id` AND
                        `apartment`.`building_id` = '{$_GET['building_id']}'
                "; 
            }, 
            "leaseagrm"=> function()
            {
                return (isset($_GET["edit"]))? Query::GeneralData("leaseagrm", $_GET["id"]??null): 
                "
                    SELECT 
                        `leaseagrm`.`id` as `ID`, 
                        `leaseagrm`.`name` AS `Name`, 
                        `apartment`.`name` as `Apartment`, 
                        CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, 
                        `Start_date` AS `Start Date`, 
                        `Finish` AS `End Date`, 
                        (
                            SELECT SUM(`invoice_details`.`amount`) 
                            FROM `invoice_details` 
                            WHERE `invoice_details`.`invoice_id` IN (SELECT `invoice`.`id` FROM `invoice` WHERE `invoice`.`leaseagrm_id` = `leaseagrm`.`id`)
                        ) AS `Amount`,
                        (
                            SELECT SUM(Amount) 
                            FROM `revenue`
                            WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                        ) AS `Paid Amount`
                    FROM `leaseagrm`, `apartment`, `tenant`
                    WHERE 
                        `leaseagrm`.`apartment_id` = `apartment`.`id` AND 
                        `leaseagrm`.`Tenant_ID` = `tenant`.`id` AND 
                        `apartment`.`building_id` = '{$_GET['building_id']}'; 
                ";
            },             
            "revenue"=>function()
            {
                return (isset($_GET["edit"]))? Query::GeneralData("revenue", $_GET["id"]??null): 
                "
                    SELECT `revenue`.`id` AS `ID`, `revenue`.`name` AS `Name`, `apartment`.`name` AS `Apartment`, `revenue`.`Amount`, DATE_FORMAT(`revenue`.`Payment_date`,'%d/%m/%Y') AS `Payment Date`
                    FROM `revenue`,`leaseagrm`, `apartment`
                    WHERE 
                        `revenue`.`leaseagrm_id` = `leaseagrm`.`id` AND
                        `leaseagrm`.`apartment_id` = `apartment`.`id` AND
                        `apartment`.`building_id` = '{$_GET['building_id']}'
                "; 
            }, 
            "tenant"=> function()
            {
                $selects = isset($_GET["edit"])? ["*", "CONCAT(`Last_Name`, ' ', `Middle_Name`, ' ', `First_Name`) AS `Full Name`"]: ["`id` AS `ID`", "`First_Name` AS `First Name`", "`Middle_Name` AS `Middle Name`", "`Last_Name` AS `Last Name`", "`Passport_ID_number` AS `ID Number`", "CONCAT(`Last_Name`, ' ', `Middle_Name`, ' ', `First_Name`) AS `Full Name`"]; 
                $conditions = isset($_GET["id"]) ? ["id"=>$_GET['id']]: null; 

                return Query::SelectData("tenant", $selects, $conditions); 
            }, 
            "user" => function()
            {
                return Query::GeneralData("user", $_GET["id"]); 
            }
        ); 
        $overview_data = Connect::GetData($sql_queries[$overview_controller]()); 
    }

    if(isset($overview_data))
    {
        echo json_encode($overview_data); 
    }
?>
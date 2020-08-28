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
                return isset($_GET["edit"])? Query::SelectData("expense", ["*"], ["id"=>$_GET['id']]): 
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
                return Query::GeneralData("invoice"); 
            }, 
            "leaseagrm"=> function()
            {
                return (isset($_GET['building_id'])&&!isset($_GET["id"]))? 
                "
                    SELECT `leaseagrm`.`id` as `ID`, `leaseagrm`.`name` AS `Name`, apartment.name as `Apartment`, CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, `Start_date`, `Finish`, `Rent_amount`, `Deposit_amount`, `Deposit_payment_date`, `Deposit_payback_date`, `Monthly_payment_date`, `Deposit_currency`, `Deposit_exchange_rate` 
            
                    FROM `leaseagrm`, `apartment`, `tenant`
                    WHERE 
                        `leaseagrm`.`apartment_id` = `apartment`.`id` AND 
                        `leaseagrm`.`Tenant_ID` = `tenant`.`id` AND 
                        `apartment`.`building_id` = '{$_GET['building_id']}'; 
                ": Query::GeneralData("leaseagrm", $_GET["id"]??null);
            },             
            "revenue"=>function()
            {
                return isset($_GET["edit"])? Query::SelectData("revenue", ["*"], ["id"=>$_GET['id']]): 
                "
                    SELECT `revenue`.`id` AS `ID`, `revenue`.`name` AS `Name`,`invoice`.`name` AS `Invoice`, `apartment`.`name` AS `Apartment`, `revenue`.`Amount`, DATE_FORMAT(`revenue`.`Payment_date`,'%d/%m/%Y') AS `Payment Date`
                    FROM `revenue` LEFT JOIN `invoice` ON `revenue`.`invoice_id` = `invoice`.`id` LEFT JOIN `apartment` ON `invoice`.`apartment` = `apartment`.`id`
                    WHERE `apartment`.`building_id` = '{$_GET['building_id']}'
                "; 
            }, 
            "tenant"=> function()
            {
                $selects = isset($_GET["edit"])? ["*"]: ["`id` AS `ID`", "`First_Name` AS `First Name`", "`Middle_Name` AS `Middle Name`", "`Last_Name` AS `Last Name`", "`Passport_ID_number` AS `ID Number`", "CONCAT(`Last_Name`, ' ', `Middle_Name`, ' ', `First_Name`) AS `Full Name`"]; 
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
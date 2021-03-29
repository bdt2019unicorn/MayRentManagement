<?php 
    require_once("../helper/database.php"); 
    require_once("../invoice_controller/helper.php"); 

    class ResolveOldContract 
    {
        public function LoadOldLeases()
        {
            $test_mode = CurrentEnvironment::TestMode(); 
            $extra_selects_sql = $test_mode?
            "            
                CASE
                    WHEN LAG(`utility_reading`.`unit_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`unit_id` AND LAG(`utility_reading`.`revenue_type_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`revenue_type_id` THEN LAG(`utility_reading`.`date`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC)
                    ELSE NULL
                END AS `previous_date`, 
                CASE
                    WHEN LAG(`utility_reading`.`unit_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`unit_id` AND LAG(`utility_reading`.`revenue_type_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`revenue_type_id` THEN LAG(`utility_reading`.`number`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC)
                    ELSE NULL
                END AS `previous_number`, 
                `leaseagrm`.`unit_id`,
                `utility_reading`.`revenue_type_id`,
                `utility_reading`.`date`,
                `utility_reading`.`number`, 
                MAX
                (
                    `Start_date`, 
                    DATE('now','start of month', '-1 day')
                ) AS `date_charged_until`
            ": 
            "
                IF(@previous_unit_id=`leaseagrm`.`unit_id` AND @previous_revenue_type_id=`utility_reading`.`revenue_type_id`, @previous_date, @previous_date:='0000-00-00') AS `previous_date`, 
                IF(@previous_unit_id=`leaseagrm`.`unit_id` AND @previous_revenue_type_id=`utility_reading`.`revenue_type_id`, @previous_number, @previous_number:=0) AS `previous_number`, 
                @previous_unit_id:= `leaseagrm`.`unit_id` AS `unit_id`,
                @previous_revenue_type_id:=`utility_reading`.`revenue_type_id` AS `revenue_type_id`,
                @previous_date:=`utility_reading`.`date` AS `date`,
                @previous_number:=`utility_reading`.`number` AS `number`, 
                GREATEST
                (
                    `Start_date`, 
                    LAST_DAY(CURRENT_DATE - INTERVAL 1 MONTH)
                ) AS `date_charged_until`
            "; 

            $sql = 
            "
                SELECT 
                    `info`.*,
                    `info`.`number` - `info`.`previous_number` AS `quantity`,
                    `utility_price`.`value` AS `price`, 
                    (`info`.`number` - `info`.`previous_number`) * `utility_price`.`value` AS `amount`
                FROM
                    (
                        SELECT 
                            `leaseagrm`.`id`,
                            `leaseagrm`.`name`,
                            `leaseagrm`.`Start_date`,
                            `leaseagrm`.`Finish`,
                            `leaseagrm`.`Rent_amount`,
                            `leaseagrm_period`.`name` AS `leaseagrm_period`, 
                            `utility_reading`.`id` AS `utility_reading_id`,
                            `revenue_type`.`name` AS `revenue_type`, 
                            
                            {$extra_selects_sql}
                        FROM 
                            `leaseagrm` LEFT JOIN `utility_reading` ON `leaseagrm`.`unit_id` = `utility_reading`.`unit_id`
                            LEFT JOIN `leaseagrm_period` ON `leaseagrm`.`leaseagrm_period_id` = `leaseagrm_period`.`id` 
                            LEFT JOIN `revenue_type` ON `utility_reading`.`revenue_type_id` = `revenue_type`.`id` AND `revenue_type`.`is_utility` = '1'
                        WHERE 
                            `leaseagrm`.`id` NOT IN (SELECT DISTINCT `leaseagrm_id` FROM `invoices`) AND 
                            `leaseagrm`.`unit_id` IN (SELECT `id` FROM `unit` WHERE `unit`.`building_id` = '{$_GET['building_id']}') AND
                            CURRENT_DATE BETWEEN `Start_date` AND `Finish` 
                        ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC 
                    ) info 
                    LEFT JOIN `utility_price` ON `utility_price`.`revenue_type_id` = `info`.`revenue_type_id` AND `utility_price`.`date_valid` <= `info`.`previous_date`
                WHERE 
                    `info`.`date` > `info`.`Start_date` AND `info`.`date` <= `info`.`Finish` 
                    AND `info`.`previous_date` <> '0000-00-00'
                ORDER BY `info`.`id`, `info`.`date` ASC, `info`.`revenue_type_id`
            "; 
            if(!$test_mode)
            {
                $sql = 
                "
                    SET @previous_date = '0000-00-00'; 
                    SET @previous_number = 0; 
                    SET @previous_unit_id = 0; 
                    SET @previous_revenue_type_id = 0; 
                    {$sql}
                "; 
            }
            $data = $test_mode? ConnectSqlite::Query($sql): Connect::MultiQuery($sql); 
            $old_leases = []; 
            $leaseagrm_keys = ["id", "name", "Start_date", "Finish", "Rent_amount","leaseagrm_period", "date_charged_until"]; 
            foreach ($data as $leaseagrm_record) 
            {
                $id = $leaseagrm_record["id"]; 
                $utility_reading_id = $leaseagrm_record["utility_reading_id"]; 
                $revenue_type = $leaseagrm_record["revenue_type"]; 
                $old_lease = 
                [
                    "utilities" =>
                    [
                        $revenue_type =>
                        [
                            $utility_reading_id=>[]
                        ]
                    ]
                ]; 
                foreach ($leaseagrm_record as $key => $value) 
                {
                    if (in_array($key, $leaseagrm_keys)) 
                    {
                        if(!isset($old_leases[$id]))
                        {
                            $old_lease[$key] = $value; 
                        }
                    }
                    else
                    {
                        $old_lease["utilities"][$revenue_type][$utility_reading_id][$key] = $value; 
                    }
                }
                if(isset($old_leases[$id]))
                {
                    if(!isset($old_lease[$id]["utilities"][$revenue_type]))
                    {
                        $old_lease[$id]["utilities"][$revenue_type] = []; 
                    }
                    $old_leases[$id]["utilities"][$revenue_type][$utility_reading_id] = $old_lease["utilities"][$revenue_type][$utility_reading_id]; 
                }
                else
                {
                    $old_leases[$id] = $old_lease; 
                }
            }
            require_once("../helper/support.php"); 
            $old_leases = ObjectToArray($old_leases); 
            echo json_encode($old_leases); 
        }

        public function ResolveOldLeases()
        {
            function DateReformatName($date_string)
            {
                $date = new DateTime($date_string); 
                return $date->format("d M Y"); 
            }; 

            $old_leases = json_decode($_POST["old_leases"], true); 
            $rent_id = OverviewQueries\Invoices::RentId(); 
            $test_mode = CurrentEnvironment::TestMode(); 

            $sql = []; 

            foreach ($old_leases as $leaseagrm) 
            {
                $start_date = DateReformatName($leaseagrm["start_date"]); 
                $date_charged_until = DateReformatName($leaseagrm["date_charged_until"]); 
                $general_name = "\"{$leaseagrm['name']}\" period {$start_date} - {$date_charged_until}"; 

                $invoices = 
                [
                    "invoice"=>
                    [
                        "name" => "Resolve {$general_name}", 
                        "leaseagrm_id"=>$leaseagrm["id"]
                    ], 
                    "details"=>
                    [
                        "leaseagrm"=>
                        [
                            [
                                "name" => "Rent {$general_name}", 
                                "revenue_type_id" => $rent_id, 
                                "end_date" => $leaseagrm["date_charged_until"], 
                                "start_date" => $leaseagrm["start_date"], 
                                "price" => $leaseagrm["price"], 
                                "amount" => $leaseagrm["amount"]
                            ]
                        ], 
                        "utilities"=> $leaseagrm["utilities"]
                    ]
                ]; 

                $revenue_data = 
                [
                    "name" => "Payment for invoice {$general_name}", 
                    "leaseagrm_id" => $leaseagrm["id"], 
                    "Payment_date" => $leaseagrm["date_charged_until"], 
                    "Amount" => $leaseagrm["total"]
                ]; 

                $queries = ImportInvoice($invoices, $test_mode); 
                if($test_mode)
                {
                    $queries["details"]["revenue"] = ["data"=>[$revenue_data]]; 
                    array_push($sql, $queries);
                }
                else 
                {
                    $sql = array_merge($sql, $queries, [Query::Insert("revenue", $revenue_data)]); 
                }
            }

            $result = $test_mode? ConnectSqlite::InsertWithDetailsGroup($sql):Connect::ExecTransaction($sql); 
            if($result)
            {
                $this->LoadOldLeases(); 
            }
            else 
            {
                echo false; 
            }
        }
    }

    $resolve_old_contract = new ResolveOldContract(); 

    try 
    {
        $command = $_GET["command"]; 
        $resolve_old_contract->$command(); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }
    

?>
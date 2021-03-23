<?php 
    require_once("../helper/database.php"); 
    require_once("../invoice_controller/helper.php"); 

    class ResolveOldContract 
    {
        public function LoadOldLeases()
        {
            $date_charged_until = CurrentEnvironment::TestMode()? 
            "
                MAX
                (
                    `Start_date`, 
                    DATE('now','start of month', '-1 day')
                )
            ": 
            "
                GREATEST
                (
                    `Start_date`, 
                    LAST_DAY(CURRENT_DATE - INTERVAL 1 MONTH)
                )
            "; 
            $sql = 
            "
                SELECT 
                    *, 
                    (
                        SELECT `leaseagrm_period`.`name` FROM `leaseagrm_period` 
                        WHERE `leaseagrm_period`.`id` = `leaseagrm`.`leaseagrm_period_id`
                    ) AS `leaseagrm_period`, 
                    {$date_charged_until} AS `date_charged_until`
                FROM `leaseagrm` 
                WHERE 
                    `id` NOT IN (SELECT DISTINCT `leaseagrm_id` FROM `invoices`) AND 
                    `unit_id` IN (SELECT `id` FROM `unit` WHERE `unit`.`building_id` = '{$_GET['building_id']}') AND
                    CURRENT_DATE BETWEEN `Start_date` AND `Finish`
            "; 
            $data = Database::GetData($sql); 
            echo json_encode($data); 
        }

        public function ResolveOldLeases()
        {
            function DateReformatName($date_string)
            {
                $date = new DateTime($date_string); 
                return $date->format("d M Y"); 
            }; 

            function RentDetails($leaseagrm)
            {
                $columns = ["start_date", "price", "amount"]; 
                $details = []; 
                foreach ($columns as $column) 
                {
                    $details[$column] = $leaseagrm[$column]; 
                }
                return $details; 
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
                            array_merge
                            (
                                [
                                    "name" => "Rent {$general_name}", 
                                    "revenue_type_id"=> $rent_id, 
                                    "end_date"=> $leaseagrm["date_charged_until"]
                                ], RentDetails($leaseagrm)
                            )
                        ]
                    ]
                ]; 

                $revenue_data = 
                [
                    "name" => "Rent {$general_name}", 
                    "leaseagrm_id" => $leaseagrm["id"], 
                    "Payment_date" => $leaseagrm["date_charged_until"], 
                    "Amount" => $leaseagrm["amount"]
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
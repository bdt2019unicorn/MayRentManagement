<?php 
    require_once("../helper/database.php"); 
    require_once("../invoice_controller/helper.php"); 

    class ResolveOldContract 
    {
        public function LoadOldLeases()
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

                $queries = ImportInvoice($invoices); 
                $sql = array_merge($sql, $queries, [Query::Insert("revenue", $revenue_data)]); 
            }

            if(Connect::ExecTransaction($sql))
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
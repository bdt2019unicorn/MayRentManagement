<?php 
    Trait LeaseAgrm
    {
        private $leaseagrm_id, $rent_id, $total_paid_amount, $total_invoice_amount, $start_lease; 
        private $date_format = "Y-m-d"; 
        function __construct($leaseagrm_id)
        {
            $helper_path = __DIR__ . "../../../helper/"; 
            echo $helper_path; 
            require_once(realpath("{$helper_path}database.php")); 
            require_once(realpath("{$helper_path}overview_queries.php")); 

            $this->leaseagrm_id = $leaseagrm_id; 
            $this->rent_id = OverviewQueries\Invoices::RentId(); 
            $this->total_paid_amount = OverviewQueries\LeaseAgrm::TotalPaidAmountQuery(); 
            $this->total_invoice_amount = OverviewQueries\LeaseAgrm::$TotalInvoiceAmountQuery; 
        }

        private function LeaseAgrm()
        {
            $selects = 
            [
                "`Rent_amount` AS `rent_amount`", 
                "{$this->total_paid_amount} AS `paid_amount`", 
                "{$this->total_invoice_amount} AS `total_amount`", 
                "IFNULL((SELECT `leaseagrm_period`.`name` FROM `leaseagrm_period` WHERE `leaseagrm_period`.`id` = `leaseagrm_period_id`), 'months') AS `leaseagrm_period`"
            ]; 
        
            $sql = Query::SelectData("leaseagrm", $selects, ["id"=>$this->leaseagrm_id]); 
            $leaseagrm = ConnectSqlite::Query($sql); 
            $leaseagrm = $leaseagrm[0]; 
            $leaseagrm["difference"] = floatval($leaseagrm["total_amount"]) - floatval($leaseagrm["paid_amount"]); 
            $start_date = $this->StartDate(); 
            $leaseagrm["start_date"] = $start_date; 
            $leaseagrm["end_date"] = $this->EndDate($start_date); 
            $leaseagrm["rent_information"] = $this->RentInformation(); 
            return $leaseagrm; 
        }

        private function StartDate()
        {
            $sql = 
            "
                SELECT MAX(`invoice_leaseagrm`.`end_date`) AS `start_date` FROM `invoice_leaseagrm`, `invoices` 
                WHERE  
                    `invoices`.`id` = `invoice_leaseagrm`.`invoice_id` AND 
                    `invoice_leaseagrm`.`revenue_type_id` = '{$this->rent_id}' AND  
                    `invoices`.`leaseagrm_id` = '{$this->leaseagrm_id}'
            "; 
            $data = ConnectSqlite::Query($sql); 
            if($data[0]["start_date"])
            {
                return (new DateTime($data[0]["start_date"]))->modify("+1 day")->format($this->date_format); 
            }
            else 
            {
                return $this->start_lease; 
            }
        }

        private function EndDate($start_date)
        {
            $start_date = new DateTime($start_date); 
            $end_of_last_month = (new DateTime())->modify("-1 month")->modify("last day of"); 
            if($end_of_last_month>$start_date)
            {
                return $end_of_last_month->format($this->date_format); 
            }
            else 
            {
                $now = new DateTime(); 
                return ($start_date<=$now)? $now->format($this->date_format): $start_date->format($this->date_format); 
            }
        }

        private function RentInformation()
        {
            $sql = 
            "                    
                SELECT * FROM `invoice_leaseagrm` 
                WHERE 
                    `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = '{$this->leaseagrm_id}') 
                    AND `revenue_type_id` = '{$this->rent_id}' 
                ORDER BY `start_date` ASC 
            "; 
            $data = ConnectSqlite::Query($sql); 
            if(!count($data))
            {
                return [["start_date"=>(new DateTime($this->start_lease))->format($this->date_format), "end_date"=> null]]; 
            }
            $result = []; 
            for ($i=0; $i < count($data) ; $i++) 
            { 
                $start_date = $data[$i]["start_date"]; 
                $end_date = $data[$i]["end_date"];
                if(!isset($data[$i-1]))
                {
                    if(new DateTime($start_date)>new DateTime($this->start_lease))
                    {
                        array_push($result, ["start_date"=>$this->start_lease, "end_date"=>$start_date]); 
                    }
                }
                if(isset($data[$i+1]))
                {
                    $next_start_date = (new DateTime($end_date))->modify("+1 day"); 
                    $new_start_date = new DateTime($data[$i+1]["start_date"]); 
                    if($next_start_date<$new_start_date)
                    {
                        $new_start_date = $new_start_date->modify("-1 day"); 
                        if($new_start_date>$next_start_date)
                        {
                            array_push($result, ["start_date"=>$next_start_date, "end_date"=>$new_start_date]); 
                        }
                    }
                }
                else 
                {
                    array_push($result, ["start_date"=>$end_date, "end_date"=>null]); 
                }
            }
            return $result; 
        }
    }
?>
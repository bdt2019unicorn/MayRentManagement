<?php 
    require_once("test-support.php"); 
    // echo $sql; 
    $data = Connect::MultiQuery($sql, true); 
    echo "<pre>"; print_r($data); echo "</pre>"; 


    $LeaseAgrm = function() use ($leaseagrm_id, $rent_id, $total_paid_amount, $total_invoice_amount)
    {
        $selects = 
        [
            "`Rent_amount` AS `rent_amount`", 
            "{$total_paid_amount} AS `paid_amount`", 
            "{$total_invoice_amount} AS `total_amount`", 
            "IFNULL((SELECT `leaseagrm_period`.`name` FROM `leaseagrm_period` WHERE `leaseagrm_period`.`id` = `leaseagrm_period_id`), 'months') AS `leaseagrm_period`"
        ]; 
    
        $sql = Query::SelectData("leaseagrm", $selects, ["id"=>$leaseagrm_id]); 
        $leaseagrm = ConnectSqlite::Query($sql); 
        $leaseagrm = $leaseagrm[0]; 
        $date_format = "Y-m-d"; 
        $StartDate = function() use ($leaseagrm_id, $rent_id, $date_format)
        {
            $sql = 
            "
                SELECT MAX(`invoice_leaseagrm`.`end_date`) AS `start_date` FROM `invoice_leaseagrm`, `invoices` 
                WHERE  
                    `invoices`.`id` = `invoice_leaseagrm`.`invoice_id` AND 
                    `invoice_leaseagrm`.`revenue_type_id` = '{$rent_id}' AND  
                    `invoices`.`leaseagrm_id` = '{$leaseagrm_id}'
            "; 
            $data = ConnectSqlite::Query($sql); 
            if($data[0]["start_date"])
            {
                return (new DateTime($data[0]["start_date"]))->modify("+1 day")->format($date_format); 
            }
            else 
            {
                $sql = Query::SelectData("leaseagrm", ["`Start_date` AS `start_lease`"], ["id"=>$leaseagrm_id]); 
                $data = ConnectSqlite::Query($sql); 
                return $data[0]["start_lease"]; 
            }
        }; 
        $EndDate = function($start_date) use ($date_format)
        {
            $start_date = new DateTime($start_date); 
            $end_of_last_month = (new DateTime())->modify("-1 month")->modify("last day of"); 
            if($end_of_last_month>$start_date)
            {
                return $end_of_last_month->format($date_format); 
            }
            else 
            {
                $now = new DateTime(); 
                return ($start_date<=$now)? $now->format($date_format): $start_date->format($date_format); 
            }
        }; 
        $leaseagrm["difference"] = floatval($leaseagrm["total_amount"]) - floatval($leaseagrm["paid_amount"]); 
        $start_date = $StartDate(); 
        $leaseagrm["start_date"] = $start_date; 
        $leaseagrm["end_date"] = $EndDate($start_date); 
        return $leaseagrm; 
    }; 

    
?>
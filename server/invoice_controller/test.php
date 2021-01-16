<?php 
    require_once("test-support.php"); 
    // echo $sql; 
    $data = Connect::MultiQuery($sql, true); 
    echo "<pre>"; print_r($data); echo "</pre>"; 
    
    $StartLease = function($leaseagrm_id) 
    {
        $sql = Query::SelectData("leaseagrm", ["`Start_date` AS `start_lease`"], ["id"=>$leaseagrm_id]); 
        $data = ConnectSqlite::Query($sql); 
        return $data[0]["start_lease"]; 
    }; 


    $LeaseAgrm = function() use ($leaseagrm_id, $rent_id, $total_paid_amount, $total_invoice_amount, $StartLease)
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

        $StartDate = function() use ($leaseagrm_id, $rent_id, $date_format, $StartLease)
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
                return $StartLease($leaseagrm_id); 
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

    $UnitId = function() use ($leaseagrm_id)
    {
        $sql = Query::SelectData("leaseagrm", ["`unit_id`"], ["id"=>$leaseagrm_id]); 
        $data = ConnectSqlite::Query($sql); 
        return $data[0]["unit_id"]; 
    }; 

    $Utilities = function($unit_id) use ($StartLease, $leaseagrm_id)
    {
        $utilities = Database::SelectData("revenue_type", ["*"], ["is_utility"=>1]); 
        $start_lease = $StartLease($leaseagrm_id); 
        $utilities = array_map
        (
            function($revenue_type) use ($unit_id, $start_lease, $leaseagrm_id)
            {   
                $sql = "SELECT * FROM `utility_reading` WHERE `unit_id` = '{$unit_id}' AND `revenue_type_id` = '{$revenue_type['id']}' ORDER BY `date` DESC";
                $data = ConnectSqlite::Query($sql); 
                if(count($data)<=1)
                {
                    return []; 
                }
                for ($i=0; $i < count($data)-1 ; $i++) 
                { 
                    $previous_date = $data[$i+1]["date"]; 
                    $previous_number = $data[$i+1]["number"]; 
                    
                    $UtilityPrice =function($previous_date) use ($revenue_type)
                    {
                        $sql = "SELECT * FROM `utility_price` WHERE `revenue_type_id` = '{$revenue_type['id']}' AND `date_valid` <='{$previous_date}' ORDER BY `date_valid` DESC LIMIT 1;"; 
                        $data = ConnectSqlite::Query($sql); 
                        return count($data)? $data[0]["value"] : 0; 
                    }; 
                    $price = $UtilityPrice($previous_date); 
                    $data[$i]["previous_date"] = $previous_date; 
                    $data[$i]["previous_number"] = $previous_number; 
                    $data[$i]["price"] = $price; 
                    $quantity = floatval($data[$i]["number"]) - floatval($previous_number); 
                    $data[$i]["quantity"] = $quantity; 
                    $data[$i]["amount"] = $quantity * floatval($price); 
                }

                $ExistingUtilityReadingIds = function() use ($leaseagrm_id)
                {
                    $sql = "SELECT `utility_reading_id` FROM `invoice_utilities` 
                    WHERE `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = '{$leaseagrm_id}')"; 
                    $data = ConnectSqlite::Query($sql); 
                    return array_map(function($utility_reading){return $utility_reading["utility_reading_id"]; }, $data); 
                }; 

                $existing_utility_reading_ids = $ExistingUtilityReadingIds(); 
                
                return array_filter
                (
                    $data, function($row) use ($existing_utility_reading_ids, $start_lease)
                    {
                        if(isset($row["previous_date"]))
                        {
                            $previous_date = new DateTime($row["previous_date"]); 
                            return (in_array($row["id"], $existing_utility_reading_ids))? false: $previous_date >= new DateTime($start_lease); 
                        }
                        return false; 
                    }
                ); 
            }, $utilities
        ); 
        return array_reduce($utilities, function($current, $utility){return array_merge($current, $utility); }, []); 
    }; 

    $UnitName = function($unit_id)
    {
        $sql = Query::SelectData("unit", ["name"], ["id"=>$unit_id]); 
        $data = ConnectSqlite::Query($sql); 
        return $data[0]["name"]; 
    }; 

    $unit_id = $UnitId(); 
    $utilities = $Utilities($unit_id); 
    
?>
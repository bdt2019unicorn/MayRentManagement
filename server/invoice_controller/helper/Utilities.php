<?php 
    // require_once("../../helper/database.php"); 
    Trait Utilities 
    {
        private function Utilities($unit_id)
        {
            $utilities = Database::SelectData("revenue_type", ["*"], ["is_utility"=>1]); 
            $utilities = array_map
            (
                function($revenue_type) use ($unit_id)
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
    
                    $existing_utility_reading_ids = $this->ExistingUtilityReadingIds(); 
                    
                    return array_filter
                    (
                        $data, function($row) use ($existing_utility_reading_ids)
                        {
                            if(isset($row["previous_date"]))
                            {
                                $previous_date = new DateTime($row["previous_date"]); 
                                return (in_array($row["id"], $existing_utility_reading_ids))? false: $previous_date >= new DateTime($this->start_lease); 
                            }
                            return false; 
                        }
                    ); 
                }, $utilities
            ); 
            return array_reduce($utilities, function($current, $utility){return array_merge($current, $utility); }, []); 
        }

        private function ExistingUtilityReadingIds()
        {
            $sql = "SELECT `utility_reading_id` FROM `invoice_utilities` 
            WHERE `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = '{$this->leaseagrm_id}')"; 
            $data = ConnectSqlite::Query($sql); 
            return array_map(function($utility_reading){return $utility_reading["utility_reading_id"]; }, $data); 
        }
    }

?>
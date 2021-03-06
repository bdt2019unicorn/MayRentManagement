<?php 
    Trait UtilitiesSupport
    {
        private function AllUtilitiesReadingByUnitIdSql($unit_id, $revenue_type=null)
        {
            $sql = "SELECT * FROM `utility_reading` WHERE `unit_id` = {$unit_id}"; 
            if($revenue_type)
            {
                $sql.= "\nAND `revenue_type_id` = '{$revenue_type['id']}'\n"; 
            }
            $sql.="\nORDER BY `date` DESC;";
            return $sql; 
        }

        private function ExistingUtilityReadingIdsSql()
        {
            return 
            "
                SELECT `utility_reading_id`, `revenue_type_id` FROM `invoice_utilities` 
                WHERE `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = '{$this->leaseagrm_id}');
            "; 
        }

        private function PossiblePricesSql()
        {
            return 
            "
                SELECT * FROM `utility_price` 
                WHERE `date_valid` <= (SELECT MAX(`date`) FROM `utility_reading` WHERE `unit_id` = @unit_id) 
                ORDER BY `revenue_type_id`, `date_valid` DESC;
            "; 
        }

        private function UtilitiesListSql()
        {
            return Query::SelectData("revenue_type", ["*"], ["is_utility"=>1]); 
        }

        private function ExistingUtilityReadingIds($data=null)
        {
            $data = $data?? ConnectSqlite::Query($this->ExistingUtilityReadingIdsSql()); 
            return array_map(function($utility_reading){return $utility_reading["utility_reading_id"]; }, $data); 
        }

        private function ProcessUtilityReadingByUnitData($data, $revenue_type)
        {
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
                    if($this->test_mode)
                    {
                        $sql = "SELECT * FROM `utility_price` WHERE `revenue_type_id` = '{$revenue_type['id']}' AND `date_valid` <='{$previous_date}' ORDER BY `date_valid` DESC LIMIT 1;"; 
                        $data = ConnectSqlite::Query($sql); 
                        return count($data)? $data[0]["value"] : 0; 
                    }
                    else 
                    {
                        $previous_date = new DateTime($previous_date); 
                        $previous_prices = $revenue_type; 
                        $index = 0; 
                        while($index<count($previous_prices))
                        {
                            $date_valid = new DateTime($previous_prices[$index]["date_valid"]);  
                            if($date_valid<=$previous_date)
                            {
                                return $previous_prices[$index]["value"]; 
                            }
                            $index++; 
                        }
                        return 0; 
                    }
                }; 
                $price = $UtilityPrice($previous_date); 
                $data[$i]["previous_date"] = $previous_date; 
                $data[$i]["previous_number"] = $previous_number; 
                $data[$i]["price"] = $price; 
                $quantity = floatval($data[$i]["number"]) - floatval($previous_number); 
                $data[$i]["quantity"] = $quantity; 
                $data[$i]["amount"] = $quantity * floatval($price); 
            }
            return $data; 
        }

        private function UtilitiesDataFilter($data, $existing_utility_reading_ids)
        {
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
        }

        private function MergeAllUtilityValues($utilities)
        {
            return array_reduce($utilities, function($current, $utility){return array_merge($current, $utility); }, []); 
        }
    }

    Trait Utilities 
    {
        use UtilitiesSupport; 
        private function Utilities($unit_id)
        {
            $utilities = Database::GetData($this->UtilitiesListSql()); 
            $utilities = array_map
            (
                function($revenue_type) use ($unit_id)
                {   
                    $sql = $this->AllUtilitiesReadingByUnitIdSql("'{$unit_id}'", $revenue_type); 
                    $data = ConnectSqlite::Query($sql); 
                    $data = $this->ProcessUtilityReadingByUnitData($data, $revenue_type); 
                    $existing_utility_reading_ids = $this->ExistingUtilityReadingIds(); 
                    return $this->UtilitiesDataFilter($data, $existing_utility_reading_ids); 
                }, $utilities
            ); 
            return $this->MergeAllUtilityValues($utilities); 
        }

        private function UtilitiesProduction($all_utility_reading, $existing_utility_reading, $possible_prices, $utility_list)
        {
            $utility_list = array_map
            (
                function($revenue_type) use ($all_utility_reading, $existing_utility_reading, $possible_prices) 
                { 
                    $Filterfunction = function($utility_reading) use ($revenue_type) { return $utility_reading["revenue_type_id"] == $revenue_type["id"]; }; 
                    $data = array_values(array_filter($all_utility_reading, $Filterfunction)); 
                    $existing_utility_reading_data = array_filter($existing_utility_reading, $Filterfunction); 
                    $prices = array_values(array_filter($possible_prices, $Filterfunction)); 
                    $data = $this->ProcessUtilityReadingByUnitData($data, $prices); 
                    $existing_utility_reading_data = $this->ExistingUtilityReadingIds($existing_utility_reading_data); 
                    return $this->UtilitiesDataFilter($data, $existing_utility_reading_data); 
                }, $utility_list
            ); 
            return $this->MergeAllUtilityValues($utility_list); 
        }
    }
?>
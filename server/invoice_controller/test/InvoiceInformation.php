<?php 
    require_once("LeaseAgrm.php"); 
    require_once("Utilities.php"); 

    class InvoiceInformation
    {
        use LeaseAgrm, Utilities; 
        public function GetInformation()
        {
            $test_mode = CurrentEnvironment::TestMode(); 
            return $test_mode? $this->TestEnvironment(): $this->ProductionEnvironment(); 
        }

        public function ProductionEnvironment()
        {
            $sql = 
            "
                {$this->LeaseAgrmSql(['@unit_id:= `unit_id` AS `unit_id`', '`Start_date` AS `start_lease`', '(SELECT `unit`.`name` FROM `unit` WHERE `unit`.`id` = `leaseagrm`.`unit_id`) AS `unit_name`'])}
                {$this->StartDateSql()}
                {$this->RentInformationSql()}
                {$this->AllUtilitiesReadingByUnitIdSql('@unit_id')}
                {$this->ExistingUtilityReadingIdsSql()}
                {$this->PossiblePricesSql()}
                {$this->UtilitiesListSql()}
            "; 
            $data = Connect::MultiQuery($sql, true); 

            $leaseagrm = $data[0][0]; 
            $this->start_lease = $leaseagrm["start_lease"]; 
            $start_date_data = $data[1]; 
            $rent_information = $data[2]; 

            $all_utility_reading = $data[3]; 
            $existing_utility_reading = $data[4]; 
            $possible_prices = $data[5]; 
            $utility_list = $data[6]; 


            $invoice_information = 
            [
                "leaseagrm" => $this->LeaseAgrm($leaseagrm, $start_date_data, $rent_information), 
                "utilities" => $this->UtilitiesProduction($all_utility_reading, $existing_utility_reading, $possible_prices, $utility_list), 
                "unit_name" => $leaseagrm["unit_name"]
            ]; 

            return $invoice_information; 
        }

        private function TestEnvironment()
        {
            $this->start_lease = $this->StartLease(); 
            $unit_id = $this->UnitId(); 
            return 
            [
                "leaseagrm"=>$this->LeaseAgrm(), 
                "utilities"=>$this->Utilities($unit_id), 
                "unit_name"=>$this->UnitName($unit_id)
            ]; 
        }
                            
        private function StartLease() 
        {
            $sql = Query::SelectData("leaseagrm", ["`Start_date` AS `start_lease`"], ["id"=>$this->leaseagrm_id]); 
            $data = ConnectSqlite::Query($sql); 
            return $data[0]["start_lease"]; 
        } 

        private function UnitId() 
        {
            $sql = Query::SelectData("leaseagrm", ["`unit_id`"], ["id"=>$this->leaseagrm_id]); 
            $data = ConnectSqlite::Query($sql); 
            return $data[0]["unit_id"]; 
        } 

        private function UnitName($unit_id)
        {
            $sql = Query::SelectData("unit", ["name"], ["id"=>$unit_id]); 
            $data = ConnectSqlite::Query($sql); 
            return $data[0]["name"]; 
        } 
    }
?>
<?php 
    require_once("LeaseAgrm.php"); 
    require_once("Utilities.php"); 

    class InvoiceInformation
    {
        use LeaseAgrm, Utilities; 
        private $tenant_name; 
        public function GetInformation()
        {
            return $this->test_mode? $this->TestEnvironment(): $this->ProductionEnvironment(); 
        }

        public function ProductionEnvironment()
        {
            $leaseagrm_sql = $this->LeaseAgrmSql
            (
                [
                    '@unit_id:= `unit_id` AS `unit_id`', 
                    '`Start_date` AS `start_lease`', 
                    '(SELECT `unit`.`name` FROM `unit` WHERE `unit`.`id` = `leaseagrm`.`unit_id`) AS `unit_name`', 
                    "(SELECT {$this->tenant_name} FROM `tenant` WHERE `tenant`.`id` = `leaseagrm`.`Tenant_ID`) AS `tenant_name`"
                ]
            ); 
            $sql = 
            "
                {$leaseagrm_sql}
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

            return 
            [
                "leaseagrm" => $this->LeaseAgrm($leaseagrm, $start_date_data, $rent_information), 
                "utilities" => $this->UtilitiesProduction($all_utility_reading, $existing_utility_reading, $possible_prices, $utility_list), 
                "unit_name" => $leaseagrm["unit_name"], 
                "tenant_name" =>$leaseagrm["tenant_name"]
            ]; 
        }

        private function TestEnvironment()
        {
            $this->start_lease = $this->StartLease(); 
            $unit_id = $this->UnitId(); 
            return 
            [
                "leaseagrm"=>$this->LeaseAgrm(), 
                "utilities"=>$this->Utilities($unit_id), 
                "unit_name"=>$this->UnitName($unit_id), 
                "tenant_name"=>$this->TenantName()
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

        private function TenantName()
        {
            $sql = 
            "
                SELECT ({$this->tenant_name}) AS 'name'
                FROM `leaseagrm` LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id` 
                WHERE `leaseagrm`.`id` = {$this->leaseagrm_id}
            "; 
            $data = ConnectSqlite::Query($sql); 
            return $data[0]["name"]; 
        }
    }
?>
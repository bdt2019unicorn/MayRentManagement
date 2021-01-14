<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 

    class Overviews 
    {
        public $rent_id, $building_id, $test_mode;
        function __construct($rent_id, $building_id, $test_mode)
        {
            $this->rent_id = $rent_id; 
            $this->building_id = $building_id; 
            $this->test_mode = $test_mode; 
        } 

        public function Test()
        {

        }

        private function Select()
        {
            $RentalStatus = function()
            {
                $condition = "`leaseagrm_overview`.`Rental Status` IS NULL"; 
                $true = "'Vacant'"; 
                $false = Query::Concat
                (
                    [
                        "'<router-link to=\"leaseagrm/edit?id='", 
                        Query::CastAsChar("`leaseagrm_overview`.`leaseid`", $this->test_mode),"'\" append>'", 
                        Query::CastAsChar("`leaseagrm_overview`.`Rental Status`", $this->test_mode),
                        "'</router-link>'"
                    ], $this->test_mode
                ); 
                return "\n(" . Query::CaseWhen($condition, $true, $false) . "\n) AS `Rental Status`"; 
            }; 

            return 
            "
                SELECT 
                    `unit`.`id` AS `ID`, 
                    `unit`.`name` AS `Unit Name`, 
                    {$RentalStatus()}, 
                    IFNULL(`leaseagrm_overview`.`Rental Status Value`, 0) AS `Rental Status Value`, 
                    `leaseagrm_overview`.`Payment Status`, 
                    IFNULL(`leaseagrm_overview`.`Payment Status Value`, 0) AS `Payment Status Value`, 
                    `leaseagrm_overview`.`Tenant Name`, 
                    `leaseagrm_overview`.`leaseid`, 
                    `leaseagrm_overview`.`tenantid`	
            "; 
        }

        private function LeaseagrmOverview()
        {
            $Status = function($true_word, $false_word, $as)
            {

            }; 

            $Value = function($true_word, $false_word, $as)
            {

            }; 
        }

    }
?>
<?php 
	require_once("../../helper/database.php"); 
	require_once("../../helper/overview_queries.php"); 
	
    class Overviews 
    {
        public $rent_id, $building_id, $test_mode;
        function __construct($rent_id, $building_id, $test_mode)
        {
            $this->rent_id = $rent_id; 
            $this->building_id = $building_id; 
            $this->test_mode = $test_mode; 
        } 

        public function RawTable()
        {
            $selects = $this->Select(); 
            $leaseagrm_overview = $this->LeaseagrmOverview(); 
            $sql = 
            "
                {$selects}
                FROM 
                    `unit` LEFT JOIN 
                    (
                        {$leaseagrm_overview}
                    ) AS `leaseagrm_overview` ON `unit`.`id` = `leaseagrm_overview`.`unit_id`
                WHERE `unit`.`building_id` = '{$this->building_id}' ORDER BY `unit`.`id`; 
            "; 
            return Database::GetData($sql); 
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
                    `leaseagrm_overview`.`Rental Status` AS `Rental Status VN`, 
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
            $RentalStatus = function($true_word, $false_word, $date_format, $as)
            {
                $condition_date = Query::DateFormat("`Finish`", $date_format, $this->test_mode); 
                $true = Query::Concat(["'{$true_word}'", $condition_date], $this->test_mode); 
                $false = Query::Concat(["'{$false_word}'", $condition_date], $this->test_mode); 
                return "\n(" . Query::CaseWhen("`Start_date`<CURRENT_DATE", $true, $false) . "\n) AS `{$as}`"; 
            }; 

            $PaymentStatus = function($true_word, $date_format, $deposit_null_word, $deposit_paid_word, $as)
            {
                $end_date = $this->test_mode? "STRFTIME('{$date_format['test']}', MAX(`invoice_leaseagrm`.`end_date`))" : "DATE_FORMAT(MAX(`invoice_leaseagrm`.`end_date`), '{$date_format['production']}')"; 
                $expression = Query::Concat
                (
                    [
                        "'{$true_word}'", 
                        "
                            (
                                SELECT {$end_date} FROM `invoice_leaseagrm` 
                                WHERE 
                                    `invoice_leaseagrm`.`invoice_id` IN 
                                    (
                                        SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                                    ) AND 
                                    `invoice_leaseagrm`.`revenue_type_id` = '{$this->rent_id}'
                            ) 
                        "
                    ], $this->test_mode
                ); 
                $false = Query::CaseWhen("`Deposit_payment_date` IS NULL", $deposit_null_word, $deposit_paid_word); 
                return "\n(" . Query::IfNull($expression, $false) . "\n) AS `{$as}`"; 
            }; 

            $date_format_status = ["test"=> "%d/%m/%Y", "production"=>"%M %d, %Y"]; 
            $date_format_value = ["test"=> "%Y%m%d", "production"=> "%Y%m%d"]; 


            $tenant_name = Query::Concat(["IFNULL(`tenant`.`First_Name`,'')","' '","IFNULL(`tenant`.`Middle_Name`,'')","' '","IFNULL(`tenant`.`Last_Name`,'')"], $this->test_mode); 

            return 
            "
                SELECT 
                    `id` AS `leaseid`, 
                    `Tenant_ID` AS `tenantid`, 
                    `unit_id`, 
                    `Start_date`, 
                    `Finish`, 
                    `Deposit_payment_date`, 
                    {$RentalStatus('Until ', 'Move in on ', $date_format_status, 'Rental Status')}, 
                    {$RentalStatus('2', '1', $date_format_value, 'Rental Status Value')}, 
                    {$PaymentStatus('Until ', $date_format_status, "NULL", "'Deposit paid'", 'Payment Status')}, 
                    {$PaymentStatus('2', $date_format_value, '0', '1', 'Payment Status Value')}, 
                    (SELECT ({$tenant_name}) FROM `tenant` WHERE `tenant`.`id`=`Tenant_ID`) AS `Tenant Name`
                FROM `leaseagrm` WHERE `Finish`>=CURRENT_DATE
            "; 
        }
    }

	$rent_id = OverviewQueries\Invoices::RentId(); 
	$test_mode = CurrentEnvironment::TestMode(); 
	$building_id = $_GET['building_id']; 

	$overviews = new Overviews($rent_id, $building_id, $test_mode); 
    $raw_table = $overviews->RawTable(); 
	echo json_encode($raw_table); 
?>
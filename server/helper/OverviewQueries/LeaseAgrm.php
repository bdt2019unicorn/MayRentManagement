<?php 
    namespace OverviewQueries; 
    use Query; 
    class LeaseAgrm
    {
        public static function OverviewDashboard($test_mode = false)
        {
            return LeaseAgrm::GeneralQuery($test_mode). 
            "
                WHERE 
                    `leaseagrm`.`unit_id` IS NULL OR 
                    `leaseagrm`.`Tenant_ID` IS NULL
                ; 
            "; 
        }

        public static function OverviewBuildingId($building_id, $test_mode=false)
        {
            return LeaseAgrm::GeneralQuery($test_mode). "\n WHERE `unit`.`building_id` = '{$building_id}'; "; 
        }

        public static function TotalPaidAmountQuery()
        {
            return "(\n " . LeaseAgrm::$DepositQuery . "\n + " . LeaseAgrm::$TotalPaidRevenueQuery . "\n)"; 
        }

        public static $TotalInvoiceAmountQuery = 
        "
            (
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                        WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0
                ) + 
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                        WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0 
                )
            )
        "; 

        private static $DepositQuery = 
        "
            (
                CASE 
                    WHEN `Deposit_payment_date` IS NULL THEN 0 
                    WHEN `Deposit_payment_date` < CURRENT_DATE THEN IFNULL(`Deposit_amount`, 0)
                    ELSE 0 
                END	
            )
        "; 

        private static $TotalPaidRevenueQuery = 
        "
            (
                IFNULL
                (
                    (
                        SELECT SUM(`Amount`) 
                        FROM `revenue`
                        WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                    ), 0 
                )
            )
        "; 

        private static function CompareTotals($main_total_query, $compared_total_query, $as, $test_mode=false)
        {
            $format = $test_mode? "ROUND" : "FORMAT";  

            $condition = 
            "
                (
                    {$main_total_query} - {$compared_total_query}
                ) > 0
            "; 

            $true = Query::Concat
            (
                [
                    "'('", 
                    Query::CastAsChar("(\n{$format}({$main_total_query} - {$compared_total_query}, 0)\n)", $test_mode), 
                    "')'"
                ], $test_mode
            ); 

            $false = 
            "
                (
                    {$format}({$compared_total_query} - {$main_total_query}, 0)
                )
            "; 

            return "(\n" . Query::CaseWhen($condition, $true, $false) . "\n) AS `{$as}`"; 
        }

        private static function GeneralQuery($test_mode=false)
        {
            $deposit = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::TotalPaidAmountQuery(), "Deposit", $test_mode); 
            $outstanding_balance = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::$TotalPaidRevenueQuery, "Outstanding Balance", $test_mode); 

            $tenant_name = "(\n" . Query::CaseWhen
            (
                "`leaseagrm`.`Tenant_ID` IS NULL", 
                "NULL", 
                Query::Concat(["IFNULL(`tenant`.`Last_Name`,'')", "', '" ,"IFNULL(`tenant`.`First_Name`, '')"], $test_mode)
            ) ."\n)"; 

            $start_date = Query::DateFormatStandard("`Start_date`", $test_mode); 
            $end_date = Query::DateFormatStandard("`Finish`", $test_mode); 

            return 
            "
                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    {$tenant_name} AS `Tenant Name`, 
                    {$start_date} AS `Start Date`, 
                    {$end_date} AS `End Date`, 
                    {$outstanding_balance},
                    {$deposit} 
                FROM `leaseagrm`
                    LEFT JOIN `unit` ON `leaseagrm`.`unit_id` = `unit`.`id`
                    LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            "; 
        }
    }
?>
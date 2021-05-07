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

        private static $LeaseagrmAggregateQuery = 
        "
            SELECT 
                `leaseagrm_invoice`.`leaseagrm_id` AS `id`, 
                `leaseagrm_invoice`.`paid_amount`, 
                `leaseagrm_invoice`.`Deposit_amount`, 
                SUM(`leaseagrm_invoice`.`leaseagrm_amount` + `leaseagrm_invoice`.`utility_amount`) AS `invoice_amount` 
            FROM 
                (
                    SELECT 
                        `invoices`.`leaseagrm_id`, 
                        `invoices`.`id` AS `invoice_id`, 
                        `iu`.`utility_amount`, 
                        `il`.`leaseagrm_amount`, 
                        `lr`.`paid_amount`, 
                        (
                            CASE 
                                WHEN `leaseagrm`.`Deposit_payment_date` IS NULL THEN 0 
                                WHEN `leaseagrm`.`Deposit_payment_date` < CURRENT_DATE THEN IFNULL(`leaseagrm`.`Deposit_amount`, 0)
                                ELSE 0 
                            END 
                        ) AS `Deposit_amount`
                    FROM 
                        `invoices` LEFT JOIN `leaseagrm` ON `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                        LEFT JOIN 
                        (
                            SELECT 
                                `invoice_utilities`.`invoice_id`, 
                                SUM(IFNULL(`invoice_utilities`.`amount`, 0)) AS `utility_amount`
                            FROM `invoice_utilities`
                            GROUP BY `invoice_utilities`.`invoice_id`
                        )`iu` ON `iu`.`invoice_id` = `invoices`.`id`
                        LEFT JOIN 
                        (
                            SELECT 
                                `invoice_leaseagrm`.`invoice_id`, 
                                SUM(IFNULL(`invoice_leaseagrm`.`amount`, 0)) AS `leaseagrm_amount`
                            FROM `invoice_leaseagrm`
                            GROUP BY `invoice_leaseagrm`.`invoice_id`
                        ) `il` ON `il`.`invoice_id` = `invoices`.`id`
                        LEFT JOIN 
                        (
                            SELECT 
                                `revenue`.`leaseagrm_id`, 
                                SUM(`revenue`.`Amount`) AS `paid_amount` 
                            FROM `revenue`
                            GROUP BY `revenue`.`leaseagrm_id`
                        ) `lr` ON `lr`.`leaseagrm_id` = `leaseagrm`.`id`
                ) `leaseagrm_invoice`
            GROUP BY `leaseagrm_invoice`.`leaseagrm_id`, `leaseagrm_invoice`.`paid_amount`, `leaseagrm_invoice`.`Deposit_amount` 
        "; 

        private static function CompareTotals($main_total_query, $compared_total_query, $as, $test_mode=false)
        {
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
                    Query::CastAsChar
                    (
                        Query::NumberFormat("{$main_total_query} - {$compared_total_query}", $test_mode), 
                        $test_mode
                    ), 
                    "')'"
                ], $test_mode
            ); 

            $false = Query::NumberFormat("{$compared_total_query} - {$main_total_query}", $test_mode); 

            return "(\n" . Query::CaseWhen($condition, $true, $false) . "\n) AS `{$as}`"; 
        }

        private static function GeneralQuery($test_mode=false)
        {
            $invoice_amount = "IFNULL(`leaseagrm_aggregate`.`invoice_amount`, 0)"; 
            $outstanding_balance = LeaseAgrm::CompareTotals($invoice_amount, "IFNULL(`leaseagrm_aggregate`.`paid_amount`, 0)", "Outstanding Balance", $test_mode); 
            $deposit = LeaseAgrm::CompareTotals($invoice_amount, "(IFNULL(`leaseagrm_aggregate`.`paid_amount`, 0) + IFNULL(`leaseagrm_aggregate`.`Deposit_amount`, 0))", "Deposit", $test_mode); 

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
                    LEFT JOIN 
                    (
                        " . LeaseAgrm::$LeaseagrmAggregateQuery . "
                    ) `leaseagrm_aggregate` ON `leaseagrm`.`id` = `leaseagrm_aggregate`.`id` 

            "; 
        }
    }
?>
<?php 
    namespace OverviewQueries; 
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

        public static function OverviewBuildingId($building_id)
        {
            return LeaseAgrm::GeneralQuery(). "\n WHERE `unit`.`building_id` = '{$building_id}'; "; 
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
            IF
            (
                `Deposit_payment_date` IS NULL, 
                0, 
                IF
                (
                    `Deposit_payment_date` < CURRENT_DATE, 
                    IFNULL(`Deposit_amount`, 0), 
                    0
                )
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

        private static function CompareTotals($main_total_query, $compared_total_query, $as)
        {
            return 
            "
                (
                    IF
                    (
                        (
                            {$main_total_query} - {$compared_total_query} > 0 
                        ), 
                        CONCAT
                        (
                            '(', 
                            CAST
                            (
                                (
                                    FORMAT({$main_total_query} - {$compared_total_query}, 0)
                                ) AS CHAR 
                            ),
                            ')' 
                        ), 
                        (
                            FORMAT({$compared_total_query} - {$main_total_query}, 0)
                        )
                    )
                ) AS `{$as}` 
            "; 
        }

        private static function GeneralQuery($test_mode=false)
        {
            $deposit = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::TotalPaidAmountQuery(), "Deposit"); 
            $outstanding_balance = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::$TotalPaidRevenueQuery, "Outstanding Balance"); 

            

            return 
            "
                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    CONCAT(IFNULL(`tenant`.`Last_Name`,''),', ',IFNULL(`tenant`.`First_Name`, '')) AS `Tenant Name`, 
                    DATE_FORMAT(`Start_date`,'%d/%m/%Y') AS `Start Date`, 
                    DATE_FORMAT(`Finish`,'%d/%m/%Y') AS `End Date`, 
                    {$outstanding_balance},
                    {$deposit} 
                FROM `leaseagrm`
                    LEFT JOIN `unit` ON `leaseagrm`.`unit_id` = `unit`.`id`
                    LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            "; 
        }
    }
?>
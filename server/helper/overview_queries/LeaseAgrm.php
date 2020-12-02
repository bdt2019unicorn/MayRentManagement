<?php 
    namespace OverviewQueries; 
    class LeaseAgrm
    {
        public static function OverviewDashboard()
        {
            return LeaseAgrm::GeneralQuery(). 
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
                ISNULL(`Deposit_payment_date`), 
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
                            CONVERT
                            (
                                (
                                    FORMAT({$main_total_query} - {$compared_total_query}, 0)
                                ), 
                                CHAR 
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

        private static function GeneralQuery()
        {
            $out_standing_balance = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::TotalPaidAmountQuery(), "Outstanding Balance"); 
            $paid_invoice_balance = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::$TotalPaidRevenueQuery, "Invoice/Paid Balance"); 

            return 
            "
                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, 
                    DATE_FORMAT(`Start_date`,'%d/%m/%Y') AS `Start Date`, 
                    DATE_FORMAT(`Finish`,'%d/%m/%Y') AS `End Date`, 
                    {$out_standing_balance}, 
                    {$paid_invoice_balance}
                FROM `leaseagrm`
                    LEFT JOIN `unit` ON `leaseagrm`.`unit_id` = `unit`.`id`
                    LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            "; 
        }
    }
?>
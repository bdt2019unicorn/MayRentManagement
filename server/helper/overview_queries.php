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

        private static function GeneralQuery()
        {
            $sum_query_invoice = 
            "
                (
                    IFNULL
                    (
                        (
                            SELECT SUM(`invoice_leaseagrm`.`amount`) 
                            FROM `invoice_leaseagrm` 
                            WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                        ), 0
                    ) + 
                    IFNULL
                    (
                        (
                            SELECT SUM(`invoice_utilities`.`amount`) 
                            FROM `invoice_utilities` 
                            WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                        ), 0 
                    )
                )
            "; 

            $sum_query_revenue = 
            "
                (
                    IFNULL
                    (
                        (
                            SELECT SUM(Amount) 
                            FROM `revenue`
                            WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                        ), 0 
                    )
                )
            "; 
            return 
            "
                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, 
                    DATE_FORMAT(`Start_date`,'%d/%m/%Y') AS `Start Date`, 
                    DATE_FORMAT(`Finish`,'%d/%m/%Y') AS `End Date`, 
                    (
                        IF
                        (
                            (
                                {$sum_query_invoice} - 
                                {$sum_query_revenue} > 0 
                            ), 
                            CONCAT
                            (
                                '(', 
                                CONVERT
                                (
                                    (
                                        {$sum_query_invoice} - 
                                        {$sum_query_revenue}
                                    ), 
                                    CHAR 
                                ),
                                ')' 
                            ), 
                            (
                                {$sum_query_revenue} - 
                                {$sum_query_invoice}
                            )
                        )
                    ) AS `Outstanding Balance` 
                FROM `leaseagrm`
                    LEFT JOIN `unit` ON `leaseagrm`.`unit_id` = `unit`.`id`
                    LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            "; 
        }

    }

?>
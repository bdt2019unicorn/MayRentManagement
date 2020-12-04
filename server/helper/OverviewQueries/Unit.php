<?php 
    namespace OverviewQueries; 
    require_once("OverviewTrait.php"); 
    class Unit 
    {
        use OverviewTrait; 
        public static function Selects($edit, $building_id, $id)
        {
            if($edit)
            {
                return ["*"]; 
            }
            else 
            {
                $LeaseagrmSelect = function($clause)
                {
                    return 
                    "
                        (
                            SELECT {$clause} FROM `leaseagrm` 
                            WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                            ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                        )
                    "; 
                }; 

                $tenant_from_lease = $LeaseagrmSelect("`Tenant_ID`"); 

                $RentalStatusSelect = function() use ($LeaseagrmSelect, $tenant_from_lease)
                {
                    $leaseagrm_id = $LeaseagrmSelect("CAST(`leaseagrm`.`id` AS CHAR)"); 
                    $start_date_check = $LeaseagrmSelect("`Start_date` < CURRENT_DATE"); 
                    $start_date_lease = $LeaseagrmSelect("`Start_date`"); 
                    $end_date_lease = $LeaseagrmSelect("`Finish`"); 
                    return 
                    "
                        IF
                        (
                            ISNULL
                            (
                                {$tenant_from_lease}
                            ), 
                            'Vacant', 
                            CONCAT
                            (
                                '<router-link :to=\"{name: \'actions\', params: {controller: \'leaseagrm\', action: \'edit\', building_id: ', CAST(`building_id` AS CHAR) ,'}, query: {id: ', 
                                {$leaseagrm_id}, '}, }\">',
                                (
                                    IF
                                    (
                                        {$start_date_check}, 
                                        CONCAT
                                        (
                                            'Until ', 
                                            DATE_FORMAT
                                            (
                                                {$end_date_lease}, '%d %M %Y'
                                            )
                                        ), 
                                        CONCAT
                                        (
                                            'Move in', 
                                            DATE_FORMAT
                                            (
                                                {$start_date_lease}, '%d %M %Y'
                                            )  
                                        )
                                        
                                    ) 
                                ), 
                                '</router-link>'
                            )
                
                        ) AS `Rental Status` 
                    "; 
                }; 
                $PaidUntilSelect = function() use ($tenant_from_lease)
                {
                    $WhereLeaseagrm = function($table) use ($tenant_from_lease)
                    {
                        return 
                        "
                            WHERE 
                            `{$table}`.`unit_id` = `unit`.`id` AND 
                            `{$table}`.`Tenant_ID` = {$tenant_from_lease}
                        "; 
                    }; 
                    return 
                    "
                        IFNULL
                        (
                            (
                                SELECT MAX(`invoice_leaseagrm`.`end_date`) FROM `invoice_leaseagrm`
                                WHERE 
                                    `invoice_leaseagrm`.`invoice_id` IN
                                    (
                                        SELECT `invoices`.`id`
                                        FROM `invoices` LEFT JOIN `leaseagrm` ON `invoices`.`leaseagrm_id` = `leaseagrm`.`id` 
                                        {$WhereLeaseagrm('leaseagrm')}
                                    ) AND 
                                    `invoice_leaseagrm`.`revenue_type_id` = '1' 
                            ), 
                            IF
                            (
                                ISNULL
                                (
                                    (
                                        SELECT `la`.`Deposit_payment_date` FROM `leaseagrm` AS `la`
                                        {$WhereLeaseagrm('la')}
                                    )
                                ),'', 'Deposit Paid' 
                            )
                        ) AS `Paid Until` 
                    "; 
                }; 
                return 
                [
                    "id AS `ID`", 
                    "name AS `Name`", 
                    $RentalStatusSelect(), 
                    $PaidUntilSelect(), 
                    "{$tenant_from_lease} AS `tenantid`", 
                    "
                        (
                            SELECT CONCAT(`tenant`.`Last_Name`, ' ', `tenant`.`First_Name`)
                            FROM `leaseagrm` LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
                            WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                            ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                        ) AS `Tenant Name`
                    ", 
                    "area AS `Area`"
                ]; 
            }
        }
    }
?>
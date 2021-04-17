<?php 
    namespace OverviewQueries;
    require_once("OverviewTrait.php"); 
    use Query; 
    class Unit 
    {
        use OverviewTrait; 
        public static function Selects($edit, $building_id, $id, $test_mode = false)
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

                $RentalStatusSelect = function($en = true) use ($LeaseagrmSelect, $tenant_from_lease, $test_mode)
                {
                    $leaseagrm_id = $LeaseagrmSelect(Query::CastAsChar("`leaseagrm`.`id`", $test_mode)); 
                    $start_date_check = $LeaseagrmSelect("`Start_date` < CURRENT_DATE"); 
                    $start_date_lease = $LeaseagrmSelect("`Start_date`"); 
                    $end_date_lease = $LeaseagrmSelect("`Finish`"); 



                    $RouterLink = function() use ($leaseagrm_id, $test_mode)
                    {
                        $router_link_open = "'<router-link :to=\"{name: \'actions\', params: {controller: \'leaseagrm\', action: \'edit\', building_id: '"; 
                        if($test_mode)
                        {
                            $router_link_open = str_replace("\'", "''", $router_link_open); 
                        }

                        $building_id = Query::CastAsChar("`building_id`", $test_mode); 

                        return Query::Concat([$router_link_open, $building_id, "'}, query: {id: '", $leaseagrm_id, "'} }\">'"], $test_mode); 
                    }; 

                    $UnitOccupied = function() use ($start_date_check, $end_date_lease, $start_date_lease, $test_mode)
                    {
                        $true = Query::Concat(["'Until '", Query::DateFormatDisplay($end_date_lease, $test_mode)], $test_mode); 
                        $false = Query::Concat(["'Move in '", Query::DateFormatDisplay($start_date_lease, $test_mode)], $test_mode); 
                        return "\n(" . Query::CaseWhen($start_date_check, $true, $false) ."\n)\n"; 
                    }; 

                    $condition = "{$tenant_from_lease} IS NULL"; 
                    $true = "'Vacant'"; 
                    $false = $en? Query::Concat([$RouterLink(), $UnitOccupied(), "\n'</router-link>'\n" ], $test_mode): $UnitOccupied(); 
                    return "\n(" . Query::CaseWhen($condition, $true, $false) . "\n) AS `Rental Status" .($en?"":" VN")."`"; 
                }; 
                $PaymentStatusSelect = function() use ($tenant_from_lease, $test_mode)
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

                    $rent_id = Invoices::RentId(); 
                    $end_date = Query::DateFormatDisplay("MAX(`invoice_leaseagrm`.`end_date`)", $test_mode); 
                    $end_date = Query::Concat(["'Until '", $end_date], $test_mode); 
                    $expression = 
                    "
                        SELECT {$end_date} FROM `invoice_leaseagrm`
                        WHERE 
                            `invoice_leaseagrm`.`invoice_id` IN
                            (
                                SELECT `invoices`.`id`
                                FROM `invoices` LEFT JOIN `leaseagrm` ON `invoices`.`leaseagrm_id` = `leaseagrm`.`id` 
                                {$WhereLeaseagrm('leaseagrm')}
                            ) AND 
                            `invoice_leaseagrm`.`revenue_type_id` = '{$rent_id}' 
                    "; 

                    $false = Query::CaseWhen
                    (
                        "
                            (
                                SELECT `la`.`Deposit_payment_date` FROM `leaseagrm` AS `la`
                                {$WhereLeaseagrm('la')}
                            ) IS NULL
                        ", "''", "'Deposit Paid'"
                    ); 
                    return Query::IfNull($expression, $false) . " AS `Payment Status` "; 
                }; 
                $tenant_full_name = Query::Concat(["`tenant`.`Last_Name`", "' '", "`tenant`.`First_Name`"], $test_mode); 
                return 
                [
                    "`id` AS `ID`", 
                    "`name` AS `Name`", 
                    $RentalStatusSelect(), 
                    $RentalStatusSelect(false), 
                    $PaymentStatusSelect(), 
                    "{$tenant_from_lease} AS `tenantid`", 
                    "
                        (
                            SELECT {$tenant_full_name}
                            FROM `leaseagrm` LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
                            WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                            ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                        ) AS `Tenant Name`
                    ", 
                    "`area` AS `Area`"
                ]; 
            }
        }
    }
?>
<?php 
    require_once("./helper.php"); 
    $leaseagrm_id = 124; 
            $rent_id = OverviewQueries\Invoices::RentId(); 
            $total_paid_amount = OverviewQueries\LeaseAgrm::TotalPaidAmountQuery(); 
            $total_invoice_amount = OverviewQueries\LeaseAgrm::$TotalInvoiceAmountQuery; 
            $sql = 
            "
                SET @leaseagrm_id = '{$leaseagrm_id}'; 
                SET @rent_id = '{$rent_id}'; 
    
                SELECT 
                    @unit_id:= `unit_id`, 
                    @start_lease:= `Start_date`, 
                    @rent_amount:=`Rent_amount`, 
                    @total_amount:={$total_invoice_amount}, 
                    @paid_amount:={$total_paid_amount}, 
                    @leaseagrm_period_id:=`leaseagrm_period_id`
                FROM `leaseagrm` WHERE `id` = @leaseagrm_id; 
    
                SET @start_date = 
                (
                    SELECT MAX(`invoice_leaseagrm`.`end_date`) FROM `invoice_leaseagrm`, `invoices` 
                    WHERE  
                        `invoices`.`id` = `invoice_leaseagrm`.`invoice_id` AND 
                        `invoice_leaseagrm`.`revenue_type_id` = @rent_id AND  
                        `invoices`.`leaseagrm_id` = @leaseagrm_id
                ); 
    
                SET @start_date = IF(@start_date IS NULL, @start_lease, @start_date + INTERVAL 1 day); 
                SET @end_date = LAST_DAY(CURRENT_DATE()-INTERVAL 1 MONTH); 
                SET @end_date = GREATEST(@start_date, CURRENT_DATE, @end_date); 
    
                SELECT 
                    @start_date AS `start_date`, 
                    @end_date AS `end_date`, 
                    @rent_amount AS `rent_amount`, 
                    @paid_amount AS `paid_amount`, 
                    @total_amount AS `total_amount`, 
                    (IFNULL(@total_amount, 0) - IFNULL(@paid_amount, 0)) AS `difference`, 
                    IFNULL((SELECT `leaseagrm_period`.`name` FROM `leaseagrm_period` WHERE `leaseagrm_period`.`id` = @leaseagrm_period_id), 'months') AS `leaseagrm_period`; 
    
                CREATE TEMPORARY TABLE IF NOT EXISTS `all_utility_reading` AS
                (
                    SELECT 
                        *, 
                        (
                            SELECT MAX(`date`) FROM `utility_reading` AS `ur` 
                            WHERE 
                                `utility_reading`.`date`>`ur`.`date` AND 
                                `utility_reading`.`revenue_type_id` = `ur`.`revenue_type_id`AND 
                                `utility_reading`.`unit_id` = `ur`.`unit_id`
                        ) AS `previous_date`
                    FROM `utility_reading` WHERE `unit_id`=@unit_id ORDER BY `revenue_type_id`
                ); 
    
                CREATE TEMPORARY TABLE IF NOT EXISTS `all_utility_reading_temp` AS (SELECT * FROM `all_utility_reading`); 
                    
                CREATE TEMPORARY TABLE IF NOT EXISTS `all_utility_reading_with_numbers` AS 
                (
                    SELECT 
                        *, 
                        (
                            SELECT `number` FROM `all_utility_reading_temp` AS `aur` 
                            WHERE 
                                `all_utility_reading`.`previous_date` = `aur`.`date` AND 
                                `all_utility_reading`.`revenue_type_id` = `aur`.`revenue_type_id`
                        ) AS `previous_number`, 
                        IFNULL
                        (
                            (
                                SELECT `utility_price`.`value` FROM `utility_price`
                                WHERE 
                                    `utility_price`.`revenue_type_id` = `all_utility_reading`.`revenue_type_id` AND 
                                    `utility_price`.`date_valid` <= `all_utility_reading`.`previous_date` 
                                ORDER BY `utility_price`.`date_valid` DESC LIMIT 1 
                            ), 0 
                        ) AS `price`
                    FROM `all_utility_reading`
                ); 
                    
                SELECT *, (`number` - `previous_number`) AS `quantity`, ((`number` - `previous_number`) * `price`) AS `amount` 
                FROM `all_utility_reading_with_numbers`
                WHERE 
                    CONVERT(`previous_date`, date) >= @start_lease AND 
                    `id` NOT IN 
                    (
                        SELECT `utility_reading_id` FROM `invoice_utilities` 
                        WHERE `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = @leaseagrm_id)
                    );
    
                SELECT `name` FROM `unit` WHERE `id` = @unit_id; 
    
                CREATE TEMPORARY TABLE IF NOT EXISTS `invoice_leaseagrm_rent_search` AS 
                (               
                    SELECT * FROM `invoice_leaseagrm` 
                    WHERE 
                        `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = @leaseagrm_id) 
                        AND `revenue_type_id` = @rent_id 
                ); 
    
                CREATE TEMPORARY TABLE IF NOT EXISTS `invoice_leaseagrm_rent_search_temp` AS (SELECT * FROM `invoice_leaseagrm_rent_search`);
                
                CREATE TEMPORARY TABLE IF NOT EXISTS `rent_start_not_in_end` AS
                (
                    SELECT `start_date` FROM `invoice_leaseagrm_rent_search`
                    WHERE DATE(`start_date` - INTERVAL 1 DAY) NOT IN (SELECT DATE(`end_date`) FROM `invoice_leaseagrm_rent_search_temp`)
                ); 
                                
                CREATE TEMPORARY TABLE IF NOT EXISTS `rent_end_not_in_start` AS
                (
                    SELECT `end_date` FROM `invoice_leaseagrm_rent_search`
                    WHERE DATE(`end_date` + INTERVAL 1 DAY) NOT IN (SELECT DATE(`start_date`) FROM `invoice_leaseagrm_rent_search_temp`)
                ); 
    
                SET @minimum_start_date = (SELECT MIN(`start_date`) FROM `rent_start_not_in_end`); 
                
                SET @extra_end_date = IF
                (
                    ISNULL(@minimum_start_date), 
                    @start_lease, 
                    IF(@start_lease<@minimum_start_date, @start_lease, NULL) 
                ); 
                INSERT INTO `rent_end_not_in_start` VALUES (@extra_end_date); 
                SELECT 
                    IF(`end_date`>@start_lease, `end_date` + INTERVAL 1 DAY, @start_lease) AS `start_date`, 
                    (
                        SELECT (MIN(`start_date`) - INTERVAL 1 DAY) FROM `rent_start_not_in_end` 
                        WHERE (`start_date` - INTERVAL 1 DAY)>`rent_end_not_in_start`.`end_date`
                    ) AS `end_date`
                FROM `rent_end_not_in_start` WHERE `end_date` IS NOT NULL ORDER BY `end_date` DESC;
            "; 

?>
<?php
    require_once("./helper.php"); 

    $actions = array 
    (
        "InvoiceDetails"=>function()
        {
            $tables = ["leaseagrm", "utilities"]; 
            $sql = InvoiceInformationSql($_GET["invoice_id"]); 
            $data = Connect::MultiQuery($sql, true); 

            $result = []; 
            foreach ($tables as $key => $table) 
            {
                $result[$table] = $data[$key]; 
            }
            echo json_encode($result); 
        }, 
        "InvoiceInformation"=>function()
        {
            $sql = 
            "
                SET @leaseagrm_id = '{$_GET['leaseagrm_id']}'; 
                SET @rent_id = '1'; 

                SELECT @apartment_id:= `apartment_id`, @start_lease:= `Start_date`, @rent_amount:=`Rent_amount` 
                FROM `leaseagrm` WHERE `id` = @leaseagrm_id; 

                SELECT @paid_amount := SUM(`Amount`) FROM `revenue` WHERE `leaseagrm_id` =@leaseagrm_id; 

                SET @total_amount := 
                (
                    SELECT SUM(`Amount`) FROM `invoice_leaseagrm` 
                    WHERE `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = @leaseagrm_id)
                ) + 
                (
                    SELECT SUM(`Amount`) FROM `invoice_utilities` 
                    WHERE `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = @leaseagrm_id)
                ); 

                SELECT @start_date := MAX(`invoice_leaseagrm`.`end_date`)
                FROM `invoice_leaseagrm`, `invoices` 
                WHERE  
                    `invoices`.`id` = `invoice_leaseagrm`.`invoice_id` AND 
                    `invoice_leaseagrm`.`revenue_type_id` = @rent_id AND  
                    `invoices`.`leaseagrm_id` = @leaseagrm_id; 

                SET @start_date = IF(@start_date IS NULL, @start_lease, @start_date); 
                SET @end_date= LAST_DAY(CURRENT_DATE()-INTERVAL 1 MONTH); 
                SET @end_date = IF
                    (
                        @start_date > @end_date, 
                        IF(@start_date <= CURRENT_DATE(), CURRENT_DATE(), @start_date), 
                        @end_date
                    ); 

                SELECT 
                    @start_date AS `start_date`, 
                    @end_date AS `end_date`, 
                    @rent_amount AS `rent_amount`, 
                    @paid_amount AS `paid_amount`, 
                    @total_amount AS `total_amount`, 
                    (IFNULL(@total_amount, 0) - IFNULL(@paid_amount, 0)) AS `difference`; 

                CREATE TEMPORARY TABLE IF NOT EXISTS `all_utility_reading` AS
                (
                    SELECT *, (SELECT MAX(`date`) FROM `utility_reading` AS `ur` WHERE `utility_reading`.`date`>`ur`.`date`) AS `previous_date`
                    FROM `utility_reading` WHERE `apartment_id`=@apartment_id ORDER BY `revenue_type_id`
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
                        (
                            SELECT `utility_price`.`value` FROM `utility_price`
                            WHERE 
                                `utility_price`.`revenue_type_id` = `all_utility_reading`.`revenue_type_id` AND 
                                `utility_price`.`date_valid` <= `all_utility_reading`.`previous_date` 
                            ORDER BY `utility_price`.`date_valid` DESC LIMIT 1 
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

                SELECT `name` FROM `apartment` WHERE `id` = @apartment_id; 

                CREATE TEMPORARY TABLE IF NOT EXISTS `invoice_leaseagrm_rent_search` AS 
                (               
                    SELECT * FROM `invoice_leaseagrm` 
                    WHERE 
                        `invoice_id` IN (SELECT `id` FROM `invoices` WHERE `leaseagrm_id` = @leaseagrm_id) 
                        AND `revenue_type_id` = '1' 
                ); 

                CREATE TEMPORARY TABLE IF NOT EXISTS `invoice_leaseagrm_rent_search_temp` AS (SELECT * FROM `invoice_leaseagrm_rent_search`);
                
                CREATE TEMPORARY TABLE IF NOT EXISTS `rent_start_not_in_end` AS
                (
                    SELECT `start_date` FROM `invoice_leaseagrm_rent_search`
                    WHERE `start_date` NOT IN (SELECT `end_date` FROM `invoice_leaseagrm_rent_search_temp`)
                ); 
                                
                CREATE TEMPORARY TABLE IF NOT EXISTS `rent_end_not_in_start` AS
                (
                    SELECT `end_date` FROM `invoice_leaseagrm_rent_search`
                    WHERE `end_date` NOT IN (SELECT `start_date` FROM `invoice_leaseagrm_rent_search_temp`)
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
                    `end_date` AS `start_date`, 
                    (
                        SELECT MIN(`start_date`) FROM `rent_start_not_in_end` 
                        WHERE `start_date`>`rent_end_not_in_start`.`end_date`
                    ) AS `end_date`
                FROM `rent_end_not_in_start` WHERE `end_date` IS NOT NULL ORDER BY `end_date` DESC;
            "; 

            $data = Connect::MultiQuery($sql,true); 
            $invoice_information = array
            (
                "leaseagrm"=>$data[3][0], 
                "utilities"=>$data[4], 
                "apartment_name"=>$data[5][0]["name"]
            ); 
            $invoice_information["leaseagrm"]["rent_information"] = $data[6]; 
            echo(json_encode($invoice_information)); 
        }, 
        "LastInvoiceDate"=>function()
        {
            $sql = "SELECT MAX(`end_date`) FROM `invoices` WHERE `leaseagrm_id`='{$_GET['leaseagrm_id']}';"; 
            $select_data = Connect::GetData($sql); 
            echo(json_encode($select_data)); 
        }
    ); 

    try 
    {
        $actions[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }
?>



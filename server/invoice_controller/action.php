<?php
    require_once("../helper/database.php"); 

    $actions = array 
    (
        "LastInvoiceDate"=>function()
        {
            $sql = "SELECT MAX(`end_date`) FROM `invoice` WHERE `leaseagrm_id`='{$_GET['leaseagrm_id']}';"; 
            $select_data = Connect::GetData($sql); 
            echo(json_encode($select_data)); 
        }, 
        "InvoiceInformation"=>function()
        {
            $sql = 
            "
                SET @leaseagrm_id = '1'; 

                SELECT @apartment_id:= `apartment_id`, @start_lease:= `Start_date`, @rent_amount:=`Rent_amount`
                FROM `leaseagrm`
                WHERE `id` = @leaseagrm_id; 

                SELECT @paid_amount := SUM(`Amount`) 
                FROM `revenue` 
                WHERE `leaseagrm_id` =@leaseagrm_id; 

                SELECT @total_leaseagrm := SUM(`Amount`) 
                FROM `invoice_leaseagrm` 
                WHERE 
                    `invoice_id` IN 
                        (SELECT `id` FROM `invoice` WHERE `invoice`.`leaseagrm_id` = @leaseagrm_id); 

                SELECT @start_date := MAX(`invoice_leaseagrm`.`end_date`)
                FROM `invoice_leaseagrm`, `invoice` 
                WHERE  
                    `invoice`.`id` = `invoice_leaseagrm`.`invoice_id` AND 
                    `invoice_leaseagrm`.`revenue_type_id` = '1' AND  
                    `invoice`.`leaseagrm_id` = @leaseagrm_id; 
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
                    @total_leaseagrm AS `total_leaseagrm`, 
                    (@total_leaseagrm - @paid_amount) AS `difference`; 


                CREATE TEMPORARY TABLE IF NOT EXISTS `invoice_utilities_checking_apartment` AS
                (
                    SELECT 
                        `invoice_utilities`.*, 
                        (SELECT `date` FROM `utility_reading` WHERE `invoice_utilities`.`utility_reading_id` = `utility_reading`.`id`) AS `date`, 
                        (SELECT `number` FROM `utility_reading` WHERE `invoice_utilities`.`utility_reading_id` = `utility_reading`.`id`) AS `number`, 
                        `invoice`.`leaseagrm_id`
                    FROM `invoice_utilities` LEFT JOIN `invoice` ON `invoice_utilities`.`invoice_id` = `invoice`.`id`
                    WHERE `invoice`.`leaseagrm_id` = @leaseagrm_id
                ); 

                CREATE TEMPORARY TABLE IF NOT EXISTS `utilities_previous_reading_temp` AS
                (
                    SELECT `revenue_type_id`, MAX(`date`) AS `date`
                    FROM `invoice_utilities_checking_apartment`
                    GROUP BY `revenue_type_id`
                ); 


                CREATE TEMPORARY TABLE IF NOT EXISTS `utilities_previous_reading` AS
                (
                    SELECT 
                        *, 
                        (
                            SELECT `number` 
                            FROM `invoice_utilities_checking_apartment` 
                            WHERE 
                                `utilities_previous_reading_temp`.`revenue_type_id` = `invoice_utilities_checking_apartment`.`revenue_type_id` AND 
                                `utilities_previous_reading_temp`.`date` = `invoice_utilities_checking_apartment`.`date`
                        ) AS `number`
                    FROM `utilities_previous_reading_temp`
                ); 

                CREATE TEMPORARY TABLE IF NOT EXISTS `utilities_reading_apartment` AS 
                (
                    SELECT * 
                    FROM `utility_reading`
                    WHERE 
                        `apartment_id` = @apartment_id AND 
                        `date`>=@start_lease AND 
                        `id` NOT IN 
                        (
                            SELECT `utility_reading_id` 
                            FROM `invoice_utilities_checking_apartment`
                        )
                ); 

                CREATE TEMPORARY TABLE IF NOT EXISTS `utility_reading_min_date` AS 
                (
                    SELECT 
                        `revenue_type_id`, 
                        MIN(`date`) AS `date`, 
                        `number`, 
                        (SELECT `date` FROM `utilities_previous_reading` WHERE `utilities_reading_apartment`.`revenue_type_id` = `utilities_previous_reading`.`revenue_type_id`) AS `previous_date`, 
                        (SELECT `number` FROM `utilities_previous_reading` WHERE `utilities_reading_apartment`.`revenue_type_id` = `utilities_previous_reading`.`revenue_type_id`) AS `previous_number`
                    FROM `utilities_reading_apartment`
                    GROUP BY `revenue_type_id`
                ); 

                CREATE TEMPORARY TABLE IF NOT EXISTS `utilities_information_apartment` AS 
                (
                    SELECT 
                        *,
                        IF
                        (
                            `utilities_reading_apartment`.`date` IN (SELECT `utility_reading_min_date`.`date` FROM `utility_reading_min_date` WHERE `utility_reading_min_date`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id`), 
                            (
                                SELECT `utility_reading_min_date`.`previous_date` 
                                FROM `utility_reading_min_date` 
                                WHERE `utility_reading_min_date`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id`
                            ),
                            (
                                SELECT MAX(`ura`.`date`)
                                FROM `utilities_reading_apartment` AS `ura` 
                                WHERE 
                                    `ura`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id` AND 
                                    `ura`.`date`<`utilities_reading_apartment`.`date`
                            )
                        ) AS `previous_date`, 
                        IF
                        (
                            `utilities_reading_apartment`.`date` IN (SELECT `utility_reading_min_date`.`date` FROM `utility_reading_min_date` WHERE `utility_reading_min_date`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id`), 
                            (
                                SELECT `utility_reading_min_date`.`previous_number`
                                FROM `utility_reading_min_date` 
                                WHERE `utility_reading_min_date`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id`
                            ),
                            (
                                SELECT `ura`.`number` 
                                FROM `utilities_reading_apartment` AS `ura` 
                                WHERE 
                                    `ura`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id` AND 
                                    `ura`.`date`=
                                    (
                                        SELECT MAX(`ura`.`date`) 
                                        FROM `utilities_reading_apartment` AS `ura` 
                                        WHERE 
                                            `ura`.`revenue_type_id` = `utilities_reading_apartment`.`revenue_type_id` AND 
                                            `ura`.`date`<`utilities_reading_apartment`.`date`
                                    )
                            )
                        ) AS `previous_number`
                    FROM `utilities_reading_apartment`
                );

                CREATE TEMPORARY TABLE IF NOT EXISTS `invoice_utility_information` AS 
                (
                    SELECT 
                        *, 
                        (
                            SELECT `utility_price`.`value`
                            FROM `utility_price` 
                            WHERE 
                                `utility_price`.`revenue_type_id` = `utilities_information_apartment`.`revenue_type_id` AND 
                                `utility_price`.`date_valid` <=`utilities_information_apartment`.`previous_date`
                            ORDER BY `date_valid` DESC 
                            LIMIT 1
                        ) AS `price`
                    FROM `utilities_information_apartment`
                    WHERE 
                        `previous_date` IS NOT NULL AND 
                        `previous_date` < `date`
                ); 

                SELECT 
                    *, 
                    (`number`-`previous_number`) AS `quantity`,
                    ((`number`-`previous_number`) * `price`) AS `amount`
                FROM `invoice_utility_information`; 

                SELECT `name` 
                FROM `apartment`
                WHERE `id` = @apartment_id; 
            "; 

            $data = Connect::MultiQuery($sql,true); 
            $invoice_information = array
            (
                "leaseagrm"=>$data[4][0], 
                "utilities"=>$data[5], 
                "apartment_name"=>$data[6][0]["name"]
            ); 

            echo(json_encode($invoice_information)); 
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



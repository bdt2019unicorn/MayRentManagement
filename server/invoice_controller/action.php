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
                SET @leaseagrm_id = '{$_GET['leaseagrm_id']}'; 

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

                /*

                SELECT 
                    DATE_FORMAT(@start_period,'%d/%m/%Y') AS `Start Period`, 
                    DATE_FORMAT(@end_period,'%d/%m/%Y') AS `End Period`, 
                    @rent_amount AS `Rent Amount`, 
                    @paid_amount AS `Paid Amount`, 
                    @total_leaseagrm AS `Total Amount`, 
                    (@total_leaseagrm - @paid_amount) AS `Difference`; 
                
                */


                /**********************************************************************/

                /*
                CREATE TEMPORARY TABLE IF NOT EXISTS `revenue_vs_max_date` AS 
                (
                    SELECT `revenue_type_id`, MAX(`date_valid`) AS `date_valid`
                    FROM `utility_price`
                    GROUP BY `revenue_type_id`
                ); 

                SELECT 
                    *,
                    (
                        SELECT `value` 
                        FROM `utility_price` 
                        WHERE 
                            `utility_price`.`revenue_type_id` = `revenue_vs_max_date`.`revenue_type_id` AND 
                            `utility_price`.`date_valid` = `revenue_vs_max_date`.`date_valid`
                    ) AS `value` 
                FROM `revenue_vs_max_date`;

                */


            "; 

            $data = Connect::MultiQuery($sql,true); 

            $invoice_information = array
            (
                "leaseagrm"=>$data[4][0], 
                "utilities"=>array()
            ); 

            echo(json_encode($invoice_information)); 
        }
    ); 


//     SET @apartment_id = '2'; 

// SELECT *  
// FROM `utility_reading`
// WHERE `apartment_id` = @apartment_id; 

// CREATE TEMPORARY TABLE IF NOT EXISTS `utility_reading_vs_date` AS 
// (
//     SELECT `revenue_type_id`, MAX(`date`) AS `date`
//     FROM `utility_reading`
//     WHERE `apartment_id` = @apartment_id
//     GROUP BY `revenue_type_id`
// ); 

// SELECT 
//     *, 
//     (
//         SELECT `number`  
//         FROM `utility_reading` 
//         WHERE 
//             `utility_reading`.`apartment_id` = @apartment_id AND 
//             `utility_reading`.`revenue_type_id` = `utility_reading_vs_date`.`revenue_type_id` AND 
//             `utility_reading`.`date` = `utility_reading_vs_date`.`date`
//     ) AS `number`
// FROM `utility_reading_vs_date`; 

    try 
    {
        $actions[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }









//     SET @apartment_id = '2'; 

// SELECT *  
// FROM `utility_reading`
// WHERE `apartment_id` = @apartment_id; 

// CREATE TEMPORARY TABLE IF NOT EXISTS `utility_reading_vs_date` AS 
// (
//     SELECT `revenue_type_id`, MAX(`date`) AS `date`
//     FROM `utility_reading`
//     WHERE `apartment_id` = @apartment_id
//     GROUP BY `revenue_type_id`
// ); 

// SELECT 
//     *, 
//     (
//         SELECT `number`  
//         FROM `utility_reading` 
//         WHERE 
//             `utility_reading`.`apartment_id` = @apartment_id AND 
//             `utility_reading`.`revenue_type_id` = `utility_reading_vs_date`.`revenue_type_id` AND 
//             `utility_reading`.`date` = `utility_reading_vs_date`.`date`
//     ) AS `number`
// FROM `utility_reading_vs_date`; 

?>



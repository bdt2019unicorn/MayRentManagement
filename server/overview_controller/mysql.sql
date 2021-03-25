SET @previous_date = '0000-00-00'; 
SET @previous_number = 0; 
SET @previous_unit_id = 0; 
SET @previous_revenue_type_id = 0; 

SELECT 
    `info`.*,
    `utility_price`.`value` AS `price` 
FROM 
    (
        SELECT 
            `leaseagrm`.`id`,
            `leaseagrm`.`name`,
            IF(@previous_unit_id=`leaseagrm`.`unit_id` AND @previous_revenue_type_id=`utility_reading`.`revenue_type_id`, @previous_date, @previous_date:='0000-00-00') AS `previous_date`, 
            IF(@previous_unit_id=`leaseagrm`.`unit_id` AND @previous_revenue_type_id=`utility_reading`.`revenue_type_id`, @previous_number, @previous_number:=0) AS `previous_number`, 
            @previous_unit_id:= `leaseagrm`.`unit_id` AS `unit_id`,
            `utility_reading`.`id` AS `utility_reading_id`,
            @previous_revenue_type_id:=`utility_reading`.`revenue_type_id` AS `revenue_type_id`,
            @previous_date:=`utility_reading`.`date` AS `date`,
            @previous_number:=`utility_reading`.`number` AS `number`, 
            `leaseagrm_period`.`name` AS `leaseagrm_period`, 
            `leaseagrm`.`Tenant_ID`,
            `leaseagrm`.`ocupants_ids`,
            `leaseagrm`.`Start_date`,
            `leaseagrm`.`Finish`,
            `leaseagrm`.`Rent_amount`,
            GREATEST
            (
                `Start_date`, 
                LAST_DAY(CURRENT_DATE - INTERVAL 1 MONTH)
            ) AS `date_charged_until`
        FROM 
            `leaseagrm` LEFT JOIN `utility_reading` ON `leaseagrm`.`unit_id` = `utility_reading`.`unit_id`
            LEFT JOIN `leaseagrm_period` ON `leaseagrm`.`leaseagrm_period_id` = `leaseagrm_period`.`id` 
        WHERE 
            `leaseagrm`.`id` NOT IN (SELECT DISTINCT `leaseagrm_id` FROM `invoices`) AND 
            `leaseagrm`.`unit_id` IN (SELECT `id` FROM `unit` WHERE `unit`.`building_id` = '1') AND
            CURRENT_DATE BETWEEN `Start_date` AND `Finish` 
        ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC, `revenue_type_id` 
    ) info
    LEFT JOIN `utility_price` ON `utility_price`.`revenue_type_id` = `info`.`revenue_type_id` AND `utility_price`.`date_valid` <= `info`.`previous_date`
    WHERE `info`.`previous_date` <>'0000-00-00' 
    ORDER BY `info`.`id`, `info`.`date` ASC, `info`.`revenue_type_id`
    

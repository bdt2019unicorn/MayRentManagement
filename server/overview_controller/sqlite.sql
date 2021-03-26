
SELECT 
    `info`.*,
    `info`.`number` - `info`.`previous_number` AS `quantity`,
    `utility_price`.`value` AS `price`, 
    (`info`.`number` - `info`.`previous_number`) * `utility_price`.`value` AS `amount`
FROM
    (
        SELECT 
            `leaseagrm`.`id`,
            `leaseagrm`.`name`,
            `leaseagrm`.`Tenant_ID`,
            `leaseagrm`.`ocupants_ids`,
            `leaseagrm`.`Start_date`,
            `leaseagrm`.`Finish`,
            `leaseagrm`.`Rent_amount`,
            `leaseagrm_period`.`name` AS `leaseagrm_period`, 
            `utility_reading`.`id` AS `utility_reading_id`,
            
            CASE
                WHEN LAG(`utility_reading`.`unit_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`unit_id` AND LAG(`utility_reading`.`revenue_type_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`revenue_type_id` THEN LAG(`utility_reading`.`date`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC)
                ELSE NULL
            END AS `previous_date`, 
            CASE
                WHEN LAG(`utility_reading`.`unit_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`unit_id` AND LAG(`utility_reading`.`revenue_type_id`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC) = `utility_reading`.`revenue_type_id` THEN LAG(`utility_reading`.`number`) OVER (ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC)
                ELSE NULL
            END AS `previous_number`, 
            `leaseagrm`.`unit_id`,
            `utility_reading`.`revenue_type_id`,
            `utility_reading`.`date`,
            `utility_reading`.`number`, 
            MAX
            (
                `Start_date`, 
                DATE('now','start of month', '-1 day')
            ) AS `date_charged_until`
        FROM 
            `leaseagrm` LEFT JOIN `utility_reading` ON `leaseagrm`.`unit_id` = `utility_reading`.`unit_id`
            LEFT JOIN `leaseagrm_period` ON `leaseagrm`.`leaseagrm_period_id` = `leaseagrm_period`.`id` 
        WHERE 
            `leaseagrm`.`id` NOT IN (SELECT DISTINCT `leaseagrm_id` FROM `invoices`) AND 
            `leaseagrm`.`unit_id` IN (SELECT `id` FROM `unit` WHERE `unit`.`building_id` = '1') AND
            CURRENT_DATE BETWEEN `Start_date` AND `Finish` 
        ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC 
    ) info 
    LEFT JOIN `utility_price` ON `utility_price`.`revenue_type_id` = `info`.`revenue_type_id` AND `utility_price`.`date_valid` <= `info`.`previous_date`
WHERE 
    `info`.`date` > `info`.`Start_date` AND `info`.`date` <= `info`.`Finish` 
    AND `info`.`previous_date` <> '0000-00-00'
ORDER BY `info`.`id`, `info`.`date` ASC, `info`.`revenue_type_id`


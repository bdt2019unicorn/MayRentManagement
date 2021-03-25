
SELECT 
    `leaseagrm`.`id`,
    `leaseagrm`.`name`,
    `leaseagrm`.`unit_id`,
    `leaseagrm`.`Tenant_ID`,
    `leaseagrm`.`ocupants_ids`,
    `leaseagrm`.`Start_date`,
    `leaseagrm`.`Finish`,
    `leaseagrm`.`Rent_amount`,
    `utility_reading`.`id` AS `utility_reading_id`,
    `utility_reading`.`revenue_type_id`,
    `utility_reading`.`date`,
    `utility_reading`.`number`, 
    `leaseagrm_period`.`name` AS `leaseagrm_period`, 
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
ORDER BY `leaseagrm`.`id`, `utility_reading`.`date` ASC 
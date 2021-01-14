
SELECT 
    `id` AS `ID`,
    `name` AS `Name`,
    (
        CASE 
            WHEN 
                (
                    SELECT `Tenant_ID` FROM `leaseagrm` 
                    WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                    ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                ) IS NULL THEN 'Vacant'
            ELSE 
            (
                '<router-link :to="{name: ''actions'', params: {controller: ''leaseagrm'', action: ''edit'', building_id: ', CAST(`building_id` AS TEXT) ,'}, query: {id: '||

                            (
                                SELECT CAST(`leaseagrm`.`id` AS TEXT) FROM `leaseagrm` 
                                WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                                ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                            )
                        ||
    '}, }">'||

    (
                    CASE 
                        WHEN 
                            (
                                SELECT `Start_date` < CURRENT_DATE FROM `leaseagrm` 
                                WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                                ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                            )
                        THEN (
    'Until '||
    STRFTIME('%d/%m/%Y', 
                            (
                                SELECT `Finish` FROM `leaseagrm` 
                                WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                                ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                            )
                        )
    )
                        ELSE (
    'Move in '||
    STRFTIME('%d/%m/%Y', 
                            (
                                SELECT `Start_date` FROM `leaseagrm` 
                                WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
                                ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
                            )
                        )
    )
                    END
                
    )
    ||

    '</router-link>'

    )
                    END
                

    ) AS `Rental Status`,
    `area` AS `Area` 



FROM `unit` 
WHERE `building_id` = '5';


                SELECT *
                FROM 
                    `unit` LEFT JOIN 
                    (
                        
                SELECT 
                    `id` AS `leaseid`, 
                    `Tenant_ID` AS `tenantid`, 
                    `unit_id`, 
                    `Start_date`, 
                    `Finish`, 
                    `Deposit_payment_date`, 
                    (
                        CASE 
                            WHEN `Start_date`<CURRENT_DATE THEN 
                            (
                                'Until '||
                                STRFTIME('%d/%m/%Y', `Finish`)
                            )
                            ELSE 
                            (
                                'Move in on '||
                                STRFTIME('%d/%m/%Y', `Finish`)
                            )
                        END
            
                    ) AS `Rental Status`, 
                    (
                        CASE 
                            WHEN `Start_date`<CURRENT_DATE THEN 
                            (
                                '2'||
                                STRFTIME('%Y%m%d', `Finish`)
                            )
                            ELSE 
                            (
                                '1'||
                                STRFTIME('%Y%m%d', `Finish`)
                            )
                        END
            
                    ) AS `Rental Status Value`, 
                    (
                        IFNULL
                        (
                            (
                                (
                                    'Until '||
                                    (
                                        SELECT STRFTIME('%d/%m/%Y', MAX(`invoice_leaseagrm`.`end_date`)) FROM `invoice_leaseagrm` 
                                        WHERE 
                                            `invoice_leaseagrm`.`invoice_id` IN 
                                            (
                                                SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                                            ) AND 
                                            `invoice_leaseagrm`.`revenue_type_id` = '1'
                                    ) 
                                )
                            ), 
                            (
                                CASE 
                                    WHEN `Deposit_payment_date` IS NULL THEN NULL
                                    ELSE 'Deposit paid'
                                END                
                            )
                        ) 
            
                    ) AS `Payment Status`, 
                    (
                        IFNULL
                        (
                            (
                                (
                                    '2'||
                                    (
                                        SELECT STRFTIME('%d/%m/%Y', MAX(`invoice_leaseagrm`.`end_date`)) FROM `invoice_leaseagrm` 
                                        WHERE 
                                            `invoice_leaseagrm`.`invoice_id` IN 
                                            (
                                                SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                                            ) AND 
                                            `invoice_leaseagrm`.`revenue_type_id` = '1'
                                    ) 
                                )
                            ), 
                            (
                                CASE 
                                    WHEN `Deposit_payment_date` IS NULL THEN 0
                                    ELSE 1
                                END
                            )
                        ) 
                    ) AS `Payment Status Value`, 
                    (
                        SELECT 
                        (
                            IFNULL(`tenant`.`First_Name`,'')||
                            ' '||
                            IFNULL(`tenant`.`Middle_Name`,'')||
                            ' '||
                            IFNULL(`tenant`.`Last_Name`,'')
                        )
                        ) FROM `tenant` WHERE `tenant`.`id`=`Tenant_ID`) AS `Tenant Name`
                FROM `leaseagrm` WHERE `Finish`>=CURRENT_DATE
            
                    ) AS `leaseagrm_overview` ON `unit`.`id` = `leaseagrm_overview`.`unit_id`
                WHERE `unit`.`building_id` = '5' ORDER BY `unit`.`id`; 
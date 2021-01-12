

                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    (IFNULL(`tenant`.`Last_Name`,'') || ', ' || IFNULL(`tenant`.`First_Name`, '')) AS `Tenant Name`, 
                    STRFTIME('%d/%m/%Y', `Start_date`) AS `Start Date`, 
                    STRFTIME('%d/%m/%Y', `Finish`) AS `End Date`, 
                    
                (
                    IIF
                    (
                        (
                            
            (
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                        WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0
                ) + 
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                        WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0 
                )
            )
         - 
            (
                IFNULL
                (
                    (
                        SELECT SUM(`Amount`) 
                        FROM `revenue`
                        WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                    ), 0 
                )
            )
         > 0 
                        ), 
                        
                        (
                            '(' ||
                            CAST
                            (
                                (
                                    ROUND
                                    (
                                        (
                                            IFNULL
                                            (
                                                (
                                                    SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                                                    WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                                                ), 0
                                            ) + 
                                            IFNULL
                                            (
                                                (
                                                    SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                                                    WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                                                ), 0 
                                            )
                                        )
                                    - 
                                        (
                                            IFNULL
                                            (
                                                (
                                                    SELECT SUM(`Amount`) 
                                                    FROM `revenue`
                                                    WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                                                ), 0 
                                            )
                                        ), 0
                                    )
                                ) AS TEXT
                            ) || 
                            ')' 
                        ), 
                        (
                            ROUND(
            (
                IFNULL
                (
                    (
                        SELECT SUM(`Amount`) 
                        FROM `revenue`
                        WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                    ), 0 
                )
            )
         - 
            (
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                        WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0
                ) + 
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                        WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0 
                )
            )
        , 0)
                        )
                    )
                ) AS `Outstanding Balance` 
            ,
                    
                (
                    IIF
                    (
                        (
                            
            (
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                        WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0
                ) + 
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                        WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0 
                )
            )
         - (
 
            IIF
            (
                `Deposit_payment_date` IS NULL, 
                0, 
                IIF
                (
                    `Deposit_payment_date` < CURRENT_DATE, 
                    IFNULL(`Deposit_amount`, 0), 
                    0
                )
            ) 
        
 + 
            (
                IFNULL
                (
                    (
                        SELECT SUM(`Amount`) 
                        FROM `revenue`
                        WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                    ), 0 
                )
            )
        
) > 0 
                        ), 
                        (
                            '(' ||
                            CAST
                            (
                                (
                                    ROUND
                                    (
                                        (
                                            IFNULL
                                            (
                                                (
                                                    SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                                                    WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                                                ), 0
                                            ) + 
                                            IFNULL
                                            (
                                                (
                                                    SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                                                    WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                                                ), 0 
                                            )
                                        )
                                        - (
                                
                                            IIF
                                            (
                                                `Deposit_payment_date` IS NULL, 
                                                0, 
                                                IIF
                                                (
                                                    `Deposit_payment_date` < CURRENT_DATE, 
                                                    IFNULL(`Deposit_amount`, 0), 
                                                    0
                                                )
                                            ) 
                                    
                                        + 
                                        (
                                            IFNULL
                                            (
                                                (
                                                    SELECT SUM(`Amount`) 
                                                    FROM `revenue`
                                                    WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                                                ), 0 
                                            )
                                        )
                                    
                                    ), 0)
                                ) AS TEXT 
                            ) ||
                            ')' 
                        ), 
                        (
                            ROUND((
 
            IIF
            (
                `Deposit_payment_date` IS NULL, 
                0, 
                IIF
                (
                    `Deposit_payment_date` < CURRENT_DATE, 
                    IFNULL(`Deposit_amount`, 0), 
                    0
                )
            ) 
        
 + 
            (
                IFNULL
                (
                    (
                        SELECT SUM(`Amount`) 
                        FROM `revenue`
                        WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                    ), 0 
                )
            )
        
) - 
            (
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` 
                        WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0
                ) + 
                IFNULL
                (
                    (
                        SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` 
                        WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                    ), 0 
                )
            )
        , 0)
                        )
                    )
                ) AS `Deposit` 
             
                FROM `leaseagrm`
                    LEFT JOIN `unit` ON `leaseagrm`.`unit_id` = `unit`.`id`
                    LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            
                WHERE 
                    `leaseagrm`.`unit_id` IS NULL OR 
                    `leaseagrm`.`Tenant_ID` IS NULL
                ; 
<?php
    namespace OverviewQueries; 

    trait OverviewTrait 
    {
        public $edit; 
        public $building_id; 
        public $id; 

        public function __construct($edit, $building_id, $id)
        {
            $this->edit = $edit; 
            $this->building_id = $building_id; 
            $this->id = $id; 
        }

        public function GetArray($method)
        {
            return call_user_func_array(__CLASS__ . "::{$method}", [$this->edit, $this->building_id, $this->id]); 
        }

        public static function Conditions($edit, $building_id, $id)
        {
            if($id)
            {
                return ["id"=>$id]; 
            }
            else if($building_id)
            {
                return ["building_id"=>$building_id]; 
            }
            return null; 
        }

    }

    class Unit 
    {
        use OverviewTrait; 
        public static function Selects($edit, $building_id, $id)
        {
            return $edit? ["*"]: ["id AS ID", "name AS Name"]; 
        }
    }

    class Tenant 
    {
        use OverviewTrait; 
        public static function Selects($edit, $building_id, $id)
        {
            return $edit? 
            [
                "*", 
                "CONCAT(IFNULL(`Last_Name`,''), ' ', IFNULL(`Middle_Name`,''), ' ', IFNULL(`First_Name`,'')) AS `Full Name`"
            ]: 
            [
                "`id` AS `ID`", 
                "CONCAT(IFNULL(`Last_Name`,''), ' ', IFNULL(`Middle_Name`,''), ' ', IFNULL(`First_Name`,'')) AS `Full Name`", 
                "`Passport_ID_number` AS `ID Number`"
            ]; 
        }
    }


    class GeneralOverview
    {
        public static function UserInput($controller)
        {
            $path = __DIR__ . "/../user_input_controller/{$controller}.json"; 
            $path = realpath($path); 
            if(!$path)
            {
                return false; 
            }
            $invoice_user_input = file_get_contents($path); 
            return json_decode($invoice_user_input, true); 
        }

        use OverviewTrait
        {
            __construct as private Contruct; 
            GetArray as private TraitGetArray; 
            Conditions as private TraitConditions; 
        }

        public $class; 
        public function __construct($edit, $building_id, $id, $controller)
        {
            $this->Contruct($edit, $building_id, $id); 
            $controller = ucfirst($controller); 
            $this->class = __NAMESPACE__ . "\\{$controller}"; 
        }

        public function GetArray($method)
        {
            return call_user_func_array ("{$this->class}::{$method}", [$this->edit, $this->building_id, $this->id]); 
        }
    }

    class LeaseAgrm
    {
        public static function OverviewDashboard()
        {
            return LeaseAgrm::GeneralQuery(). 
            "
                WHERE 
                    `leaseagrm`.`unit_id` IS NULL OR 
                    `leaseagrm`.`Tenant_ID` IS NULL
                ; 
            "; 
        }

        public static function OverviewBuildingId($building_id)
        {
            return LeaseAgrm::GeneralQuery(). "\n WHERE `unit`.`building_id` = '{$building_id}'; "; 
        }

        private static function GeneralQuery()
        {
            $sum_query_invoice = 
            "
                (
                    IFNULL
                    (
                        (
                            SELECT SUM(`invoice_leaseagrm`.`amount`) 
                            FROM `invoice_leaseagrm` 
                            WHERE `invoice_leaseagrm`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                        ), 0
                    ) + 
                    IFNULL
                    (
                        (
                            SELECT SUM(`invoice_utilities`.`amount`) 
                            FROM `invoice_utilities` 
                            WHERE `invoice_utilities`.`invoice_id` IN (SELECT `invoices`.`id` FROM `invoices` WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`)
                        ), 0 
                    )
                )
            "; 

            $sum_query_revenue = 
            "
                (
                    IFNULL
                    (
                        (
                            SELECT SUM(Amount) 
                            FROM `revenue`
                            WHERE `revenue`.`leaseagrm_id` = `leaseagrm`.`id`
                        ), 0 
                    )
                )
            "; 

            $deposit_amount = 
            "                
                IF
                (
                    ISNULL(`Deposit_payment_date`), 
                    0, 
                    IF
                    (
                        `Deposit_payment_date` < CURRENT_DATE, 
                        IFNULL(`Deposit_amount`, 0), 
                        0
                    )
                )
            "; 

            return 
            "
                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, 
                    DATE_FORMAT(`Start_date`,'%d/%m/%Y') AS `Start Date`, 
                    DATE_FORMAT(`Finish`,'%d/%m/%Y') AS `End Date`, 
                    (
                        IF
                        (
                            (
                                {$sum_query_invoice} - 
                                {$deposit_amount} - {$sum_query_revenue} > 0 
                            ), 
                            CONCAT
                            (
                                '(', 
                                CONVERT
                                (
                                    (
                                        {$sum_query_invoice} - 
                                        {$deposit_amount} - {$sum_query_revenue}
                                    ), 
                                    CHAR 
                                ),
                                ')' 
                            ), 
                            (
                                {$sum_query_revenue} + {$deposit_amount} - 
                                {$sum_query_invoice}
                            )
                        )
                    ) AS `Outstanding Balance` 
                FROM `leaseagrm`
                    LEFT JOIN `unit` ON `leaseagrm`.`unit_id` = `unit`.`id`
                    LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            "; 
        }
    }

    class Invoices 
    {
        public static function RentId()
        {
            $invoice_user_input = GeneralOverview::UserInput("invoice"); 
            return $invoice_user_input? $invoice_user_input["rent_id"]: null; 
        }
    }

?>
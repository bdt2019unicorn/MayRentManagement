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
            $full_name = "CONCAT(IFNULL(`Last_Name`,''), ' ', IFNULL(`First_Name`,'')) AS `Full Name`"; 
            return $edit? 
            [
                "*", 
                $full_name
            ]: 
            [
                "`id` AS `ID`", 
                "
                    (
                        SELECT `unit`.`name` FROM `unit` 
                        WHERE `unit`.`id` IN (SELECT `unit_id` FROM `leaseagrm` WHERE `leaseagrm`.`Tenant_ID` = `tenant`.`id`)
                        LIMIT 1 
                    ) AS `Unit Name`
                ", 
                $full_name, 
                "`Mobile_Phone` AS `Mobile Phone`", 
                "`Personal_Email` AS `Personal Email`", 
                "`Passport_ID_number` AS `Passport/ID number`", 
                "DATE_FORMAT(`Date_of_birth`, '%d %M %Y') AS `Date of birth`" 
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

        public static function TotalPaidAmountQuery()
        {
            return "(\n " . LeaseAgrm::$DepositQuery . "\n + " . LeaseAgrm::$TotalPaidRevenueQuery . "\n)"; 
        }

        public static $TotalInvoiceAmountQuery = 
        "
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
        "; 

        private static $DepositQuery = 
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

        private static $TotalPaidRevenueQuery = 
        "
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
        "; 

        private static function CompareTotals($main_total_query, $compared_total_query, $as)
        {
            return 
            "
                (
                    IF
                    (
                        (
                            {$main_total_query} - {$compared_total_query} > 0 
                        ), 
                        CONCAT
                        (
                            '(', 
                            CONVERT
                            (
                                (
                                    FORMAT({$main_total_query} - {$compared_total_query}, 0)
                                ), 
                                CHAR 
                            ),
                            ')' 
                        ), 
                        (
                            FORMAT({$compared_total_query} - {$main_total_query}, 0)
                        )
                    )
                ) AS `{$as}` 
            "; 
        }

        private static function GeneralQuery()
        {
            $out_standing_balance = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::TotalPaidAmountQuery(), "Outstanding Balance"); 
            $paid_invoice_balance = LeaseAgrm::CompareTotals(LeaseAgrm::$TotalInvoiceAmountQuery, LeaseAgrm::$TotalPaidRevenueQuery, "Invoice/Paid Balance"); 

            return 
            "
                SELECT 
                    `leaseagrm`.`id` as `ID`, 
                    `leaseagrm`.`name` AS `Name`, 
                    `unit`.`name` as `Unit`, 
                    CONCAT(tenant.Last_Name,', ',tenant.First_Name) AS `Tenant Name`, 
                    DATE_FORMAT(`Start_date`,'%d/%m/%Y') AS `Start Date`, 
                    DATE_FORMAT(`Finish`,'%d/%m/%Y') AS `End Date`, 
                    {$out_standing_balance}, 
                    {$paid_invoice_balance}
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

    /*

    SELECT 
        id AS ID, 
        name AS Name, 


        (
            SELECT `Tenant_ID` FROM `leaseagrm` 
            WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
            ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
        ) AS `tenantid`, 
        (
            SELECT CONCAT(`tenant`.`Last_Name`, ' ', `tenant`.`First_Name`)
            FROM `leaseagrm` LEFT JOIN `tenant` ON `leaseagrm`.`Tenant_ID` = `tenant`.`id`
            WHERE `leaseagrm`.`Finish` > CURRENT_DATE AND `leaseagrm`.`unit_id` = `unit`.`id` 
            ORDER BY `leaseagrm`.`Start_date` ASC LIMIT 1
        ) AS `Tenant Name`

    FROM `unit` WHERE `building_id` = '6'




    */

?>
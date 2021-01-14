<?php 
    namespace OverviewQueries; 
    require_once("OverviewTrait.php"); 
    class Tenant 
    {
        use OverviewTrait; 
        public static function Selects($edit, $building_id, $id, $test_mode=false)
        {
            $full_name = ($test_mode? "(IFNULL(`Last_Name`,'') || ' ' || IFNULL(`First_Name`,''))":  "CONCAT(IFNULL(`Last_Name`,''), ' ', IFNULL(`First_Name`,''))" ). " AS `Full Name`"; 
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
                ($test_mode? "STRFTIME('%d/%m/%Y', `Date_of_birth`)": "DATE_FORMAT(`Date_of_birth`, '%d %M %Y')") . " AS `Date of birth`" 
            ]; 
        }
    }
?>
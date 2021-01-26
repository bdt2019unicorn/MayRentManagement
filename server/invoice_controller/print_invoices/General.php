<?php 
    namespace PrintInvoices;

use ConnectSqlite;

require_once("Excel.php"); 
    class General 
    {
        private $logo_image, $building_information, $invoices, $test_mode; 
        function __construct($building_id)
        {
            $this->logo_image = $this->Base64Logo(); 
            $this->test_mode = \CurrentEnvironment::TestMode(); 
            $this->PopulateInvoiceData($building_id); 
        }

        private function PopulateInvoiceData($building_id)
        {
            $Tenant = function()
            {
                $select = \Query::Concat(["IFNULL(`tenant`.`Last_Name`,'')" , "' '", "IFNULL(`tenant`.`First_Name`,'')"], $this->test_mode); 
                return 
                "
                    (
                        SELECT {$select} 
                        FROM `tenant` 
                        WHERE `tenant`.`id` = 
                        (
                            SELECT `leaseagrm`.`Tenant_ID` FROM `leaseagrm` 
                            WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                        )
                    ) AS `tenant` 
                "; 
            }; 
            $GrandTotal = function()
            {
                $format = $this->test_mode? "ROUND": "FORMAT"; 
                return 
                "
                    {$format}
                    (
                        (
                            IFNULL
                            (
                                (SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` WHERE `invoice_leaseagrm`.`invoice_id` = `invoices`.`id`), 
                                0
                            ) + 
                            IFNULL
                            (
                                (SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` WHERE `invoice_utilities`.`invoice_id` = `invoices`.`id`),
                                0 
                            )
                        ), 0  
                    ) AS `grand_total`
                "; 
            }; 
            $building_information = \Query::GeneralData("buildings", $building_id); 
            $invoices = 
            "
                SELECT 
                    *, 
                    (
                        SELECT `unit`.`name` FROM `unit` 
                        WHERE `unit`.`id` = 
                        (
                            SELECT `leaseagrm`.`unit_id` FROM `leaseagrm` 
                            WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                        )
                    ) AS `unit`, 
                    {$Tenant()}, 
                    (SELECT `leaseagrm`.`name` FROM `leaseagrm` WHERE `leaseagrm`.`id` = `invoices`.`leaseagrm_id`) AS `leaseagrm`, 
                    {$GrandTotal()}
                FROM `invoices` 
                WHERE `leaseagrm_id` IN 
                (
                    SELECT `leaseagrm`.`id` FROM `leaseagrm` 
                    WHERE `leaseagrm`.`unit_id` IN 
                    (
                        SELECT `unit`.`id` FROM `unit` WHERE `building_id` = '{$building_id}'
                    )
                ); 
            "; 

            if($this->test_mode)
            {
                $data = [\ConnectSqlite::Query($building_information), \ConnectSqlite::Query($invoices)]; 
            }
            else 
            {
                $sql = "{$building_information}\n {$invoices}"; 
                $data = \Connect::MultiQuery($sql, true); 
            }
            $this->building_information = $data[0][0];
            $this->invoices = $data[1]; 
        }
        
        private function Base64Logo()
        {
            $path = realpath(__DIR__ . "/../../../img/logo.png"); 
            $image = file_get_contents($path); 
            $base64 = base64_encode($image); 
            return "data:image/jpeg;base64,{$base64}"; 
        }

        private function InvoicesInformation()
        {
            return array_map
            (
                function($invoice)
                {
                    $invoice_id = $invoice["id"]; 
                    $query = InvoiceDetails($invoice_id); 
                    if($this->test_mode)
                    {
                        $invoice_details = array_filter(explode(";", $query), function($string){return trim($string); });
                        $invoice_details = array_map(function($sql){return ConnectSqlite::Query($sql); }, $invoice_details); 
                    }
                    else 
                    {
                        $invoice_details = \Connect::MultiQuery($query, true); 
                    }
                    
                    return
                    [
                        "id" => $invoice_id, 
                        "invoice" =>$invoice, 
                        "details" => 
                        [
                            "leaseagrm" =>$invoice_details[0], 
                            "utilities" =>$invoice_details[1]
                        ], 
                        "checked" => false, 
                        "show_details" => false 
                    ]; 
                }, 
                $this->invoices
            ); 
        }
        
        public function PrintInvoices()
        {
            return 
            [
                "html" => 
                [
                    "image" => $this->logo_image 
                ], 
                "invoices" =>$this->InvoicesInformation(), 
                "excel" => Excel::FooterArray($this->building_information)
            ]; 
        }
    }
?>
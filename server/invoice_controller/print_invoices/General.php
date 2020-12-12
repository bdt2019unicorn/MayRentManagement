<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    spl_autoload_register(fn($class)=>require_once(str_replace(__NAMESPACE__."\\","",$class).".php")); 
    class General 
    {
        use InvoicesInformation, Pdf; 
        private $logo_image; 
        private $building_information; 
        function __construct($building_id)
        {
            $this->logo_image = $this->Base64Logo(); 
            $this->PopulateInvoiceData($building_id); 
        }

        private function PopulateInvoiceData($building_id)
        {
            $sql = \Query::GeneralData("buildings", $building_id) . 
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
                    (
                        SELECT CONCAT(IFNULL(`tenant`.`Last_Name`,''), ' ', IFNULL(`tenant`.`First_Name`,'')) 
                        FROM `tenant` 
                        WHERE `tenant`.`id` = 
                        (
                            SELECT `leaseagrm`.`Tenant_ID` FROM `leaseagrm` 
                            WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                        )
                    ) AS `tenant`, 
                    (SELECT `leaseagrm`.`name` FROM `leaseagrm` WHERE `leaseagrm`.`id` = `invoices`.`leaseagrm_id`) AS `leaseagrm`, 
                    FORMAT
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
            $data = \Connect::MultiQuery($sql, true); 
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
        
        public function PrintInvoices()
        {
            return 
            [
                "html" => 
                [
                    "image" => $this->logo_image, 
                    "footer" => ""
                ], 
                "invoices" =>$this->InvoicesInformation(), 
                "pdf" => $this->Pdf(), 
                "excel" => Excel::FooterArray($this->building_information)
            ]; 
        }
    }
?>
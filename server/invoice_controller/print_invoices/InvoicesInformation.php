<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    trait InvoicesInformation 
    {   
        private $invoices; 
        private function InvoicesInformation()
        {
            return array_map
            (
                function($invoice)
                {
                    $invoice_id = $invoice["id"]; 
                    $query = InvoiceDetails($invoice_id); 
                    $invoice_details = \Connect::MultiQuery($query, true); 
                    
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
    }
?>
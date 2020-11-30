<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    trait InvoicesInformation 
    {   
        private $invoices; 
        private function InvoicesInformation()
        {
            $all_invoices_information = []; 
            foreach ($this->invoices as $invoice) 
            {
                $invoice_id = $invoice["id"]; 
                $query = InvoiceDetails($invoice_id); 
                $invoice_details = \Connect::MultiQuery($query, true); 
                
                $details = 
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
        
                array_push($all_invoices_information, $details); 
            }
            return $all_invoices_information; 
        }
    }
?>
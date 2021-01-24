<?php 
    require_once("helper/InvoiceInformation.php"); 
    $leaseagrm_id = 144; 
    $invoice_information = new InvoiceInformation($leaseagrm_id); 
    $information = $invoice_information->GetInformation(); 
    echo "<pre>"; print_r($information); echo "</pre>"; 
?>
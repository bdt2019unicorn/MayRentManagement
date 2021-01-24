<?php 
    require_once("test/InvoiceInformation.php"); 
    $leaseagrm_id = 144; 
    $invoice_information = new InvoiceInformation($leaseagrm_id); 
    $invoice_information->ProductionInformation(); 
?>
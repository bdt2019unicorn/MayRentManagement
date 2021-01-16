<?php 
    require_once("helper.php"); 
    $leaseagrm_id = 148; 

    $invoice_information = InvoiceInformation($leaseagrm_id); 

    echo "<pre>"; print_r($invoice_information); echo "</pre>"; 

?>
<?php 
// check here first 
    require_once("./helper.php"); 
    $invoices = json_decode($_POST["invoices"], true); 
    $queries = ImportInvoice($invoices); 
    $result = Connect::ExecTransaction($queries); 
    echo $result; 
?>
<?php 
    require_once("./helper.php"); 
    $monthly_invoices = json_decode($_POST["monthly_invoices"], true); 
    $sql = [...array_map(fn($invoices)=>ImportInvoice($invoices), $monthly_invoices)]; 
    $result = Connect::ExecTransaction($sql); 
    echo $result; 
?>
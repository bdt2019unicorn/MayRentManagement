<?php 
    require_once("./helper.php"); 
    $monthly_invoices = json_decode($_POST["monthly_invoices"], true); 

    $sql = []; 
    foreach ($monthly_invoices as $invoices) 
    {
        $queries = ImportInvoice($invoices); 
        $sql = array_merge($sql, $queries); 
    }

    // echo '<pre>'; 
    // print_r($sql); 
    // echo '</pre>';
    $result = Connect::ExecTransaction($sql); 
    echo $result; 
?>
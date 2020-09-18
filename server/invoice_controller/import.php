<?php 
    require_once("../helper/database.php"); 
    $invoices = json_decode($_POST["invoices"], true); 
    $queries = []; 
    array_push($queries, Query::Insert("invoice", $invoices["invoice"]), "SET @invoice_id=LAST_INSERT_ID();"); 

    foreach ($invoices["details"] as $table => $values) 
    {
        foreach ($values as $data) 
        {
            array_push($queries, Query::Insert($table, $data, ["invoice_id"=>"@invoice_id"])); 
        }
    }
    $result = Connect::ExecTransaction($queries); 
    echo $result; 
?>
<?php 
    require_once("./helper.php"); 

    $invoice_id = 4; 

    $tables = ["leaseagrm", "utilities"]; 
    $sql = InvoiceDetails($invoice_id); 
    $data = Connect::MultiQuery($sql, true); 

    // print_r($data); 
    // echo $sql; 
    $result = []; 
    foreach ($tables as $key => $table) 
    {
        $result[$table] = $data[$key]; 
    }
    echo json_encode($result); 

    $queries = explode(";", $sql); 
    print_r($queries); 
    foreach ($tables as $key => $table) 
    {
        $result[$table] = ConnectSqlite::Query($queries[$key]); 
    }

    print_r($result); 


?>
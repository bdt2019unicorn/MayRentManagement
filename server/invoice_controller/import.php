<?php 
    require_once("./helper.php"); 
    $invoices = json_decode($_POST["invoices"], true); 
    $test_mode = CurrentEnvironment::TestMode(); 
    $data = ImportInvoice($invoices, $test_mode); 
    $result = $test_mode? ConnectSqlite::InsertWithDetails($data): Connect::ExecTransaction($data); 
    echo $result; 
?>
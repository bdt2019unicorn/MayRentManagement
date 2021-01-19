<?php 
    require_once("./helper.php"); 
    $monthly_invoices = json_decode($_POST["monthly_invoices"], true); 
    $test_mode = CurrentEnvironment::TestMode(); 
    $sql = array_map(function($invoices) use ($test_mode) {return ImportInvoice($invoices, $test_mode);}, $monthly_invoices); 

    if($test_mode)
    {
        $result = ConnectSqlite::InsertWithDetailsGroup($sql); 
    }
    else 
    {
        $sql = array_reduce($sql, function($current, $queries){return array_merge($current, $queries); }, []); 
        $result = Connect::ExecTransaction($sql); 
    }
    echo $result; 
?>
<?php 
    require_once("./helper.php"); 
    $invoices = json_decode($_POST["invoices"], true); 
    if(CurrentEnvironment::TestMode())
    {
        $data = 
        [
            "table" => "invoices", 
            "main" => $invoices["invoice"], 
            "details"=>
            [
                "invoice_leaseagrm" => 
                [
                    "reference_key"=> "invoice_id", 
                    "data" => $invoices["details"]["leaseagrm"]
                ], 
                "invoice_utilities" => 
                [
                    "reference_key"=> "invoice_id", 
                    "data" => $invoices["details"]["utilities"]
                ]
            ] 
        ]; 
        $result = ConnectSqlite::InsertWithDetails($data); 
    }
    else 
    {
        $queries = ImportInvoice($invoices); 
        $result = Connect::ExecTransaction($queries); 
    }

    echo $result; 
?>
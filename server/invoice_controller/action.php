<?php
    require_once("./helper.php"); 

    $actions = array 
    (
        "AddMonthlyInvoices"=>function()
        {

        }, 
        "InvoiceDetails"=>function()
        {
            $tables = ["leaseagrm", "utilities"]; 
            $sql = InvoiceDetails($_GET["invoice_id"]); 
            $data = Connect::MultiQuery($sql, true); 

            $result = []; 
            foreach ($tables as $key => $table) 
            {
                $result[$table] = $data[$key]; 
            }
            echo json_encode($result); 
        }, 
        "InvoiceInformation"=>function()
        {
            $invoice_information = InvoiceInformation($_GET['leaseagrm_id']); 
            echo(json_encode($invoice_information)); 
        }
    ); 

    try 
    {
        $actions[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }
?>
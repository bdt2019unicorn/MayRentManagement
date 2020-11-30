<?php 
    require_once("./helper.php"); 
    require_once("print_invoices/General.php"); 
    $building_id = $_GET["building_id"]; 
    $print_invoices_general = new PrintInvoices\General($building_id); 

    $all_invoices_information = []; 
    foreach ($print_invoices_general->invoices as $invoice) 
    {
        $invoice_id = $invoice["id"]; 
        $query = InvoiceDetails($invoice_id); 
        $invoice_details = Connect::MultiQuery($query, true); 
        
        $details = 
        [
            "id" => $invoice_id, 
            "invoice" =>$invoice, 
            "details" => 
            [
                "leaseagrm" =>$invoice_details[0], 
                "utilities" =>$invoice_details[1]
            ], 
            "checked" => false, 
            "show_details" => false 
        ]; 

        array_push($all_invoices_information, $details); 
    }
        
    $print_invoices = 
    [
        "html" => $print_invoices_general->Html(), 
        "invoices" =>$all_invoices_information, 
        "pdf" => $print_invoices_general->Pdf()
    ]; 

    echo json_encode($print_invoices); 
?>
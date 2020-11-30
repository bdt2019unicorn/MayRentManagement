<?php 
    require_once("print_invoices/General.php"); 
    $building_id = $_GET["building_id"]; 
    $print_invoices_general = new PrintInvoices\General($building_id); 
    echo json_encode($print_invoices_general->PrintInvoices()); 
?>
<?php 
	require_once("main_controller.php"); 

    $table = "leaseagrm"; 
    $date_collumns = ["start_date", "finish", "deposit_payment_date", "deposit_payback_date"]; 
    $exclude_columns = []; 
    $get_id = array
    (
        'Apartment' => array
        (
            'search'=>'name', 
            'change'=>'apartment_id', 
            'table'=>'apartment'
        ), 
        'Tenant_ID' => array
        (
            'search'=>'Passport_ID_number', 
            'change'=>'Tenant_ID', 
            'table'=>'tenant'
        )
    );
    $year_number = "20"; 
    $comma = ["Rent_amount","Deposit_amount", "Deposit_exchange_rate"]; 
    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>
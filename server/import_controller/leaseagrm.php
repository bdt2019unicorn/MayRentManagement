<?php 
	require_once("main_controller.php"); 

    $table = "leaseagrm"; 
    $date_collumns = ["start_date", "finish", "deposit_payment_date", "deposit_payback_date"]; 
    $exclude_columns = []; 
    $get_id = array
    (
        'apartment' => array
        (
            'search'=>'name', 
            'change'=>'apartment_id', 
            'table'=>'apartment'
        ), 
        'tenant_id' => array
        (
            'search'=>'passport_id_number', 
            'change'=>'tenant_id', 
            'table'=>'tenant'
        )
    );
    $year_number = "20"; 
    $comma = ["rent_amount","deposit_amount", "deposit_exchange_rate"]; 
    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>
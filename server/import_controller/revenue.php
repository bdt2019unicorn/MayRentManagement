<?php 
	require_once("main_controller.php"); 

    $table = "revenue"; 
    $date_collumns = ["start_period", "end_period", "payment_date"]; 
    $exclude_columns = []; 
    $get_id = array
    (
        'apartment' => array
        (
            'search'=>'name', 
            'change'=>'apartment_id', 
            'table'=>'apartment'
        ), 
        'revenue_type' => array
        (
            'search'=>'name', 
            'change'=>'revenue_type_id', 
            'table'=>'revenue_type'
        )
    );
    $year_number = "20"; 
    $comma = ["amount"]; 
    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 


?>
<?php
    require_once("main_controller.php"); 
    $table = "utility_reading"; 
    $date_collumns = []; 
    $exclude_columns = []; 
    $get_id = array 
    (
        "utility_type" => array
        (
            'search' => 'name',
            'change' => 'revenue_type_id', 
            'table' => 'revenue_type'
        ), 
        'apartment' => array
        (
            'search'=>'name', 
            'change'=>'apartment_id', 
            'table'=>'apartment'
        )
    ); 

    $year_number = "20"; 
    $comma = []; 
    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>
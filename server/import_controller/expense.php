<?php 
    require_once("main_controller.php"); 
    $table = "expense"; 
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
        'expense_type' => array
        (
            'search'=>'name', 
            'change'=>'expense_type_id', 
            'table'=>'expense_type'
        )
    );
    $year_number = "20"; 
    $comma = ["amount"]; 

    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>

<?php 
    require_once("main_controller.php"); 
    $table = "expense"; 
    $date_collumns = ["start_period", "end_period", "payment_date"]; 
    $exclude_columns = []; 
    $get_id = array
    (
        'Apartment' => array
        (
            'search'=>'name', 
            'change'=>'apartment_id', 
            'table'=>'apartment'
        ), 
        'Expense type' => array
        (
            'search'=>'name', 
            'change'=>'expense_type_id', 
            'table'=>'expense_type'
        )
    );
    $year_number = "20"; 
    $comma = ["Amount"]; 

    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>

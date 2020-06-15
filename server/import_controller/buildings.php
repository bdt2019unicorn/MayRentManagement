<?php 
    require_once("main_controller.php"); 
    $table = "buildings"; 
    $date_collumns = []; 
    $exclude_columns = []; 
    $get_id = []; 
    $year_number = "20"; 
    $comma = []; 

    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>

<?php 
    require_once("main_controller.php"); 
    $table = "tenant"; 
    $date_collumns = ["date_of_birth"]; 
    $exclude_columns = ["Tenant_ID", "Apartment"]; 
    $get_id = []; 
    $year_number = "19"; 
    $comma = []; 
    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>
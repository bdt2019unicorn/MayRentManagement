<?php 
    require_once("main_controller.php"); 
    $table = "apartment"; 
    $date_collumns = []; 
    $exclude_columns = []; 
    $get_id = array 
    (
    	"building" => array
    	(
    		'search' => 'name',
    		'change' => 'building_id', 
    		'table' => 'buildings'
    	)
    ); 

    $year_number = "20"; 
    $comma = []; 

    ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma); 
?>

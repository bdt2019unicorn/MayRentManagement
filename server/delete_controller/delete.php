<?php 
    require_once("../helper/query.php"); 
    require_once("../helper/connect.php"); 

    $post_key = "delete"; 
    $ids = json_decode($_POST[$post_key]); 

    $queries = Query::Delete($table, $id_column, $ids); 
    $result = Connect::ExecTransaction($queries); 
    echo $result; 

?>
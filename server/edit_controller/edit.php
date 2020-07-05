<?php 
    require_once("../helper/query.php"); 
    require_once("../helper/connect.php"); 

    $post_key = "edit"; 
    $data = json_decode($_POST[$post_key]); 

    $sql = Query::Update($table, $data, $_GET);
    $result = Connect::GetData($sql); 
    echo $result; 
?>
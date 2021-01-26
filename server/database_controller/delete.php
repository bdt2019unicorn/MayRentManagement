<?php 
    require_once("../helper/database.php"); 

    $post_key = "delete"; 
    $ids = json_decode($_POST[$post_key]); 

    $queries = Query::Delete($_GET["table"], "id", $ids); 
    $result = Database::ExecTransaction($queries); 
    echo $result; 

?>
<?php 
    require_once("../../helper/database.php"); 

    $ids = json_decode($_POST["delete"]); 

    $queries = Query::Delete($_GET["table"], "id", $ids); 
    $result = Database::ExecTransaction($queries); 
    echo $result; 
    if(boolval($result))
    {
        Database::LogUserAction("Delete", $_GET["table"], $_POST["delete"], implode("\n", $queries)); 
    }
?>
<?php 
    require_once("./helper/database.php"); 

    $post_key = "edit"; 
    $data = json_decode($_POST[$post_key]); 

    $sql = Query::Update($_GET["table"], $data, ["id"=>$_GET["id"]]);
    $result = Connect::GetData($sql); 
    echo $result; 
?>
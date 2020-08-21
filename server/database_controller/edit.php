<?php 
    require_once("../helper/database.php"); 
    require_once("./helper.php"); 

    $post_key = "edit"; 
    $row = json_decode($_POST[$post_key]); 

    $params = Params($_GET["table"]); 
    $data = RowData($row, $params); 

    $sql = Query::Update($_GET["table"], $data, ["id"=>$_GET["id"]]);
    $result = Connect::GetData($sql); 
    echo $result; 
?>
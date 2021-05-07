<?php 
    require_once("../../helper/database.php"); 
    require_once("helper.php"); 

    $row = json_decode($_POST["edit"]); 

    $params = Params($_GET["table"]); 
    $data = RowData($row, $params); 

    $sql = Query::Update($_GET["table"], $data, ["id"=>$_GET["id"]]);
    $result = CurrentEnvironment::TestMode()? ConnectSqlite::Exec($sql): Connect::GetData($sql); 
    echo $result; 
?>
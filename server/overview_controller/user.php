<?php 
    require_once("../helper/database.php"); 
    $key = "id"; 
    $id = (isset($_GET[$key]))? $_GET[$key]: "";
    $table = "user"; 


    $data = Connect::GetDataWithId($id,$table); 
    if(isset($data[0]))
    {
        echo json_encode($data); 
    }
?>
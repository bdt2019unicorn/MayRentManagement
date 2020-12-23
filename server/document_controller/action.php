<?php 
    require_once("../helper/database.php"); 
    $actions = 
    [
        "SelectDataBind"=> function()
        {
            $sql = Query::GeneralData("document_type") . Query::SelectData("unit", ["*"], ["building_id"=>$_GET["building_id"]]); 
            $data = Connect::MultiQuery($sql, true); 
            $select_data_bind = 
            [
                "document_type_id"=>
                [
                    "title"=> "Document Type", 
                    "select_data"=>$data[0], 
                    "select_value"=>"id", 
                    "text"=>"name"
                ], 
                "unit_id"=>
                [
                    "title"=> "Unit", 
                    "select_data"=>$data[1], 
                    "select_value"=>"id", 
                    "text"=>"name"
                ] 
            ]; 
            echo json_encode($select_data_bind); 
        }
    ]; 
    try 
    {
        $actions[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }
?>
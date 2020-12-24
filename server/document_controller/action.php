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
        }, 
        "AddDocument"=> function()
        {
            $file = file_get_contents($_FILES["file"]["tmp_name"]); 
            $file = addslashes($file); 
            $data = array_merge(["file"=>$file], $_POST); 
            $sql = Query::Insert("documents", $data); 
            $result = Connect::GetData($sql); 
            echo $result; 
        }, 
        "DocumentEditInformation"=> function()
        {
            require_once("../helper/overview_queries.php"); 
            $document = new OverviewQueries\Documents(1, null, $_GET["id"]); 
            $data = Connect::GetData($document->Documents()); 
            $result = $data[0]; 
            echo json_encode($result); 
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
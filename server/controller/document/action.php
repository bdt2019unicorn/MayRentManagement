<?php 
    require_once("../../helper/database.php"); 
    require_once("../../helper/overview_queries.php"); 

    $actions = 
    [
        "SelectDataBind"=> function()
        {
            $document_types_sql = Query::GeneralData("document_type"); 
            $unit_sql = Query::SelectData("unit", ["*"], ["building_id"=>$_GET["building_id"]]); 
            if(CurrentEnvironment::TestMode())
            {
                $data = [ConnectSqlite::Query($document_types_sql), ConnectSqlite::Query($unit_sql)]; 
            }
            else 
            {
                $sql = $document_types_sql . $unit_sql; 
                $data = Connect::MultiQuery($sql, true); 
            }

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
        "DocumentEditInformation"=> function()
        {
            $document = new OverviewQueries\Documents(1, null, $_GET["id"]); 
            $data = Database::GetData($document->Documents(CurrentEnvironment::TestMode())); 
            $result = $data[0]; 
            echo json_encode($result); 
        }, 
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
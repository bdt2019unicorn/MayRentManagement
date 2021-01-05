<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
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
            $document = new OverviewQueries\Documents(1, null, $_GET["id"]); 
            $data = Connect::GetData($document->Documents()); 
            $result = $data[0]; 
            echo json_encode($result); 
        }, 
        "DocumentEditSubmit"=> function()
        {
            $document = new OverviewQueries\Documents(1, null, $_GET["id"]); 
            $new_file = file_get_contents($_FILES["file"]["tmp_name"]); 
            $current_file = Connect::GetData($document->File($document->id))[0]["file"];

            $CompareFiles = function($new_file, $current_file)
            {
                $new64 = base64_encode($new_file); 
                $current64 = base64_encode($current_file); 
                return ($new64==$current64)? null: addslashes($new_file); 
            }; 

            $CurrentData = function() use ($document)
            {
                $data = Connect::GetData($document->Documents())[0]; 
                $current_data = []; 
                foreach ($data as $key => $value) 
                {
                    $current_data[strtolower($key)] = $value; 
                }
                return $current_data; 
            }; 

            $data = []; 
            $user_information_data = []; 
            $file = $CompareFiles($new_file, $current_file); 
            if($file)
            {
                $data["file"] = $file; 
            }
            
            $current_data = $CurrentData(); 
            foreach ($_POST as $key => $value) 
            {
                if(isset($current_data[$key]))
                {
                    if($current_data[$key]!=$value)
                    {
                        $data[$key] = $value; 
                    }
                }
                else 
                {
                    $user_information_data[$key] = $value; 
                }
            }
            if(count($data))
            {
                $sql = Query::Update("documents", array_merge($data, $user_information_data), ["id"=>$document->id]); 
                $result = Connect::GetData($sql); 
                echo $result; 
            }
            else 
            {
                echo true; 
            }
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
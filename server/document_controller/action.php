<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
    function GetUploadFileCombine()
    {
        if(isset($_FILES["file"]))
        {
            return file_get_contents($_FILES["file"]["tmp_name"]); 
        }
        else 
        {
            $files = glob("{$_POST['file']}/*"); 
            $content = ""; 
            foreach ($files as $file) 
            {
                if(is_file($file))
                {
                    $content.= file_get_contents($file); 
                    unlink($file); 
                }
            }
            rmdir($_POST['file']); 
            return $content; 
        }
    }

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
        "UploadFiles"=>function()
        {
            if(!file_exists("temp"))
            {
                mkdir("temp"); 
            }
            $folder = "temp/{$_POST['folder']}"; 
            if(!file_exists($folder))
            {
                mkdir($folder); 
            }
            $file_destination = "{$folder}/{$_POST['part']}.tmp"; 
            move_uploaded_file($_FILES["blob"]["tmp_name"], $file_destination); 
        }, 
        "AddDocument"=> function()
        {
            if(CurrentEnvironment::TestMode())
            {
                if(isset($_FILES["file"]))
                {
                    $file_path = $_FILES["file"]["tmp_name"]; 
                }
                else 
                {
                    $files = glob("{$_POST['file']}/*"); 
                    $file_path = "{$_POST['file']}/file.tmp"; 
                    
                    foreach ($files as $file_destination) 
                    {
                        if(is_file($file_destination))
                        {
                            $file = fopen($file_destination, "rb"); 
                            $buffer = fread($file, filesize($file_destination)); 
                            fclose($file); 
                            $final = fopen($file_path, "ab"); 
                            fwrite($final, $buffer); 
                            fclose($final); 
                            unlink($file_destination); 
                        }
                    }
                }
                $result = ConnectSqlite::InsertFile("document", $_POST, $file_path, "file"); 
                if(isset($_POST["file"]))
                {
                    unlink($file_path); 
                    rmdir($_POST['file']); 
                }
                echo $result; 
            }
            else 
            {
                $data = $_POST; 
                $file = GetUploadFileCombine(); 
                $data["file"] = addslashes($file); 
                $sql = Query::Insert("documents", $data); 
                $result = Connect::GetData($sql); 
                echo $result; 
            }

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
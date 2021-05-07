<?php 
    require_once("../../helper/database.php"); 
    require_once("../../helper/overview_queries.php"); 

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

    function TempFolder()
    {
        $file_path = CurrentEnvironment::TempFolderPath() . "/document_controller"; 
        CurrentEnvironment::SetupFolder($file_path); 
        return $file_path; 
    }

    $actions = 
    [
        "UploadFiles"=>function()
        {
            $folder = TempFolder() . "/{$_POST['folder']}"; 
            CurrentEnvironment::SetupFolder($folder); 
            $file_destination = "{$folder}/{$_POST['part']}.tmp"; 
            move_uploaded_file($_FILES["blob"]["tmp_name"], $file_destination); 
            echo $folder; 
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
        "DocumentEditSubmit"=> function()
        {
            $test_mode = CurrentEnvironment::TestMode(); 
            $document = new OverviewQueries\Documents(1, null, $_GET["id"]); 
            $new_file = GetUploadFileCombine(); 
            $current_file = Database::GetData($document->File($document->id))[0]["file"];

            $CompareFiles = function($new_file, $current_file)
            {
                $new64 = base64_encode($new_file); 
                $current64 = base64_encode($current_file); 
                return ($new64==$current64)? null: addslashes($new_file); 
            }; 

            $CurrentData = function() use ($document, $test_mode)
            {
                $data = Database::GetData($document->Documents($test_mode))[0]; 
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
                $data = array_merge($data, $user_information_data); 
                $conditions = ["id"=>$document->id]; 
                if($test_mode && $file)
                {
                    $file_path = TempFolder(); 
                    $file_name = md5(json_encode($user_information_data)) . random_int(PHP_INT_MIN, PHP_INT_MAX) . ".tmp"; 
                    $file_path = "{$file_path}/{$file_name}"; 
                    $file = fopen($file_path, "ab"); 
                    fwrite($file, $new_file); 
                    fclose($file); 
                    $result = ConnectSqlite::EditFile("documents", $data, $conditions, $file_path); 
                    unlink($file_path); 
                    echo $result; 
                    return; 
                }
                $sql = Query::Update("documents", $data, $conditions); 
                $result = Database::GetData($sql); 
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
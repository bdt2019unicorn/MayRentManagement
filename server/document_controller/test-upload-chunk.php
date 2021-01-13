<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 



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

    $sql = "INSERT INTO `documents`"; 
    $columns = "("; 
    $values = "VALUES ("; 

    $data = $_POST; 
    $params = []; 

    foreach ($data as $column => $value) 
    {
        if($column!="file")
        {
            $param = ":{$column}"; 
            $params[$param] = $value; 
            $columns.= "`{$column}`, "; 
            $values.= "{$param},"; 
        }
    }

    $columns.= "`file`) "; 
    $values.= ":file); "; 
    $sql.= $columns.$values; 

    $fh = fopen($file_path, "rb"); 
    
    $pdo = new PDO("sqlite:". CurrentEnvironment::TestSqliteDatabasePath()); 

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) 
    {
        $stmt->bindValue($key, $value); 
    }

    $stmt->bindValue(':file', $fh, PDO::PARAM_LOB);
    $stmt->execute();

    fclose($fh); 

    echo $pdo->lastInsertId(); 

    unlink($file_path); 
    rmdir($_POST['file']); 

    print_r($_POST); 

?>
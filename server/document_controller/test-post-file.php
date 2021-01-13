<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 

    $sql = "INSERT INTO `documents`"; 
    $columns = "("; 
    $values = "VALUES ("; 

    $data = $_POST; 
    $params = []; 

    foreach ($data as $column => $value) 
    {
        $param = ":{$column}"; 
        $params[$param] = $value; 
        $columns.= "`{$column}`, "; 
        $values.= "{$param},"; 
    }

    $columns.= "`file`) "; 
    $values.= ":file); "; 

    $sql.= $columns.$values; 
    
    $fh = fopen($_FILES["file"]["tmp_name"], "rb"); 
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


?>
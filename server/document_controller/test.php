<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 

    // $file = file_get_contents("Text_items.xls"); 
    // $file = addslashes($file); 
    // $file = sqlite_escape_string($file); 
    // $file = SQLite3::escapeString($file);
    // sqlite_udf_encode_binary($file); 
    // echo $file; 

    $sql = "INSERT INTO `documents` (`name`, `document_type_id`, `unit_id`, `file`, `file_extension`, `description`, `username`, `modified_time`) VALUES (:name, :document_type_id, :unit_id, :file, :file_extension, :description, :username, :modified_time) "; 

    copy("Text_items.xls", "Text_items-copy.xls"); 
    $fname = "Text_items-copy.xls"; 

    $fh = fopen($fname, "rb"); 

    $params = 
    [
        ":name"=> 'test', 
        ":document_type_id" => '6', 
        ":unit_id" => '94',
        // ":file" => '{$file}', 
        ":file_extension" => 'xls', 
        ":description" => 'test file', 
        ":username" => 'blastor555', 
        ":modified_time" => '2021-01-13 17:27:37'
    ]; 

    $pdo = new PDO("sqlite:". CurrentEnvironment::TestSqliteDatabasePath()); 
    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) 
    {
        $stmt->bindParam($key, $value); 
    }

    $stmt->bindParam(':file', $fh, PDO::PARAM_LOB);
    $stmt->execute();

    // fclose($fh); 

    echo $pdo->lastInsertId(); 

    // echo $sql; 
    unlink($fname); 

    // $result = ConnectSqlite::Query($sql); 
    // echo $result; 

?>
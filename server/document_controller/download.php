<?php
    require_once("../helper/database.php"); 
    $sql = "SELECT * FROM `documents`"; 

    $data = Connect::GetData($sql); 

    // echo '<pre>'; print_r($data); echo '</pre>'; 

    $file = $data[0]["file"]; 

    // header("Content-Type: application/application/octetstream"); 
    // header("Content-disposition: attachment; filename=test.xls"); 
    // echo $file; 

    // $string = base64_encode($file); 
    // echo "<h1>"; echo $string; echo "</h1>"; 


?>
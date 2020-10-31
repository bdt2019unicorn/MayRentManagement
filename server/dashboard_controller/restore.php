<?php
    require_once("../helper/database.php"); 
    if($_FILES["file"]["error"]>0)
    {
        echo false; 
        return;     
    }
    else 
    {
        $file_name = $_FILES["file"]["name"]; 
        move_uploaded_file($_FILES["file"]["tmp_name"], $file_name); 
        $file_content = file_get_contents($file_name); 
        Connect::MultiQuery($file_content); 
        echo true; 
        unlink($file_name); 
    }


?>
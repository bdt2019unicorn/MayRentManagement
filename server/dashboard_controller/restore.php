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
        $file_content = file_get_contents($_FILES["file"]["tmp_name"]); 
        Connect::MultiQuery($file_content); 
        echo true; 
    }


?>
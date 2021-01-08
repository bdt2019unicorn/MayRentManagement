<?php 
    if(!file_exists("temp"))
    {
        mkdir("temp"); 
    }
    $folder = "temp/{$_POST['folder']}"; 
    if(!file_exists($folder))
    {
        mkdir($folder); 
    }
    $file_destination = "{$folder}/{$_POST['part']}"; 
    $file_path = "{$folder}/file"; 
    move_uploaded_file($_FILES["blob"]["tmp_name"], $file_destination); 

    $file = fopen($file_destination, "rb"); 
    $buffer = fread($file, filesize($file_destination)); 
    fclose($file); 

    $final = fopen($file_path, "ab"); 
    $write = fwrite($final, $buffer); 
    fclose($final); 

    print_r($_POST); print_r($_FILES); 

?>
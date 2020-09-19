<?php 
    require_once(realpath(__DIR__."../../../vendor/autoload.php")); 


    $path = realpath(__DIR__."../../../vendor/autoload.php"); 


    echo "<h1>$path</h1>"; 

    $something_path = __DIR__."../../../vendor/autoload.php"; 

    echo "<h1>$something_path</h1>"; 


    $test_path = realpath(__DIR__."../../vendor/autoload.php"); 

    echo "<h1 style='color:red;'>$test_path</h1>"; 


?>
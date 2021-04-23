<?php

    function RedirectPage($error)
    {
        echo 
        "
            <script>
                alert(`{$error}`);
                window.location = '{$_SERVER['HTTP_REFERER']}'; 
            </script>
        "; 
    }

    $servername = $_POST['SERVERNAME'];
    $username = $_POST['USERNAME'];
    $password = $_POST['PASSWORD'];
    $dbname = $_POST['DBNAME']; 

    
    $connection = new mysqli($servername, $username, $password);
    if ($connection -> connect_errno) 
    {
        RedirectPage('Database connect error!'); 
        return; 
    }

    $query = file_get_contents("database.sql"); 
    $sql = array_filter(explode(";", $query), function($string){return trim($string);}); 
    $sql = array_merge
    (
        [
            "CREATE DATABASE `{$dbname}`", 
            "USE `{$dbname}`", 
            "SET FOREIGN_KEY_CHECKS=0;"
        ], 
        $sql
    ); 

    $message = "Database created success!"; 
    
    try 
    {
        $connection->autocommit(false);

        foreach ($sql as $query) 
        {
            $exec = $connection->query($query); 
            if(!$exec)
            {
                throw new Exception("\n". var_dump($connection)."\n"); 
            }
        }
        $connection->commit(); 
        require_once("../../helper/current_environment.php"); 
        $current_environment = new CurrentEnvironment(); 
        $current_environment->WriteEnv($_POST); 
    }
    catch(Throwable $t)
    {
        $message = "Database is not created."; 
        $connection->rollback(); 
        $connection->query("DROP DATABASE `{$dbname}`;"); 
    }
    $connection->close(); 
    RedirectPage($message); 
?>